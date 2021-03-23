import React from "react";

import { gql, useQuery } from "@apollo/client";
import Skeleton from "react-skeleton-loader";
import { Link } from 'react-router-dom';

const GET_SCOPE_DETAILS_QUERY = gql`
  query GetScopeSummary($id: String!) {
    session(id: $id) {
      __typename
      id
      state
      scores {
        name
        value
      }
    }
  }
`;

interface IScopeSummary {
  id: string;
  state: string;
  scores: Array<{ name: string; value: number }>;
}

const ScopingInProgress = () => (
  <div className="notification is-info has-text-centered">
    <h1 className="title is-size-3">Scoping in Progress</h1>
  </div>
);

const ScoresList = ({
  scores,
}: {
  scores: Array<{ name: string; value: number }>;
}) => {
  return (
    <>
      {scores.map((it) => (
        <p className="tag is-medium">
          <strong>{it.name}</strong>: {it.value}
        </p>
      ))}
    </>
  );
};

const StatsBlock = ({scores: _scores} : { scores: Array<{ name: string; value: number }>; }) => {
  return (
    <div className="column is-4 ">
      <h3 className="title is-size-4 has-text-grey">Stats
      <p className="tag ml-2 ">Coming soon!</p></h3>
    </div>
  );
};

export default function SessionSummary({ id }: { id: string }) {
  const { error, loading, data } = useQuery<{ session: IScopeSummary }>(
    GET_SCOPE_DETAILS_QUERY,
    { variables: { id } }
  );

  if (error)
    return <div className="notification is-danger">{error.message}</div>;

  if (loading)
    return (
      <div className="notification is-info has-text-centered">
        <h1 className="title is-size-3">
          <Skeleton width="600px" widthRandomness={0.5} />
        </h1>
      </div>
    );

  if (data?.session.state === "Complete") {
    return (
      <>
        <div className="block card">
          <div className="card-content">
            <div className="columns">
              <div className="column tags">
                <h2 className="block title is-size-3">Scoping Complete!</h2>
                <p className="block">Here's what everyone has voted:</p>
                <ScoresList scores={data.session.scores} />
              </div>
              <StatsBlock scores={data.session.scores} />
            </div>
          </div>
        </div>
        <div className="block card">
          <div className="card-content">
            <h2 className="block title is-size-4">Had a good scope?</h2>
            <p className="block"> Why not scope again? It's free. </p>
            <Link to={"/new-scope"} className="block button is-success">Scope Again!</Link>
          </div>
        </div>
      </>
    );
  } else {
    return <ScopingInProgress />;
  }
}
