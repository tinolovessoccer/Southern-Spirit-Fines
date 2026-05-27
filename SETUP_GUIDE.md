# Southern Spirit FC — Fine Register Setup Guide

## What you'll be setting up
- **Supabase** — free database + auth backend (supabase.com)
- **Vercel** — free hosting (vercel.com)
- Takes about 30–45 minutes total

---

## STEP 1 — Create a Supabase project

1. Go to **supabase.com** and sign up (free)
2. Click **New Project**
3. Name it `southern-spirit-fines`
4. Set a database password (save it somewhere)
5. Choose region: **Australia (Southeast)** — closest to Perth
6. Wait ~2 minutes for it to spin up

---

## STEP 2 — Run the database setup

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `SUPABASE_SETUP.sql` from this folder
4. Copy the entire contents and paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

---

## STEP 3 — Create your 3 admin accounts

1. In Supabase, go to **Authentication → Users**
2. Click **Add User → Create New User** for each of the 3 admins
3. Enter their email and set a password
4. After creating each user, click their name to see their **User UID** (looks like: `abc123-def456-...`)
5. For each user, go back to **SQL Editor** and run:

```sql
insert into public.admins (user_id) values ('PASTE-USER-UUID-HERE');
```

Do this once per admin (3 times total).

---

## STEP 4 — Get your Supabase keys

1. In Supabase, go to **Settings → API**
2. Copy two values:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## STEP 5 — Deploy to Vercel

1. Go to **github.com** and create a free account if you don't have one
2. Create a new repository called `southern-spirit-fines`
3. Upload all the files from this folder to that repository
4. Go to **vercel.com**, sign up with your GitHub account
5. Click **Add New Project** → select your repository → click **Deploy**
6. Before deploying, click **Environment Variables** and add:
   - `REACT_APP_SUPABASE_URL` = your Project URL from Step 4
   - `REACT_APP_SUPABASE_ANON_KEY` = your anon key from Step 4
7. Click **Deploy**

After ~2 minutes, Vercel gives you a URL like `southern-spirit-fines.vercel.app` — that's your link!

---

## STEP 6 — Update payment details

Open `src/constants.js` and update the `PAYMENT_INFO` section with your real bank details before deploying.

---

## How admin access works

- Anyone with the link can **view** fines — no login needed
- The 3 admins click **Admin Login** and enter their email + password
- Logged-in admins can issue fines, mark paid/unpaid, edit, and delete
- Session stays active across tabs and browser restarts
- To log out, click the green admin badge in the top right

---

## Sharing the link

Just send the Vercel URL to the whole squad. Viewers see everything, only admins can edit.

---

## If you get stuck

The most common issue is forgetting to add the environment variables in Vercel (Step 5). If the app loads but shows no data or login fails, that's the first thing to check.
