import { useEffect, useState } from 'react'
import CreateReleaseForm from './CreateReleaseForm.jsx'
import ReleaseDetails from './ReleaseDetails.jsx'
import {
  createRelease,
  getReleases,
  updateReleaseAdditionalInfo,
  updateReleaseChecklist,
} from './api.js'

const checklistSteps = [
  { id: 'confirm-scope', label: 'Confirm the release scope' },
  { id: 'review-code', label: 'Review and approve code changes' },
  { id: 'run-tests', label: 'Run automated tests' },
  { id: 'complete-qa', label: 'Complete quality assurance checks' },
  { id: 'update-notes', label: 'Update the release notes' },
  { id: 'verify-config', label: 'Verify production configuration' },
  { id: 'create-build', label: 'Create the production build' },
  { id: 'deploy-monitor', label: 'Deploy and monitor the release' },
]

const statusStyles = {
  planned: 'bg-slate-100 text-slate-700',
  ongoing: 'bg-amber-100 text-amber-800',
  done: 'bg-emerald-100 text-emerald-800',
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function App() {
  const [releases, setReleases] = useState([])
  const [selectedReleaseId, setSelectedReleaseId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedRelease = releases.find(
    (release) => release.id === selectedReleaseId,
  )

  useEffect(() => {
    async function loadReleases() {
      try {
        const loadedReleases = await getReleases()
        setReleases(loadedReleases)
        setSelectedReleaseId(loadedReleases[0]?.id || null)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadReleases()
  }, [])

  async function handleCreateRelease(releaseDetails) {
    setError('')

    try {
      const newRelease = await createRelease(releaseDetails)
      setReleases((currentReleases) => [newRelease, ...currentReleases])
      setSelectedReleaseId(newRelease.id)
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  async function handleToggleStep(releaseId, stepId) {
    const release = releases.find((item) => item.id === releaseId)
    const completed = !release.completedSteps.includes(stepId)
    setError('')

    try {
      const updatedRelease = await updateReleaseChecklist(
        releaseId,
        stepId,
        completed,
      )
      setReleases((currentReleases) =>
        currentReleases.map((item) =>
          item.id === releaseId ? updatedRelease : item,
        ),
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleUpdateAdditionalInfo(releaseId, additionalInfo) {
    setError('')

    try {
      const updatedRelease = await updateReleaseAdditionalInfo(
        releaseId,
        additionalInfo,
      )
      setReleases((currentReleases) =>
        currentReleases.map((release) =>
          release.id === releaseId ? updatedRelease : release,
        ),
      )
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="mb-2 text-sm font-bold tracking-wider text-blue-600 uppercase">
            Release management
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Release Checklist
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Keep every release organized and track its progress in one place.
          </p>
        </header>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <CreateReleaseForm onCreate={handleCreateRelease} />

        <section className="mt-12" aria-labelledby="releases-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="releases-heading" className="text-2xl font-semibold">
                Releases
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {releases.length} releases scheduled
              </p>
            </div>
          </div>

          {isLoading && <p className="mt-6 text-slate-500">Loading releases...</p>}

          {!isLoading && releases.length === 0 && (
            <p className="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
              No releases yet. Create the first one above.
            </p>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => {
              const isSelected = release.id === selectedReleaseId

              return (
                <article
                  key={release.id}
                  className={`rounded-xl border bg-white p-5 shadow-sm ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-100'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold">{release.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[release.status]}`}
                    >
                      {release.status}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                      Due date
                    </p>
                    <time
                      className="mt-1 block text-sm font-medium text-slate-700"
                      dateTime={release.dueDate}
                    >
                      {dateFormatter.format(new Date(release.dueDate))}
                    </time>
                  </div>

                  <button
                    className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                    type="button"
                    onClick={() => setSelectedReleaseId(release.id)}
                  >
                    {isSelected ? 'Viewing checklist' : 'View checklist'}
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        {selectedRelease && (
          <ReleaseDetails
            key={selectedRelease.id}
            release={selectedRelease}
            steps={checklistSteps}
            status={selectedRelease.status}
            onToggleStep={handleToggleStep}
            onUpdateAdditionalInfo={handleUpdateAdditionalInfo}
          />
        )}
      </div>
    </main>
  )
}

export default App
