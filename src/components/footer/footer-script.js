import algorandIcon from "../../assets/footer-icon-algorand.svg";
import pinataIcon from "../../assets/footer-icon-pinata.svg";
import celoIcon from "../../assets/footer-icon-celo.svg";
import polygonIcon from "../../assets/footer-icon-polygon.svg";
import avalancheIcon from "../../assets/footer-icon-avalanche.svg";
import nearIcon from "../../assets/footer-icon-near.svg";
import auroraIcon from "../../assets/footer-icon-aurora.svg";
import twitterIcon from "../../assets/icon-twitter.svg";
import discordIcon from "../../assets/icon-discord.svg";
import linkedInIcon from "../../assets/icon-linkedin.svg";
import youTubeIcon from "../../assets/icon-youtube.svg";
import telegram from "../../assets/telegram.svg";
import links from "../../assets/icon-links.svg";

export const orgs = [
  {
    name: "Pinata",
    icon: pinataIcon,
    link: "https://www.pinata.cloud/",
  },
  {
    name: "Algorand",
    icon: algorandIcon,
    link: "https://www.algorand.com/",
  },
  {
    name: "Celo",
    icon: celoIcon,
    link: "https://celo.org/",
  },
  {
    name: "Polygon",
    icon: polygonIcon,
    link: "https://polygon.technology/",
  },
  {
    name: "Avalanche",
    icon: avalancheIcon,
    link: "https://www.avax.network/",
  },
  {
    name: "Near",
    icon: nearIcon,
    link: "https://near.org/",
  },
  {
    name: "Aurora",
    icon: auroraIcon,
    link: "https://aurora.dev/",
  },
];
export const footerLinks = [
  {
    id: "1",
    title: "App",
    content: [
      { name: "Mint", link: "/create", id: "2" },
      { name: "Marketplace", link: "/marketplace", id: "3" },
    ],
  },
  {
    id: "2",
    title: "Quick Links",
    content: [
      {
        name: "DAO",
        link: "https://snapshot.org/#/minorityprogrammers.eth",
        id: "1",
      },
      { name: "MPA", link: "https://www.minorityprogrammers.org", id: "2" },
    ],
  },
  {
    id: "3",
    title: "Support",
    content: [
      {
        name: "Docs",
        link: "https://www.genadrop.com/docs",
        id: "1",
      },
      {
        name: "Contact Us",
        link: "https://linktr.ee/MinorityProgrammers",
        id: "2",
      },
    ],
  },
];

export const socialLinks = [
  {
    name: "Linktree",
    icon: links,
    link: "/links",
  },
  {
    name: "Discord",
    icon: discordIcon,
    link: "https://discord.gg/4vdtmQqz6d",
  },
  {
    name: "Twitter",
    icon: twitterIcon,
    link: "https://twitter.com/minorityprogram",
  },
  {
    name: "Telegram",
    icon: telegram,
    link: "https://t.me/+4BDhz2QLaa05NzEx",
  },
  {
    name: "Linkedin",
    icon: linkedInIcon,
    link: "https://linkedin.com/company/minority-programmers/",
  },
  {
    name: "Youtube",
    icon: youTubeIcon,
    link: "https://youtube.com/c/minorityprogrammers",
  },
];
