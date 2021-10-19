
import './style.css'
import ConnectWallet from '../../components/ConnectWallet';
import FeatureCommingSoon from '../../components/FeatureCommingSoon';

function Mint() {
    return (
        <div className='mint-page'>
            <ConnectWallet />
            <FeatureCommingSoon />
        </div>
    )
}

export default Mint;