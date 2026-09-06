import { supabase } from "@/integrations/supabase/client";

export type SecuritySeverity = "info" | "warning" | "critical";

/**
 * Records a client-observed security event through the `log-security-event`
 * edge function. The database writer is private (service-role only), so no
 * client can write to or read the security log directly. Failures are
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
    await supabase.functions.invoke("log-security-event", {
      body: {
        event_type: eventType,
        severity: opts.severity ?? "info",
        resource: opts.resource ?? null,
        details: opts.details ?? {},
        actor_email: opts.actorEmail ?? null,
      },
    });
  } catch {
    // ignore — never let telemetry break the caller
  }
}
