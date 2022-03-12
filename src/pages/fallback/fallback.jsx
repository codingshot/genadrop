import classes from './fallback.module.css';

const Fallback = () => {
  return (
    <div className={classes.container}>
      <span>OOPS!</span> Page not available
    </div>
  )
}

export default Fallback;