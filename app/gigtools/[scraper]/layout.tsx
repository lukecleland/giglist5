import { Open_Sans } from "next/font/google";
import clsx from "clsx";

const lato = Open_Sans({
  weight: ["400"],
  display: "swap",
});

export default function GigtoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className={clsx(
        "flex justify-center items-start min-h-screen w-full p-4",
        lato.className
      )}
    >
      <div className="w-full max-w-6xl">{children}</div>
    </section>
  );
}
