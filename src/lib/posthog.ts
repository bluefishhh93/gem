import posthog from 'posthog-js'
import { PostHog } from 'posthog-js'

export const initPosthog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog: PostHog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      capture_pageview: false // We'll manually capture pageviews
    })
  }
}

export const posthogInstance = posthog