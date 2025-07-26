-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  user_type text,
  first_name text,
  last_name text,
  phone text,
  area text
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create properties table
create table properties (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) not null,
  address text not null,
  property_type text,
  bedrooms int,
  bathrooms int,
  rent numeric,
  description text,
  amenities text[],
  photos text[],
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS) for properties
alter table properties
  enable row level security;

create policy "Landlords can view their own properties." on properties
  for select using (auth.uid() = owner_id);

create policy "Landlords can insert their own properties." on properties
  for insert with check (auth.uid() = owner_id);

create policy "Landlords can update their own properties." on properties
  for update using (auth.uid() = owner_id);

create policy "Tenants can view their assigned property." on properties
  for select using (
    id in (
      select property_id
      from public.tenants
      where email = auth.email()
    )
  );

-- Create tenants table
create table tenants (
  id uuid default gen_random_uuid() primary key,
  landlord_id uuid references public.profiles(id) not null,
  property_id uuid references public.properties(id) not null,
  name text not null,
  phone text,
  email text,
  national_id text,
  lease_start_date date,
  lease_end_date date,
  rent_amount numeric,
  security_deposit numeric,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS) for tenants
alter table tenants
  enable row level security;

create policy "Landlords can view tenants in their properties." on tenants
  for select using (auth.uid() = landlord_id);
  
create policy "Tenants can view their own details." on tenants
  for select using (auth.email() = email);

create policy "Landlords can insert tenants into their properties." on tenants
  for insert with check (auth.uid() = landlord_id);

-- Create payments table
create table payments (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) not null,
  landlord_id uuid references public.profiles(id) not null,
  amount numeric not null,
  payment_date date not null,
  status text,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS) for payments
alter table payments
  enable row level security;
  
create policy "Landlords can view payments for their properties." on payments
  for select using (auth.uid() = landlord_id);

create policy "Tenants can view their own payments." on payments
  for select using (exists (select 1 from tenants where tenants.id = tenant_id and tenants.email = auth.email()));

-- Create maintenance_requests table
create table maintenance_requests (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) not null,
  tenant_id uuid references public.tenants(id) not null,
  issue text not null,
  description text,
  priority text,
  status text,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS) for maintenance_requests
alter table maintenance_requests
  enable row level security;

create policy "Landlords can view maintenance requests for their properties." on maintenance_requests
  for select using (exists (select 1 from properties where properties.id = property_id and properties.owner_id = auth.uid()));

create policy "Tenants can view their own maintenance requests." on maintenance_requests
  for select using (exists (select 1 from tenants where tenants.id = tenant_id and tenants.email = auth.email()));

create policy "Tenants can insert maintenance requests for their properties." on maintenance_requests
  for insert with check (exists (select 1 from tenants where tenants.id = tenant_id and tenants.email = auth.email()));

-- Create messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) not null,
  recipient_id uuid references public.profiles(id) not null,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS) for messages
alter table messages
  enable row level security;

create policy "Users can view messages they sent or received." on messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can insert messages." on messages
  for insert with check (auth.uid() = sender_id);

-- Create maintenance_teams table
create table maintenance_teams (
  id uuid default gen_random_uuid() primary key,
  team_name text not null,
  team_leader_name text,
  phone text,
  specialization text,
  cost_per_hour numeric,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS) for maintenance_teams
alter table maintenance_teams
  enable row level security;

create policy "Authenticated users can view maintenance teams." on maintenance_teams
  for select using (auth.role() = 'authenticated');

-- Function and Trigger to create a profile for new users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, user_type, first_name, last_name, phone, area)
  values (
    new.id, 
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'area'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 