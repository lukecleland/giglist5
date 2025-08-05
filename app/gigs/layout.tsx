import clsx from "clsx";
import { lato } from "@/config/fonts";

export default function GigsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={clsx(lato.className, "flex")}>{children}</main>;
}
