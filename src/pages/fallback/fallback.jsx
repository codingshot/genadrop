import classes from './fallback.module.css';

const Fallback = () => {
  return (
    <div className={classes.container}>
      <span>OOPS!</span> Page unavailable
    </div>
  )
}

export default Fallback;