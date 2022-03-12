import classes from './styles.module.css';
import data from './Data.json';

const getBgImage = image => ({
  backgroundImage: `url(${image})`
})

const Category = () => {
  return (
    <div className={classes.container}>
      <h3 className={classes.heading}>Browse by Category</h3>
      <div className={classes.wrapper}>
        {
          data.map((d, idx)=> (
            <div key={idx} style={getBgImage(d.image)} className={classes.card}>
              <span>{d.name}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Category