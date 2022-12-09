import React from "react";

import { gql, useMutation, useQuery } from "@apollo/client";
import classnames from "classnames";
import Skeleton from "react-skeleton-loader";

const GET_SCOPE_QUERY = gql`
  query GetSession($id: String!) {
    session(id: $id) {
      id
      title
      description
      averageScore
      state
      scores {
        name
        value
      }
    }
  }
`;

const END_SCOPE_MUTATION = gql`
  mutation EndScope($id: String!) {
    finishSession(sessionId: $id) {
      id
      state
    }
  }
`;

interface IScopeSession {
  id: string;
  title: string;
  description: string;
  averageScore: number;
  state: string;
  scores: Array<{ name: string; value: number }>;
}

const ScopingCard = ({
  session,
  loading,
  endScopeMutation,
}: {
  session?: IScopeSession;
  loading: boolean;
  endScopeMutation: () => void;
}) => {
  const shouldShowScores = !loading && session?.state === "Complete";
  return (
  <div className="card">
    <div className="card-content">
      <div className="columns">
        <div className="column is-three-quarters">
          <h1 className="block title is-size-4">
            {loading ? (
              <Skeleton width="300px" />
            ) : (
              <span>{session?.title}</span>
            )}
            {session?.state && (
              <span className="ml-2 tag">{session?.state}</span>
            )}
          </h1>
          <p className="block ">
            {loading ? (
              <Skeleton count={3} width="400px" widthRandomness={0.3} />
            ) : (
              <span>{session?.description}</span>
            )}
          </p>
        </div>
        <div
          className={classnames("column", "notification", "level", {
            "is-success": session?.state === "InProgress",
            "is-dark": session?.state === "Complete",
          })}
        >
          <div className="level-item ">
            <div className="container">
              <h1 className="title is-size-2">
                {shouldShowScores ? <>{session?.averageScore}</> : null}
              </h1>
              <div className="">Average Score</div>
              <h1 className="title is-size-3">
                {!loading ? <>{session?.scores.length}</> : null}
              </h1>
              <div className="">
                Total Response{session?.scores.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer className="card-footer">
      <button
        onClick={() => endScopeMutation()}
        className={classnames("button card-footer-item is-danger is-inverted", {
          "is-loading": loading,
        })}
        disabled={session?.state === "Complete"}
      >
        End Session
      </button>
    </footer>
  </div>
)};

export default function ShowScopeSession({
  scopeId,
}: {
  scopeId: String;
  hideScore?: boolean;
}) {
  const { error, loading: getLoading, data } = useQuery(
    GET_SCOPE_QUERY,
    {
      variables: { id: scopeId },
      pollInterval: 1000,
    }
  );

  const [
    endScopeMutation,
    { loading: endLoading, error: endError },
  ] = useMutation(END_SCOPE_MUTATION, { variables: { id: scopeId } });

  // Poll for new updates (gross, but ok for now)
  // This also keeps the record alive in redis
  
  const loading = getLoading || endLoading;

  if (endError) return <div>Failed to end scope: {endError.message}</div>;
  if (error) return <div>{error.message}</div>;

  if (loading || data?.session) {
    const session: IScopeSession = data?.session;

    return (
      <ScopingCard
        session={session}
        loading={loading}
        endScopeMutation={endScopeMutation}
      />
    );
  } else {
    return <div>Session not found</div>;
  }
}
