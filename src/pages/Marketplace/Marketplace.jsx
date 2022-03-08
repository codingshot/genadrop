// import Academy from '../../components/Marketplace/Academy/Academy'
import Banner from '../../components/Marketplace/Banner/Banner'
// import Category from '../../components/Marketplace/Category/Category'
import Collections from '../../components/Marketplace/Collections/Collections'
import Demo from '../../components/Marketplace/Demo/Demo'
// import Demo2 from '../../components/Marketplace/Demo2/Demo2'
// import SingleNft from '../../components/SingleNft/SingleNft'
import Invite from '../../components/Marketplace/Invite/Invite'
import classes from './Marketplace.module.css'
import { useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { getPolygonNfts } from "../../utils/arc_ipfs";


const Marketplace = () => {
  const { account, connector } = useContext(GenContext);
  getPolygonNfts(connector).then((data) => {console.log('rp', data)})
  return (
    <div className={classes.container}>
      <Banner />
      <div className={classes.wrapper}>
        {/* <Category /> */}
        <Collections/>
        {/* <SingleNft/> */}
        <Demo/>
        {/* <Academy/> */}
        {/* <Demo2/> */}
        <Invite/>
      </div>
    </div>
  )
}

export default Marketplace