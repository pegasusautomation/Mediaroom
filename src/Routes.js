import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Table from "./Table";
import "./Table.css"
import Servertable from "./manageserver/servertable.js";
import Layout from "./components/Layout/Layout.js";

    const Routes = () => {
    return (
        <Layout>
        <Switch>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route exact path="/servers">
                <Servertable/>
            </Route>
            <Route exact path="/certificates">
            <div className="center">
                <Table/>
            </div>
            </Route>
        </Switch>
        </Layout>
    );
};

export default Routes;
