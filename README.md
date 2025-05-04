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

### .env
You'll need to create an `.env.local` file in the root directory of the project and add the following environment variables.  Contact me lukecleland@gmail.com for the values. 

```
# .env.local
GOOGLE_ID=...
GOOGLE_SECRET=...
MYSQL_HOST=bitwisetrading.com
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=giglist1234!
MYSQL_DATABASE=giglist
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
AUTH_SECRET=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Container Development

### Docker

It's recommended to use Docker for development. You can use the following command to build and run the Docker containers:

```bash
docker compose build
```

Then, you can use the following command to start the Docker containers:

```bash
docker compose up
```

Dev server will be available at `http://localhost:3000` and phpMyAdmin will be available at `http://localhost:8080`.


## Local Development

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

You'll need to install MySQL and setup the `giglistc_wp180` database. On MacOS, you can install MySQL using Homebrew, or a development environment like MAMP or XAMPP. Linux users can use the package manager for their distribution. Windows users can use WAMP or XAMPP also.
Use the following command to create the database:

```sql
CREATE DATABASE giglistc_wp180;
```

Then import the `giglist5.sql` file into the database. You can use phpMyAdmin to import or the following command in the terminal:

```bash
mysql -u root -p giglistc_wp180 < giglist5.sql
```