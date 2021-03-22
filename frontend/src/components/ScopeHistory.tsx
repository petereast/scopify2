import React from "react";

import { getHistory, removeId } from "../scope_history";
import { gql, useQuery } from "@apollo/client";

// const existing_history = JSON.parse(localStorage.getItem("scope_history") || "[]");
//

const SCOPE_SUMMARY_QUERY = gql`
  query ScopeSummary($id: String!) {
    session(id: $id) {
      __typename
      id
      title
      state
      averageScore
    }
  }
`;

const ScopeHistoryItem = ({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) => {
  const { error, loading, data } = useQuery(SCOPE_SUMMARY_QUERY, {
    variables: { id },
  });

  if (error) return <div>{error.message}</div>;
  if (loading) return <div>Loading</div>;

  if (data.session === null) {
    removeId(id);
    return null;
  } else {
    return (
      <a href={`/scope/${id}`} className="block card">
        <div className="card-content columns level ">
          <div className="column is-two-thirds is-size-5">{data.session.title}</div>
          <div className="column ">{data.session.averageScore} </div>
          <div className="column is-1 tag">{data.session.state}</div>
        </div>
      </a>
    );
  }
};
export default function ScopeHistory() {
  const scope_history = getHistory();

  const history_list = scope_history
    .sort((a, b) => b.timestamp.getDate() - a.timestamp.getDate())
    .map(({id, timestamp}) => (<ScopeHistoryItem id={id} timestamp={timestamp} />));

  return (
    <div>
      <h2 className="title is-size-4">
        Recent Scopes<span className="ml-2 tag">{scope_history.length}</span>{" "}
      </h2>
      {history_list}
    </div>
  );
}
