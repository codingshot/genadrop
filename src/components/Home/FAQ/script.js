/* eslint-disable import/prefer-default-export */
export const FAQS = [
  {
    id: "1",
    question: "What is a generative collection?",
    answer:
      "A generative collection is a group of NFTs that use a computer program for the rendering of their art. This is commonly done with profile pictures that choose different traits for the same layer at different rarities that the computer then layers and outputs a unique image. Generative collections have also been used to reference AI generated art.",
  },
  {
    id: "2",
    question: `What does GenaDrop mean when it says it's "multi-chain"?`,
    answer:
      "GenaDrop allows users to mint NFTs (or publish them to the public)  to a number of different blockchains, or decentralized databases. This means you get to choose which blockchain you want to publish your work on. We at the Minority Programmers have a chain-agnostic approach to building Web3 dApps and will continue to add different chains onto the platform at the request of members of the Minority Programmers DAO.",
  },
  {
    id: "3",
    question: "How does GenaDrop store my images?",
    answer: "GenaDrop uses a form of decentralized storage called IPFS to mint your NFTs.",
  },
  {
    id: "5",
    question: "How do I start using Genadrop?",
    answer:
      "When you’re making a generative NFT collection, each final image will be made out of different traits that can be mixed and matched. First of all you must have basic assets for layer combination generation. Example: the main background layer, body, and few traits. For more information watch this demo",
  },
  // {
  //   id: "6",
  //   question: "What are the requirements for the assets?",
  //   answer:
  //     "Each layer in the image represents a trait (Hair, Outfit, etc), and each trait will have many variants (Short Purple Hair, Long Purple Hair, etc). Draw each variant on a transparent .PNG file so all the layers will be visible. Each image should be the same size, You can add conflict rules to selected layers. Preview and download your collection.",
  // },
  {
    id: "7",
    question: "How do I mint my collection?",
    answer:
      "Connect your wallet and upload your collection zip folder, previously made in the create section of the Genadrop dApp. As a JSON file after which you will now upload your Metadata to IPFS and select the blockchain of your choice, add price and Mint.",
  },
  {
    id: "8",
    question: "Which blockchains does Genadrop support?",
    answer: `- Algorand \n- Polygon \n- Celo\n- Aurora\n- Arbitrum\n- Avalanche\n- NEAR (minting only)`,
  },
  {
    id: "9",
    question: "Can I resell my art after its been minted on Genadrop?",
    answer: `
      Yes NFTs can be transfer and resold that have been minted on the respective public blockchains`,
  },
  {
    id: "10",
    question: "How many editions of an NFT can create?",
    answer:
      "You can select how many NFTs (for collections) (must be less than possible combinations that can be produced. The more editions the longer it will take for your art to generate and upload. Currently for 1 of 1 NFTs, you can only mint 1 at a time.",
  },
  {
    id: "11",
    question: "What are some features of GenaDrop art generation tool?",
    answer:
      "With the Genadrop art creation tool (genadrop.com/create) a artist can upload and name different assets, choose blanks images, edit rarities, reorder layers, see possible combinations, choose generation size, omit or replace from combination with new images, rename collection and metadata for both EVM and Solana blockchains.",
  },
  // {
  //   id: "12",
  //   question: "Does GenaDrop save my assets?",
  //   answer:
  //     "To promote the decentralized stack, we do not have a backend to store assets. Rather this is handled on the client side. We only save contract references for things like collections on Algorand onto a database in order to build the marketplace with a Ethereum familiar UI.",
  // },
  {
    id: "13",
    question: "What type of NFT(s) can I mint?",
    answer:
      "Genadrop supports Minting of 1 of 1 images and collections. To Mint a 1 of 1 NFT select your NFT file[supported file format: png] , enter metadata and click mint.",
  },
];
