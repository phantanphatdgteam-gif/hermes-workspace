import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { PromptTemplate } from '@/lib/prompt-library'
import { fillVariables } from '@/lib/prompt-utils'

type PromptFillModalProps = {
  open: boolean
  prompt: PromptTemplate | null
  initialValues?: Record<string, string>
  onClose: () => void
  onInsert: (value: string) => void
}

export function PromptFillModal({
  open,
  prompt,
  initialValues,
  onClose,
  onInsert,
}: PromptFillModalProps) {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!prompt) return
    const defaults = Object.fromEntries(
      (prompt.variables || []).map((variable) => [
        variable.name,
        variable.defaultValue || '',
      ]),
    )
    setValues({
      ...defaults,
      ...(initialValues || {}),
    })
  }, [initialValues, prompt])

  const hasVariables = (prompt?.variables || []).length > 0
  const preview = useMemo(() => {
    if (!prompt) return ''
    return fillVariables(prompt.body, values)
  }, [prompt, values])

  return (
    <DialogRoot
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogContent className="w-[min(620px,95vw)]">
        <div className="border-b border-primary-200 px-4 py-3">
          <DialogTitle>{prompt?.title || 'Use prompt'}</DialogTitle>
          <DialogDescription>
            Fill prompt variables and insert into chat.
          </DialogDescription>
        </div>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto px-4 py-3">
          {hasVariables ? (
            (prompt?.variables || []).map((variable) => (
              <label
                key={variable.name}
                className="flex flex-col gap-1 text-sm text-primary-700"
              >
                <span className="font-medium">{variable.name}</span>
                <Input
                  value={values[variable.name] || ''}
                  onChange={(event) => {
                    const next = event.target.value
                    setValues((prev) => ({
                      ...prev,
                      [variable.name]: next,
                    }))
                  }}
                  placeholder={variable.defaultValue || ''}
                />
              </label>
            ))
          ) : (
            <p className="text-sm text-primary-600">
              This prompt has no variables. Insert as-is.
            </p>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-500">
              Preview
            </p>
            <pre className="max-h-44 overflow-auto whitespace-pre-wrap rounded-lg border border-primary-200 bg-primary-100/50 p-3 text-xs text-primary-800">
              {preview}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-primary-200 px-4 py-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onInsert(preview)
              onClose()
            }}
            disabled={!prompt}
          >
            Insert into Chat
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}
