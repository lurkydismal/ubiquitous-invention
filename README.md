# ubiquitous-invention

> An administrative dashboard for monitoring application activity, visualizing operational data, and communicating with users through technical support.

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

ubiquitous-invention is an in-progress administrative interface for the Vigilant Parakeet application.

The goal is to provide administrators and technical support staff with a centralized interface for monitoring application activity, analyzing operational statistics, managing data, and communicating directly with users.

The application is designed around several main areas:

- **Dashboard and Analytics** — Visualize application activity through statistics, charts, and configurable dashboard widgets.
- **Data Management** — Manage application data through reusable, configuration-driven data grids and editing forms.
- **Technical Support** — Communicate with application users through direct messages and manage support conversations.
- **Notifications** — Receive real-time administrative notifications and updates.

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
- Fallow
- Oxfmt

## Features

### Implemented

#### Authentication and Administration

- Email/password authentication using Better Auth.
- Server-side session validation and protected administrative routes.
- Responsive administrative interface with navigation and reusable Material UI components.

#### Dashboard and Analytics

- Dashboard layout with reusable statistic cards.
- Line charts, bar charts, and pie charts using MUI X Charts.
- Task overview with a data grid.
- Sample metrics and datasets for prototyping dashboard visualizations.

#### Data Management

- Reusable, strongly typed, configuration-driven data grid architecture.
- Dynamically generated columns and row-editing dialogs.
- Configurable form fields supporting:
    - Text and multiline text.
    - Markdown with preview.
    - Numeric values with range constraints.
    - Date, time, and datetime.
    - Autocomplete with configurable options.
    - UUID and hexadecimal values.
    - IPv4 and IPv6 addresses, optionally including ports.
    - Table lookups with custom validation.
    - Boolean checkboxes, icon checkboxes, and switches.
    - Radio groups and custom-rendered fields.
- Field-level validation and configurable required fields.
- Interconnected fields with dependent values and conditional read-only behavior.
- Automatic author and last-editor attribution.
- Quick search, sorting, filtering, CSV export, and printing.

#### Database and Real-Time Infrastructure

- Reusable server-side create, read, and update operations using Drizzle ORM.
- PostgreSQL integration with runtime validation using Zod.
- Authenticated database operations and protected table allowlisting.
- Automatic creation and modification metadata.
- Database cache invalidation after successful mutations.
- Server-Sent Events for broadcasting database changes.
- Persistent administrative notifications with unread tracking and read-state management.
- Real-time notification delivery to connected clients.

#### Technical Support Interface

- Two-pane messaging interface with a conversation list and message history.
- User avatars and online-status indicators.
- Conversation selection and message presentation.
- Responsive layout for desktop and mobile devices.
- Sample users and conversations for UI prototyping.

### Planned

#### Dashboard and Analytics

- Integration with live Vigilant Parakeet application statistics.
- Real-time monitoring of application activity and user sessions.
- User statistics, registration trends, and activity history.
- Configurable dashboards with additional charts and widgets.
- Historical data analysis and customizable time ranges.

#### Data Management

- Integration with actual Vigilant Parakeet database entities.
- Dedicated administrative views for application-specific resources.
- Record deletion and bulk operations.
- Server-side pagination, sorting, and filtering.
- Role-based access control and resource-specific permissions.

#### Technical Support

- Integration with Vigilant Parakeet user accounts.
- Direct communication between users and technical support staff.
- Persistent conversations and message history.
- Message sending and receiving through the application's backend.
- Unread message tracking and conversation status management.
- Real-time message delivery and notifications.
- Conversation search and management.

#### Infrastructure

- Improved authorization and administrative permissions.
- Comprehensive automated unit and end-to-end tests.
- Production deployment configuration.
- Improved error handling and operational logging.

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
just packages-install
```

Create an environment configuration file:

```bash
cp env.example .env
```

Configure PostgreSQL and authentication settings in `.env`:

```env
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=appdb

DB_HOST=localhost
DB_PORT=5432

BETTER_AUTH_SECRET=your_secret
```

Start PostgreSQL using Docker Compose:

```bash
just docker-up
```

Apply the database schema:

```bash
pnpm push
```

Start the development server:

```bash
just
```

The application will be available at:

```text
http://localhost:3000
```

## Usage

1. Register an administrative account or sign in.
2. Explore the dashboard overview and available visualizations.
3. Navigate through administrative data tables.
4. Create and edit records using dynamically generated forms.
5. Search, filter, sort, and export table data.
6. Explore the technical support messaging interface.
7. Monitor administrative notifications.

Additional development commands:

```bash
# Build the production application
just build-release

# Start the production server
just run-release

# Run unit tests
just run-unit-tests

# Generate database migrations
just generate-migration

# Apply database migrations
just migrate

# Synchronize database schema
pnpm push

# Run fallow static analysis
just lint

# Run tsc static analysis
just hard-lint

# Format source files
just format
```

## Project Status

Project is: _in progress_.

The administrative application foundation is implemented, including authentication, dashboard visualization components, reusable data grids, PostgreSQL operations, and notification infrastructure.

The dashboard currently uses demonstration datasets, and the messaging interface uses sample conversations. Integration with the actual Vigilant Parakeet application, its user database, operational metrics, and technical support messaging system is still under development.

## Room for Improvement

To do:

- Connect dashboard visualizations to live application data.
- Implement dedicated application monitoring dashboards.
- Integrate actual Vigilant Parakeet database entities.
- Implement direct messaging between users and technical support.
- Add persistent message storage and real-time message delivery.
- Introduce conversation management and unread message tracking.
- Expand administrative permissions and access control.
- Add record deletion and bulk database operations.
- Implement server-side pagination and filtering.
- Add comprehensive automated tests.
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
