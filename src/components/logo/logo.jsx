import classes from './logo.module.css';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className={classes.container}>
      <Link to="/">
        <img className={classes.logo} src="./logo.PNG" alt="" />
      </Link>
    </div>
  )
}

export default Logo;