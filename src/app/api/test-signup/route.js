import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = 'test_endpoint_' + Date.now() + '@lenspro.test';
  const password = 'TestLensPro2026!';

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Photographe Test Endpoint',
          username: 'test_endpoint',
          city: 'Kinshasa',
          specialty: 'Mariage'
        }
      }
    });

    if (error) {
      return NextResponse.json({
        error: error.message,
        status: error.status,
        code: error.code
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      user: data.user?.id,
      session: !!data.session,
      email
    });
  } catch (e) {
    return NextResponse.json({
      error: e.message,
      stack: e.stack
    }, { status: 500 });
  }
}
