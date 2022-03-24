import { useState } from 'react';
import classes from './FAQ.module.css';
import FQACard from './FAQCard';

const FQA = () => {
  const [state, setState] = useState({
    dropdown: ''
  })
  const { dropdown } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const FAQS = [
    {
      question: "How do i start using GenaDrop ?",
      answer: "When you’re making a generative NFT collection, each final image will be made out of different traits that can be mixed and matched. First of all you must have basic assets for layers combination generation. Example: the main background layer, body, and few traits. For more information watch this"
    },
    {
      question: "what are the requirements for each asset ?",
      answer: "Each layer in the image represents a trait (Hair, Outfit, etc), and each trait will have many variants (Short Purple Hair, Long Purple Hair, etc). Draw each variant on a transparent .PNG file so all the layers will be visible. Each image should be the same size, You can add conflict rules to selected layers. Preview and download your collection."
    },
    {
      question: "How do I mint my collection ?",
      answer: "Connect your wallet and upload your collection zip folder, previously made in the create section of the Genadrop dApp. as json file after which you will now upload your Metadata to ipfs and select the blockchain of your choice, add price and Mint."
    },
    {
      question: "Which blockchains does Genadrop support ?",
      answer: `
        - Algorand
        - Polygon
        - Celo (Coming Soon)
        - Near (Coming Soon)`
    },
    {
      question: "Can I resell my art after its been minted on Genadrop ?",
      answer: "Yes NFTs can be transfer and resell arts that have been minted on the respective public blockchains"
    },
    {
      question: "How many editions of an NFT can create ?",
      answer: "You can select how many NFTs (must be less than possible combinations that can be produced)"
    },
    {
      question: "What are some features of GenaDrop art generation tool ?",
      answer: "With the Genadrop art creation tool (genadrop.com/create) a artist can upload and name different assets, choose blanks images, edit rarities, reorder layers, see possible combinations, choose generation size, omit or replace from combination with new images, rename collection and metadata for both EVM and Solana blockchains."
    },
    {
      question: "Does GenaDrop save my assets ?",
      answer: "To promote the decentralized stack, we do not have a backend to story assets. Rather this is handled on the client side. We only save contract references for things like collections on Algorand onto a database in order to build the marketplace with a Ethereum familiar UI."
    },
    {
      question: "What Type of NFT can I Mint ?",
      answer: `
      Genadrop supports Minting of 1 of 1 images and collections.
      To Mint 1 0f 1 NFT select your NFT file[supported file format: png] , add metadata file and click export`
    }
  ]


  return (
    <div className={classes.container}>
      <div className={classes.heading}>Frequently Asked Questions</div>
      <div className={classes.FQAs}>
        {
          FAQS.map((FAQ, index) => (
            <FQACard key={index} FAQ={FAQ} id={index} dropdown={dropdown} handleSetState={handleSetState} />
          ))
        }
      </div>
    </div>
  )
}

export default FQA;