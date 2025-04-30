import { Fira_Code as FontMono, Inter as FontSans, Lato, Special_Elite, Open_Sans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: false,
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
});

export const lato = Lato({
  weight: ["400"],
  display: "swap",
  preload: false,
});

export const specialElite = Special_Elite({
  weight: ["400"],
  display: "swap",
  preload: false,
});

const openSans = Open_Sans({
  weight: ["400"],
  display: "swap",
  preload: false,
});