import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";

import Landing from './pages/landing/Landing'
import Create from './pages/create/Create'
import Mint from './pages/mint/Mint'
import Explore from './pages/explore/Explore';
import Navigation from './components/Navigation'

function Router() {
    return (
        <BrowserRouter>

            <Navigation />

            <Switch>
                <Route path="/create">
                    <Create />
                </Route>
                <Route path="/mint">
                    <Mint />
                </Route>
                <Route path="/explore">
                    <Explore />
                </Route>
                <Route path="/">
                    <Landing />
                </Route>
            </Switch>

        </BrowserRouter>
    )
}

export default Router;