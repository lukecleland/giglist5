import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { subtitle } from "@/components/primitives";
import { Input } from "@heroui/input";
import { specialElite } from "@/config/fonts";
import clsx from "clsx";

export default function Home() {
  return (
    <section
      style={{ height: "calc(100vh - 380px)" }}
      className={clsx(
        specialElite.className,
        "flex flex-col items-center justify-center gap-4 w-full"
      )}
    >
      <div className=" max-w-xl text-center justify-center">
        <div className={subtitle({ class: "mt-4" })}>Find local gigs</div>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Enter your post code" />
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Go!
        </Link>
      </div>
    </section>
  );
}
