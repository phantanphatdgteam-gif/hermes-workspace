import {
  CheckmarkCircle02Icon,
  Home01Icon,
  Plug01Icon,
  Settings01Icon,
} from '@hugeicons/core-free-icons'
import {
  ConnectionCheckStep,
  ModelConfigurationStep,
} from './setup-step-content'
import type { HugeiconsIcon } from '@hugeicons/react'
import type * as React from 'react'

type IconType = React.ComponentProps<typeof HugeiconsIcon>['icon']

export type OnboardingStepComponentProps = {
  setCanProceed: (canProceed: boolean) => void
}

export type OnboardingStep = {
  id: string
  title: string
  description: string
  icon: IconType
  iconBg: string
  component?: React.ComponentType<OnboardingStepComponentProps>
  nextLabel?: string
  completeLabel?: string
  canProceedByDefault?: boolean
}

export const ONBOARDING_STEPS: Array<OnboardingStep> = [
  {
    id: 'welcome',
    title: 'Chào mừng đến với Hermes Workspace',
    description: 'Không gian làm việc AI của anh/chị, vận hành bởi Hermes Agent',
    icon: Home01Icon,
    iconBg: 'bg-orange-500',
    nextLabel: 'Bắt đầu',
  },
  {
    id: 'connection-check',
    title: 'Kiểm tra kết nối',
    description: 'Xác nhận Hermes Agent đang chạy trước khi anh/chị bắt đầu.',
    icon: Plug01Icon,
    iconBg: 'bg-emerald-500',
    component: ConnectionCheckStep,
    canProceedByDefault: false,
  },
  {
    id: 'model-configuration',
    title: 'Cấu hình mô hình',
    description: 'Kiểm tra nhà cung cấp và mô hình hiện tại.',
    icon: Settings01Icon,
    iconBg: 'bg-cyan-500',
    component: ModelConfigurationStep,
  },
  {
    id: 'ready',
    title: 'Mọi thứ đã sẵn sàng!',
    description:
      'Hãy bắt đầu trò chuyện với tác nhân. Thử nhờ tác nhân hỗ trợ về code, nghiên cứu, hoặc bất kỳ điều gì khác.',
    icon: CheckmarkCircle02Icon,
    iconBg: 'bg-emerald-500',
    completeLabel: 'Bắt đầu trò chuyện',
  },
]

export const STORAGE_KEY = 'claude-onboarding-complete'
