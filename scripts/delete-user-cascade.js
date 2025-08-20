/*
  Deletes a user and all dependent data from application tables, then removes the Auth user.
  Usage:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/delete-user-cascade.js <user-uuid>
  PowerShell:
    $env:SUPABASE_URL = "https://YOUR-PROJECT.supabase.co"
    $env:SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"
    node scripts/delete-user-cascade.js 00000000-0000-0000-0000-000000000000
*/

import { createClient } from '@supabase/supabase-js';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const supabaseUrl = requireEnv('SUPABASE_URL');
const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function deleteWhere(tableName, builderFn) {
  let query = supabase.from(tableName).delete();
  query = builderFn(query);
  const { error, count } = await query.select('*', { count: 'exact' });
  if (error) throw new Error(`${tableName} delete failed: ${error.message}`);
  return count ?? 0;
}

async function selectIds(tableName, idColumn, builderFn) {
  let query = supabase.from(tableName).select(`${idColumn}`);
  query = builderFn ? builderFn(query) : query;
  const { data, error } = await query;
  if (error) throw new Error(`${tableName} select failed: ${error.message}`);
  return (data || []).map((r) => r[idColumn]);
}

async function run(userId) {
  console.log(`Starting cascade delete for user ${userId}`);

  // Gather related entity ids first
  const propertyIds = await selectIds('properties', 'id', (q) => q.eq('owner_id', userId));
  console.log(`Found ${propertyIds.length} properties owned by user.`);

  // Tenants related to this landlord or their properties
  let tenantIds = [];
  {
    const byLandlord = await selectIds('tenants', 'id', (q) => q.eq('landlord_id', userId));
    const byProperty = propertyIds.length
      ? await selectIds('tenants', 'id', (q) => q.in('property_id', propertyIds))
      : [];
    const set = new Set([...byLandlord, ...byProperty]);
    tenantIds = [...set];
  }
  console.log(`Found ${tenantIds.length} tenants related to user (as landlord or via properties).`);

  // 1) Messages where the profile (userId) is sender or recipient
  const deletedMessages = await deleteWhere('messages', (q) => q.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`));
  console.log(`Deleted ${deletedMessages} messages.`);

  // 2) Reminders where sender/recipient match profile id
  const deletedRemindersByUser = await deleteWhere('reminders', (q) => q.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`));
  console.log(`Deleted ${deletedRemindersByUser} reminders by user.`);

  // 3) Payments where landlord is the user, or where tenant is in tenantIds
  if (tenantIds.length) {
    const deletedPaymentsForTenants = await deleteWhere('payments', (q) => q.in('tenant_id', tenantIds));
    console.log(`Deleted ${deletedPaymentsForTenants} payments for tenants.`);
  }
  const deletedPaymentsForLandlord = await deleteWhere('payments', (q) => q.eq('landlord_id', userId));
  console.log(`Deleted ${deletedPaymentsForLandlord} payments for landlord.`);

  // 4) Maintenance requests related to these properties or tenants
  if (propertyIds.length) {
    const deletedMaintenanceByProperty = await deleteWhere('maintenance_requests', (q) => q.in('property_id', propertyIds));
    console.log(`Deleted ${deletedMaintenanceByProperty} maintenance requests for properties.`);
  }
  if (tenantIds.length) {
    const deletedMaintenanceByTenant = await deleteWhere('maintenance_requests', (q) => q.in('tenant_id', tenantIds));
    console.log(`Deleted ${deletedMaintenanceByTenant} maintenance requests for tenants.`);
  }

  // 5) Reminders that reference tenant ids
  if (tenantIds.length) {
    const deletedRemindersByTenant = await deleteWhere('reminders', (q) => q.in('tenant_id', tenantIds));
    console.log(`Deleted ${deletedRemindersByTenant} reminders for tenants.`);
  }

  // 6) Tenants
  if (tenantIds.length) {
    const deletedTenants = await deleteWhere('tenants', (q) => q.in('id', tenantIds));
    console.log(`Deleted ${deletedTenants} tenants.`);
  }

  // 7) Properties
  if (propertyIds.length) {
    const deletedProperties = await deleteWhere('properties', (q) => q.in('id', propertyIds));
    console.log(`Deleted ${deletedProperties} properties.`);
  }

  // 8) Profile
  const deletedProfiles = await deleteWhere('profiles', (q) => q.eq('id', userId));
  console.log(`Deleted ${deletedProfiles} profile row.`);

  // 9) Auth user (requires service role)
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) throw new Error(`Auth delete failed: ${authError.message}`);
  console.log(`Deleted auth user ${userId}.`);

  console.log('Cascade delete complete.');
}

(async () => {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: node scripts/delete-user-cascade.js <user-uuid>');
    process.exit(1);
  }
  try {
    await run(userId);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
})();


