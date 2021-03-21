import React from "react";
import { Link } from "react-router-dom";

import ScopeHistory from '../components/ScopeHistory';

export default function IndexPage() {
  return (
    <div>
      <div className="section container is-max-desktop">
        <h1 className="title is-size-2 is-italic"> Scopify is back!</h1>
        <p className=""> After a few long hours of downtime, the greatest tool on the internet is back! Scopify is new and improved.</p>
      </div>
      <div className="section box container is-max-desktop">
        <h2 className="title is-size-4 block">Get Started</h2>
    <p className="block">Got a task you{"'"}d like to scope? Create a new scoping session</p>
        <Link className="block button is-success" to="/new-scope">Scope Something!</Link>
      </div>
      <div className="section container is-max-desktop">
        <ScopeHistory />
      </div>
    </div>
  );
}
