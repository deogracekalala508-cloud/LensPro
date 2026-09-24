'use client'
import React from 'react'
import GiantScreen from '@/components/GiantScreen/GiantScreen'

export default function GiantScreenPage({ params }) {
  const { shareCode } = params
  return <GiantScreen shareCode={shareCode} />
}
