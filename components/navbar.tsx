"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";

import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { specialElite } from "@/config/fonts";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import NextLink from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useListingsStore } from "@/app/gigtools/store/listings";
import { CrosshairsIcon } from "@/app/icons/CrosshairsIcon";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchListings = useListingsStore((s) => s.searchListings);
  const [postcode, setPostcode] = useState<string>("0000");

  useEffect(() => {
    const location = window.localStorage.getItem("location");
    if (location) {
      setPostcode(JSON.parse(location).postcode);
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    searchListings(val);
  };

  const searchInput = (
    <Input
      aria-label="Search"
      value={searchTerm}
      onChange={handleSearch}
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      placeholder="Search gigs..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  // const [expanded, setExpanded] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const inputRef = useRef<HTMLInputElement>(null);
  // const searchListings = useListingsStore((s) => s.searchListings);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = e.target.value;
  //   setSearchTerm(val);
  //   searchListings(val);
  // };

  // useEffect(() => {
  //   if (expanded && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [expanded]);

  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
  //       setExpanded(false);
  //     }
  //   };
  //   if (expanded) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [expanded]);

  return (
    <HeroUINavbar
      maxWidth="full"
      position="sticky"
      className={clsx(specialElite.className)}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        justify="end"
        className={clsx(
          specialElite.className,
          "hidden sm:flex basis-1/5 sm:basis-full"
        )}
      >
        <NavbarItem className="hidden sm:flex gap-2">
          {/* <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link> */}
          {/* <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link> */}
          {/* <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
            <HeartFilledIcon className="text-danger" />
          </Link> */}
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <div className="flex gap-2">
            <Button
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.github}
              startContent={<CrosshairsIcon />}
              variant="flat"
            >
              {postcode}
            </Button>
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.github}
              startContent={<GithubIcon className="text-default-500" />}
              variant="flat"
            >
              Github
            </Button>
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.sponsor}
              startContent={<HeartFilledIcon className="text-danger" />}
              variant="flat"
            >
              Patreon
            </Button>
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/* <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link> */}
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className={clsx(specialElite.className)}>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
