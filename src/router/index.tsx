import React from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import { localRoutes } from "./data/";
import { loadRouter } from "./loaderRoutes";

export default function RouterLoader() {
  return (
    // <LoadingView>
    <Router>
      <Switch>
        {/* <Route
          exact
          path="/"
          render={() => <Redirect to="/admin"></Redirect>}
        ></Route>
        <Route path="/login" exact component={Login}></Route>

        <Route path="/admin">
          <LayoutMain>
            <LoadingView>
              <Switch> {loadRouter(authRoutes)}</Switch>
            </LoadingView>
          </LayoutMain>
        </Route>

        <Route path="*" component={NoFount}></Route> */}

        {loadRouter(localRoutes)}
      </Switch>
    </Router>
    // </LoadingView>
  );
}
