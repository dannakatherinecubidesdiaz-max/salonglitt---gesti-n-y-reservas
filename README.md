<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/43edf5d9-907f-4110-8891-d60499902592

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase Authentication and Security

The app expects Supabase Auth and the `profiles`, `services`, and `appointments` tables. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the project, then apply the SQL migration in `supabase/migrations/202609250001_security_and_booking.sql`.

For local development, start Supabase with the included `supabase/config.toml`; it disables email confirmations only in the local Auth service. Point `.env.local` at the local Supabase URL and anon key printed by `supabase status`. For a hosted project, disable **Auth > Providers > Email > Confirm email** to allow immediate sessions, or leave it enabled and confirm each user's email from the message Supabase sends.

Create the initial `admin@salonglitt.com` account in Supabase Auth and enter its password through the Supabase Dashboard. Then run `supabase/seeds/admin_auth.sql` in the Supabase SQL Editor to confirm that existing Auth user and ensure its active administrator profile. Do not add the password to `.env`, frontend code, seed data, or version control. The application no longer contains a password check or demo login that can be bypassed in the browser.
