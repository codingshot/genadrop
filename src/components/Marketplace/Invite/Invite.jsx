import classes from './styles.module.css';

const Invite = () => {
  return (
    <div className={classes.container}>
      <h3>Let us send you offering</h3>
      <div>
        <input type="email" />
        <button>subscribe</button>
      </div>
    </div>
  )
}

export default Invite