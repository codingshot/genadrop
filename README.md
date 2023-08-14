<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/codingshot/genadrop">
    <img src="./src/assets/Genadro-logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">GenaDrop </h1>

  <p align="center">
     The Ultimate No-code NFT solution
    <br />
    <a href="https://www.docs.geandrop.io"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://youtu.be/wC0odzMW_9g">View Demo</a>
    ·
    <a href="https://github.com/codingshot/genadrop/issues">Report Bug</a>
    ·
    <a href="https://github.com/codingshot/genadrop/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About Genadrop</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contracts">Contracts</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About Genadrop

<div align="center">
<br>
<br>
  <a href="https://genadrop.com">
    <img src="./src/assets/landingPage.png " alt="Logo" width="600" height="500">
  </a>
<br>
<br>

</div>

GenaDrop is the ultimate multi-chain no code generative NFT creator, minter, and marketplace.

Coming from the name "Generative Drops". GenaDrop allows artists to create layers, choose rarities, add conflict rules, add blank images, pick the number to generate, generate a preview, delete bad images, edit metadata, download a zip, upload to ipfs, mint to multiple blockchains with a simple to use user interface.

### Built With

- [![ReactJS][react.js]][react-url]
- [![EtherJS][ether.js]][ether-url]
- [![Firebase][firebase]][firebase-url]
- [![WalletConnect][walletconnect]][walletconnect-url]
- [![Pinata][pinata]][pinata-url]
- [![Alchemy][alchemy]][alchemy-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Proceed with the following steps to get Genadrop up and running on any device

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
- yarn
  ```sh
  npm install yarn -g
  ```

### Installation

1. Get a free API Key at
   - Pinata account: https://www.pinata.cloud/
   - Alchemy account: https://www.alchemy.com/
2. Clone the repo
   ```sh
   git clone https://github.com/codingshot/genadrop
   ```
3. Install packages

   ```sh
   yarn install
   ```

   Or

   ```sh
   npm install
   ```

4. Create a `.env` file and enter fill up keys as per the `example.env`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

This doc link can be found here: genadrop.com/docs

## Usage

### USER DOCUMENTATION

https://doc.clickup.com/4659940/d/4e6q4-2087/gena-drop-docs

### TECHNICAL DOCUMENTATION

https://docs.google.com/document/d/1ZYpUnSBJqeGJmmtlkuSD1FSMFJmHrl53c3iyHomj8rs/edit

### NFT Generative Drop Builder + Marketplace

Genadrop Walk Through https://docs.google.com/document/d/e/2PACX-1vS8bwlR12wBqlAA2VovqtdzMOBWLtPdGu6kI99pAGgpfI08jomOc4Auoi_bStFoedsBoPXtKHZZBemc/pub

## Roadmap

- [x] Algorand Integration
  - Milestone 1 YouTube Deliverables https://youtu.be/vXzubFQ5Ulo
  - Minting Nft on Algorand flow : https://www.loom.com/share/68509b38d5d0489891b5f1e426c1cd29
- [x] Celo Integration
- [x] Polygon Integration
- [x] Avalanche Integration
- [x] Near Integration

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!--### January 3rd, 2021
 Thank you so much Algorand Foundation and Happy New Year! Let this year be the year of getting Algorand dApps into production.

We have made a lot of progress with Genadrop. Right now genadrop is used by artists to generate art. We have even been spending time adding functionality as we launch NFT drops to help the creative process.

Check out the product today at genadrop.com and here is a very quick demo https://youtu.be/DnjhyvK4dUY

We have completed milestone 1- Generative Web App PFP Maker as seen in the following video
Milestone 1 YouTube Deliverables https://youtu.be/vXzubFQ5Ulo

Use the web application you can now ✔️✔️✔️✔️✔️✔️✔️✔️✔️
Ability to upload png images to layers
generative all combinations of different layers,
figure out the number of possible combinations based on layers and traits
Ability to delete layer assets
Ability to change rarities
Create, rename, reorder, and delete layers
highlight assets from each layer to generate preview
Download preview as png of same of correct size
Ability to preview all generated renders
the combination amount displayed by multiplying all the number of traits to each other
Ability to drag and reorder layer order and that affect order of generative script
Ability to download all generatives attributes output .png name CollectionName\_#N with a json file with the meta data description of traits and rarity, as (format to structure what is needed for ipfs) as a zipped folder
Ability to have active selected assets in each layer and displayed on right with correct metadata
Layers reflect order on left
Ability to omit bad image and choose new possible collection
Ability to add blank layers
Ability to rename collection
Milestone 2 YouTube Deliverable
https://www.loom.com/share/68509b38d5d0489891b5f1e426c1cd29
Our second deliverable is completed however we already have a mitner working, So essentially half of milestone 3 and all milestone 3.
IPFS Upload
Upload zip of images with metadata unto ipfs
Return IPFS json
Preview collection, number of pictures, layers and size
(We can get the second milestone amount for this)
Algorand Mint
Mint complete IPFS.json to algorand
Shows transaction link after minted to view on block explorer
We still need to add
A NFT Marketplace
List and purchasing abilities
Custom marketplace tax
View marketplace
Individual NFT view
Custom transfer contracts
Tweak metadata description

Thank you so much for your continued support. Would love to pilot some drops as other foundations are asking us to add minters and definitely want Algorand support in the marketing of the genadrop marketplace when it comes out. -->

# Contracts

### Genadrop Contract addresses evm chains

### Celo

- ### Testnet
  - Nft Factory address - https://alfajores-blockscout.celo-testnet.org/address/0xe8C59969Cc0B161d8e045f99B86e3496bD4B88c2
  - Single minter address - https://alfajores-blockscout.celo-testnet.org/address/0x990fBe6231bb75C7782afAF6570A7A5Be8fE7912
  - Marketplace contract - https://alfajores-blockscout.celo-testnet.org/address/0xB9eEFb0C664c86d7e375D5136167Fe80D5C4B94D
  - SoulBound Contract - https://alfajores-blockscout.celo-testnet.org/address/0xd91cC6DE129D13F4384FB0bC07a1a99D4F858e72
- ### MAINNET
  - Nft Factory address - https://explorer.celo.org/address/0x25766E3c4e7f7183bA5341EA647a8040c73F60Da
  - Single minter address - https://explorer.celo.org/address/0xC291846A587cf00a7CC4AF0bc4EEdbC9c3340C36
  - Marketplace contract - https://explorer.celo.org/address/0x5616BCcc278F7CE8B003f5a48f3754DDcfA4db5a
  - SoulBound Contract - https://explorer.celo.org/address/0xd91cC6DE129D13F4384FB0bC07a1a99D4F858e72

### Polygon

- ### Testnet
  - Nft Factory address - https://mumbai.polygonscan.com/address/0x4ab6c03e7779fCC67b06f76169CC07d93FD4965A
  - Single minter address - https://mumbai.polygonscan.com/address/0x5D05FE74a923B0E2e50ef08e434AC8fA6C76Fe71
  - Marketplace contract - https://mumbai.polygonscan.com/address/0xee7Ff1636FF6e85c1613FDDD703E4A48b2b2A9A0
  - SoulBound Contract - https://mumbai.polygonscan.com/address/0xd91cC6DE129D13F4384FB0bC07a1a99D4F858e72
- ### MAINNET
  - Nft Factory address - https://polygonscan.com/address/0x4836CFA7ff4Cafac18fF038F4Da75f68c254c732
  - Single minter address - https://polygonscan.com/address/0x436AEceaEeC57b38a17Ebe71154832fB0fAFF878
  - Marketplace contract - https://polygonscan.com/address/0x57Eb0aaAf69E22D8adAe897535bF57c7958e3b1b
  - SoulBound Contract - https://polygonscan.com/address/0xd91cC6DE129D13F4384FB0bC07a1a99D4F858e72

### Aurora

- ### Testnet
  - Nft Factory address - https://testnet.aurorascan.dev/address/0x9663429db7c868e1d83c2c1616713396cf6b2806
  - Single minter address - https://testnet.aurorascan.dev/address/0x97E9d4c3d547D8ebc46DD32eA9E7f745E5A408E9
  - Marketplace contract - https://testnet.aurorascan.dev/address/0x2B75c2fF193086D425ffCA4a1829C560FA4710Fa
  - SoulBound Contract - https://testnet.aurorascan.dev/address/0xd91cC6DE129D13F4384FB0bC07a1a99D4F858e72
- ### MAINNET
  - Nft Factory address - https://aurorascan.dev/address/0xcdaD838f104F046f564CCc40Eae753ead10Ee862
  - Single minter address - https://aurorascan.dev/address/0xe53bC42B6b25a1d548B73636777a0599Fd27fE5c
  - Marketplace contract - https://aurorascan.dev/address/0xe93097f7C3bF7A0E0F1261c5bD88F86D878667B5
  - SoulBound Contract - https://aurorascan.dev/address/0xe1D36964Eb49E38BB3f7410401BC95F0E9f1F6D3

### Avalanche

- ### Testnet
  - Nft Factory address - https://testnet.snowtrace.io/address/0xDf683a6B7a39C9757072c145BBB9484F3574a55c
  - Single minter address - https://testnet.snowtrace.io/address/0x43dBdfcAADD0Ea7aD037e8d35FDD7c353B5B435b
  - Marketplace contract - https://testnet.snowtrace.io/address/0x26a0eEF5CC8A2C41B040e64f1318CFa2314f0E0D
  - SoulBound Contract - https://testnet.snowtrace.io/address/0xd91cC6DE129D13F4384FB0bC07a1a99D4F858e72
- ### MAINNET
  - Nft Factory address - https://snowtrace.io/address/0x473ced4c09024224edf353d6f7574c551806c81a
  - Single minter address - https://snowtrace.io/address/0x5ce2DEEe9b495B5Db2996C81c16005559393efb8
  - Marketplace contract - https://snowtrace.io/address/0xDf683a6B7a39C9757072c145BBB9484F3574a55c
  - SoulBound Contract - https://snowtrace.io/address/0xd91cC6DE129D13F4384FB0bC07a1a99D4F858e72

### Near

- ### Testnet
  - Single minter address - https://explorer.testnet.near.org/accounts/genadrop-test.mpadev.testnet
- ### MAINNET
  - Single minter address - https://explorer.mainnet.near.org/accounts/nft.genadrop.near

### Listing to external markets through Genadrop

listing to https://www.tradeport.xyz/ and http://fewfar.com/ marketplaces; there is a fee of 0.01 near each for storage deposit on the respective markets.
and another 0.01 attachement for gas fees, there will be a refund of excess gas attachement.

- WalkThrough Video - https://www.loom.com/share/b2fbf24f8de04a57be9052032ecfba41

<!-- DEPLOYING CONTRACTS -->

## Deploying EVM Contracts

Follow the steps below to contribute to Genadrop

1. create a .env file and add the rpc url for the respective chain you want to deploy to.
2. Make sure Hardhat is installed, checkout the scripts under the Scripts folder
3. In your console, `run yarn hardhat run --network (network-name) (script-name)` i.e `yarn hardhat run --network avax scripts/deployMarket.js` to deploy on avax network(check the hardhatconfig.js file to see the various network tags)
4. The script runs and returns the Deployed Contract address

--- Demo video ---
https://www.loom.com/share/19d35f0ec9434411851190984475a676

<!-- Contract Docs -->

## NEAR Contract Docs
### genadrop-contract.nftgen.near
| **Contract Name** | *NEAR Mainnet* |
| --- | --- |
| **Contract Address** | *genadrop-contract.nftgen.near* |
| **Chain Name** | *NEAR Mainnet* |
| **Chain ID** | *null* |
| **Type** | *near* |
| **RPC URL** | *https://rpc.mainnet.near.org* |

### nft_approve
| Name | State Mutability |
| --- | --- |
| *nft_approve* | *null* |

### nft_is_approved
| Name | State Mutability |
| --- | --- |
| *nft_is_approved* | *null* |

### nft_revoke
| Name | State Mutability |
| --- | --- |
| *nft_revoke* | *null* |

### nft_revoke_all
| Name | State Mutability |
| --- | --- |
| *nft_revoke_all* | *null* |

### nft_total_supply
| Name | State Mutability |
| --- | --- |
| *nft_total_supply* | *null* |

### nft_tokens
| Name | State Mutability |
| --- | --- |
| *nft_tokens* | *null* |

### nft_supply_for_owner
| Name | State Mutability |
| --- | --- |
| *nft_supply_for_owner* | *null* |

### nft_tokens_for_owner
| Name | State Mutability |
| --- | --- |
| *nft_tokens_for_owner* | *null* |

### nft_metadata
| Name | State Mutability |
| --- | --- |
| *nft_metadata* | *null* |

### nft_mint
| Name | State Mutability |
| --- | --- |
| *nft_mint* | *null* |

### nft_transfer
| Name | State Mutability |
| --- | --- |
| *nft_transfer* | *null* |

### nft_transfer_call
| Name | State Mutability |
| --- | --- |
| *nft_transfer_call* | *null* |

### nft_token
| Name | State Mutability |
| --- | --- |
| *nft_token* | *null* |

### nft_resolve_transfer
| Name | State Mutability |
| --- | --- |
| *nft_resolve_transfer* | *null* |

### nft_payout
| Name | State Mutability |
| --- | --- |
| *nft_payout* | *null* |

### nft_transfer_payout
| Name | State Mutability |
| --- | --- |
| *nft_transfer_payout* | *null* |

### new_default_meta
| Name | State Mutability |
| --- | --- |
| *new_default_meta* | *null* |

### new
| Name | State Mutability |
| --- | --- |
| *new* | *null* |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->


## Contributing

Follow the steps below to contribute to Genadrop

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`js git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Coding Shot - [@genadrop](https://twitter.com/genadrop) - https://linktr.ee/MinorityProgrammers

Project Link: [https://github.com/codingshot/genadrop](https://github.com/codingshot/genadrop)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/company/minority-programmers/
[linkedin-url]: https://linkedin.com/company/genadrop/
[product-screenshot]: ./src/assets/landingPage.png
[react.js]: ./src/assets/react-logo.svg
[react-url]: https://reactjs.org/
[ether.js]: ./src/assets/ether-logo.svg
[ether-url]: https://docs.ethers.io/v5/
[firebase]: ./src/assets/firebase.svg
[firebase-url]: https://firebase.google.com/
[walletconnect]: ./src/assets/walletConnect-logo.svg
[walletconnect-url]: https://walletconnect.com/
[pinata]: ./src/assets/pinata.svg
[pinata-url]: https://www.pinata.cloud/
[alchemy]: ./src/assets/alchemy.svg
[alchemy-url]: https://www.alchemy.com/
