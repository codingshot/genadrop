import createIcon from "../../assets/create-icon.svg"
import uploadIcon from "../../assets/upload-icon2.svg"
import setRuleIcon from "../../assets/set-rules-icon.svg"
import downloadIcon from "../../assets/download-mint-autolist-icon.svg"
import resellIcon from "../../assets/resell-icon.svg"
import creatorsImage from "../../assets/creators-image.png"
import collectorsImage from "../../assets/collectors-image.png"

export const creators = {
  heading: 'Genadrop for',
  headingAccent: 'Creators',
  description: 'Bring your NFTs to life via a simple interface, upload each assets and have genaDrop create your generative collection effortlessly.',
  image: creatorsImage,
  feature: [
    {
      icon: createIcon,
      title: 'Create Layers',
      description: 'You can create your layers and name them according to assets you want to upload'
    },
    {
      icon: uploadIcon,
      title: 'Upload Assests',
      description: 'Make sure your assets are in the same size and are in Png format.'
    },
    {
      icon: setRuleIcon,
      title: 'Set Rarity and Conflict Rules',
      description: 'You can configure rarity and conflict rules as you want it to apply to a certain asset.'
    },
    {
      icon: downloadIcon,
      title: 'Download, Mint and Auto List',
      description: 'You can configure rarity and conflict rules as you want it to apply to a certain asset.'
    }
  ]
}

export const Collectors = {
  heading: 'Genadrop for',
  headingAccent: 'Collectors',
  description: 'Bring your NFTs to life via a simple interface, collectors trust GenaDrop marketplace to be the home of excellent NFTs with. ',
  image: collectorsImage,
  feature: [
    {
      icon: createIcon,
      title: 'Browse Generative Drops',
      description: 'You can browse through thousands of generative drops designed by other creators.'
    },
    {
      icon: uploadIcon,
      title: 'Get New Drops',
      description: 'Make sure your assets are in the same size and are in Png format.'
    },
    {
      icon: resellIcon,
      title: 'Resell on Marketplace',
      description: 'You can configure rarity and conflict rules as you want it to apply to a certain asset.'
    }
  ]
}