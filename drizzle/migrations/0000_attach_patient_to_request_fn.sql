-- Allows the account holder to attach (or change) the patient on their own
-- ambulance request AFTER dispatch, without exposing a general UPDATE policy.
create or replace function public.attach_patient_to_request(
  p_request_id uuid,
  p_patient_profile_id uuid,
  p_patient_name text,
  p_patient_phone text,
  p_critical_summary text
)
returns public.ambulance_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  req public.ambulance_requests;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_patient_profile_id is not null then
    if not exists (
      select 1 from public.patient_profiles
      where id = p_patient_profile_id and account_user_id = auth.uid()
    ) then
      raise exception 'Patient profile not found for this account';
    end if;
  end if;

  select * into req from public.ambulance_requests
  where id = p_request_id and patient_user_id = auth.uid();
  if not found then
    raise exception 'Request not found';
  end if;
  if req.status = 'completed' then
    raise exception 'Trip already completed';
  end if;

  update public.ambulance_requests set
    patient_profile_id = p_patient_profile_id,
    patient_name = coalesce(left(btrim(p_patient_name), 120), patient_name),
    patient_phone = coalesce(left(btrim(p_patient_phone), 20), patient_phone),
    notes = case
      when p_critical_summary is null then notes
      when notes is null then p_critical_summary
      when strpos(notes, p_critical_summary) > 0 then notes
      else notes || E'\n' || p_critical_summary
    end,
    updated_at = now()
  where id = p_request_id
  returning * into req;

  return req;
end;
$$;

revoke all on function public.attach_patient_to_request(uuid, uuid, text, text, text) from public, anon;
grant execute on function public.attach_patient_to_request(uuid, uuid, text, text, text) to authenticated;
