# Database Setup Guide

This project requires a MySQL database. Since Prisma is configured for MySQL, you must provide a valid database connection URL before the backend can function properly.

## 1. Prerequisites

You have three main options for running MySQL:

### Option A: Local MySQL Server (e.g., XAMPP, WAMP, Native)
1. Ensure MySQL is installed and running on port `3306`.
2. Open your MySQL client (or phpMyAdmin).
3. Create a new database:
   \`\`\`sql
   CREATE DATABASE IF NOT EXISTS sphinx_db;
   \`\`\`

### Option B: Docker (Recommended for isolation)
1. Ensure Docker Desktop is running.
2. In the `backend` folder, run:
   \`\`\`bash
   docker-compose up -d
   \`\`\`
3. This will spin up a MySQL container named `sphinx_mysql` on port `3306` with the password `password` and an empty database named `sphinx_db`.

### Option C: Remote / Hosted MySQL (e.g., cPanel, AWS RDS, DigitalOcean)
1. Create a MySQL database and user via your hosting control panel.
2. Note down the host, port, database name, username, and password.

---

## 2. Configure Environment Variables

Open the \`.env\` file inside the \`backend\` directory and update the \`DATABASE_URL\` variable.

The format is:
\`\`\`
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
\`\`\`

**Examples:**
- **Local / Docker:** \`DATABASE_URL="mysql://root:password@localhost:3306/sphinx_db"\`
- **Remote:** \`DATABASE_URL="mysql://db_user:my_secure_pass@database.hosting.com:3306/db_name"\`

---

## 3. Apply Prisma Schema (Migration)

Once the database is running and the URL is set, run the following command to push the schema to the database:

\`\`\`bash
npx prisma db push
\`\`\`
*(This will create all the necessary tables).*

---

## 4. Seed Initial Data

To populate the database with the default Super Admin, categories, projects, and settings, run:

\`\`\`bash
npm run prisma:seed
\`\`\`

**Default Admin Login:**
- Email: \`admin@example.com\`
- Password: \`Admin@123456\`

---

## 5. Start the Server

\`\`\`bash
npm run dev
\`\`\`
The server should now start successfully and connect to the database. You can test the login endpoint via Swagger at \`http://localhost:5000/api/docs\`.
