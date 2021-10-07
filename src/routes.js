import React from 'react'
import {Switch,Route} from "react-router-dom"
import LandingPage from './components/LandingPage'
import Create from './components/Create'
import Mint from './components/Mint'
import Explore from './components/Explore'





export default (
    <Switch>
        <Route path = "/Create" component ={Create}/>
        <Route path = "/Mint" component ={Mint}/>
        <Route path = "/Explore" component ={Explore}/>

        <Route exact path = "/" component ={LandingPage}/>
    </Switch>
)