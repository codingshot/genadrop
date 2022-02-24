import { useParams } from 'react-router-dom';
import Explore from '../../components/Marketplace/Explore/Explore';

const Collection = () => {
  const { collectionName } = useParams();
  return (
    <Explore collectionName={collectionName} />
  )
}

export default Collection;