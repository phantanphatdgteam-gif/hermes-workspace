# i18n-vi Screenshots

Captured 2026-05-09 from local production build (vite build → server-entry.js, port 3000).

Browser: Playwright Chromium 145, viewport 1280×900, locale `vi-VN`, headless.

## Files

| File | Route | Notes |
|------|-------|-------|
| `01-startup-failure.png` | `/` (splash) | After 6.5s — failure panel expanded, full setup guide visible (claude-onboarding.tsx splash). |
| `02-login.png` | `/login` | Splash intercept (Hermes Agent gateway not running, so root surface state shows onboarding). |
| `03-onboarding.png` | `/onboarding` | Same splash. Onboarding wizard never reaches manual route. |
| `04-chat.png` | `/chat` | Same splash. Chat route protected by backend-connected gate. |
| `05-memory.png` | `/memory` | Same splash. |
| `06-settings.png` | `/settings` | Same splash. |

## Why all routes show the same splash

`src/routes/__root.tsx` mounts `ClaudeOnboarding` whenever `rootSurfaceState.showOnboarding` is true (i.e., backend not yet connected). Without a Hermes Agent gateway running on `:8642`, every route renders the splash first. The translated splash IS the most user-visible screen for first-time setup.

## Verifiable Vietnamese strings present

- `Chào mừng đến với Hermes Workspace` (h1)
- `Hoạt động với mọi backend tương thích OpenAI...`
- `Các API gateway của Hermes Agent tự mở khóa sessions, bộ nhớ, kỹ năng...`
- `Kết nối backend` (primary button)
- `Bỏ qua thiết lập` (skip link)

After connecting a Hermes Agent gateway, additional translated screens become visible:
- Login screen (`auth/login-screen.tsx`) — translated
- Memory browser (`screens/memory/memory-browser-screen.tsx`) — translated
- Onboarding tour (`components/onboarding/onboarding-tour.tsx` + `tour-steps.tsx`) — translated
- Agent chat panel (`components/agent-chat/*`) — translated
- Reconnect banner (`components/claude-reconnect-banner.tsx`) — translated
