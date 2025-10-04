# Oddo-Oracles

# ExpenseFlow

## Overview

ExpenseFlow is a modern expense management application designed for organizations requiring structured approval workflows. The system enables employees to submit expense claims, which are then routed through configurable multi-level approval chains based on amount thresholds and an organizational hierarchy. The platform supports role-based dashboards for Admins, Managers, and Employees, OCR receipt scanning capabilities, and comprehensive expense tracking with real-time status updates.

## Features

  * **Role-Based Access Control**: Separate dashboards and functionalities for administrators, managers, and employees.
  * **Multi-Level Approval Workflows**: Configurable approval chains based on expense amounts and organizational structure.
  * **Expense Tracking**: Real-time status updates on expense claims.
  * **OCR Receipt Scanning**: Streamlined expense submission through automated receipt data extraction.
  * **Reporting and Analytics**: Insights into spending patterns and approval times.

## System Architecture

### Frontend

  * **Technology Stack**: React with TypeScript, Vite
  * **UI Framework**: Shadcn/ui, Radix UI, Tailwind CSS
  * **Routing**: Wouter
  * **State Management**: TanStack Query (React Query), React Context API

### Backend

  * **Runtime**: Node.js with Express.js
  * **Database**: Neon Database (serverless PostgreSQL) with Drizzle ORM, with support for MongoDB
  * **Authentication**: Session-based with bcryptjs for password hashing.

## Design

The design of ExpenseFlow is inspired by modern productivity applications like Linear, Notion, and Asana, with a focus on clarity, efficiency, and a professional aesthetic. It features a role-driven UI with distinct color-coding and layouts for each user type, a transparent and intuitive workflow design, and a comprehensive component library for a consistent user experience.

## Getting Started

### Prerequisites

  * Node.js
  * npm

### Installation

1.  Clone the repository:
    ```
    git clone https://github.com/your-username/expense-flow.git
    ```
2.  Install dependencies:
    ```
    cd expense-flow
    npm install
    ```

### Running the Application

  * **Development**:
    ```
    npm run dev
    ```
  * **Production**:
    ```
    npm run build
    npm start
    ```

## Scripts

  * `dev`: Starts the development server.
  * `build`: Builds the application for production.
  * `start`: Starts the production server.
  * `check`: Runs the TypeScript compiler to check for errors.
  * `db:push`: Pushes database schema changes.
