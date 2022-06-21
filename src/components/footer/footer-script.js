import algorandIcon from "../../assets/footer-icon-algorand.svg";
import pinataIcon from "../../assets/footer-icon-pinata.svg";
import celoIcon from "../../assets/footer-icon-celo.svg";
import polygonIcon from "../../assets/footer-icon-polygon.svg";
import solanaIcon from "../../assets/footer-icon-solana.svg";
import nearIcon from "../../assets/footer-icon-near.svg";
import auroraIcon from "../../assets/footer-icon-aurora.svg";
import twitterIcon from "../../assets/icon-twitter.svg";
import discordIcon from "../../assets/icon-discord.svg";
import linkedInIcon from "../../assets/icon-linkedin.svg";
import youTubeIcon from "../../assets/icon-youtube.svg";
import telegram from "../../assets/telegram.svg";
import linktree from "../../assets/linktree.svg";

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
    link: "https://celocommunityfund.org/",
  },
  {
    name: "Polygon",
    icon: polygonIcon,
    link: "https://polygon.technology/",
  },
  {
    name: "Solana",
    icon: solanaIcon,
    link: "https://solana.com/",
  },
  {
    name: "Near",
    icon: nearIcon,
    link: "https://near.foundation/",
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
      { name: "Create", link: "/create", id: "1" },
      { name: "Mint", link: "/mint", id: "2" },
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
      { name: "HERDrop", link: "https://www.herdrop.com", id: "3" },
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
    icon: linktree,
    link: "https://linktr.ee/Genadrop",
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