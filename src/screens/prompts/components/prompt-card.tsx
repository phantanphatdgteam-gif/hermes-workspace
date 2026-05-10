import { HugeiconsIcon } from '@hugeicons/react'
import {
  PencilEdit02Icon,
  SparklesIcon,
  StarIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PromptTemplate } from '@/lib/prompt-library'

type PromptCardProps = {
  prompt: PromptTemplate
  onUse: (prompt: PromptTemplate) => void
  onEdit: (prompt: PromptTemplate) => void
  onToggleFavorite: (id: string) => void
}

export function PromptCard({
  prompt,
  onUse,
  onEdit,
  onToggleFavorite,
}: PromptCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border p-4 transition-all',
        'hover:bg-[var(--theme-card2)] hover:border-[var(--theme-accent-border)]',
      )}
      style={{
        background: 'var(--theme-card)',
        borderColor: 'var(--theme-border)',
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-primary-900">
            {prompt.title}
          </h3>
          <span className="inline-flex rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-700">
            {prompt.category}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite(prompt.id)}
          className="rounded-md p-1 text-primary-500 hover:bg-primary-100"
          aria-label={prompt.isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <HugeiconsIcon
            icon={StarIcon}
            size={16}
            strokeWidth={1.8}
            className={prompt.isFavorite ? 'text-yellow-500' : ''}
          />
        </button>
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-primary-600">
        {prompt.description || prompt.body}
      </p>

      <div className="mb-3 rounded-lg border border-primary-200 bg-primary-100/50 p-2 text-xs text-primary-700">
        <p className="line-clamp-3 whitespace-pre-wrap">{prompt.body}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(prompt)}
          disabled={Boolean(prompt.isBuiltin)}
        >
          <HugeiconsIcon icon={PencilEdit02Icon} size={16} strokeWidth={1.6} />
          Edit
        </Button>
        <Button size="sm" onClick={() => onUse(prompt)}>
          <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={1.6} />
          Use
        </Button>
      </div>
    </article>
  )
}
