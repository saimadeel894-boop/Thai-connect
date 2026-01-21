# Supabase Setup Guide

This guide walks you through setting up your Supabase database for ThaiConnect.

## Prerequisites

- A Supabase account (https://supabase.com)
- A Supabase project created
- Supabase CLI installed (optional but recommended)

## Step 1: Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase project settings under "API".

## Step 2: Apply Database Migration

### Option A: Using Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Click "New Query"
4. Copy the contents of `supabase/migrations/20240116000000_initial_schema.sql`
5. Paste into the editor
6. Click "Run"

### Option B: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Step 3: Enable Realtime

1. Go to "Database" → "Replication" in your Supabase dashboard
2. Enable replication for these tables:
   - `messages`
   - `matches`
   - `profiles`

## Step 4: Verify Setup

Run these SQL queries to verify tables were created:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should see: profiles, matches, messages
```

## Step 5: Create Test Data (Optional)

### Create a Test Profile

```sql
-- Insert a test profile (replace with your auth user ID)
INSERT INTO profiles (
  id,
  email,
  name,
  age,
  gender,
  location,
  bio,
  profile_image
) VALUES (
  'your-auth-user-id',
  'test@example.com',
  'Test User',
  25,
  'Female',
  'Bangkok',
  'Test bio for development',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
);
```

### Create a Test Match

```sql
-- Create a match between two users
INSERT INTO matches (
  user_a,
  user_b,
  initiated_by,
  status
) VALUES (
  'user-id-1',
  'user-id-2',
  'user-id-1',
  'accepted'
);
```

### Create a Test Message

```sql
-- Create a test message
INSERT INTO messages (
  match_id,
  sender_id,
  receiver_id,
  content
) VALUES (
  'match-id',
  'sender-id',
  'receiver-id',
  'Hello, this is a test message!'
);
```

## Row Level Security (RLS) Policies

The migration automatically sets up these RLS policies:

### Profiles
- ✅ Everyone can view all profiles
- ✅ Users can update only their own profile
- ✅ Users can insert their own profile

### Matches
- ✅ Users can view matches they're part of
- ✅ Users can create matches
- ✅ Users can update matches they're part of

### Messages
- ✅ Users can view messages in their matches
- ✅ Users can send messages in accepted matches
- ✅ Users can mark received messages as read

## Testing RLS Policies

```sql
-- Test as a specific user (replace with real user ID)
SET request.jwt.claims.sub = 'user-id-here';

-- Try to view profiles (should work)
SELECT * FROM profiles;

-- Try to view messages (should only see own messages)
SELECT * FROM messages;
```

## Storage Setup (For Profile Images)

1. Go to "Storage" in Supabase dashboard
2. Create a new bucket called `profiles`
3. Set bucket to **Public**
4. Add this policy:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow everyone to view images
CREATE POLICY "Public profiles are viewable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');
```

## Realtime Configuration

### Enable Realtime in Code

The app automatically subscribes to changes. Verify in your code:

```typescript
// This is already set up in:
// - lib/hooks/useRealtimeMessages.ts
// - lib/hooks/useRealtimeConversations.ts

const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    // Handle new message
  })
  .subscribe();
```

## Monitoring

### View Real-time Connections

1. Go to "Database" → "Replication"
2. Click "Inspect" on any table
3. See active subscriptions

### View Logs

1. Go to "Logs" in Supabase dashboard
2. Filter by:
   - Database logs
   - Realtime logs
   - API logs

## Troubleshooting

### "permission denied for table profiles"
- RLS policies not applied correctly
- User not authenticated
- Re-run migration script

### Realtime not working
- Check replication is enabled for table
- Verify Supabase client is initialized correctly
- Check browser console for WebSocket errors

### Images not uploading
- Storage bucket not created
- Storage policies not set
- Check file size limits (default 50MB)

## Production Checklist

Before going live:

- [ ] All migrations applied
- [ ] RLS policies tested
- [ ] Realtime enabled for all tables
- [ ] Storage buckets configured
- [ ] Environment variables set
- [ ] Test authentication flow
- [ ] Test message sending/receiving
- [ ] Test profile updates
- [ ] Check database indexes for performance
- [ ] Set up database backups
- [ ] Configure rate limiting (if needed)

## Database Indexes

The migration includes these indexes for performance:

```sql
-- Already created in migration
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_online ON profiles(online);
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

## Backup & Recovery

### Manual Backup

```bash
# Backup database
supabase db dump > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

### Automated Backups

Supabase Pro automatically backs up your database daily. Configure in:
Settings → Database → Backup

## Next Steps

1. Test the entire flow with real users
2. Monitor database performance
3. Add more indexes if needed
4. Set up database alerts
5. Configure Edge Functions (if needed)

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase
