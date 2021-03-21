import React from "react";

import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link className="navbar-item " to="/">
          <button className="button ">
            <span className="icon">
              <i className="fas fa-home" />{" "}
            </span>
          </button>
        </Link>
        <Link className="navbar-item" to="/new-scope">
          <button className="button is-outlined">Scope Something!</button>
        </Link>
      </div>
    </nav>
  );
}
