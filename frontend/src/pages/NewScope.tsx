import React, { ChangeEvent, FormEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Redirect } from 'react-router-dom';

const CREATE_SCOPE_MUTATION = gql`
  mutation CreateScope($title: String!, $description: String!) {
    createSession(title: $title, description: $description) {
      id
    }
  }
`;

export default function NewScopePage() {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const [createSessionMutation, { loading, data }] = useMutation(
    CREATE_SCOPE_MUTATION,
    {
      variables: { description, title },
    }
  );
  const submitSession = (ev: FormEvent) => {
    ev.preventDefault();

    createSessionMutation().then(() => {
      // Change the view to show the scope
      console.log("ok")
    });

    // TODO: Do the actual submission
  };

  if (loading) return <div>Loading...</div>
  if (data) return <Redirect to={`/scope/${data.createSession.id}`} />

  return (
    <div>
      NewScopePage
      <div>
        <form onSubmit={submitSession}>
          <div>
            <label>
              {" "}
              Title:
              <input
                id="newScopeTitle"
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <input
                id="newScopeDescription"
                onChange={(ev) => setDescription(ev.target.value)}
              />
            </label>
          </div>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}
