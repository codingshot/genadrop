
import './style.css'
import ConnectWallet from '../../components/ConnectWallet';
import FeatureCommingSoon from '../../components/FeatureCommingSoon';

function Explore() {
    return (
        <div className='explore-page'>
            <ConnectWallet />
            <FeatureCommingSoon />
        </div>
    )
}

export default Explore;