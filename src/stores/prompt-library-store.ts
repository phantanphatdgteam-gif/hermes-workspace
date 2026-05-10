import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  createPromptTemplate,
  deletePrompt as deletePromptFromLibrary,
  getPrompts,
  importPromptTemplates,
  savePrompt,
  toggleFavorite as toggleFavoriteInLibrary,
} from '@/lib/prompt-library'
import type { PromptTemplate } from '@/lib/prompt-library'
import { extractVariables } from '@/lib/prompt-utils'

type PromptDrafts = Record<string, Record<string, string>>

type PromptLibraryState = {
  prompts: Array<PromptTemplate>
  drafts: PromptDrafts
  loadPrompts: () => void
  upsertPrompt: (template: Partial<PromptTemplate>) => PromptTemplate | null
  deletePrompt: (id: string) => void
  toggleFavorite: (id: string) => void
  setDraftVar: (promptId: string, varName: string, value: string) => void
  clearDraft: (promptId: string) => void
  importPrompts: (templates: Array<PromptTemplate>) => number
}

function normalizePromptTemplate(
  template: Partial<PromptTemplate>,
): PromptTemplate | null {
  const title = (template.title || '').trim()
  const body = template.body || ''
  if (!title || !body.trim()) return null
  const variableNames = extractVariables(body)
  const defaults = new Map(
    (template.variables || []).map((item) => [item.name, item.defaultValue]),
  )

  return createPromptTemplate({
    ...template,
    title,
    body,
    category: template.category || 'Custom',
    variables: variableNames.map((name) => ({
      name,
      defaultValue: defaults.get(name),
    })),
    isBuiltin: false,
  })
}

export const usePromptLibraryStore = create<PromptLibraryState>()(
  persist(
    (set, get) => ({
      prompts: [],
      drafts: {},
      loadPrompts: () => {
        set({ prompts: getPrompts() })
      },
      upsertPrompt: (template) => {
        const normalized = normalizePromptTemplate(template)
        if (!normalized) return null
        const saved = savePrompt(normalized)
        set({ prompts: getPrompts() })
        return saved
      },
      deletePrompt: (id) => {
        deletePromptFromLibrary(id)
        set((state) => {
          const nextDrafts = { ...state.drafts }
          delete nextDrafts[id]
          return { drafts: nextDrafts, prompts: getPrompts() }
        })
      },
      toggleFavorite: (id) => {
        toggleFavoriteInLibrary(id)
        set({ prompts: getPrompts() })
      },
      setDraftVar: (promptId, varName, value) => {
        set((state) => {
          const existingDraft = state.drafts[promptId]
          return {
            drafts: {
              ...state.drafts,
              [promptId]:
                existingDraft && typeof existingDraft === 'object'
                  ? { ...existingDraft, [varName]: value }
                  : { [varName]: value },
            },
          }
        })
      },
      clearDraft: (promptId) => {
        set((state) => {
          if (!(promptId in state.drafts)) return state
          const nextDrafts = { ...state.drafts }
          delete nextDrafts[promptId]
          return { drafts: nextDrafts }
        })
      },
      importPrompts: (templates) => {
        const saved = importPromptTemplates(templates)
        set({ prompts: getPrompts() })
        return saved.length
      },
    }),
    {
      name: 'hermes-prompt-library-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ drafts: state.drafts }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.loadPrompts()
      },
    },
  ),
)
