# ubiquitous-invention

> A configurable admin dashboard starter with reusable data grids, database-backed operations, and real-time updates.

## Table of Contents

- [General Information](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## General Information

ubiquitous-invention is an in-progress admin dashboard application designed around reusable, configuration-driven data management components.

The main goal is to provide a flexible foundation for building database-backed administrative interfaces without repeatedly implementing table layouts, editing forms, validation, and database operations for every resource.

Its data grid architecture separates field definitions and presentation logic from database operations, allowing different tables to reuse the same components with their own configurations.

The project also includes a dashboard overview with data visualizations, task management interface, notification system, and a chat-style messaging interface.

## Technologies Used

### Frontend

- Next.js 16
- React 19
- TypeScript
- Material UI
- MUI X Data Grid
- MUI X Charts
- MUI X Date Pickers
- React Hook Form
- React Markdown
- Mermaid
- React Syntax Highlighter

### Backend and Database

- PostgreSQL
- Drizzle ORM
- Better Auth
- Zod
- Drizzle-Zod
- Next Safe Action
- Server-Sent Events (SSE)

### Development and Deployment

- Node.js
- pnpm
- Docker
- Docker Compose
- Caddy
- Vitest
- Playwright

## Features

### Implemented

#### Authentication and Application Layout

- Email/password registration and authentication using Better Auth.
- Server-side session validation and protected application routes.
- Responsive Material UI dashboard layout with navigation and user information.
- Centralized application theme and reusable UI components.

#### Configurable Data Grid

- Reusable, strongly typed data grid architecture based on MUI X Data Grid.
- Configuration-driven column generation and row editing dialogs.
- Support for multiple field types:
    - Text and multiline text.
    - Markdown with preview.
    - Numeric fields with minimum and maximum constraints.
    - Date, time, and datetime fields.
    - Autocomplete with static or asynchronously loaded options.
    - UUID and hexadecimal values.
    - IPv4 and IPv6 addresses, optionally including ports.
    - Table-lookup fields with custom validation.
    - Boolean checkboxes, icon checkboxes, and switches.
    - Radio groups and custom-rendered fields.
- Field-level validation, required field groups, and custom validation functions.
- Interconnected fields with dependent values, conditional read-only behavior, and relational lookups.
- Configurable autocomplete options with mutually exclusive selections.
- Automatic row metadata displaying creation date, modification date, author, and last editor.
- Quick search, sorting, filtering, CSV export, and printing.

#### Database Operations

- Reusable server-side create, read, and update operations using Drizzle ORM.
- Runtime input and database schema validation using Zod and Drizzle-Zod.
- Protected database table allowlisting for generic data operations.
- Automatic author and last-editor attribution based on authenticated sessions.
- Automatic modification timestamps.
- Database cache invalidation after successful mutations.
- Support for primary-key-based updates, including composite primary keys.

#### Real-Time Updates and Notifications

- Server-Sent Events for broadcasting dashboard changes.
- Automatic data grid refresh when database records change.
- Persistent notification records stored in PostgreSQL.
- Notification types: default, success, error, warning, and informational.
- Unread notification count and read/unread state management.
- Snackbar notifications integrated with the application interface.

#### Dashboard and Data Visualization

- Dashboard overview with reusable statistic cards.
- Line, bar, and pie chart components using MUI X Charts.
- Task overview with a data grid.
- Task status filtering through URL query parameters.

#### Additional Components

- Chat-style messaging interface with a two-pane conversation layout.
- Markdown rendering with GitHub Flavored Markdown.
- LaTeX mathematical expressions.
- Mermaid diagrams.
- Syntax-highlighted code blocks with clipboard support.

### Planned

- Support for multiple independently configured database tables and dashboard resources.
- Configurable server-side pagination, sorting, and filtering.
- Generic record deletion and bulk operations.
- Role-based access control and resource-specific permissions.
- Customizable dashboard layouts and widgets.
- Database-backed task management with assignments, statuses, tags, and deadlines.
- Persistent conversations and actual message delivery.
- Real-time messaging using Server-Sent Events.
- Improved notification ownership and delivery across multiple application instances.
- Additional field types and reusable validation rules.
- Comprehensive automated unit and end-to-end testing.

## Screenshots

Screenshots will be added as the interface develops.

## Setup

### Prerequisites

- Node.js
- pnpm
- PostgreSQL (or Docker with Docker Compose)

### Installation

Install dependencies:

```bash
pnpm install
```

Create an environment configuration file:

```bash
cp env.example .env
```

Configure your PostgreSQL connection and authentication secret in `.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=appdb

DB_HOST=localhost
DB_PORT=5432

BETTER_AUTH_SECRET=your_secret
```

Start PostgreSQL using Docker Compose (optional):

```bash
docker compose up -d postgres
```

Apply the database schema:

```bash
pnpm push
```

Start the development server:

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

## Usage

1. Register an account or sign in.
2. Explore the dashboard overview and data visualizations.
3. Navigate to the task dashboard and filter tasks by status.
4. Open the configurable data grid.
5. Create or edit records using the dynamically generated form dialogs.
6. Configure fields, validation rules, and custom renderers through field definitions.
7. Search, filter, sort, export, and print table data.
8. Explore the notification system and messaging interface.

Additional development commands:

```bash
# Build the production application
pnpm build

# Start the production server
pnpm start

# Run unit tests
pnpm test --run

# Generate database migrations
pnpm generate

# Apply database migrations
pnpm migrate

# Synchronize the database schema
pnpm push

# Run static analysis
pnpm lint

# Format source files
pnpm format
```

## Project Status

Project is: _in progress_.

The authentication system, application layout, configurable data grid, database-backed record operations, and basic real-time notification infrastructure are implemented.

The dashboard visualizations, task management interface, and messaging interface are still being developed. Some of these currently use demonstration data rather than persistent application records.

## Room for Improvement

To do:

- Expand the generic data grid architecture to support multiple configurable database resources.
- Implement record deletion and bulk editing.
- Add server-side pagination and filtering for large datasets.
- Introduce role-based and resource-specific authorization.
- Replace demonstration task data with database-backed task management.
- Implement persistent messaging and real-time message delivery.
- Add configurable dashboard layouts and widgets.
- Improve notification delivery and multi-instance support.
- Add comprehensive unit and end-to-end tests.
- Improve deployment configuration and production documentation.

## Acknowledgements

- [Next.js](https://github.com/vercel/next.js)
- [React](https://github.com/facebook/react)
- [Material UI](https://github.com/mui/material-ui)
- [MUI X](https://github.com/mui/mui-x)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Better Auth](https://github.com/better-auth/better-auth)
- [Zod](https://github.com/colinhacks/zod)
- [React Hook Form](https://github.com/react-hook-form/react-hook-form)
- [Mermaid](https://github.com/mermaid-js/mermaid)

## License

This project is open source and available under the [GNU Affero General Public License v3.0](LICENSE).
