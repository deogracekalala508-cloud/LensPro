import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Endpoint de test pour vérifier la configuration Supabase
export async function GET() {
  try {
    // Vérifier si Supabase est configuré
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'NEXT_PUBLIC_SUPABASE_URL n\'est pas configuré',
          config: {
            hasUrl: false,
            hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          }
        },
        { status: 503 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY n\'est pas configuré',
          config: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasKey: false
          }
        },
        { status: 503 }
      )
    }

    // Tester la connexion Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Erreur de connexion Supabase',
          error: error.message,
          config: {
            hasUrl: true,
            hasKey: true
          }
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { 
        status: 'ok', 
        message: 'Supabase fonctionnel',
        config: {
          hasUrl: true,
          hasKey: true
        },
        data: data
      }
    )
  } catch (err) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: err.message,
        config: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      },
      { status: 500 }
    )
  }
}
