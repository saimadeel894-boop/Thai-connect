
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdmin() {
    console.log('Checking for admin user...');
    const { data, error } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('email', 'john@kggroup.io')
        .single();

    if (error) {
        console.log(`❌ Admin user not found or error: ${error.message}`);
    } else {
        console.log(`✅ Admin user found:`, data);
    }

    console.log('\nAll Profiles:');
    const { data: allProfiles } = await supabase.from('profiles').select('email, role');
    console.log(allProfiles);
}

checkAdmin();
