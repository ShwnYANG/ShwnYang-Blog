type Counts = { pageviews: number; visitors: number }
type VercelCountResponse = { data?: Counts }

const countEndpoint = 'https://api.vercel.com/v1/query/web-analytics/visits/count'
const cacheHeaders = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }

async function getCounts(token: string, projectId: string, teamId?: string, path?: string): Promise<Counts> {
  const url = new URL(countEndpoint)
  url.searchParams.set('projectId', projectId)
  if (teamId) url.searchParams.set('teamId', teamId)
  if (path) url.searchParams.set('filter', `requestPath eq '${path.replace(/'/g, "''")}'`)

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000)
  })
  if (!response.ok) throw new Error(`Vercel Web Analytics returned ${response.status}`)

  const result = await response.json() as VercelCountResponse
  const counts = result.data
  if (!counts || !Number.isSafeInteger(counts.pageviews) || !Number.isSafeInteger(counts.visitors)) {
    throw new Error('Vercel Web Analytics returned invalid counts')
  }
  return counts
}

export async function GET(request: Request): Promise<Response> {
  const path = new URL(request.url).searchParams.get('path')
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.length > 2048 || /[\r\n\\]/.test(path)) {
    return Response.json({ error: 'Invalid path' }, { status: 400 })
  }

  const token = process.env.VERCEL_ANALYTICS_TOKEN
  const projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_ANALYTICS_TEAM_ID
  if (!token || !projectId) {
    return Response.json({ error: 'Analytics is not configured' }, { status: 503 })
  }

  try {
    const [site, page] = await Promise.all([
      getCounts(token, projectId, teamId),
      getCounts(token, projectId, teamId, path)
    ])
    return Response.json({ site, page }, { headers: cacheHeaders })
  } catch (error) {
    console.error('Unable to load Vercel Web Analytics counts:', error)
    return Response.json({ error: 'Analytics is unavailable' }, { status: 502 })
  }
}
