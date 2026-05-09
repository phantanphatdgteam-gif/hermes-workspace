import type { Step } from 'react-joyride'

export const tourSteps: Array<Step> = [
  // Step 1: Welcome
  {
    target: 'body',
    placement: 'center',
    title: 'Chào mừng đến với Hermes Workspace! ⚕',
    content: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <img
          src="/claude-avatar.webp"
          alt="Hermes Agent"
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
        <p style={{ textAlign: 'center', margin: 0 }}>
          Trung tâm điều khiển AI của anh/chị: quản lý tác nhân, trò chuyện,
          tập tin và nhiều hơn nữa. Cùng đi tham quan nhanh nhé!
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  // Step 2: Sidebar
  {
    target: '[data-tour="sidebar-container"]',
    placement: 'right',
    title: 'Thanh điều hướng',
    content:
      'Chuyển qua lại giữa các công cụ tại đây. Thu gọn hoặc mở rộng các nhóm để tùy chỉnh không gian làm việc.',
  },
  // Step 3: New Session
  {
    target: '[data-tour="new-session"]',
    placement: 'right',
    title: 'Bắt đầu phiên chat mới',
    content:
      'Bấm vào đây để mở phiên trò chuyện AI mới. Mỗi cuộc trò chuyện được lưu tự động.',
  },
  // Step 4: Dashboard
  {
    target: '[data-tour="dashboard"]',
    placement: 'right',
    title: 'Bảng điều khiển',
    content:
      'Tổng quan về phiên, mức sử dụng và hoạt động — mọi thứ trong một màn hình.',
  },
  // Step 5: Agent Hub
  {
    target: '[data-tour="agent-hub"]',
    placement: 'right',
    title: 'Trung tâm tác nhân',
    content:
      'Quản lý tác nhân AI và cấu hình. Tạo tác nhân tùy chỉnh với hành vi chuyên biệt.',
  },
  // Step 7: Skills
  {
    target: '[data-tour="skills"]',
    placement: 'right',
    title: 'Thư viện kỹ năng',
    content:
      'Duyệt và cài đặt kỹ năng để mở rộng khả năng tác nhân — thêm công cụ và chức năng mới.',
  },
  // Step 8: Terminal
  {
    target: '[data-tour="terminal"]',
    placement: 'right',
    title: 'Terminal tích hợp',
    content:
      'Terminal sẵn có để chạy lệnh nhanh, không cần rời khỏi Hermes Workspace.',
  },
  // Step 9: Usage Meter (in header)
  {
    target: '[data-tour="usage-meter"]',
    placement: 'bottom',
    title: 'Theo dõi mức sử dụng',
    content:
      'Theo dõi mức sử dụng nhà cung cấp AI theo thời gian thực — chi phí và mức tiêu thụ API.',
  },
  // Step 10: Settings
  {
    target: '[data-tour="settings"]',
    placement: 'right',
    title: 'Cấu hình & Tùy chỉnh',
    content:
      'Cấu hình nhà cung cấp, chủ đề, màu nhấn và nhiều hơn nữa — biến Hermes Workspace thành của riêng anh/chị.',
  },
  // Step 11: Finish
  {
    target: 'body',
    placement: 'center',
    title: "Mọi thứ đã sẵn sàng! 🎉",
    content:
      'Bắt đầu trò chuyện với AI, khám phá các công cụ và tùy chỉnh Hermes Workspace theo phong cách làm việc của anh/chị. Cần trợ giúp? Bấm ? để xem các phím tắt.',
  },
]
