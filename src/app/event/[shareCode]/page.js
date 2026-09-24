'use client'
import React from 'react'
import SocialWall from '@/components/SocialWall/SocialWall'
import { getTranslations } from '@/lib/i18n'

export default function EventSharePage({ params }) {
  const { shareCode } = params
  return (
    <SocialWall shareCode={shareCode} />
  )
}
