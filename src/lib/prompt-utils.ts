import type { PromptTemplate } from './prompt-library'

export const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g

export const CHAT_PENDING_PROMPT_STORAGE_KEY = 'hermes-chat-pending-prompt'

export function extractVariables(body: string): Array<string> {
  const names = new Set<string>()
  for (const match of body.matchAll(VARIABLE_PATTERN)) {
    const name = (match[1] || '').trim()
    if (name) names.add(name)
  }
  return Array.from(names)
}

export function fillVariables(
  body: string,
  values: Record<string, string>,
): string {
  return body.replaceAll(VARIABLE_PATTERN, (_, variableName: string) => {
    const key = variableName.trim()
    const value = values[key]
    return typeof value === 'string' ? value : ''
  })
}

export function validateTemplate(title: string, body: string): string | null {
  if (!title.trim()) return 'Title is required.'
  if (!body.trim()) return 'Prompt body is required.'
  return null
}

export function queuePromptForChatInsert(prompt: string): void {
  if (typeof window === 'undefined') return
  const trimmed = prompt.trim()
  if (!trimmed) return
  window.sessionStorage.setItem(CHAT_PENDING_PROMPT_STORAGE_KEY, trimmed)
}

export function consumeQueuedPromptForChatInsert(): string | null {
  if (typeof window === 'undefined') return null
  const queued = window.sessionStorage.getItem(CHAT_PENDING_PROMPT_STORAGE_KEY)
  if (!queued) return null
  window.sessionStorage.removeItem(CHAT_PENDING_PROMPT_STORAGE_KEY)
  return queued
}

export function hydrateTemplateVariables(
  template: PromptTemplate,
): PromptTemplate {
  const variableNames = extractVariables(template.body)
  const defaultsByName = new Map(
    template.variables.map((item) => [item.name, item.defaultValue]),
  )
  return {
    ...template,
    variables: variableNames.map((name) => ({
      name,
      defaultValue: defaultsByName.get(name),
    })),
  }
}
