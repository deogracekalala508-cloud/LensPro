import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getEventByShareCode, createEventPost, ModerationStatus } from '@/lib/events'

export async function GET(request, { params }) {
  try {
    // Vérifier que Supabase est configuré
    if (!supabase) {
      return NextResponse.json({ error: 'Service not configured' }, { status: 503 })
    }
    
    const { shareCode } = params
    if (!shareCode) {
      return NextResponse.json({ error: 'Share code required' }, { status: 400 })
    }

    const event = await getEventByShareCode(shareCode)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const moderationStatus = searchParams.get('moderation') || 'approved'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const posts = await supabase
      .from('event_posts')
      .select('*')
      .eq('event_id', event.id)
      .eq('moderation_status', moderationStatus)
      .order('created_at', { ascending: false })
      .limit(limit)
      .offset(offset)
      .execute()

    return NextResponse.json({ posts: posts.data || [], total: posts.count })
  } catch (error) {
    console.error('GET posts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { shareCode } = params
    if (!shareCode) {
      return NextResponse.json({ error: 'Share code required' }, { status: 400 })
    }

    const event = await getEventByShareCode(shareCode)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const body = await request.json()
    const { content_type, content_url, text_content, audio_url, user_name, user_email } = body

    if (!content_type) {
      return NextResponse.json({ error: 'content_type required' }, { status: 400 })
    }

    const post = await createEventPost({
      eventId: event.id,
      content_type,
      content_url: content_url || null,
      text_content: text_content || '',
      audio_url: audio_url || null,
      user_name: user_name || 'Invité',
      user_email: user_email || null,
      moderation_status: ModerationStatus.PENDING
    })

    return NextResponse.json({ post, message: 'Post created successfully' }, { status: 201 })
  } catch (error) {
    console.error('POST post error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
