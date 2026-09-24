import { supabase } from './supabase'
import { generateShareCode } from './utils'

// Vérification que Supabase est disponible
if (!supabase) {
  console.warn('Supabase client not available - events functions will fail')
}

export const EventStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CLOSED: 'closed'
}

export const ModerationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export async function generateUniqueShareCode() {
  let code
  let attempts = 0
  while (attempts < 10) {
    code = generateShareCode()
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('share_code', code)
      .single()
    if (!error && !data) break
    attempts++
  }
  return code
}

export async function createEvent({ title, description, pinCode, expiresAt, userId, coverImageUrl }) {
  const shareCode = await generateUniqueShareCode()
  const { data, error } = await supabase
    .from('events')
    .insert({
      title,
      description: description || '',
      pin_code: pinCode || null,
      share_code: shareCode,
      user_id: userId,
      cover_image_url: coverImageUrl || null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      status: EventStatus.ACTIVE
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getEventByShareCode(shareCode) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      posts(posts(*)),
      participant_count(count),
      post_count(count)
    `)
    .eq('share_code', shareCode)
    .single()
  if (error) throw error
  if (!data) return null
  return {
    ...data,
    participant_count: data.participant_count?.length || 0,
    post_count: data.post_count?.length || 0
  }
}

export async function getPhotographerEvents(userId, { limit = 20, status = 'active' } = {}) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function createEventPost({ eventId, content_type, content_url, text_content, audio_url, user_name, user_email, moderation_status }) {
  const { data, error } = await supabase
    .from('event_posts')
    .insert({
      event_id: eventId,
      content_type: content_type,
      content_url: content_url,
      text_content: text_content || '',
      audio_url: audio_url || null,
      user_name: user_name,
      user_email: user_email || null,
      moderation_status: moderation_status || ModerationStatus.PENDING
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getEventPosts({ eventId, moderation_status = 'approved', limit = 50, offset = 0 }) {
  const { data, error } = await supabase
    .from('event_posts')
    .select('*')
    .eq('event_id', eventId)
    .eq('moderation_status', moderation_status)
    .order('created_at', { ascending: false })
    .limit(limit)
    .offset(offset)
  if (error) throw error
  return data || []
}

export async function getPendingPosts(eventId, limit = 50) {
  const { data, error } = await supabase
    .from('event_posts')
    .select('*')
    .eq('event_id', eventId)
    .eq('moderation_status', ModerationStatus.PENDING)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function moderatePost({ postId, action, moderator_id }) {
  const newStatus = action === 'approve' ? ModerationStatus.APPROVED 
    : action === 'reject' ? ModerationStatus.REJECTED 
    : ModerationStatus.PENDING
  const { data, error } = await supabase
    .from('event_posts')
    .update({ moderation_status: newStatus })
    .eq('id', postId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function hidePost(postId) {
  const { data, error } = await supabase
    .from('event_posts')
    .update({ is_hidden: true })
    .eq('id', postId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(postId) {
  const { error } = await supabase
    .from('event_posts')
    .delete()
    .eq('id', postId)
  if (error) throw error
  return { success: true }
}

export async function getEventFeed({ eventId, limit = 20, offset = 0 }) {
  const { data, error } = await supabase
    .from('event_posts')
    .select('*')
    .eq('event_id', eventId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(limit)
    .offset(offset)
  if (error) throw error
  return data || []
}

export async function eventExists(shareCode) {
  const { data, error } = await supabase
    .from('events')
    .select('id')
    .eq('share_code', shareCode)
    .single()
  if (error) throw error
  return !!data
}

export async function toggleSubscription({ eventId, userId, action }) {
  const { data, error } = await supabase
    .from('event_subscriptions')
    .upsert({
      event_id: eventId,
      user_id: userId,
      subscribed: action === 'subscribe'
    }, { onConflict: 'event_id,user_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getEventSubscribers(eventId) {
  const { data, error } = await supabase
    .from('event_subscriptions')
    .select('user_id')
    .eq('event_id', eventId)
    .eq('subscribed', true)
  if (error) throw error
  return data || []
}
