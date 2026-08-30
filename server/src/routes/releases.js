import express from 'express'
import prisma from '../prisma.js'

const router = express.Router()

const checklistStepIds = [
  'confirm-scope',
  'review-code',
  'run-tests',
  'complete-qa',
  'update-notes',
  'verify-config',
  'create-build',
  'deploy-monitor',
]

function calculateStatus(completedSteps) {
  if (completedSteps.length === 0) {
    return 'planned'
  }

  if (completedSteps.length === checklistStepIds.length) {
    return 'done'
  }

  return 'ongoing'
}

function addStatus(release) {
  return {
    ...release,
    status: calculateStatus(release.completedSteps),
  }
}

router.get('/', async (request, response) => {
  const releases = await prisma.release.findMany({
    orderBy: { dueDate: 'asc' },
  })

  response.json(releases.map(addStatus))
})

router.get('/:id', async (request, response) => {
  const release = await prisma.release.findUnique({
    where: { id: request.params.id },
  })

  if (!release) {
    return response.status(404).json({ error: 'Release not found' })
  }

  response.json(addStatus(release))
})

router.post('/', async (request, response) => {
  const { name, dueDate, additionalInfo } = request.body
  const parsedDueDate = new Date(dueDate)

  if (typeof name !== 'string' || !name.trim()) {
    return response.status(400).json({ error: 'Name is required' })
  }

  if (!dueDate || Number.isNaN(parsedDueDate.getTime())) {
    return response.status(400).json({ error: 'A valid due date is required' })
  }

  if (additionalInfo !== undefined && typeof additionalInfo !== 'string') {
    return response
      .status(400)
      .json({ error: 'Additional information must be text' })
  }

  const release = await prisma.release.create({
    data: {
      name: name.trim(),
      dueDate: parsedDueDate,
      additionalInfo: additionalInfo?.trim() || null,
    },
  })

  response.status(201).json(addStatus(release))
})

router.patch('/:id', async (request, response) => {
  const { additionalInfo } = request.body

  if (typeof additionalInfo !== 'string' && additionalInfo !== null) {
    return response
      .status(400)
      .json({ error: 'Additional information must be text or null' })
  }

  const existingRelease = await prisma.release.findUnique({
    where: { id: request.params.id },
  })

  if (!existingRelease) {
    return response.status(404).json({ error: 'Release not found' })
  }

  const release = await prisma.release.update({
    where: { id: request.params.id },
    data: {
      additionalInfo: additionalInfo?.trim() || null,
    },
  })

  response.json(addStatus(release))
})

router.patch('/:id/checklist', async (request, response) => {
  const { stepId, completed } = request.body

  if (!checklistStepIds.includes(stepId)) {
    return response.status(400).json({ error: 'Unknown checklist step' })
  }

  if (typeof completed !== 'boolean') {
    return response.status(400).json({ error: 'Completed must be true or false' })
  }

  const existingRelease = await prisma.release.findUnique({
    where: { id: request.params.id },
  })

  if (!existingRelease) {
    return response.status(404).json({ error: 'Release not found' })
  }

  const completedSteps = new Set(existingRelease.completedSteps)

  if (completed) {
    completedSteps.add(stepId)
  } else {
    completedSteps.delete(stepId)
  }

  const release = await prisma.release.update({
    where: { id: request.params.id },
    data: { completedSteps: [...completedSteps] },
  })

  response.json(addStatus(release))
})

export default router
