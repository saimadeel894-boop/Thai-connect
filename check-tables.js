
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
    const tables = ['profiles', 'matches', 'messages', 'subscriptions', 'transactions'];
    console.log('Checking tables...');

    for (const table of tables) {
        const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ Table [${table}]: ${error.message}`);
        } else {
            console.log(`✅ Table [${table}]: Found (${count} rows)`);
        }
    }
}

checkTables();
