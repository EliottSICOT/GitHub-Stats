export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const username = searchParams.get('username')

  if (!username) {
    return Response.json({ error: 'Username requis' }, { status: 400 })
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const endpoints: Record<string, string> = {
    user: `https://api.github.com/users/${username}`,
    repos: `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    events: `https://api.github.com/users/${username}/events/public?per_page=100`,
  }

  const url = endpoints[type ?? '']
  if (!url) {
    return Response.json({ error: 'Type invalide' }, { status: 400 })
  }

  const res = await fetch(url, { headers, next: { revalidate: 300 } })

  if (!res.ok) {
    if (res.status === 404) {
      return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }
    if (res.status === 403) {
      return Response.json({ error: 'Rate limit GitHub atteinte' }, { status: 429 })
    }
    return Response.json({ error: 'Erreur GitHub API' }, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
