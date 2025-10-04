# Expense Management System - Design Guidelines

## Design Approach

**Selected Approach**: Modern Productivity Application Design
**Inspiration**: Linear (clean workflows), Notion (role-based views), Asana (task management patterns)
**Rationale**: This utility-focused application requires efficiency, clarity, and professional polish over decorative elements. The multi-level approval workflows and role-based dashboards demand intuitive information architecture.

## Core Design Principles

1. **Role-Driven Clarity**: Each role (Admin, Manager, Employee) gets visually distinct dashboard layouts
2. **Workflow Transparency**: Approval processes should be immediately understandable through visual hierarchy
3. **Efficient Data Entry**: Forms prioritize speed and accuracy with smart defaults and OCR integration
4. **Professional Trust**: Enterprise-grade aesthetic that builds confidence in financial management

## Color Palette

### Light Mode
- **Primary Brand**: 240 70% 50% (Deep blue - authority, trust)
- **Primary Hover**: 240 70% 45%
- **Secondary/Accent**: 142 70% 45% (Success green for approvals)
- **Destructive**: 0 70% 50% (Red for rejections)
- **Background**: 0 0% 98% (Warm white)
- **Card Background**: 0 0% 100%
- **Border**: 240 10% 90%
- **Text Primary**: 240 15% 15%
- **Text Secondary**: 240 10% 50%

### Dark Mode
- **Primary Brand**: 240 60% 60%
- **Primary Hover**: 240 60% 65%
- **Secondary/Accent**: 142 60% 55%
- **Destructive**: 0 60% 60%
- **Background**: 240 15% 8%
- **Card Background**: 240 15% 12%
- **Border**: 240 10% 20%
- **Text Primary**: 0 0% 95%
- **Text Secondary**: 240 5% 70%

### Role Color Coding (Subtle accents)
- **Admin**: 280 60% 55% (Purple - system control)
- **Manager**: 200 60% 50% (Cyan - approval authority)
- **Employee**: 240 60% 55% (Blue - standard user)

## Typography

**Font Stack**: 
- Primary: 'Inter', system-ui, sans-serif (clean, highly legible)
- Monospace: 'JetBrains Mono', monospace (for currency amounts, IDs)

**Type Scale**:
- Display/Hero: text-4xl font-bold (36px) - Dashboard headers
- H1: text-3xl font-semibold (30px) - Page titles
- H2: text-2xl font-semibold (24px) - Section headers
- H3: text-xl font-medium (20px) - Card headers
- Body: text-base (16px) - Main content
- Small: text-sm (14px) - Helper text, labels
- Tiny: text-xs (12px) - Metadata, timestamps

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Card padding: p-6
- Section spacing: space-y-8
- Form field gaps: gap-4
- Button padding: px-6 py-2.5
- Dashboard margins: max-w-7xl mx-auto px-6

**Grid Structures**:
- 3-column stat cards (lg:grid-cols-3)
- 2-column form layouts (lg:grid-cols-2)
- Single column mobile (grid-cols-1)
- Expense table: Full width with horizontal scroll on mobile

## Component Library

### Navigation
- **Top Bar**: Fixed header with role badge, company currency indicator, user menu
- **Sidebar**: Collapsible nav with icon+label, role-specific menu items
- **Breadcrumbs**: Show workflow position in approval chains

### Dashboard Cards
- **Stat Cards**: Large number + trend indicator + subtle background gradient
- **Pending Expenses**: Table with expandable rows for details
- **Activity Feed**: Timeline view with avatars and status icons
- **Quick Actions**: Prominent CTAs based on role (Submit Expense, Review Pending, Add Employee)

### Forms & Inputs
- **Expense Form**: Multi-step wizard (Details → Receipt → Review)
- **OCR Drop Zone**: Prominent drag-and-drop area with instant preview
- **Currency Input**: Prefix with currency symbol, real-time conversion display below
- **Date Picker**: Calendar overlay with range selection
- **Category Selector**: Icon + label dropdown with custom categories

### Approval Workflow
- **Stepper Component**: Horizontal progress indicator showing approval chain
- **Approver Cards**: Avatar + name + role + status badge
- **Action Buttons**: Approve (green), Reject (red), with comment modal
- **Conditional Rules Display**: Visual flowchart showing percentage/hybrid rules

### Tables & Data Display
- **Expense Table**: Sortable columns, status badges, inline actions
- **Filters**: Sticky filter bar with date range, category, status, amount range
- **Export Options**: CSV/PDF download buttons
- **Pagination**: Show 20 items per page with page jump

### Status Indicators
- **Badges**: Rounded pills with role/status colors
  - Pending: 45 80% 60% (Orange)
  - Approved: 142 70% 45% (Green)
  - Rejected: 0 70% 50% (Red)
  - In Review: 240 60% 55% (Blue)

### Modals & Overlays
- **Approval Modal**: Large modal with expense details + comment textarea + action buttons
- **Receipt Viewer**: Full-screen overlay with zoom controls
- **Rule Builder**: Multi-step modal for creating conditional approval rules
- **Confirmation Dialogs**: Center-aligned with clear primary/secondary actions

## Animations & Interactions

**Minimal & Purposeful**:
- Sidebar collapse: 200ms ease transition
- Card hover: Subtle lift with shadow (translate-y-1 + shadow-lg)
- Status badge changes: Color transition 150ms
- Loading states: Skeleton screens, not spinners
- Form validation: Shake animation on error (animate-shake)
- No page transitions or decorative animations

## Images & Visual Assets

**Icons**: Heroicons (outline style for navigation, solid for buttons)
**Illustrations**: 
- Empty states: Simple, flat illustrations for "No expenses yet", "No pending approvals"
- OCR placeholder: Camera/document icon in drop zone
- Avoid hero images - this is a utility application focused on data and workflows

**Receipt Handling**:
- Thumbnail previews in expense cards (80x80px)
- Full-size modal view with zoom/pan controls
- OCR confidence indicator overlay on scanned receipts

## Responsive Behavior

**Breakpoints**:
- Mobile (<768px): Single column, bottom nav, collapsed sidebar
- Tablet (768-1024px): 2-column layouts, permanent sidebar
- Desktop (>1024px): Full 3-column grids, expanded sidebar

**Mobile Optimizations**:
- Stack form fields vertically
- Convert tables to card views
- Sticky action buttons at bottom
- Swipe gestures for approve/reject (with confirmation)

## Accessibility & Dark Mode

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- All form inputs have visible labels in both modes
- Dark mode toggle in user menu (persistent across sessions)
- Focus states: 2px ring with primary color
- Keyboard navigation: Tab order follows visual hierarchy
- Screen reader labels for icon-only buttons

## File Structure Preview

```
/src
  /components
    /layout (Sidebar, TopBar, DashboardLayout)
    /expense (ExpenseForm, ExpenseCard, ExpenseTable)
    /approval (ApprovalStepper, ApprovalModal, RuleBuilder)
    /common (Button, Input, Badge, Card, Modal)
  /pages
    /dashboard (AdminDashboard, ManagerDashboard, EmployeeDashboard)
    /expenses (ExpenseList, ExpenseDetail, NewExpense)
    /approval (PendingApprovals, ApprovalHistory)
    /settings (UserManagement, ApprovalRules, CompanySettings)
  /lib
    /api (axios setup, endpoints)
    /utils (currency conversion, OCR processing)
    /hooks (useAuth, useExpenses, useApprovals)
```

This design prioritizes **professional efficiency** over decorative elements, ensuring users can complete financial tasks quickly and accurately. The role-based color coding and clear workflow visualization create an intuitive experience for all user types.