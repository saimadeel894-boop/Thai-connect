# ThaiConnect Admin Dashboard

## 🔐 Admin Access

### Login Credentials
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `john@kggroup.io`
- **Password**: Your account password
- **Admin Code**: `Random001`

### First Time Setup

1. **Create your admin account**:
   - Go to `/signup`
   - Sign up with email: `john@kggroup.io`
   - Use a strong password

2. **Set admin role in Supabase**:
   - Go to Supabase SQL Editor
   - Run the migration file: `supabase/migrations/20240117000000_set_admin_user.sql`
   - Or manually run:
     ```sql
     UPDATE public.profiles
     SET role = 'admin'
     WHERE email = 'john@kggroup.io';
     ```

3. **Login to admin panel**:
   - Go to `/admin/login`
   - Enter your email, password, and admin code (`Random001`)
   - You'll be redirected to the admin dashboard

## 📊 Features

### Dashboard (`/admin`)
- **Statistics Overview**:
  - Total Users
  - Total Messages
  - Total Matches
  - Total Reports (coming soon)
- **Recent Users Table**: View last 5 registered users

### User Management (`/admin/users`)
- **View all users** with profile pictures, names, emails, locations
- **Search users** by name or email
- **Delete users** (with confirmation)
- **Block users** (coming soon)
- Real-time user count

### Messages (`/admin/messages`)
- **View all messages** sent on the platform
- **Search messages** by content or user names
- **Delete messages** (with confirmation)
- See sender → receiver conversation flow
- Last 100 messages displayed

### Reports (`/admin/reports`)
- Coming soon: View and manage user reports

### Settings (`/admin/settings`)
- Coming soon: Platform configuration

## 🎨 Design

- **Dark theme**: Black background with red accents
- **Sidebar navigation**: Fixed left sidebar with icons
- **Responsive tables**: Clean data display
- **Consistent styling**: Matches main app design (red/black/white)

## 🔒 Security

- Admin code verification (`Random001`)
- Database role check (must be `admin` role)
- Protected routes via middleware
- Session-based authentication via Supabase

## 🚀 Development

Access admin panel during development:
```bash
npm run dev
# Navigate to http://localhost:3000/admin/login
```

## 📝 Notes

- Admin panel is **desktop-first** (optimized for larger screens)
- All admin routes are protected
- Logout redirects to homepage
- Admin role is required in database
