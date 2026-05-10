import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogRoot,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CodeBlock } from '@/components/prompt-kit/code-block'
import type { PromptTemplate } from '@/lib/prompt-library'
import { extractVariables, fillVariables, validateTemplate } from '@/lib/prompt-utils'

type PromptEditorProps = {
  open: boolean
  prompt: PromptTemplate | null
  onClose: () => void
  onSave: (prompt: Partial<PromptTemplate>) => void
  onDelete: (promptId: string) => void
}

const CATEGORIES = [
  'Coding',
  'Writing',
  'Analysis',
  'Research',
  'Planning',
  'Product',
  'Operations',
  'Custom',
] as const

export function PromptEditor({
  open,
  prompt,
  onClose,
  onSave,
  onDelete,
}: PromptEditorProps) {
  const [activeTab, setActiveTab] = useState('edit')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const [title, setTitle] = useState(prompt?.title || '')
  const [description, setDescription] = useState(prompt?.description || '')
  const [category, setCategory] = useState(prompt?.category || 'Custom')
  const [body, setBody] = useState(prompt?.body || '')
  const [defaults, setDefaults] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    setActiveTab('edit')
    setTitle(prompt?.title || '')
    setDescription(prompt?.description || '')
    setCategory(prompt?.category || 'Custom')
    setBody(prompt?.body || '')
    setDefaults(
      Object.fromEntries(
        (prompt?.variables || []).map((variable) => [
          variable.name,
          variable.defaultValue || '',
        ]),
      ),
    )
    setError('')
  }, [prompt])

  const variableNames = useMemo(() => extractVariables(body), [body])

  const highlightedBody = useMemo(
    () => body.replaceAll(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, '[[ $1 ]]'),
    [body],
  )

  const previewBody = useMemo(() => fillVariables(body, defaults), [body, defaults])

  if (!open) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[170] bg-black/40"
          onClick={onClose}
        />
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="fixed right-0 top-0 z-[180] flex h-full w-[min(780px,95vw)] flex-col border-l"
          style={{
            background: 'var(--theme-panel)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="border-b border-primary-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-primary-900">
              {prompt?.id ? 'Edit Prompt' : 'New Prompt'}
            </h2>
            <p className="text-sm text-primary-600">
              Use {'{{variable}}'} placeholders to define dynamic fields.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="px-5 pt-3">
              <TabsList>
                <TabsTab value="edit">Edit</TabsTab>
                <TabsTab value="preview">Preview</TabsTab>
              </TabsList>
            </div>
            <TabsPanel value="edit" className="min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-4 px-5 py-4">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase text-primary-500">
                    Title
                  </span>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase text-primary-500">
                    Category
                  </span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-9 rounded-lg border border-primary-200 bg-surface px-3 text-sm text-primary-800"
                  >
                    {CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase text-primary-500">
                    Description
                  </span>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={2}
                    className="rounded-lg border border-primary-200 bg-surface px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-400"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase text-primary-500">
                    Prompt Body
                  </span>
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={10}
                    className="rounded-lg border border-primary-200 bg-surface px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-400"
                  />
                </label>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-primary-500">
                    Highlighted placeholders
                  </p>
                  <pre className="whitespace-pre-wrap rounded-lg border border-primary-200 bg-primary-100/50 p-3 text-xs text-primary-700">
                    {highlightedBody}
                  </pre>
                </div>

                {variableNames.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-primary-500">
                      Variables
                    </p>
                    {variableNames.map((name) => (
                      <label key={name} className="flex items-center gap-2 text-sm">
                        <span className="w-40 shrink-0 font-medium text-primary-700">
                          {name}
                        </span>
                        <Input
                          value={defaults[name] || ''}
                          onChange={(event) =>
                            setDefaults((prev) => ({
                              ...prev,
                              [name]: event.target.value,
                            }))
                          }
                          placeholder="Default value"
                        />
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </TabsPanel>
            <TabsPanel value="preview" className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <CodeBlock content={previewBody} />
            </TabsPanel>
          </Tabs>

          <div className="flex items-center justify-between gap-2 border-t border-primary-200 px-5 py-3">
            <div>
              {prompt?.id && !prompt?.isBuiltin ? (
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  Delete
                </Button>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const validationError = validateTemplate(title, body)
                  if (validationError) {
                    setError(validationError)
                    return
                  }
                  setError('')
                  onSave({
                    id: prompt?.id,
                    title: title.trim(),
                    description: description.trim(),
                    body,
                    category,
                    isFavorite: prompt?.isFavorite || false,
                    createdAt: prompt?.createdAt,
                    variables: variableNames.map((name) => ({
                      name,
                      defaultValue: defaults[name] || '',
                    })),
                  })
                  onClose()
                }}
              >
                Save Prompt
              </Button>
            </div>
          </div>
          {error ? (
            <div className="border-t border-red-200 bg-red-50 px-5 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </motion.aside>
      </AnimatePresence>

      <AlertDialogRoot open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <div className="p-4">
            <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </div>
          <div className="flex justify-end gap-2 border-t border-primary-200 p-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!prompt?.id) return
                onDelete(prompt.id)
                onClose()
              }}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogRoot>
    </>
  )
}
