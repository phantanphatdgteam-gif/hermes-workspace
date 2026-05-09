'use client'

import { Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  RefreshIcon,
  Settings01Icon,
} from '@hugeicons/core-free-icons'
import type { OnboardingStepComponentProps } from './onboarding-steps'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AuthCheckResponse = {
  authenticated?: boolean
  authRequired?: boolean
  error?: string
}

type ClaudeConfigResponse = {
  activeProvider?: string
  activeModel?: string
}

type ConnectionStatus = 'checking' | 'connected' | 'disconnected'

export function ConnectionCheckStep({
  setCanProceed,
}: OnboardingStepComponentProps) {
  const [status, setStatus] = useState<ConnectionStatus>('checking')
  const [lastError, setLastError] = useState<string | null>(null)

  const checkConnection = useCallback(async () => {
    setStatus('checking')
    setLastError(null)

    try {
      const response = await fetch('/api/auth-check', {
        signal: AbortSignal.timeout(5000),
      })
      const data = (await response.json()) as AuthCheckResponse
      const connected =
        response.ok &&
        data.error !== 'server_timeout' &&
        (data.authenticated === true || data.authRequired === false)

      setStatus(connected ? 'connected' : 'disconnected')
      if (!connected) {
        setLastError(
          data.error === 'server_timeout'
            ? 'Hermes Agent không phản hồi kịp thời gian.'
            : 'Chưa kết nối được tới Hermes Agent.',
        )
      }
    } catch (error) {
      setStatus('disconnected')
      setLastError(
        error instanceof Error ? error.message : 'Kiểm tra kết nối thất bại.',
      )
    }
  }, [])

  useEffect(() => {
    void checkConnection()
  }, [checkConnection])

  useEffect(() => {
    setCanProceed(status === 'connected')
  }, [setCanProceed, status])

  return (
    <div className="flex w-full flex-col items-center text-center">
      <div
        className={cn(
          'mb-5 flex size-20 items-center justify-center rounded-2xl',
          status === 'connected'
            ? 'bg-emerald-100 text-emerald-600'
            : status === 'disconnected'
              ? 'bg-red-100 text-red-600'
              : 'bg-primary-100 text-primary-500',
        )}
      >
        <HugeiconsIcon
          icon={
            status === 'connected'
              ? CheckmarkCircle02Icon
              : status === 'disconnected'
                ? Cancel01Icon
                : RefreshIcon
          }
          className={cn('size-10', status === 'checking' && 'animate-spin')}
          strokeWidth={1.8}
        />
      </div>

      <h2 className="mb-3 text-2xl font-semibold text-primary-900">
        Kiểm tra kết nối
      </h2>

      <p className="mb-6 max-w-md text-base leading-relaxed text-primary-600">
        {status === 'connected'
          ? 'Backend đã kết nối và sẵn sàng cấu hình.'
          : status === 'checking'
            ? 'Đang kiểm tra backend tương thích OpenAI...'
            : 'Chưa có backend tương thích nào kết nối.'}
      </p>

      {status === 'disconnected' && (
        <div className="mb-6 w-full rounded-2xl border border-red-200 bg-red-50 p-4 text-left">
          <p className="mb-3 text-sm font-medium text-red-700">
            Hãy đảm bảo máy chủ HTTP API của Hermes Agent đang được bật:
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-red-700 mb-1">
                1. Bật API server trong <code>~/.hermes/.env</code>:
              </p>
              <code className="block overflow-x-auto rounded-lg bg-red-100 px-3 py-2 text-xs text-red-900">
                API_SERVER_ENABLED=true
              </code>
            </div>
            <div>
              <p className="text-xs font-medium text-red-700 mb-1">
                2. Khởi động lại gateway:
              </p>
              <code className="block overflow-x-auto rounded-lg bg-red-100 px-3 py-2 text-xs text-red-900">
                cd hermes-agent && hermes --gateway
              </code>
            </div>
          </div>
          <p className="mt-3 text-xs text-red-700">
            Hoặc trỏ <code>HERMES_API_URL</code> tới bất kỳ backend tương thích
            OpenAI (Ollama, LiteLLM, vLLM, v.v.).
          </p>
          {lastError && (
            <p className="mt-3 text-xs text-red-700">{lastError}</p>
          )}
        </div>
      )}

      <Button
        variant={status === 'connected' ? 'secondary' : 'default'}
        onClick={() => void checkConnection()}
        className="gap-2"
      >
        <HugeiconsIcon icon={RefreshIcon} className="size-4" />
        Kiểm tra kết nối
      </Button>
    </div>
  )
}

export function ModelConfigurationStep({
  setCanProceed,
}: OnboardingStepComponentProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [config, setConfig] = useState<ClaudeConfigResponse | null>(null)

  useEffect(() => {
    setCanProceed(true)
  }, [setCanProceed])

  useEffect(() => {
    let cancelled = false

    async function loadConfig() {
      try {
        const response = await fetch('/api/claude-config', {
          signal: AbortSignal.timeout(5000),
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = (await response.json()) as ClaudeConfigResponse
        if (!cancelled) {
          setConfig(data)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setStatus('error')
        }
      }
    }

    void loadConfig()

    return () => {
      cancelled = true
    }
  }, [])

  const provider = config?.activeProvider?.trim()
  const model = config?.activeModel?.trim()
  const hasModel = Boolean(provider && model)

  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
        <HugeiconsIcon
          icon={Settings01Icon}
          className="size-10"
          strokeWidth={1.8}
        />
      </div>

      <h2 className="mb-3 text-2xl font-semibold text-primary-900">
        Cấu hình mô hình
      </h2>

      <p className="mb-6 max-w-md text-base leading-relaxed text-primary-600">
        Chat lõi hoạt động với mọi backend tương thích OpenAI. Các API gateway
        của Hermes Agent cho phép chỉnh sửa nhà cung cấp và mô hình ngay từ
        workspace.
      </p>

      <div className="mb-6 w-full rounded-2xl border border-primary-200 bg-primary-100/70 p-4 text-left">
        {status === 'loading' && (
          <p className="text-sm text-primary-600">
            Đang tải thông tin nhà cung cấp và mô hình hiện tại...
          </p>
        )}

        {status === 'error' && (
          <div className="flex items-start gap-3 text-amber-700">
            <HugeiconsIcon
              icon={Alert02Icon}
              className="mt-0.5 size-5 shrink-0"
            />
            <p className="text-sm">
              Hiện chưa tải được cấu hình backend có thể chỉnh sửa. Anh/chị vẫn
              có thể tiếp tục nếu chat hoạt động và cập nhật cấu hình ở nơi
              backend đang quản lý.
            </p>
          </div>
        )}

        {status === 'ready' && hasModel && (
          <p className="text-sm font-medium text-primary-900">
            Mô hình hiện tại: <span className="text-accent-700">{model}</span>{' '}
            qua <span className="text-accent-700">{provider}</span>
          </p>
        )}

        {status === 'ready' && !hasModel && (
          <div className="flex items-start gap-3 text-amber-700">
            <HugeiconsIcon
              icon={Alert02Icon}
              className="mt-0.5 size-5 shrink-0"
            />
            <p className="text-sm">
              Chưa có mô hình nào được báo cáo. Nếu backend của anh/chị quản lý
              mô hình từ bên ngoài, hãy hoàn tất cấu hình ở đó và dùng phần thử
              chat để kiểm tra kết nối.
            </p>
          </div>
        )}
      </div>

      <Link
        to="/settings/providers"
        className={buttonVariants({ variant: 'outline', className: 'gap-2' })}
      >
        <HugeiconsIcon icon={Settings01Icon} className="size-4" />
        Mở cấu hình nhà cung cấp
      </Link>
    </div>
  )
}
