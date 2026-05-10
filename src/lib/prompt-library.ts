import { extractVariables } from './prompt-utils'

export type PromptVariable = {
  name: string
  defaultValue?: string
}

export type PromptTemplate = {
  id: string
  title: string
  description?: string
  body: string
  variables: Array<PromptVariable>
  category: string
  isFavorite: boolean
  createdAt: number
  updatedAt: number
  isBuiltin?: boolean
}

type PromptLibraryPayload = {
  customPrompts: Array<PromptTemplate>
  builtinFavorites: Record<string, boolean>
}

const STORAGE_KEY = 'hermes-prompt-library'

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function now(): number {
  return Date.now()
}

function createBuiltin(
  id: string,
  title: string,
  description: string,
  category: string,
  body: string,
): PromptTemplate {
  const timestamp = now()
  return {
    id,
    title,
    description,
    body,
    variables: extractVariables(body).map((name) => ({ name })),
    category,
    isFavorite: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    isBuiltin: true,
  }
}

const BUILTIN_PROMPTS: Array<PromptTemplate> = [
  createBuiltin(
    'builtin-coding-review',
    'Code Review Assistant',
    'Find high-impact issues and concrete fixes.',
    'Coding',
    'Review this code for correctness, security, and maintainability. Return:\n1) Critical issues\n2) Suggested fixes\n3) Test cases to add.\n\nCode:\n{{code}}',
  ),
  createBuiltin(
    'builtin-bug-repro',
    'Bug Reproduction Plan',
    'Create a deterministic reproduction checklist.',
    'Analysis',
    'Given this bug report, produce a step-by-step reproduction plan, likely root causes, and data to collect.\n\nBug report:\n{{bug_report}}',
  ),
  createBuiltin(
    'builtin-writing-polish',
    'Writing Polish',
    'Rewrite for clarity and concise tone.',
    'Writing',
    'Rewrite the following text to be clear, concise, and professional. Keep the original meaning.\n\nText:\n{{text}}',
  ),
  createBuiltin(
    'builtin-research-brief',
    'Research Brief',
    'Summarize findings with confidence levels.',
    'Research',
    'Research this topic and produce:\n- Key findings\n- Sources\n- Unknowns\n- Recommended next steps\n\nTopic:\n{{topic}}',
  ),
  createBuiltin(
    'builtin-planning-breakdown',
    'Implementation Breakdown',
    'Convert requirements into executable phases.',
    'Planning',
    'Turn this requirement into an implementation plan with milestones, risks, and verification steps.\n\nRequirement:\n{{requirement}}',
  ),
  createBuiltin(
    'builtin-product-prd',
    'Mini PRD Draft',
    'Draft a compact product requirement document.',
    'Product',
    'Create a mini PRD for this feature including goals, user stories, non-goals, acceptance criteria, and rollout notes.\n\nFeature:\n{{feature}}',
  ),
  createBuiltin(
    'builtin-debug-checklist',
    'Debug Checklist',
    'Generate an ordered debugging playbook.',
    'Operations',
    'Build a debugging checklist for this incident including hypotheses, commands/tools, expected outputs, and fallback paths.\n\nIncident:\n{{incident}}',
  ),
]

function safeParsePayload(raw: string | null): PromptLibraryPayload {
  if (!raw) return { customPrompts: [], builtinFavorites: {} }
  try {
    const parsed = JSON.parse(raw) as Partial<PromptLibraryPayload>
    return {
      customPrompts: Array.isArray(parsed.customPrompts)
        ? parsed.customPrompts
        : [],
      builtinFavorites:
        parsed.builtinFavorites && typeof parsed.builtinFavorites === 'object'
          ? parsed.builtinFavorites
          : {},
    }
  } catch {
    return { customPrompts: [], builtinFavorites: {} }
  }
}

function readPayload(): PromptLibraryPayload {
  if (typeof window === 'undefined') {
    return { customPrompts: [], builtinFavorites: {} }
  }
  return safeParsePayload(window.localStorage.getItem(STORAGE_KEY))
}

function writePayload(payload: PromptLibraryPayload): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function normalizePrompt(template: PromptTemplate): PromptTemplate {
  const timestamp = now()
  const title = template.title.trim()
  const body = template.body
  const variables =
    template.variables.length > 0
      ? template.variables
      : extractVariables(body).map((name) => ({ name }))
  return {
    ...template,
    title,
    body,
    variables,
    createdAt: template.createdAt || timestamp,
    updatedAt: template.updatedAt || timestamp,
    isBuiltin: Boolean(template.isBuiltin),
  }
}

function mergeBuiltinWithFavorites(
  builtinFavorites: Record<string, boolean>,
): Array<PromptTemplate> {
  return BUILTIN_PROMPTS.map((prompt) => ({
    ...prompt,
    isFavorite: Boolean(builtinFavorites[prompt.id]),
  }))
}

export function getPrompts(): Array<PromptTemplate> {
  const payload = readPayload()
  const builtins = mergeBuiltinWithFavorites(payload.builtinFavorites)
  const custom = payload.customPrompts
    .map((prompt) => normalizePrompt({ ...prompt, isBuiltin: false }))
    .sort((left, right) => right.updatedAt - left.updatedAt)
  return [...builtins, ...custom]
}

export function savePrompt(
  template: Omit<PromptTemplate, 'createdAt' | 'updatedAt' | 'isBuiltin'> & {
    createdAt?: number
    updatedAt?: number
  },
): PromptTemplate {
  const payload = readPayload()
  const timestamp = now()
  const next = normalizePrompt({
    ...template,
    createdAt: template.createdAt || timestamp,
    updatedAt: timestamp,
    isBuiltin: false,
  })
  const existingIndex = payload.customPrompts.findIndex((p) => p.id === next.id)
  if (existingIndex >= 0) {
    const existing = payload.customPrompts[existingIndex]
    payload.customPrompts[existingIndex] = {
      ...next,
      createdAt: existing.createdAt,
    }
  } else {
    payload.customPrompts.push(next)
  }
  writePayload(payload)
  return next
}

export function createPromptTemplate(input?: Partial<PromptTemplate>): PromptTemplate {
  const timestamp = now()
  const body = input?.body || ''
  return {
    id: input?.id || createId(),
    title: input?.title || '',
    description: input?.description || '',
    body,
    variables:
      input?.variables && input.variables.length > 0
        ? input.variables
        : extractVariables(body).map((name) => ({ name })),
    category: input?.category || 'Custom',
    isFavorite: Boolean(input?.isFavorite),
    createdAt: input?.createdAt || timestamp,
    updatedAt: input?.updatedAt || timestamp,
    isBuiltin: Boolean(input?.isBuiltin),
  }
}

export function deletePrompt(id: string): boolean {
  const payload = readPayload()
  const before = payload.customPrompts.length
  payload.customPrompts = payload.customPrompts.filter((p) => p.id !== id)
  const changed = payload.customPrompts.length !== before
  if (changed) writePayload(payload)
  return changed
}

export function toggleFavorite(id: string): PromptTemplate | null {
  const payload = readPayload()
  const builtin = BUILTIN_PROMPTS.find((prompt) => prompt.id === id)
  if (builtin) {
    payload.builtinFavorites[id] = !payload.builtinFavorites[id]
    writePayload(payload)
    return {
      ...builtin,
      isFavorite: payload.builtinFavorites[id],
    }
  }

  const customIndex = payload.customPrompts.findIndex((prompt) => prompt.id === id)
  if (customIndex < 0) return null
  const current = payload.customPrompts[customIndex]
  const updated = normalizePrompt({
    ...current,
    isFavorite: !current.isFavorite,
    updatedAt: now(),
    isBuiltin: false,
  })
  payload.customPrompts[customIndex] = updated
  writePayload(payload)
  return updated
}

export function importPromptTemplates(
  templates: Array<PromptTemplate>,
): Array<PromptTemplate> {
  const saved: Array<PromptTemplate> = []
  for (const template of templates) {
    if (template.isBuiltin) continue
    const normalized = createPromptTemplate({
      ...template,
      id: template.id || createId(),
      category: template.category || 'Custom',
    })
    const next = savePrompt({
      ...normalized,
      isBuiltin: false,
    })
    saved.push(next)
  }
  return saved
}
