# i18n-vi — Vietnamese Translation Audit

**Branch:** `i18n-vi`
**Approach:** Direct in-place patches (no react-i18next library — only 2 users, no language switcher needed)
**Style:** Văn phong thân thiện, dùng "anh/chị" khi nói trực tiếp với user.
**Brand keywords (KHÔNG dịch):** Hermes, Hermes Workspace, Hermes Agent, Anthropic, Claude, OpenRouter, OpenAI, GPT, Gemini, Ollama, MCP, OAuth, API, Docker, container, gateway.

## Coverage scope

**INCLUDED (user-facing):**
- `src/components/auth/login-screen.tsx` — login form
- `src/components/agent-chat/*.tsx` — chat panel header/input/messages/modal
- `src/components/memory-viewer/*.tsx` — memory editor / file list / preview / search
- `src/components/onboarding/onboarding-steps.ts` — wizard step text
- `src/components/onboarding/onboarding-wizard.tsx` — wizard nav buttons + aria
- `src/components/onboarding/setup-step-content.tsx` — connection check + model config

**SKIPPED (dev-facing, intentionally NOT translated):**
- `src/components/terminal/`, `src/components/inspector/`, `src/components/agent-swarm/`, `src/components/swarm/`, `src/server/`, all `*.test.*` files.
- `claude-onboarding.tsx` (1145 lines, deeper provider setup) — postpone to v1.1 of fork.

---

## File-by-file mapping (English → Vietnamese)

### 1. `src/components/auth/login-screen.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 27 | `'Invalid password'` | `'Mật khẩu không đúng'` |
| 31 | `'Authentication failed. Please try again.'` | `'Xác thực thất bại. Vui lòng thử lại.'` |
| 71 | `Enter Password` | `Nhập mật khẩu` |
| 74 | `This workspace is password-protected` | `Workspace này được bảo vệ bằng mật khẩu` |
| 84 | `placeholder="Password"` | `placeholder="Mật khẩu"` |
| 102 | `Authenticating...` | `Đang xác thực...` |
| 102 | `Continue` | `Tiếp tục` |
| 109 | `Powered by ` | `Phát triển bởi ` |

KHÔNG dịch: line 64 `Hermes Workspace` (brand), line 116 `Hermes Agent` (brand).

### 2. `src/components/agent-chat/AgentChatHeader.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 50 | `Demo Mode` | `Chế độ thử nghiệm` |
| 60 | `aria-label="Close agent chat"` | `aria-label="Đóng chat tác nhân"` |

KHÔNG dịch: `statusLabel` prop values (`failed`, `queued`, `complete`, `thinking`) — bị `getStatusClassName` so sánh lowercase ở line 13–24, là logic key, không phải hiển thị thuần.

### 3. `src/components/agent-chat/AgentChatInput.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 53 | `placeholder="Message this agent..."` | `placeholder="Nhắn cho tác nhân..."` |
| 70 | `aria-label="Send message"` | `aria-label="Gửi tin nhắn"` |
| 76 | `Enter to send · Shift+Enter for a new line` | `Enter để gửi · Shift+Enter để xuống dòng` |

### 4. `src/components/agent-chat/AgentChatMessages.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 49 | `Start the conversation with this agent.` | `Bắt đầu trò chuyện với tác nhân này.` |
| 103 | `sending…` | `đang gửi…` |
| 104 | `failed` | `lỗi` |
| 122 | `Agent is typing…` | `Tác nhân đang soạn tin…` |

### 5. `src/components/agent-chat/AgentChatModal.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 70 | `(demo): Received "${text}". Hermes Agent is unavailable, so this is a simulated response.` | `(thử nghiệm): Đã nhận "${text}". Hermes Agent không khả dụng, đây là phản hồi mô phỏng.` |
| 138 | `'Unable to load chat history'` | `'Không tải được lịch sử chat'` |
| 146 | `'Hermes Agent is unavailable. Running in demo mode with simulated responses.'` | `'Hermes Agent không khả dụng. Đang chạy chế độ thử nghiệm với phản hồi mô phỏng.'` |
| 284 | `'Unable to send message'` | `'Không gửi được tin nhắn'` |

### 6. `src/components/memory-viewer/MemoryEditor.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 30 | `'Auto-saving...'` | `'Đang tự động lưu...'` |
| 31 | `'Unsaved changes'` | `'Thay đổi chưa lưu'` |
| 32 | `'Save failed'` | `'Lưu thất bại'` |
| 33 | `'Saved'` | `'Đã lưu'` |
| 39 | `Saved at ${formatted}` | `Đã lưu lúc ${formatted}` |
| 65 | `'No file selected'` | `'Chưa chọn tập tin nào'` |
| 74 | `Read-only` | `Chỉ đọc` |
| 90 | `Save` | `Lưu` |
| 97 | `Loading file content...` | `Đang tải nội dung tập tin...` |

### 7. `src/components/memory-viewer/MemoryFileList.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 79 | `Memory Files` | `Tập tin bộ nhớ` |
| 87 | `aria-label="Refresh memory files"` | `aria-label="Tải lại danh sách bộ nhớ"` |
| 95 | `aria-label="Collapse memory file list"` | `aria-label="Thu gọn danh sách bộ nhớ"` |
| 108-110 | `'Demo mode enabled because memory API data is unavailable.'` / `'Browse MEMORY.md and daily notes in memory/ or memories/.'` | `'Đã bật chế độ thử nghiệm vì dữ liệu bộ nhớ không khả dụng.'` / `'Duyệt MEMORY.md và ghi chú hàng ngày trong memory/ hoặc memories/.'` |
| 118 | `Loading memory files...` | `Đang tải tập tin bộ nhớ...` |
| 147 | `No daily memory files found.` | `Không tìm thấy tập tin bộ nhớ nào.` |

KHÔNG dịch: line 143 `memory/ or memories/` (đường dẫn thư mục), line 214 `MEMORY.md` (tên file).

### 8. `src/components/memory-viewer/MemoryPreview.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 25 | `Preview` | `Xem trước` |
| 28 | `'Select a memory file to preview markdown.'` | `'Chọn một tập tin bộ nhớ để xem trước markdown.'` |
| 34 | `'_No content_'` | `'_Không có nội dung_'` (giữ markdown italic syntax) |

### 9. `src/components/memory-viewer/MemorySearch.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 35 | `placeholder="Search across MEMORY.md and memory/*.md"` | `placeholder="Tìm trong MEMORY.md và memory/*.md"` |
| 43 | `Searching memory files...` | `Đang tìm trong tập tin bộ nhớ...` |
| 47 | `No matches found.` | `Không tìm thấy kết quả nào.` |

### 10. `src/components/onboarding/onboarding-steps.ts`

| Line | English | Vietnamese |
|------|---------|------------|
| 35 | `'Welcome to Hermes Workspace'` | `'Chào mừng đến với Hermes Workspace'` |
| 36 | `'Your AI workspace powered by Hermes Agent'` | `'Không gian làm việc AI của anh/chị, vận hành bởi Hermes Agent'` |
| 39 | `'Get Started'` | `'Bắt đầu'` |
| 43 | `'Connection Check'` | `'Kiểm tra kết nối'` |
| 44 | `'Verify that Hermes Agent is running before you begin.'` | `'Xác nhận Hermes Agent đang chạy trước khi anh/chị bắt đầu.'` |
| 52 | `'Model Configuration'` | `'Cấu hình mô hình'` |
| 53 | `'Review your current provider and model setup.'` | `'Kiểm tra nhà cung cấp và mô hình hiện tại.'` |
| 60 | `'You are all set!'` | `'Mọi thứ đã sẵn sàng!'` |
| 61-62 | `'Start chatting with your agent. Try asking it to help with code, research, or anything else.'` | `'Hãy bắt đầu trò chuyện với tác nhân. Thử nhờ tác nhân hỗ trợ về code, nghiên cứu, hoặc bất kỳ điều gì khác.'` |
| 65 | `'Start Chatting'` | `'Bắt đầu trò chuyện'` |

### 11. `src/components/onboarding/onboarding-wizard.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 111 | `aria-label="Skip onboarding"` | `aria-label="Bỏ qua hướng dẫn"` |
| 193 | `` `Go to step ${index + 1}` `` | `` `Đến bước ${index + 1}` `` |
| 207 | `Back` | `Quay lại` |
| 220 | `'Get Started'` (fallback) | `'Bắt đầu'` |
| 230 | `'Next'` (fallback) | `'Tiếp theo'` |

KHÔNG dịch: `alt="Hermes Agent"` (brand) line 150.

### 12. `src/components/onboarding/setup-step-content.tsx`

| Line | English | Vietnamese |
|------|---------|------------|
| 54 | `'Hermes Agent did not respond in time.'` | `'Hermes Agent không phản hồi kịp thời gian.'` |
| 55 | `'Hermes Agent is not reachable yet.'` | `'Chưa kết nối được tới Hermes Agent.'` |
| 61 | `'Connection check failed.'` | `'Kiểm tra kết nối thất bại.'` |
| 100 | `Connection Check` | `Kiểm tra kết nối` |
| 105 | `'Your backend is reachable and ready for setup.'` | `'Backend đã kết nối và sẵn sàng cấu hình.'` |
| 107 | `'Checking whether an OpenAI-compatible backend is available...'` | `'Đang kiểm tra backend tương thích OpenAI...'` |
| 108 | `'No compatible backend is connected yet.'` | `'Chưa có backend tương thích nào kết nối.'` |
| 113-114 | `'Make sure the Hermes Agent HTTP API server is enabled:'` | `'Hãy đảm bảo máy chủ HTTP API của Hermes Agent đang được bật:'` |
| 119 | `1. Enable the API server in <code>~/.hermes/.env</code>:` | `1. Bật API server trong <code>~/.hermes/.env</code>:` |
| 127 | `2. Restart the gateway:` | `2. Khởi động lại gateway:` |
| 134-137 | `Or point <code>HERMES_API_URL</code> at any OpenAI-compatible backend (Ollama, LiteLLM, vLLM, etc.).` | `Hoặc trỏ <code>HERMES_API_URL</code> tới bất kỳ backend tương thích OpenAI (Ollama, LiteLLM, vLLM, v.v.).` |
| 150 | `Check Connection` | `Kiểm tra kết nối` |
| 212 | `Model Configuration` | `Cấu hình mô hình` |
| 215-217 | `Core chat works with any OpenAI-compatible backend. Hermes Agent gateway APIs make provider and model setup editable from the workspace.` | `Chat lõi hoạt động với mọi backend tương thích OpenAI. Các API gateway của Hermes Agent cho phép chỉnh sửa nhà cung cấp và mô hình ngay từ workspace.` |
| 222-224 | `Loading current provider and model information...` | `Đang tải thông tin nhà cung cấp và mô hình hiện tại...` |
| 233-237 | `Could not load editable backend configuration right now. You can still continue if chat works and update settings where your backend manages them.` | `Hiện chưa tải được cấu hình backend có thể chỉnh sửa. Anh/chị vẫn có thể tiếp tục nếu chat hoạt động và cập nhật cấu hình ở nơi backend đang quản lý.` |
| 242-244 | `Current model: ... via ...` | `Mô hình hiện tại: ... qua ...` |
| 254-258 | `No model is reported yet. If your backend manages models externally, finish setup there and use the chat test to verify the connection.` | `Chưa có mô hình nào được báo cáo. Nếu backend của anh/chị quản lý mô hình từ bên ngoài, hãy hoàn tất cấu hình ở đó và dùng phần thử chat để kiểm tra kết nối.` |
| 268 | `Open Provider Settings` | `Mở cấu hình nhà cung cấp` |

---

## Summary

- **12 files** total touched (auth: 1, agent-chat: 4, memory-viewer: 4, onboarding: 3)
- **~95 strings** translated (counts include status enums, aria-labels, helper text, error messages)
- **0 logic changes** — all edits are string-only inside JSX text, JSX attributes, or returned string literals from helper functions where the value is purely for display.
- **No new dependencies** added.
