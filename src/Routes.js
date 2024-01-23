import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Table from "./Table";
import "./Table.css"

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route exact path="/servers">
                <h1>Servers Page</h1>
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
