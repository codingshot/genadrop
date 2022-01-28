import React from 'react';
import Banner from '../../components/Home/Banner/Banner';
import Features from '../../components/Home/Features/Features';
import Review from '../../components/Home/Review/Review';
import FAQ from '../../components/Home/FAQ/FAQ';
import Orgs from '../../components/Home/Orgs/Orgs';
import classes from './home.module.css';

const creators = {
  heading: 'Genadrop for',
  headingAccent: 'Creators',
  description: 'Bring your NFTs to life via a simple interface, upload each assets and have genaDrop create your generative collection effortlessly.',
  image: '/assets/creators-image.png',
  feature: [
    {
      icon: '/assets/create-icon.svg',
      title: 'Create Layers',
      description: 'You can create your layers and name them according to assets you want to upload'
    },
    {
      icon: '/assets/upload-icon2.svg',
      title: 'Upload Assests',
      description: 'Make sure your assets are in the same size and are in Png format.'
    },
    {
      icon: '/assets/set-rules-icon.svg',
      title: 'Set Rarity and Conflict Rules',
      description: 'You can configure rarity and conflict rules as you want it to apply to a certain asset.'
    },
    {
      icon: '/assets/download-mint-autolist-icon.svg',
      title: 'Download, Mint and Auto List',
      description: 'You can configure rarity and conflict rules as you want it to apply to a certain asset.'
    }
  ]
}

const Collectors = {
  heading: 'Genadrop for',
  headingAccent: 'Collectors',
  description: 'Bring your NFTs to life via a simple interface, collectors trust GenaDrop marketplace to be the home of excellent NFTs with. ',
  image: '/assets/collectors-image.png',
  feature: [
    {
      icon: '/assets/create-icon.svg',
      title: 'Browse Generative Drops',
      description: 'You can browse through thousands of generative drops designed by other creators.'
    },
    {
      icon: '/assets/upload-icon2.svg',
      title: 'Get New Drops',
      description: 'Make sure your assets are in the same size and are in Png format.'
    },
    {
      icon: '/assets/resell-icon.svg',
      title: 'Resell on Marketplace',
      description: 'You can configure rarity and conflict rules as you want it to apply to a certain asset.'
    }
  ]
}

const Home = () => {
  return (
    <div className={classes.container}>
      <Banner />
      <Orgs />
      <Features data={creators} />
      <Features data={Collectors} />
      <Review/>
      <FAQ/>
    </div>
  )
}

export default Home;