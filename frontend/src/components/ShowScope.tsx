import React from "react";

import { gql, useQuery } from "@apollo/client";

const GET_SCOPE_QUERY = gql`
query GetSession($id: String!) {
  session(id: $id) {
    id,
    title,
    description,
    averageScore,
  }
}
`;

interface IScopeSession {
  id: string;
  title: string;
  description: string;
  averageScore: number;
}

export default function ShowScopeSession({ scopeId }: { scopeId: String }) {
  const { error, loading, data } = useQuery(GET_SCOPE_QUERY, {
    variables: { id: scopeId },
  });

  if (error) return <div>{error.message}</div>;
  if (loading) return <div>Loading...</div>;

  if (data.session)  {

  const session: IScopeSession = data.session;

  return (
    <div>
      Scoping Session
      <h1>{session.title}</h1>
      <div>{session.description}</div>
      <div>{session.averageScore}</div>
    </div>
  );
  } else {
    return (
      <div>Session not found</div>
    )
  }
}
