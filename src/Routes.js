import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Table from "./Table";
import "./Table.css"
import Servertable from "./manageserver/servertable.js";

    const Routes = () => {
    return (
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
    );
};

export default Routes;
