# Giglist

Gigs in a list. Giglist. Version 5

## Technologies Used

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## How to Use
### Clone the repository

```bash
git clone https://github.com/lukecleland/giglist5.git
```
### Navigate to the project directory

```bash
cd giglist
```

### Install dependencies

Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### MySQL

You'll need to make a MySQL database and setup the giglistc_wp180 database. You can use the following command to create the database:

```sql
CREATE DATABASE giglistc_wp180;
```

Then, you can import the `giglist5.sql` file into the database. You can use the following command to import the file:

```bash
mysql -u root -p giglistc_wp180 < giglist5.sql
```
### .env
Create a `.env` file in the root directory of the project and add the following environment variables.  Contact me for the values of the variables. 

```env
GOOGLE_ID=...
GOOGLE_SECRET=...
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=giglistc_wp180
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
AUTH_SECRET=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```
### Docker

```bash
docker compose up -d
```
