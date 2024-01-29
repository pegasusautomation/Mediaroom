import React from "react";
import { Route, Switch , Redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Certtable from "./certtable.js";
import "./Table.css"
import Servertable from "./manageserver/servertable.js";
import Layout from "./components/Layout/Layout.js";
import Topbar from "./pages/topbar.jsx";

    const Routes = () => {
    return (
        <Layout>
            <Route>
            <Topbar />
        </Route>
        <Switch>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route exact path="/servers">
                <Servertable/>
            </Route>
            <Route exact path="/certificates">
            <div className="center">
                <Certtable/>
            </div>
            </Route>
        </Switch> 
        </Layout>
    );
};

export default Routes;
