import { useState } from 'react'
import CreateReleaseForm from './CreateReleaseForm.jsx'
import ReleaseDetails from './ReleaseDetails.jsx'

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

const initialReleases = [
  {
    id: 1,
    name: 'Mobile app 3.8.0',
    dueDate: '2026-09-02T09:00:00',
    additionalInfo: 'Coordinate the rollout with the mobile support team.',
    completedSteps: ['confirm-scope', 'review-code', 'run-tests'],
  },
  {
    id: 2,
    name: 'September website update',
    dueDate: '2026-09-05T14:30:00',
    additionalInfo: '',
    completedSteps: [],
  },
  {
    id: 3,
    name: 'API version 2.4',
    dueDate: '2026-09-12T11:00:00',
    additionalInfo: 'Notify API consumers after the deployment is verified.',
    completedSteps: checklistSteps.map((step) => step.id),
  },
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

function calculateStatus(completedSteps) {
  if (completedSteps.length === 0) {
    return 'planned'
  }

  if (completedSteps.length === checklistSteps.length) {
    return 'done'
  }

  return 'ongoing'
}

function App() {
  const [releases, setReleases] = useState(initialReleases)
  const [selectedReleaseId, setSelectedReleaseId] = useState(
    initialReleases[0].id,
  )

  const selectedRelease = releases.find(
    (release) => release.id === selectedReleaseId,
  )

  function handleCreateRelease(releaseDetails) {
    const newRelease = {
      id: crypto.randomUUID(),
      ...releaseDetails,
      completedSteps: [],
    }

    setReleases((currentReleases) => [newRelease, ...currentReleases])
    setSelectedReleaseId(newRelease.id)
  }

  function handleToggleStep(releaseId, stepId) {
    setReleases((currentReleases) =>
      currentReleases.map((release) => {
        if (release.id !== releaseId) {
          return release
        }

        const isCompleted = release.completedSteps.includes(stepId)
        const completedSteps = isCompleted
          ? release.completedSteps.filter((id) => id !== stepId)
          : [...release.completedSteps, stepId]

        return { ...release, completedSteps }
      }),
    )
  }

  function handleUpdateAdditionalInfo(releaseId, additionalInfo) {
    setReleases((currentReleases) =>
      currentReleases.map((release) =>
        release.id === releaseId
          ? { ...release, additionalInfo }
          : release,
      ),
    )
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => {
              const status = calculateStatus(release.completedSteps)
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
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}
                    >
                      {status}
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
            release={selectedRelease}
            steps={checklistSteps}
            status={calculateStatus(selectedRelease.completedSteps)}
            onToggleStep={handleToggleStep}
            onUpdateAdditionalInfo={handleUpdateAdditionalInfo}
          />
        )}
      </div>
    </main>
  )
}

export default App
