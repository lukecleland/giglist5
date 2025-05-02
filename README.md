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

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

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

Then, you can import the `giglistc_wp180.sql` file into the database. You can use the following command to import the file:

```bash
mysql -u root -p giglistc_wp180 < giglistc_wp180.sql
```
### .env
Create a `.env` file in the root directory of the project and add the following environment variables:

```env
DATABASE_URL=mysql://root:password@localhost:3306/giglistc_wp180
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GITHUB_ID=your_github_id
NEXT_PUBLIC_GITHUB_SECRET=your_github_secret
NEXT_PUBLIC_GOOGLE_ID=your_google_id
NEXT_PUBLIC_GOOGLE_SECRET=your_google_secret
```
### Docker

```bash
docker compose up -d
```
