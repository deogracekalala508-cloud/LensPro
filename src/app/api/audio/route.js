import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')
    
    if (!audioFile || typeof audioFile === 'string') {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const eventId = formData.get('eventId')
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    const ext = audioFile.name.split('.').pop() || 'webm'
    const filePath = `event-uploads/${eventId}/${Date.now()}-voice.${ext}`

    const { data, error } = await supabase.storage
      .from('event-uploads')
      .upload(filePath, audioFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: audioFile.type || 'audio/webm'
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('event-uploads')
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath
    })
  } catch (error) {
    console.error('Audio upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
