# Authentication Documentation - আমার ঘর

## Overview

The আমার ঘর property management system uses **Supabase Auth** for authentication with role-based access control supporting three user types: **Landlords**, **Tenants**, and **Maintenance Staff**.

## User Types & Roles

| User Type | Access Level |
|-----------|--------------|
| `landlord` | Property management, tenant management |
| `tenant` | View assigned property, submit requests |
| `maintenance` | Handle maintenance requests |

## Environment Setup

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Client Configuration
```javascript
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Database Schema

### Profiles Table
```sql
create table profiles (
  id uuid references auth.users not null primary key,
  user_type text,           -- 'landlord', 'tenant', or 'maintenance'
  first_name text,
  last_name text,
  phone text,
  area text
);
```

### Row Level Security (RLS)
```sql
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);
```

## Authentication Flow

### 1. User Registration (`src/pages/SignupPage.jsx`)

```javascript
const { user, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_type: formData.userType,
      phone: formData.phone,
      area: formData.area
    }
  }
})
```

**Process:**
1. User fills registration form with personal details
2. Form validation ensures required fields
3. User created in Supabase Auth with metadata
4. Email verification sent
5. Redirect to login page

### 2. User Login (`src/pages/LoginPage.jsx`)

```javascript
// Step 1: Authenticate
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
})

// Step 2: Get user role
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('user_type')
  .eq('id', data.user.id)
  .single()

// Step 3: Role-based redirect
switch (userType) {
  case 'landlord': navigate('/landlord'); break
  case 'tenant': navigate('/tenant'); break
  case 'maintenance': navigate('/maintenance'); break
  default: navigate('/'); break
}
```

### 3. Protected Routes (`src/components/ProtectedRoute.jsx`)

```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    fetchSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!session) return <Navigate to="/login" />

  const userRole = session.user.user_metadata.user_type
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  return children
}
```

**Usage:**
```javascript
<ProtectedRoute allowedRoles={['landlord']}>
  <LandlordHomepage />
</ProtectedRoute>
```

## Session Management

### Key Operations
```javascript
// Get current session
const { data: { session } } = await supabase.auth.getSession()

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state changes
})

// Sign out
await supabase.auth.signOut()
```

## Error Handling

### Common Errors
- `Invalid login credentials`
- `Email not confirmed`
- `Could not find a user profile`
- `Password should be at least 6 characters`

### Error Handling Pattern
```javascript
try {
  // Auth operation
} catch (error) {
  setErrors({ general: getErrorMessage(error) })
}
```

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Tokens**: Automatic token management and refresh
- **Role-based Access**: Routes protected by user roles
- **Form Validation**: Frontend and backend validation

## User Permissions

### Landlord
- Manage properties and tenants
- View payment history
- Handle maintenance requests

### Tenant
- View assigned property
- Submit maintenance requests
- Update personal profile

### Maintenance
- View assigned requests
- Update request status
- Access property details

## Troubleshooting

### Common Issues
1. **Profile not found**: Check database trigger for profile creation
2. **Loading state**: Verify environment variables and network
3. **Redirect loops**: Ensure valid user_type exists
4. **RLS errors**: Check user authentication and profile existence

### Debug Tips
```javascript
console.log('Session:', session)
console.log('User role:', session?.user?.user_metadata?.user_type)
console.log('Profile data:', profile)
```

## Future Enhancements

- Password reset functionality
- Social login integration
- Two-factor authentication
- Admin user management
- Enhanced security policies

---

For detailed implementation examples, refer to the source files mentioned in each section. 