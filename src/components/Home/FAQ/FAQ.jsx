import React, { useState } from 'react';
import classes from './FAQ.module.css';
import FQACard from './FAQCard';

const FQA = () => {
  const [state, setState] = useState({
    dropdown: '',
  });
  const { dropdown } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const FAQS = [
    {
      id: '1',
      question: 'Does GenaDrop have any documentation have any docs?',
      answer: 'genadrop.com/docs',
    },
    {
      id: '2',
      question: 'what are the requirements for each asset ?',
      answer: 'Each layer in the image represents a trait (Hair, Outfit, etc), and each trait will have many variants (Short Purple Hair, Long Purple Hair, etc). Draw each variant on a transparent .PNG file so all the layers will be visible. Each image should be the same size, You can add conflict rules to selected layers. Preview and download your collection.',
    },
    {
      id: '3',
      question: 'How do I mint my collection?',
      answer: 'Connect your wallet and upload your collection zip folder, previously made in the create section of the Genadrop dApp. as json file after which you will now upload your Metadata to ipfs and select the blockchain of your choice, add price and Mint.',
    },
    {
      id: '4',
      question: 'Which blockchains does Genadrop support?',
      answer: `
        - Algorand
        - Polygon
        - Celo (Coming Soon)
        - Aurora - NEAR's EVM (Coming Soon)
        - Near (Coming Soon)`,
    },
    {
      id: '5',
      question: 'Can I resell my art after its been minted on Genadrop?',
      answer: 'Yes, NFTs can be transfer and resell arts that have been minted on the respective public blockchains',
    },
    {
      id: '6',
      question: 'How many editions of an NFT can create?',
      answer: 'You can select how many NFTs (must be less than possible combinations that can be produced)',
    },
    {
      id: '7',
      question: 'What are some features of GenaDrop art generation tool?',
      answer: 'With the Genadrop art creation tool (genadrop.com/create) a artist can upload and name different assets, choose blanks images, edit rarities, reorder layers, see possible combinations, choose generation size, omit or replace from combination with new images, rename collection and metadata for both EVM and Solana blockchains.',
    },
    {
      id: '8',
      question: 'Does GenaDrop save my assets?',
      answer: 'To promote the decentralized stack, we do not have a backend to story assets. Rather this is handled on the client side. We only save contract references for things like collections on Algorand onto a database in order to build the marketplace with a Ethereum familiar UI.',
    },
    {
      id: '9',
      question: 'What Type of NFT can I Mint?',
      answer: `
      Genadrop supports Minting of 1 of 1 images and collections generated on GenaDrop.
      To Mint 1 0f 1 NFT select your NFT file[supported file format: png] , add metadata file and click export`,
    },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Frequently Asked Questions</div>
      <div className={classes.FQAs}>
        {
          FAQS.map((FAQ, index) => (
            <FQACard
              key={FAQ.id}
              FAQ={FAQ}
              id={index}
              dropdown={dropdown}
              handleSetState={handleSetState}
            />
          ))
        }
      </div>
    </div>
  );
};

export default FQA;
