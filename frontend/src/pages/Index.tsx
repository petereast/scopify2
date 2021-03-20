import React from "react";
import {Link} from 'react-router-dom';

export default function IndexPage() {
  return (
    <div>
      <h1> Scopify is back!</h1>
      <p> Some details </p>
      <div>
        <h2>Get Started</h2>
        <Link to="/new-scope">Scope Something!</Link>
      </div>
    </div>
  );
}
