import '../Styles/NavBar.css'
import {IoCreate} from "react-icons/io5"
import {SiLeaflet} from "react-icons/si"
import {FaSearch}from "react-icons/fa"
import {Link} from 'react-router-dom'
function NavBar() {
    return (
      <div >
        <div className = 'nav'>
          <Link to = "/" style = {{textDecoration :'none'}}>
            <section className = 'title'>
            <h1 id = 'title-txt'>gena <br/>DR<br/>OP.
            </h1>
            <p>create, mint, resell</p>
            </section>
            </Link>
            <div className = 'icons'>
              <Link to = "/Create" style = {{textDecoration :'none'}}><IoCreate size = '9em' color = '#00CC9B'/>
                <h3>create</h3>
              </Link>  
              <Link to = "/Mint" style = {{textDecoration :'none'}}>
                <SiLeaflet size = '9em' color = '#00CC9B'/>
                <h3>mint</h3>
                </Link>
                <Link to = "/Explore" style = {{textDecoration :'none'}}>
                <FaSearch size = '9em' color = '#00CC9B'/>
                <h3>explore</h3>
                </Link>
            </div>
        </div>
      </div>
    );
  }
  
  export default NavBar;