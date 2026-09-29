# Blessed Isaac Cosmetics Concept

An online product catalog for Blessed Isaac Cosmetics Concept. Visitors can browse the latest products, view product details, and contact the shop to order through WhatsApp. Administrators can sign in to manage products.

## Features

- Public product catalog and individual product pages
- Admin authentication and product management
- PostgreSQL database managed with Prisma
- Product image uploads (JPG, PNG, and WEBP, up to 5 MB)
- WhatsApp order links

## Tech Stack

- Next.js 16 with React 19 and TypeScript
- PostgreSQL 15
- Prisma 7
- pnpm

## Requirements

- Node.js compatible with Next.js 16
- pnpm 12.5.1 (or Corepack-enabled pnpm)
- Docker Compose, or another PostgreSQL 15-compatible database

## Local Setup

1. Install dependencies:

	```bash
	pnpm install
	```

2. Create a `.env` file in the project root. For the included Compose database, use:

	```dotenv
	DB_USER=blessed
	DB_PASSWORD=change-this-password
	DB_NAME=blessed
	DATABASE_URL=postgresql://blessed:change-this-password@127.0.0.1:5437/blessed
	JWT_ACCESS_SECRET=replace-with-a-long-random-secret
	SEED_ADMIN_EMAIL=admin@example.com
	SEED_ADMIN_PASSWORD=replace-with-a-strong-password
	```

	Use the same username, password, and database name in `DATABASE_URL` as in `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. `NEXT_PUBLIC_SITE_URL` is optional; set it to the public app URL if WhatsApp order messages should include direct product links.

3. Start PostgreSQL:

	```bash
	docker compose up -d
	```

4. Apply the existing database migrations and generate the Prisma client:

	```bash
	pnpm exec prisma migrate deploy
	pnpm exec prisma generate
	```

5. Create the administrator account from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`:

	```bash
	pnpm exec prisma db seed
	```

6. Start the development server:

	```bash
	pnpm dev
	```

Open [http://localhost:3000](http://localhost:3000). The admin sign-in page is at `/login`; product management is at `/admin`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build the production app |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |

## Database Changes

For local schema changes, update `prisma/schema.prisma`, create a migration, and regenerate the client:

```bash
pnpm exec prisma migrate dev --name describe-your-change
pnpm exec prisma generate
```

Use `pnpm exec prisma migrate deploy` to apply committed migrations in deployment environments.

## Deployment Notes

Configure `DATABASE_URL` and `JWT_ACCESS_SECRET` in the deployment environment. Set `NEXT_PUBLIC_SITE_URL` to the canonical site URL if product links should appear in WhatsApp order messages. Run migrations with `pnpm exec prisma migrate deploy` during release and build with `pnpm build`.

Product images are saved to the local `uploads/` directory and served through the app. A deployment using ephemeral filesystems should use persistent storage or replace local uploads with an object-storage service. Keep database credentials and admin seed credentials private, and use a unique, strong JWT secret in production.
