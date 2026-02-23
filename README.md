# Dimitri's Premium Cannabis Dispensary

A full-stack web application for a premium cannabis dispensary, featuring product management, appointment booking, a blog, and live chat support.

## Features

- **Product Menu:** Browse and manage premium cannabis products.
- **Appointment Booking:** Schedule doctor consultations for medical cannabis.
- **Blog Management:** Stay informed with the latest news and guides.
- **Cart & Order History:** Easy checkout process and order tracking.
- **Live Chat Support:** Real-time assistance for customers with a dedicated agent dashboard for admins.
- **Admin Dashboard:** Centralized management for products, orders, appointments, users, and support chats.

## Tech Stack

### Frontend
- **React (Vite):** Modern UI framework with fast builds.
- **Tailwind CSS:** Utility-first CSS for styling.
- **tRPC (Client):** Type-safe communication with the backend.
- **Wouter:** Lightweight routing.
- **Radix UI / Shadcn UI:** Accessible and customizable UI components.
- **Lucide React:** Icon library.

### Backend
- **Node.js (Express):** Server-side environment.
- **tRPC (Server):** End-to-end type safety for API endpoints.
- **Drizzle ORM:** TypeScript-first ORM for database interactions.
- **MySQL:** Relational database for persistent storage.
- **Jose:** JWT-based authentication.

### Tools & DevOps
- **Vitest:** Unit and integration testing.
- **Playwright:** End-to-end verification.
- **TypeScript:** Ensuring code quality and maintainability.

## Getting Started

### Prerequisites
- Node.js (v24+)
- pnpm (v10+)
- MySQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dimitri_dispensary
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

4. Initialize the database:
   ```bash
   pnpm run db:push
   ```

### Development

Run the development server:
```bash
pnpm run dev
```
The application will be available at `http://localhost:3000`.

### Testing

Run unit tests:
```bash
pnpm test
```

## Security

- Admin routes (`/admin`, `/admin/chat`) are protected and require admin role.
- All chat communications are authenticated.

## License

This project is licensed under the MIT License.
