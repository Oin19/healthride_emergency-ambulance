# Roadmap

## Done
- [x] Patient profiles connected to emergency flow: "Select Patient" step AFTER dispatch (profiles list + "Patient not listed" minimal entry), attach to trip, skippable — dispatch never blocked.
- [x] Pre-dispatch patient picker removed from emergency details step (name/contact remain optional free-text).
- [x] `attach_patient_to_request` SECURITY DEFINER RPC created in live DB; no broad patient UPDATE policy needed.
- [x] i18n keys for patient-selection UI added to en/hi/bn/ta/te.
- [x] "My Family" links in Navbar (desktop + mobile) and Profile page.
- [x] Typecheck (bunx tsgo --noEmit) passed.
- [x] End-to-end browser verification: sign in, request ambulance, attach saved profile post-dispatch, and "patient not listed" minimal entry — both confirmed against the DB; test requests deleted.
