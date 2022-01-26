import Academy from '../../components/Marketplace/Academy/Academy'
import Banner from '../../components/Marketplace/Banner/Banner'
// import Category from '../../components/Marketplace/Category/Category'
import Collections from '../../components/Marketplace/Collections/Collections'
import Demo from '../../components/Marketplace/Demo/Demo'
import Demo2 from '../../components/Marketplace/Demo2/Demo2'
import Explore from '../../components/Marketplace/Explore/Explore'
import Invite from '../../components/Marketplace/Invite/Invite'
import classes from './styles.module.css'

const Marketplace = () => {
  return (
    <div className={classes.container}>
      <Banner />
      <div className={classes.wrapper}>
        {/* <Category /> */}
        <Collections/>
        <Explore/>
        <Demo/>
        <Academy/>
        <Demo2/>
        <Invite/>
      </div>
    </div>
  )
}

export default Marketplace