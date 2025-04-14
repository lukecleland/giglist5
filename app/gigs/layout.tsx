import "../styles/main-section.css";

export default function GigsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section>{children}</section>
    </main>
  );
}
