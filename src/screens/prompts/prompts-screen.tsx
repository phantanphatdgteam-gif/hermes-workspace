import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DownloadSquare01Icon,
  PlusSignIcon,
  SparklesIcon,
  UploadSquare01Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'
import { SearchInput } from '@/components/search/search-input'
import { usePromptLibraryStore } from '@/stores/prompt-library-store'
import { PromptCard } from './components/prompt-card'
import { PromptEditor } from './components/prompt-editor'
import { PromptFillModal } from './components/prompt-fill-modal'
import {
  createPromptTemplate,
  getPrompts,
  type PromptTemplate,
} from '@/lib/prompt-library'
import { queuePromptForChatInsert } from '@/lib/prompt-utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { toast } from '@/components/ui/toast'

const ALL_CATEGORIES = 'All'

export function PromptsScreen() {
  usePageTitle('Prompts')
  const navigate = useNavigate()
  const prompts = usePromptLibraryStore((state) => state.prompts)
  const drafts = usePromptLibraryStore((state) => state.drafts)
  const loadPrompts = usePromptLibraryStore((state) => state.loadPrompts)
  const upsertPrompt = usePromptLibraryStore((state) => state.upsertPrompt)
  const deletePrompt = usePromptLibraryStore((state) => state.deletePrompt)
  const toggleFavorite = usePromptLibraryStore((state) => state.toggleFavorite)
  const importPrompts = usePromptLibraryStore((state) => state.importPrompts)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null)
  const [fillPrompt, setFillPrompt] = useState<PromptTemplate | null>(null)
  const [fillOpen, setFillOpen] = useState(false)

  useEffect(() => {
    if (prompts.length > 0) return
    loadPrompts()
  }, [loadPrompts, prompts.length])

  const categories = useMemo(() => {
    const entries = new Set<string>([ALL_CATEGORIES])
    for (const prompt of prompts) entries.add(prompt.category || 'Custom')
    return Array.from(entries)
  }, [prompts])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return prompts.filter((prompt) => {
      if (activeCategory !== ALL_CATEGORIES && prompt.category !== activeCategory) {
        return false
      }
      if (!normalized) return true
      const searchText = `${prompt.title} ${prompt.description || ''} ${prompt.body}`.toLowerCase()
      return searchText.includes(normalized)
    })
  }, [activeCategory, prompts, query])

  const favoritePrompts = useMemo(
    () => prompts.filter((prompt) => prompt.isFavorite),
    [prompts],
  )

  function handleUsePrompt(prompt: PromptTemplate) {
    if ((prompt.variables || []).length === 0) {
      queuePromptForChatInsert(prompt.body)
      void navigate({
        to: '/chat/$sessionKey',
        params: { sessionKey: 'new' },
      })
      toast('Prompt inserted into chat draft', { type: 'success' })
      return
    }
    setFillPrompt(prompt)
    setFillOpen(true)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <header className="border-b border-primary-200 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-primary-900">
              Prompt Library
            </h1>
            <p className="text-sm text-primary-600">
              Create, reuse, and insert prompts quickly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Import prompts"
            >
              <HugeiconsIcon icon={UploadSquare01Icon} size={16} strokeWidth={1.6} />
              Import
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const customOnly = getPrompts().filter((prompt) => !prompt.isBuiltin)
                const blob = new Blob([JSON.stringify(customOnly, null, 2)], {
                  type: 'application/json',
                })
                const url = URL.createObjectURL(blob)
                const anchor = document.createElement('a')
                anchor.href = url
                anchor.download = 'hermes-prompts.json'
                anchor.click()
                URL.revokeObjectURL(url)
              }}
            >
              <HugeiconsIcon
                icon={DownloadSquare01Icon}
                size={16}
                strokeWidth={1.6}
              />
              Export
            </Button>
            <Button onClick={() => setEditingPrompt(createPromptTemplate())}>
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.6} />
              New Prompt
            </Button>
          </div>
        </div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".json"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return
          try {
            const text = await file.text()
            const parsed = JSON.parse(text) as Array<PromptTemplate>
            const imported = importPrompts(parsed)
            toast(`Imported ${imported} prompts`, { type: 'success' })
          } catch {
            toast('Failed to import prompts JSON', { type: 'error' })
          } finally {
            event.target.value = ''
          }
        }}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-[280px_1fr] md:p-6">
        <aside className="rounded-xl border border-primary-200 bg-primary-50/40 p-4">
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary-500">
              Search
            </span>
            <SearchInput
              value={query}
              onValueChange={setQuery}
              onClear={() => setQuery('')}
            />
          </label>

          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="gap-1"
            orientation="vertical"
          >
            <TabsList className="w-full" orientation="vertical">
              {categories.map((category) => (
                <TabsTab
                  key={category}
                  value={category}
                  className="justify-start text-xs"
                >
                  {category}
                </TabsTab>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-500">
              Favorites
            </p>
            <div className="space-y-1">
              {favoritePrompts.length === 0 ? (
                <p className="text-xs text-primary-500">No favorite prompts yet.</p>
              ) : (
                favoritePrompts.slice(0, 8).map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    className="w-full rounded-md px-2 py-1 text-left text-xs text-primary-700 hover:bg-primary-100"
                    onClick={() => {
                      handleUsePrompt(prompt)
                    }}
                  >
                    {prompt.title}
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="min-h-0 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-primary-300">
              <p className="text-sm text-primary-600">No prompts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {filtered.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onToggleFavorite={toggleFavorite}
                  onEdit={(selected) => setEditingPrompt(selected)}
                  onUse={handleUsePrompt}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <PromptEditor
        open={Boolean(editingPrompt)}
        prompt={editingPrompt}
        onClose={() => setEditingPrompt(null)}
        onDelete={deletePrompt}
        onSave={(nextPrompt) => {
          const saved = upsertPrompt(nextPrompt)
          if (!saved) {
            toast('Prompt is missing title or body', { type: 'error' })
            return
          }
          toast('Prompt saved', { type: 'success' })
        }}
      />

      <PromptFillModal
        open={fillOpen}
        prompt={fillPrompt}
        initialValues={fillPrompt ? drafts[fillPrompt.id] || {} : {}}
        onClose={() => setFillOpen(false)}
        onInsert={(filledPrompt) => {
          queuePromptForChatInsert(filledPrompt)
          void navigate({
            to: '/chat/$sessionKey',
            params: { sessionKey: 'new' },
          })
          toast('Prompt inserted into chat draft', { type: 'success' })
        }}
      />

      <button
        type="button"
        onClick={() => {
          if (!favoritePrompts[0]) return
          handleUsePrompt(favoritePrompts[0])
        }}
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-surface px-3 py-2 text-xs font-medium text-primary-700 shadow-md md:hidden"
      >
        <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={1.7} />
        Quick Use
      </button>
    </div>
  )
}
