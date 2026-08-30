import { useState } from 'react'
import CreateReleaseForm from './CreateReleaseForm.jsx'

const initialReleases = [
  {
    id: 1,
    name: 'Mobile app 3.8.0',
    dueDate: '2026-09-02T09:00:00',
    status: 'ongoing',
  },
  {
    id: 2,
    name: 'September website update',
    dueDate: '2026-09-05T14:30:00',
    status: 'planned',
  },
  {
    id: 3,
    name: 'API version 2.4',
    dueDate: '2026-09-12T11:00:00',
    status: 'done',
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

function App() {
  const [releases, setReleases] = useState(initialReleases)

  function handleCreateRelease(releaseDetails) {
    const newRelease = {
      id: crypto.randomUUID(),
      ...releaseDetails,
      status: 'planned',
    }

    setReleases((currentReleases) => [newRelease, ...currentReleases])
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
            {releases.map((release) => (
              <article
                key={release.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
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
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
