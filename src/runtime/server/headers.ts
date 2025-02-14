import { defineEventHandler, getCookie, getRequestIP, getValidatedQuery, setCookie, setResponseHeader } from '#imports';
import type { H3Event } from 'h3';
import { z } from "zod";

function getIP (event: H3Event) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || ''
  return ip
}

const params = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  utm_campaign: z.string().optional(),
  'prepr-preview-segment': z.string().optional(),
})

export default defineEventHandler(async event => {
  const ip = getIP(event)

  if (ip) {
      setResponseHeader(event, 'Prepr-Visitor-IP', ip)
  }
  const preprUidCookie = getCookie(event, '__prepr_uid')

  if (preprUidCookie) {
    setResponseHeader(event, 'Prepr-Customer-Id', preprUidCookie)
  }

  const query =await getValidatedQuery(event, params.parse)

  type Key = keyof z.infer<typeof params>

  // Get all keys that start with utm
  const utmKeys = Object.keys(query).filter(key => key.startsWith('utm'))

  // Set all utm keys as response headers if they exist
  utmKeys.forEach((key) => {
    setResponseHeader(event, `Prepr-Context-${key}`, query[key as Key])
  })

  if (query['prepr-preview-segment']) {
    setResponseHeader(event, 'Prepr-Segments', query['prepr-preview-segment'])

    // Set cookie for 1 year
    setCookie(event, 'Prepr-Segments', query['prepr-preview-segment'], { maxAge: 365 * 24 * 60 * 60 })
  }

  // If the cookie for segments exists, set it as a response header
  const segmentsCookie = getCookie(event, 'Prepr-Segments')

  if (segmentsCookie) {
    setResponseHeader(event, 'Prepr-Segments', segmentsCookie)
  }
})