import axios from 'axios';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { GenContext } from '../../../gen-state/gen.context';
import { getAlgoData } from '../../utils/arc_ipfs';
import classes from './styles.module.css';
import { useHistory } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Collections = () => {

  const [state, setState] = useState({
    viewAll: false,
    allCollections: null
  })
  const { collections } = useContext(GenContext)

  const { viewAll, allCollections } = state

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const history = useHistory();

  useEffect(() => {

    const getCollections = async collections => {
      let collectionArr = []
      for (let i = 0; i < collections.length; i++) {
        try {
          let collectionObj = {}
          collectionObj.name = collections[i].name
          collectionObj.price = collections[i].price
          collectionObj.owner = collections[i].owner
          collectionObj.description = ''
          let { data } = await axios.get(collections[i]['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
          collectionObj.number_of_nfts = data.length
          let { params } = await getAlgoData(data[0])
          let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
          collectionObj.image = response.data.properties.file_url
          collectionArr.push(collectionObj)
        } catch (error) {
          console.error('|=> --- error --- <=|', error);
        }
      }
      return collectionArr
    }

    if (Object.keys(collections).length) {
      (async function getResult() {
        let result = await getCollections(collections.allCollections)
        handleSetState({
          allCollections: result
        })
      }())
    }
  }, [collections])


  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Top Collections</h3>
        <button onClick={() => handleSetState({ viewAll: !viewAll })}>
          view all {
            viewAll
              ? <img src="/assets/icon-chevron-up.svg" alt="" />
              : <img src="/assets/icon-chevron-down.svg" alt="" />
          }
        </button>
      </div>

      <div className={classes.wrapper}>
        {
          allCollections ? allCollections
            .filter((_, idx) => viewAll ? true : 10 > idx)
            .map(({ name, price, description, owner, number_of_nfts, image }, idx) => (
              <div onClick={() => history.push(`/marketplace/${name}`)} key={idx} className={classes.card}>
                <div style={{ backgroundImage: `url(${image})` }} className={classes.imgContainer}></div>
                <div className={classes.cardBody}>
                  <img className={classes.thumbnail} src={image} alt="" />
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <div className={classes.info}>
                    <div className={classes.nfts}>
                      <span className={classes.dot}></span>
                      <span>{number_of_nfts} NFTs</span>
                    </div>
                    <div className={classes.price}>
                      Floor: {price} ALGO
                    </div>
                  </div>
                </div>
              </div>
            ))
            :
            (Array(6).fill(null)).map((_, idx) => (
              <div key={idx}>
                <Skeleton count={1} height={200} />
                <Skeleton count={3} height={40} />
              </div>
            ))
        }
      </div>

    </div>
  )
}

export default Collections