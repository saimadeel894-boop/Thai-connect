# Required Environment Variables

## Supabase Configuration

The application requires these environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Where to find these values:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### What happens if they're missing:

- **Without env vars**: The app will still run, but `/user` page will show "No members found" (empty feed)
- **Console errors**: Check browser console and terminal for detailed error messages
- **No crashes**: The app is fail-soft and will never throw errors, just log them

### Error messages to look for:

```
getProfilesForFeed: Failed to create Supabase client. Check env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
```

```
BrowseMembersPage: Failed to create Supabase client. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Files that read these env vars:

- `lib/supabase/server.ts` (line 8-9)
- `lib/supabase/client.ts` (line 5-6)

Both files use:
- `process.env.NEXT_PUBLIC_SUPABASE_URL`
- `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
