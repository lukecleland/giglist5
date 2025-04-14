import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { subtitle } from "@/components/primitives";
import { Input } from "@heroui/input";

export default function Home() {
  return (
    <section
      className="flex flex-col items-center justify-center gap-4 py-8"
      style={{ height: "calc(100vh - 380px)" }}
    >
      <div className="inline-block max-w-xl text-center justify-center">
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
