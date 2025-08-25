# BHS Sports Hub - Complete Setup Guide

## Overview

This guide will walk you through setting up the complete BHS Sports Hub with a modern React frontend and Supabase backend. The system includes a comprehensive admin panel for content management without requiring code changes.

## What You're Getting

✅ **Modern React Frontend** - Beautiful, responsive UI with Tailwind CSS  
✅ **Supabase Backend** - Database, authentication, and file storage  
✅ **Admin Dashboard** - Full content management system  
✅ **Role-Based Access** - Admin, Teacher, Coach, and Viewer roles  
✅ **Real-time Updates** - Live data synchronization  
✅ **PWA Support** - Progressive Web App capabilities  
✅ **Mobile Responsive** - Works perfectly on all devices  

## Prerequisites

- Node.js 16+ installed
- Git installed
- A Supabase account (free tier is sufficient for schools)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `bhs-sports-hub`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your school
5. Click "Create new project"

### 1.2 Get Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

### 1.3 Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `database-schema.sql`
3. Paste and run the SQL script
4. This creates all necessary tables, relationships, and sample data

### 1.4 Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your domain (or `http://localhost:3000` for development)
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://yourdomain.com/**` (when deployed)

### 1.5 Set Up Storage

1. Go to **Storage** in your dashboard
2. Create a new bucket called `sports-photos`
3. Set it to **Public** (for photo sharing)
4. Go to **Policies** and add this policy for public read access:

```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'sports-photos');
```

## Step 2: Local Development Setup

### 2.1 Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd bhs-sports-hub

# Install dependencies
npm install
```

### 2.2 Environment Configuration

1. Copy the environment file:
```bash
cp env.example .env
```

2. Edit `.env` with your Supabase credentials:
```bash
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.3 Start Development Server

```bash
npm start
```

Your app will open at `http://localhost:3000`

## Step 3: Create Admin User

### 3.1 First User Setup

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add User**
3. Enter admin details:
   - **Email**: `admin@barrowhills.org`
   - **Password**: Choose a strong password
   - **User Metadata**:
     ```json
     {
       "name": "Admin User",
       "role": "admin",
       "department": "PE"
     }
     ```

### 3.2 Update User Role

1. Go to **SQL Editor**
2. Run this command to set the admin role:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@barrowhills.org';
```

## Step 4: Test the System

### 4.1 Basic Functionality

1. **Login**: Use your admin credentials
2. **Navigation**: Test all menu items
3. **Admin Panel**: Go to `/admin` to test content management
4. **Create Content**: Add a test team, sport, or match result

### 4.2 Admin Features Test

1. **Teams Management**:
   - Create a new team
   - Edit team details
   - Delete a team

2. **Sports Management**:
   - Add a new sport
   - Update sport details

3. **Match Results**:
   - Input a test match result
   - View in the results page

## Step 5: Production Deployment

### 5.1 Build the App

```bash
npm run build
```

### 5.2 Deploy Options

#### Option A: Netlify (Recommended for schools)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `build` folder
3. Set custom domain if needed
4. Update Supabase redirect URLs with your domain

#### Option B: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Deploy automatically

#### Option C: GitHub Pages

1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Set build source to GitHub Actions

### 5.3 Update Supabase Settings

1. Go to your Supabase project
2. Update **Site URL** to your production domain
3. Add production domain to **Redirect URLs**

## Step 6: Content Migration

### 6.1 Import Existing Data

If you have data from your old system:

1. **Teams**: Use the admin panel to recreate teams
2. **Match Results**: Input historical results through the admin panel
3. **Photos**: Upload to the storage bucket
4. **Students**: Add through the admin interface

### 6.2 Google Calendar Integration

To integrate with your existing Google Calendar:

1. Go to **Google Cloud Console**
2. Enable Calendar API
3. Create service account credentials
4. Add calendar IDs to the system

## Step 7: User Management

### 7.1 Create User Accounts

1. **Teachers/Coaches**: Create accounts with appropriate roles
2. **Students**: Add through the admin panel
3. **Set Permissions**: Use role-based access control

### 7.2 Role Definitions

- **Admin**: Full access to everything
- **Teacher**: Can manage teams, results, and student data
- **Coach**: Can input match results and manage team sheets
- **Viewer**: Read-only access to public information

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check Supabase URL and key in `.env`
   - Verify redirect URLs in Supabase settings

2. **Database Errors**:
   - Ensure schema was created correctly
   - Check RLS policies are enabled

3. **Build Errors**:
   - Clear `node_modules` and reinstall
   - Check Node.js version compatibility

### Getting Help

1. Check Supabase logs in the dashboard
2. Review browser console for errors
3. Check network tab for failed requests

## Security Considerations

### 1. Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access data they're authorized to see
- Admin users have full access

### 2. Authentication
- Supabase handles all authentication securely
- Passwords are never stored in plain text
- Session management is automatic

### 3. API Security
- All API calls go through Supabase
- No direct database access from frontend
- Rate limiting and abuse protection included

## Maintenance

### Regular Tasks

1. **Monitor Usage**: Check Supabase dashboard for usage metrics
2. **Backup Data**: Supabase provides automatic backups
3. **Update Dependencies**: Run `npm update` periodically
4. **Review Logs**: Check for any errors or issues

### Scaling Considerations

- **Free Tier**: 50,000 monthly active users, 500MB database
- **Pro Tier**: $25/month for higher limits
- **Enterprise**: Custom pricing for large deployments

## Support and Updates

### Keeping Updated

1. **GitHub**: Check for updates and security patches
2. **Supabase**: Monitor for platform updates
3. **Dependencies**: Regular security updates

### School-Specific Customizations

The system is designed to be easily customizable:
- **Branding**: Update colors, logos, and school name
- **Features**: Add/remove modules as needed
- **Workflows**: Modify data entry processes
- **Reports**: Customize analytics and exports

## Conclusion

You now have a complete, modern sports management system that:
- ✅ Requires no coding knowledge to manage content
- ✅ Provides real-time updates and analytics
- ✅ Works perfectly on all devices
- ✅ Scales with your school's needs
- ✅ Maintains security best practices

The admin panel gives you full control over:
- Teams and sports management
- Match results and statistics
- User access and permissions
- Content updates and modifications

Start by exploring the admin panel, then gradually migrate your existing data. The system is designed to grow with your needs!
