# Expense Management System

## Overview

ExpenseFlow is a modern expense management application designed for organizations requiring structured approval workflows. The system enables employees to submit expense claims, which are then routed through configurable multi-level approval chains based on amount thresholds and organizational hierarchy. The platform supports role-based dashboards (Admin, Manager, Employee), OCR receipt scanning capabilities, and comprehensive expense tracking with real-time status updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with TypeScript, utilizing Vite as the build tool and development server.

**UI Framework**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling. The design system follows a "Modern Productivity Application" approach inspired by Linear, Notion, and Asana, prioritizing clarity and efficiency over decorative elements.

**Routing**: Wouter for client-side routing with protected route implementation based on authentication status and user roles.

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- React Context API for authentication state and theme management
- Local component state for UI interactions

**Design System**:
- Custom theme provider supporting light/dark modes
- Role-based color coding (Admin: purple, Manager: cyan, Employee: blue)
- Consistent border radius, shadow, and spacing tokens
- Typography using Inter for UI and JetBrains Mono for numerical data

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**Database Strategy**: The application uses an abstraction layer (`IStorage` interface) that currently implements in-memory storage but is designed to support MongoDB. The schema is defined using Zod validators for type safety and runtime validation.

**Session Management**: Express sessions with support for PostgreSQL session storage (connect-pg-simple) - though the primary database strategy appears to be MongoDB-based.

**Authentication**:
- Session-based authentication with HTTP-only cookies
- Password hashing using bcryptjs
- Role-based access control middleware (admin, manager, employee)
- Protected API endpoints with authentication and authorization checks

**API Design**: RESTful API structure with role-specific endpoints:
- `/api/auth/*` - Authentication endpoints
- `/api/expenses/*` - Expense CRUD and approval operations
- `/api/expenses/pending` - Manager-specific pending approvals
- `/api/expenses/my` - Employee-specific expense history

### Database Schema

**Core Entities**:

1. **Company**: Multi-tenant support with country and currency settings
2. **User**: Role-based users (admin/manager/employee) with hierarchical relationships (managerId reference)
3. **Expense**: Expense claims with status tracking, amount, category, receipt URLs, and approval chain position
4. **ApprovalRule**: Configurable rules based on amount thresholds, percentages, or specific approvers
5. **ApprovalStep**: Individual approval steps within an expense's approval chain, tracking approver actions and comments

**Approval Workflow Logic**:
- Expenses trigger approval rules based on amount thresholds
- Multi-step approval chains with current approver index tracking
- Status progression: pending → in-review → approved/rejected
- Each step maintains audit trail with timestamps and comments

### External Dependencies

**Database**: 
- Neon Database (serverless PostgreSQL) configured via Drizzle ORM
- MongoDB support indicated in storage layer implementation
- Note: The application is architected to work with either database through the storage abstraction layer

**UI Component Libraries**:
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for iconography

**Development Tools**:
- Drizzle Kit for database migrations
- ESBuild for server bundling
- Vite plugins for development enhancements (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer)

**Third-Party Services** (Referenced but not fully implemented):
- OCR receipt scanning capability (planned feature based on design docs)
- Email notifications (implied by approval workflow requirements)

**Key Architectural Decisions**:

1. **Storage Abstraction**: Implemented `IStorage` interface allows switching between in-memory and MongoDB implementations without changing business logic
2. **Role-Based UI**: Separate dashboard components for each role (AdminDashboard, ManagerDashboard, EmployeeDashboard) ensuring appropriate data visibility
3. **Type Safety**: Shared schema definitions between client and server using Zod, ensuring consistent validation
4. **Approval Chain Design**: Current approver index system allows sequential approval processing with audit trail preservation
5. **Theme System**: CSS custom properties with dual light/dark mode support, role-specific accent colors for visual hierarchy