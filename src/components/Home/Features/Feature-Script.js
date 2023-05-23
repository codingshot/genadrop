import mintImage from "../../../assets/app-mint.svg";
import exploreImage from "../../../assets/app-explore.svg";

const features = [
  // {
  //   heading: "CREATE",
  //   link: "Try Genadrop Create for FREE",
  //   url: "/create",
  //   image: createImage,
  //   title: "No More need for copy & Paste or Uploading your NFTs all over again.",
  //   description:
  //     "Automatically Bring your NFTs to life via a simple interface, upload each assets and have genaDrop create your generative collection effortlessly.",
  // },
  {
    heading: "CREATE",
    link: "Go to Mint",
    url: "/create",
    image: mintImage,
    title: "Turn anything into a digital collectible you own with no code in minutes",
    description:
      "Directly upload files, render collections, memorialize tweets, use your camera, generate unique ART with AI........ to create NFTs you own (without any coding knowledge)",
  },
  {
    heading: "MARKETPLACE",
    link: "Buy and List NFTs",
    url: "/marketplace",
    image: exploreImage,
    title: "Distribute the art you own directly to eager collectors & fans",
    description:
      "Our marketplace is where buyers and collectors trade NFTs effortlessly across the hottest blockchains",
  },
];

export default features;
