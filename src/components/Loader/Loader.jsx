
import { useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import classes from './Loader.module.css';

const Loader = () => {
  const { loaderMessage } = useContext(GenContext)
  return (
    <div className={`${classes.container} ${loaderMessage && classes.active}`}>
      <img className={classes.icon} src="/assets/icon-loading-dark.svg" alt="" />
      <div>{loaderMessage}</div>
    </div>
  )
}

export default Loader;