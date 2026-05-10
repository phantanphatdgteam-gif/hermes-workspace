import { createFileRoute } from '@tanstack/react-router'
import { PromptsScreen } from '@/screens/prompts/prompts-screen'

export const Route = createFileRoute('/prompts')({
  ssr: false,
  component: PromptsRoute,
})

function PromptsRoute() {
  return <PromptsScreen />
}
