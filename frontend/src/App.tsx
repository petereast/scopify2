import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NavBar from "./components/NavBar";

import Index from "./pages/Index";
import NewScopePage from "./pages/NewScope";
import ViewScope from "./pages/ViewScope";

// TODO: Add react-router here!

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/scope/:id">
          <ViewScope />
        </Route>
        <Route path="/new-scope">
          <NewScopePage />
        </Route>
        <Route path="/">
          <Index />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
