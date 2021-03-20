import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// TODO: Add react-router here!

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <div> Index</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
