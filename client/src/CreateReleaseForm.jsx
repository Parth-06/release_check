import { useState } from 'react'

function CreateReleaseForm({ onCreate }) {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onCreate({
        name: name.trim(),
        dueDate,
        additionalInfo: additionalInfo.trim(),
      })

      setName('')
      setDueDate('')
      setAdditionalInfo('')
    } catch {
      // App displays the API error.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="mt-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="create-release-heading"
    >
      <div>
        <h2 id="create-release-heading" className="text-2xl font-semibold">
          Create a release
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add the release details. Its checklist will start incomplete.
        </p>
      </div>

      <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Release name
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="due-date"
          >
            Due date
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="due-date"
            name="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
        </div>

        <div>
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="additional-info"
          >
            Additional information
            <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="additional-info"
            name="additionalInfo"
            value={additionalInfo}
            onChange={(event) => setAdditionalInfo(event.target.value)}
          />
        </div>

        <div>
          <button
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create release'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreateReleaseForm
