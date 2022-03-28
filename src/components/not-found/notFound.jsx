import icon from '../../assets/icon-not-found.svg';
import classes from './notFound.module.css';

const NotFound = () => {
  return (
    <div className={classes.container}>
      <img src={icon} alt="" />
      <h1>No results Found.</h1>
      <p>We can’t find any item matching  your search</p>
    </div>
  )
}

export default NotFound;