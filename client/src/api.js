const configuredServerUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const serverUrl = configuredServerUrl
  ? configuredServerUrl.startsWith('http')
    ? configuredServerUrl
    : `https://${configuredServerUrl}`
  : import.meta.env.PROD
    ? ''
    : 'http://localhost:3000'

const apiUrl = `${serverUrl}/api`

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export function getReleases() {
  return request('/releases')
}

export function createRelease(release) {
  return request('/releases', {
    method: 'POST',
    body: JSON.stringify({
      ...release,
      dueDate: new Date(release.dueDate).toISOString(),
    }),
  })
}

export function updateReleaseAdditionalInfo(releaseId, additionalInfo) {
  return request(`/releases/${releaseId}`, {
    method: 'PATCH',
    body: JSON.stringify({ additionalInfo }),
  })
}

export function updateReleaseChecklist(releaseId, stepId, completed) {
  return request(`/releases/${releaseId}/checklist`, {
    method: 'PATCH',
    body: JSON.stringify({ stepId, completed }),
  })
}
