'use client'

import { useEffect } from 'react'
import ReactGA from 'react-ga4'

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

let isInitialized = false

export function initializeAnalytics() {
  if (typeof window !== 'undefined' && !isInitialized && MEASUREMENT_ID) {
    ReactGA.initialize(MEASUREMENT_ID)
    isInitialized = true
  }
}

export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && isInitialized) {
    ReactGA.event(eventName, eventParams)
  }
}

export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && isInitialized) {
    ReactGA.send({ hitType: 'pageview', page: path })
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAnalytics()
  }, [])

  return <>{children}</>
}
