import classes from './layer.module.css';

const Layer = ({ name, trait, click }) => {
  return (
    <li className={classes.item}>
      <div className={classes._name}>
        <div className={classes.line}>
          <i className="fas fa-arrows-alt-v"></i>
        </div>
        <div onClick={click} className={classes.icon}>
          <i className="far fa-trash-alt"></i>
        </div>
        <p className={classes.name}>{name}</p>
      </div>
      <div className={classes.trait}>{trait}</div>
    </li>
  )
}

export default Layer;