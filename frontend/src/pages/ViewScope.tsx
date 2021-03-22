import React from "react";

import { useParams } from "react-router-dom";
import ScopeView from "../components/ShowScope";
import SubmitScore from "../components/SubmitScore";
import SessionSummary from "../components/SessionSummary";

export default function ShowScope() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mt-4">
      <div className="block container is-max-desktop">
        <ScopeView scopeId={id} />
      </div>
      <div className="block container is-max-desktop">
        <SessionSummary id={id} />
      </div>
      <div className="block container is-max-desktop">
        <SubmitScore id={id} />
      </div>
    </div>
  );
}
