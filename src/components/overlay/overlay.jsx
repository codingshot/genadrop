import classes from './overlay.module.css';
import { GenContext } from "../../gen-state/gen.context";
import { useContext } from 'react';


const Overlay = () => {
  const { isLoading } = useContext(GenContext);
  
  return (
    <div className={`${classes.overlay} ${isLoading && classes.isLoading}`}>
      <i className="fas fa-spinner"></i>
    </div>
  )
}

export default Overlay;