import './style.css'
import ConnectWallet from '../../components/ConnectWallet';
import { Services } from '../../model/ServicesModel'
function Landing() {

    return (
        <div className="landing-page">
            <ConnectWallet />
            {
                Services.map(service => {
                    return (
                        <div className="services" key={service.id}>
                            <h4>{service.category}</h4>
                            <img src={service.img} alt='' />
                            <ul className="service">
                                {
                                    service.titles.map((title, index) => {
                                        return (
                                            <li key={index}>{title}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Landing;