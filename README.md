# Esahayak Assig – Real Estate Lead Management

## Overview
This is a **Next.js full-stack application** for managing real estate leads.  
It provides CRUD operations for buyers, history tracking, CSV import/export, and ownership enforcement.  

- **Backend:** Next.js API routes + Prisma + PostgreSQL  
- **Frontend:**  Next.js  

---

## Setup

### Clone the repository
```bash
git clone https://github.com/Jeetjyoti-Deka/eSahayak_assig.git
cd eSahayak_assig
```

### Environment
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buyer_leads"
JWT_SECRET="secret"
JWT_EXPIRES_IN="7D"
COOKIE_NAME="session"
COOKIE_MAX_AGE=604800
```

### Dependency
```bash
pnpm install
```

### Database
```bash
# run db container
docker compose up -d

# Push schema to database
pnpm prisma db push

# Run seed script (optional)
pnpm prisma db seed
```

### Run Locally
```bash
pnpm dev
```

## Design Notes

### Validation

- Both Server-side and Client-sides validations are done via Zod schemas (createBuyerSchema, registerSchema and loginSchema) maintaining a single source of truth
- CSV import validates per row; errors show row number + field-specific messages
- Frontend forms show error messages before submitting, reducing the changes of failure

### Ownership Enforcement

- Buyers are tied to a user (ownerId)
- API routes check to ensure only owners can edit/delete their buyers
- API routes also make sure any request only goes through if a user is logged in
- Frontend enforcement of ownership is done by disable buttons and preventing route access

### SSR vs client

- I implemented a JWT and Cookie based auth system which at the time I mistakenly thought was only possible while using client components. So i did not use SSR and went with the more traditional way. But now i found out that it could be done via server-side component as well but its too late.

Features Implemented

- CRUD operations for buyers
- Server-side and Client-side validations with Zod
- Ownership enforcement in API routes
- Ownership based function/button disabling in frontend
- Buyer history tracking (CREATE + UPDATE)
- CSV export (current filtered list)
- CSV import (max 200 rows, transactionally insert valid rows, show row-specific errors)
- Optional/required fields enforced (bhk required for Apartment/Villa)
- Frontend edit form with concurrency check (updatedAt)
- React context for storing logged-in user info
- Real pagination/sorting/filter/search on server
- Debounced search
- Rate limiting
- URL sync (pagination/sorting/filter/search)
- Helpful errors using toast notifications
- Unit Test
- Tag chips with typeahead
- Optimistic Status quick-actions with rollback (dropdown in table)
- Admin role (access/edit/delete all)
- Seed data

Skipped / Future Improvements

- Server Side Components wherever possible
- Optimistic Buyer Edit (left because of lack of time; though implemented optimistic update for status dropdown)
- File upload for a single attachmentUrl (optional doc; lack of time)

