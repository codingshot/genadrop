import classes from './logo.module.css';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className={classes.container}>
      <Link to="/">
        <h1 className={classes.appname}>
          <div>gena</div>
          <div>DR</div>
          <div>OP.</div>
        </h1>
        <p>create, mint, resell</p>
      </Link>
    </div>
  )
}

export default Logo;