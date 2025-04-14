import { notFound } from "next/navigation";
import { getSlugs } from "./queries";

type Props = {
  params: { slugs?: string[] };
};

export default async function Page({ params }: Props) {
  const path = (params.slugs?.join("/") || "").toLowerCase();

  const venues = await getSlugs();
  const matchedVenue = venues.find((v) => v.slug.toLowerCase() === path);

  if (!matchedVenue) {
    notFound();
  }

  return (
    <div>
      <img src={matchedVenue.heroImage} alt={matchedVenue.name} />
      <h1>{matchedVenue.name}</h1>
      <p>ID: {matchedVenue.id}</p>
      <p>Slug: {matchedVenue.slug}</p>
      <p>Address: {matchedVenue.address1}</p>
      <p>Suburb: {matchedVenue.suburb}</p>
      <p>State: {matchedVenue.state}</p>
      <p>Postcode: {matchedVenue.postcode}</p>
      <p>URL: {matchedVenue.url}</p>
      <p>email: {matchedVenue.email}</p>
      <p>phone: {matchedVenue.phone}</p>
      <div>
        description:{" "}
        <div dangerouslySetInnerHTML={{ __html: matchedVenue.description }} />
      </div>
    </div>
  );
}
