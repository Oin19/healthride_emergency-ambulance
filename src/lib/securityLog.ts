import { supabase } from "@/integrations/supabase/client";

export type SecuritySeverity = "info" | "warning" | "critical";

/**
 * Records a client-observed security event via the SECURITY DEFINER
 * `log_security_event` RPC. Safe to call unauthenticated. Failures are
 * swallowed on purpose — logging must never break the calling flow.
 */
export async function logSecurityEvent(
  eventType: string,
  opts: {
    severity?: SecuritySeverity;
    resource?: string;
    details?: Record<string, unknown>;
    actorEmail?: string;
  } = {}
): Promise<void> {
  try {
    await supabase.rpc("log_security_event", {
      _event_type: eventType,
      _severity: opts.severity ?? "info",
      _resource: opts.resource ?? null,
      _details: (opts.details as any) ?? {},
      _ip_address: null,
      _user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 300) : null,
      _actor_email: opts.actorEmail ?? null,
    });
  } catch {
    // ignore — never let telemetry break the caller
  }
}