import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SEVERITIES = ["info", "warning", "critical"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const eventType = typeof body.event_type === "string" ? body.event_type.slice(0, 100) : "";
    if (!eventType) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const severity = SEVERITIES.includes(body.severity) ? body.severity : "info";
    const resource = typeof body.resource === "string" ? body.resource.slice(0, 200) : null;
    const details = body.details && typeof body.details === "object" ? body.details : {};
    const actorEmail = typeof body.actor_email === "string" ? body.actor_email.slice(0, 320) : null;

    const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 64) ?? null;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Resolve the caller (if signed in) so events are attributable.
    let actorUserId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
      actorUserId = data.user?.id ?? null;
    }

    // Rate limit: 30 events / minute per user or IP.
    const since = new Date(Date.now() - 60_000).toISOString();
    let countQuery = admin
      .from("security_events")
      .select("id", { count: "exact", head: true })
      .gt("created_at", since);
    countQuery = actorUserId
      ? countQuery.eq("actor_user_id", actorUserId)
      : ipAddress
        ? countQuery.eq("ip_address", ipAddress)
        : countQuery;
    const { count } = await countQuery;
    if ((count ?? 0) >= 30) {
      return new Response(JSON.stringify({ ok: true, dropped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("security_events").insert({
      event_type: eventType,
      severity,
      actor_user_id: actorUserId,
      actor_email: actorEmail,
      ip_address: ipAddress,
      user_agent: userAgent,
      resource,
      details,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    // Never leak internals; logging must not break callers.
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
