import { ListingDates } from "./components/ListingDates";

export default async function GigsPage() {
  console.log(
    process.env.MYSQL_HOST,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    process.env.MYSQL_DATABASE
  );
  return (
    <div className="w-full">
      <ListingDates />
    </div>
  );
}
