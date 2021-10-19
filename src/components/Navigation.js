import { Link } from "react-router-dom";
import Logo from '../assets/logo.svg'
import CreateIcon from '../assets/create.png'
import MintIcon from '../assets/mint.PNG'
import ExploreIcon from '../assets/explore.PNG'

function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">
                        <img src={Logo} alt="genaDrop." className="logo" />
                    </Link>
                </li>
                <li>
                    <Link to="/create">
                        <img src={CreateIcon} alt='create' />
                        <span>create</span>
                    </Link>
                </li>
                <li>
                    <Link to="/mint">
                        <img src={MintIcon} alt='create' />
                        <span>Mint</span>
                    </Link>
                </li>
                <li>
                    <Link to="/explore">
                        <img src={ExploreIcon} alt='create' />
                        <span>Explore</span>
                    </Link>
                </li>

            </ul>
        </nav>
    )
}

export default Navigation;