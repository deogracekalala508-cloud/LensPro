const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) {
      const cleanVal = val.join('=').trim().replace(/^["']|["']$/g, '');
      if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL' && !supabaseUrl) supabaseUrl = cleanVal;
      if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' && !supabaseAnonKey) supabaseAnonKey = cleanVal;
    }
  });
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runAudit() {
  console.log('--- TESTING SUPABASE AUTH WITH STANDARD TLD ---');
  const testEmail = `lenspro_test_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';

  console.log(`Attempting SignUp for ${testEmail}...`);
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'LensPro Test Photographer',
        username: `lenspro_user_${Date.now()}`
      }
    }
  });

  if (signUpErr) {
    console.log(`❌ Auth SignUp Error: ${signUpErr.message}`);
  } else {
    console.log(`✅ Auth SignUp Success! User ID: ${signUpData.user?.id}, Email Confirmed: ${signUpData.user?.email_confirmed_at ? 'Yes' : 'No'}`);
    
    console.log('Attempting SignIn with created credentials...');
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInErr) {
      console.log(`⚠️ Auth SignIn Status: ${signInErr.message}`);
      if (signInErr.message.includes('Email not confirmed')) {
        console.log('ℹ️ Email confirmation is required by Supabase Auth configuration.');
      }
    } else {
      console.log(`✅ Auth SignIn Success! Token acquired for user ID: ${signInData.user?.id}`);
    }
  }

  console.log('\n--- TESTING STORAGE BUCKETS DIRECT ACCESS ---');
  const bucketsToTest = ['portfolio-photos', 'client-galleries', 'avatars', 'event-uploads'];
  for (const b of bucketsToTest) {
    const { data: files, error } = await supabase.storage.from(b).list();
    if (error) {
      console.log(`⚠️ Bucket '${b}': ${error.message}`);
    } else {
      console.log(`✅ Bucket '${b}' exists and accessible. Items: ${files.length}`);
    }
  }
}

runAudit();
