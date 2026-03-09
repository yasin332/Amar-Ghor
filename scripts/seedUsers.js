import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tsqphxswkztgjdihumdg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcXBoeHN3a3p0Z2pkaWh1bWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzAwODUsImV4cCI6MjA4NzQ0NjA4NX0.giK-mY0syIahD20CW43RdkwXCvqBLtE_wU9lG4ZNt1I'
const supabase = createClient(supabaseUrl, supabaseKey)

const dummyUsers = [
    {
        email: 'landlord1@example.com',
        password: 'password123',
        meta: {
            user_type: 'landlord',
            first_name: 'Rafiqul',
            last_name: 'Islam',
            phone: '01711223344',
            area: 'Dhanmondi'
        }
    },
    {
        email: 'tenant1@example.com',
        password: 'password123',
        meta: {
            user_type: 'tenant',
            first_name: 'Abdul',
            last_name: 'Karim',
            phone: '01822334455',
            area: 'Gulshan'
        }
    },
    {
        email: 'landlord2@example.com',
        password: 'password123',
        meta: {
            user_type: 'landlord',
            first_name: 'Farjana',
            last_name: 'Akter',
            phone: '01933445566',
            area: 'Banani'
        }
    }
];

async function seedUsers() {
    console.log('Seeding dummy accounts...');
    for (const u of dummyUsers) {
        const { data, error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
            options: {
                data: u.meta
            }
        });

        if (error) {
            console.error(`Error creating ${u.email}:`, error.message);
        } else {
            console.log(`Successfully created: ${u.email} (Type: ${u.meta.user_type})`);
        }
    }
}

seedUsers();
