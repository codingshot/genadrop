import { useParams } from 'react-router-dom';
import Explore from '../../components/Marketplace/Explore/Explore';

const Collection = () => {
  const {collectionName} = useParams();
  return (
    <div>
      <Explore collectionName={collectionName}/>
    </div>
  )
}

export default Collection;