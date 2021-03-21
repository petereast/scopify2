import React from "react";

import { useParams } from "react-router-dom";
import ScopeView from "../components/ShowScope";
import SubmitScore from "../components/SubmitScore";

export default function ShowScope() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mt-4">
      <div className="block container is-max-desktop">
        <ScopeView scopeId={id} />
      </div>
      <div className="block container is-max-desktop has-text-centered notification is-info">
        <h1 className="title is-size-3">Scoping in Progress...</h1>
      </div>
      <div className="block container is-max-desktop">
        <SubmitScore />
      </div>
    </div>
  );
}
