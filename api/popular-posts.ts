type PopularPost = { path: string; pageviews: number; visitors: number }
type AggregateRow = { requestPath?: unknown; pageviews?: unknown; visitors?: unknown }
type AggregateResponse = { data?: AggregateRow[] }

export async function GET(): Promise<Response> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN
  const projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_ANALYTICS_TEAM_ID
  if (!token || !projectId) {
    return Response.json({ error: 'Analytics is not configured' }, { status: 503 })
  }

  const now = Date.now()
  const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate')
  url.searchParams.set('projectId', projectId)
  if (teamId) url.searchParams.set('teamId', teamId)
  url.searchParams.set('since', String(now - 30 * 24 * 60 * 60 * 1000))
  url.searchParams.set('until', String(now))
  url.searchParams.set('by', 'requestPath')
  url.searchParams.set('limit', '100')

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000)
    })
    if (!response.ok) throw new Error(`Vercel Web Analytics returned ${response.status}`)

    const result = await response.json() as AggregateResponse
    if (!Array.isArray(result.data)) throw new Error('Vercel Web Analytics returned invalid rows')
    const posts: PopularPost[] = result.data
      .filter((row): row is AggregateRow & { requestPath: string; pageviews: number; visitors: number } =>
        typeof row.requestPath === 'string' &&
        row.requestPath.startsWith('/') &&
        typeof row.pageviews === 'number' && Number.isSafeInteger(row.pageviews) && row.pageviews > 0 &&
        typeof row.visitors === 'number' && Number.isSafeInteger(row.visitors))
      .map(row => ({ path: row.requestPath, pageviews: row.pageviews, visitors: row.visitors }))
      .sort((a, b) => b.pageviews - a.pageviews)

    const headers = posts.length ? { 'Cache-Control': 'public, s-maxage=600' } : { 'Cache-Control': 'no-store' }
    return Response.json({ posts }, { headers })
  } catch (error) {
    console.error('Unable to load popular posts:', error)
    return Response.json({ error: 'Analytics is unavailable' }, { status: 502 })
  }
}
