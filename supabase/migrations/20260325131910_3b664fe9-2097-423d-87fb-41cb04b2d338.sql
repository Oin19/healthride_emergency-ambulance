INSERT INTO public.user_roles (user_id, role)
VALUES ('96689178-488d-40e0-950b-c5e0622dca9a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;