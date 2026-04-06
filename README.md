# Intimacy Fire Ministry — Email Subscription System

A backend API for managing email subscriptions with double opt-in, built with Node.js, TypeScript, Supabase, and Resend.

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend

## Getting Started

### 1. Clone the repo
git clone https://github.com/BenjaminTorto/email-subscription-system.git
cd email-subscription-system

### 2. Install dependencies
npm install

### 3. Create .env file
Ask Benjamin for the .env values and create a .env file in the root:
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_DOMAIN=
BASE_URL=http://localhost:3000

### 4. Run the server
npm run dev

### 5. Open in browser
http://localhost:3000/subscribe.html

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /subscribe | Subscribe with name + email |
| GET | /api/newsletter/verify?token= | Verify email (double opt-in) |
| GET | /api/newsletter/unsubscribe?token= | Unsubscribe |
| POST | /api/newsletter/unsubscribe-one-click?token= | One-click unsubscribe (RFC 8058) |

## Subscribe Request Body
{
  "full_name": "Kwame Mensah",
  "email": "kwame@example.com"
}
