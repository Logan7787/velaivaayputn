# Database Setup Guide

Since you mentioned you are new to PostgreSQL and Prisma, follow these steps to get your database running.

## 1. Install PostgreSQL
If you haven't installed PostgreSQL yet:
1. Download the installer from [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/).
2. Run the installer.
3. **IMPORTANT**: During installation, it will ask you to set a password for the `postgres` user. Remember this password! (e.g., `password` or `admin123`).
4. Finish the installation.

## 2. Verify Database is Running
1. Open "pgAdmin" (installed with PostgreSQL) or use the command line `psql -U postgres`.
2. Access the database server.

## 3. Create the Database
You need to create a database named `velaivaayputn`.
- **Using pgAdmin**: Right-click "Databases" -> Create -> Database -> Name it `velaivaayputn`.
- **Using Command Line**:
  ```bash
  createdb -U postgres velaivaayputn
  ```

## 4. Configure Backend Environment
1. Open `backend/.env`.
2. Update `DATABASE_URL` with your password:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/velaivaayputn"
   ```
   Replace `YOUR_PASSWORD` with the one you set during installation.

## 5. Initialize Prisma (Create Tables)
Open a terminal in the `backend` folder and run:
```bash
npx prisma db push
```
This command will connect to your database and create all the tables defined in `prisma/schema.prisma`.

You typically see "🚀  Your database is now in sync with your Prisma schema."

## 6. Verify Tables
You can inspect your database using Prisma Studio (a web UI):
```bash
npx prisma studio
```
This will open `http://localhost:5555` in your browser where you can see User, Job, Subscription tables.

---

## Quick Troubleshooting
- **Connection Refused**: Ensure PostgreSQL service is running in Windows Services (`services.msc`).
- **Password Auth Failed**: Double check the password in `.env`.
