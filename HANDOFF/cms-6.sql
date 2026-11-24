-- cms-6: public read + super_admin write for design.* switches in site_settings (safe to run twice)
drop policy if exists "design read" on public.site_settings;
create policy "design read" on public.site_settings for select to anon, authenticated using (key like 'design.%');
drop policy if exists "design write" on public.site_settings;
create policy "design write" on public.site_settings for all to authenticated using (key like 'design.%' and public.is_super_admin()) with check (key like 'design.%' and public.is_super_admin());
