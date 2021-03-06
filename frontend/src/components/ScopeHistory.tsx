import React from "react";

import { getHistory, removeId } from "../scope_history";
import { Link } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import Skeleton from "react-skeleton-loader";
import dayjs  from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

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
    pollInterval: 1000,
    variables: { id },
  });

  if (error) return <div>{error.message}</div>;

  if (!loading && data.session === null) {
    removeId(id);
    return null;
  } else {
    return (
      <Link to={`/scope/${id}`} className="box">
        <div className="columns level ">
          <div className="column is-two-thirds is-size-5">
            {loading ? <Skeleton /> : data?.session.title}
            <div className="header is-size-7">{dayjs(timestamp).fromNow()}</div>
          </div>
          <div className="column ">
            Average Score: {data?.session.averageScore}{" "}
          </div>
          <div className="column is-1 tag">{data?.session.state}</div>
        </div>
      </Link >
    );
  }
};
export default function ScopeHistory() {
  const scope_history = getHistory();


  scope_history.sort((a, b) => {
    return b.timestamp.getTime() - a.timestamp.getTime()
  })

  const history_list = scope_history
    .map(({ id, timestamp }) => (
      <ScopeHistoryItem id={id} timestamp={timestamp} />
    ));

  return (
    <div>
      <h2 className="title is-size-4">
        Recent Scopes<span className="ml-2 tag">{scope_history.length}</span>{" "}
      </h2>
      {history_list}
      {!history_list.length && (
        <p>
          Scopes you create will appear here. Scopes will expire 10 minutes
          after you stop looking at them.
        </p>
      )}
    </div>
  );
}
