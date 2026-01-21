# Implementation Guide - Chat & Profile Features

This guide explains the new features implemented in ThaiConnect.

## Features Implemented

### 1. Chat System ✅
- **ChatPopup Component**: Floating chat window in bottom-right corner
- **Inbox Page**: Full-screen messages page at `/user/messages`
- **Chat Dropdown**: Quick access to recent conversations in header
- **Real-time Messaging**: Supabase Realtime integration

### 2. Profile Detail Slide Panel ✅
- Beautiful slide-in panel from right side
- Shows complete profile information
- Image gallery support
- Interests, languages, and lifestyle details

### 3. Header Chat Icon ✅
- Chat icon with unread message badge
- Dropdown showing 5 most recent conversations
- "Open Inbox" button to navigate to full messages page

## Database Setup

### Required Migrations

Run the SQL migration file to set up the database:

```bash
# Apply the migration to your Supabase project
psql $DATABASE_URL < supabase/migrations/20240116000000_initial_schema.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

### Tables Created

1. **profiles** - Extended user profiles with dating-specific fields
2. **matches** - Track connections between users
3. **messages** - Chat messages with read status

### RLS Policies

- Users can view all profiles
- Users can only update their own profile
- Users can only view/send messages in their matches
- Messages require accepted match status

## How It Works

### Opening a Chat

When user clicks "Message" button on a member card:
1. System creates or retrieves a match between users
2. ChatPopup opens in bottom-right corner
3. Messages load via Supabase Realtime
4. User can send/receive messages instantly

### Viewing Profile Details

When user clicks on a member card:
1. Profile slide panel animates in from right
2. Shows all profile information
3. User can message or like from profile view
4. Panel can be closed by clicking backdrop or back button

### Real-time Updates

- New messages appear instantly (no refresh needed)
- Unread counts update in real-time
- Online status updates automatically
- Conversation list stays synced

## Key Components

### Chat Components
- `ChatPopup.tsx` - Floating chat window
- `MessageList.tsx` - Message thread display
- `MessageInput.tsx` - Message composition
- `ConversationList.tsx` - Inbox conversation list
- `ChatDropdown.tsx` - Header dropdown

### Profile Components
- `ProfileDetail.tsx` - Slide panel with full profile
- `MemberCard.tsx` - Updated to support onClick

### Hooks
- `useRealtimeMessages()` - Real-time message sync
- `useRealtimeConversations()` - Real-time conversation sync

### Services
- `messageService.ts` - Message CRUD operations
- Functions: `sendMessage`, `markAsRead`, `getOrCreateMatch`

## Usage Examples

### Opening a Chat Programmatically

```typescript
import { getOrCreateMatch, sendMessage } from '@/lib/services/messageService';

// Create/get match
const matchId = await getOrCreateMatch(currentUserId, targetUserId);

// Send message
await sendMessage(matchId, senderId, receiverId, "Hello!");
```

### Using Realtime Messages Hook

```typescript
import { useRealtimeMessages } from '@/lib/hooks/useRealtimeMessages';

function ChatComponent({ matchId }) {
  const { messages, loading } = useRealtimeMessages(matchId);
  
  // Messages update automatically via Supabase Realtime
  return <MessageList messages={messages} />;
}
```

### Using Realtime Conversations Hook

```typescript
import { useRealtimeConversations } from '@/lib/hooks/useRealtimeConversations';

function InboxComponent({ userId }) {
  const { conversations, loading } = useRealtimeConversations(userId);
  
  // Conversations update automatically
  return <ConversationList conversations={conversations} />;
}
```

## Customization

### Styling
All components use Tailwind CSS classes. Customize colors, spacing, etc. by modifying the className props.

### Mock Data
Currently using mock member data. To integrate with real profiles:
1. Update `mockMembers.ts` to fetch from Supabase
2. Replace mock profile conversion with real profile queries
3. Add profile images to Supabase Storage

## Testing Checklist

- [ ] Click "Message" on member card → ChatPopup opens
- [ ] Send message in ChatPopup → Message appears
- [ ] Click chat icon in header → Dropdown shows conversations
- [ ] Click "Open Inbox" → Navigate to messages page
- [ ] Click member card → Profile detail slides in
- [ ] Click "Send Message" in profile → Opens chat
- [ ] Click "Like Profile" → Like status toggles
- [ ] Test real-time: Open two browser tabs, send messages
- [ ] Check unread counts update correctly
- [ ] Test on mobile (responsive design)

## Next Steps

1. **Add Profile Images to Supabase Storage**
   - Set up storage bucket for profile photos
   - Implement image upload functionality

2. **Enhanced Matching Logic**
   - Implement mutual like requirement
   - Add match approval flow

3. **Notifications**
   - Push notifications for new messages
   - Email notifications for matches

4. **Search & Filters**
   - Already functional! Filters work with local data
   - Connect to Supabase for server-side filtering

5. **User Profile Editing**
   - Create profile settings page
   - Allow users to update their own profile

## Troubleshooting

### Messages Not Appearing
- Check Supabase Realtime is enabled in project settings
- Verify RLS policies are correctly set
- Check browser console for errors

### Profile Panel Not Sliding
- Ensure Tailwind CSS transitions are not disabled
- Check z-index conflicts with other elements

### Chat Not Opening
- Verify user authentication is working
- Check match creation in database
- Look for errors in browser console

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase connection
3. Review RLS policies in Supabase dashboard
