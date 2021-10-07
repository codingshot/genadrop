import React, { Component } from "react";
import NavBar from "./NavBar";
import "../Styles/Create.css";
import axios from "axios";
import { connect } from "react-redux";
import {
  getBackground,
  getHead,
  getOutfit,
} from "../Redux/Reducers/pngReducer";

class Create extends Component {
  constructor() {
    super();
    this.state = {
      background: [],
    };
  }
  componentDidMount() {
    
    this.props.getBackground();
    this.props.getHead();
    this.props.getOutfit();
    

    console.log(this.props.background);
  }
  getDiv(){
    let backid = document.getElementById('1')
    // this.setState({png:backid})
    console.log(backid)
  }
 
  
  render() {
  
    return (
      <div className="create">
        <NavBar />
        <div className="create-container">
          <div className="name-container">
            <p>Colletion Name</p>
            <div className="layerOrder-container">
              <p>Layer Orders</p>
            </div>
          </div>
          <div className="layers">
            <h1>background</h1>
            <div className="back">
              <div className = 'map'>{this.props.background.map((back)=> {return(
                <div   className = 'background-container' onClick = {this.getDiv}>
                  <img id = {back.id} className = 'background-img' src = {back.png}/>
                  <p>{back.name}</p>
                  </div>
              )})}</div>
            </div>
            <h1>Head</h1>
            <div className="head">  <div className = 'map'>{this.props.head.map((head)=> {return(
                <div className = 'background-container'>
                  <img className = 'head-img' src = {head.png}/>
                  <p id = 'p-'>{head.name}</p>
                  </div>
              )})}</div></div>
              <h1>Outfit</h1>
            <div className="body">  <div className = 'map'>{this.props.outfit.map((outfit)=> {return(
                <div className = 'background-container'>
                  <img className = 'head-img' src = {outfit.png}/>
                  <p id ='p-'>{outfit.name}</p>
                  </div>
              )})}</div></div>
          </div>
          <section className="nft-container">
            <div className="connect">
              <h1>connect wallet</h1>
            </div>
            {/* <div className="nft"><img src = {this.state.background}></img></div> */}
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => {
  return {
    background: reduxState.pngReducer.background,
    head:reduxState.pngReducer.head,
    outfit:reduxState.pngReducer.outfit
  };
};
export default connect(mapStateToProps, {
  getBackground,
  getHead,
  getOutfit,
})(Create);
