const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function ReleaseDetails({
  release,
  steps,
  status,
  onToggleStep,
  onUpdateAdditionalInfo,
}) {
  return (
    <section
      id="release-details"
      className="mt-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="release-details-heading"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-blue-600">Release details</p>
          <h2 id="release-details-heading" className="mt-1 text-2xl font-semibold">
            {release.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Due {dateFormatter.format(new Date(release.dueDate))}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
            Status
          </p>
          <p className="mt-1 font-semibold text-slate-800 capitalize">{status}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Release checklist</h3>
              <p className="mt-1 text-sm text-slate-500">
                Check each step as it is completed.
              </p>
            </div>
            <p className="text-sm font-medium text-slate-600">
              {release.completedSteps.length} of {steps.length}
            </p>
          </div>

          <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
            {steps.map((step) => (
              <label
                className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-slate-50"
                key={step.id}
              >
                <input
                  className="mt-0.5 size-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  type="checkbox"
                  checked={release.completedSteps.includes(step.id)}
                  onChange={() => onToggleStep(release.id, step.id)}
                />
                <span className="text-sm font-medium text-slate-700">
                  {step.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            className="text-lg font-semibold text-slate-900"
            htmlFor="release-additional-info"
          >
            Additional information
          </label>
          <p className="mt-1 text-sm text-slate-500">
            Add notes or context for this release.
          </p>
          <textarea
            className="mt-4 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="release-additional-info"
            value={release.additionalInfo}
            onChange={(event) =>
              onUpdateAdditionalInfo(release.id, event.target.value)
            }
            placeholder="No additional information yet."
          />
        </div>
      </div>
    </section>
  )
}

export default ReleaseDetails
