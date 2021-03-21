import React, { FormEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";
import { addHistoryItem } from "../scope_history";
import classnames from "classnames";

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

    createSessionMutation()
      .then((data) => {
        // TODO: Write the id into localStorage so we keep it for later
        const {
          data: {
            createSession: { id },
          },
        } = data as { data: { createSession: { id: string } } };
        addHistoryItem(id);
      })
      .catch((error) => console.log({ error }));
  };

  if (loading) return <div>Loading...</div>;
  if (data) return <Redirect to={`/scope/${data.createSession.id}`} />;

  return (
    <div className="my-4">
      <div className="container box is-max-desktop">
        <h1 className="title is-size-2">Scope your heart out!</h1>
        <div>
          <form onSubmit={submitSession}>
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input
                  className="input"
                  id="newScopeTitle"
                  placeholder="Use a short, descriptive name to title this scoping session"
                  onChange={(ev) => setTitle(ev.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <div className="label">
                <label>Description</label>
              </div>
              <div className="control">
                <input
                  className="input"
                  id="newScopeDescription"
                  placeholder="Give your underlings a little bit more detail about the task"
                  onChange={(ev) => setDescription(ev.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <input
                  className={classnames("button", { "is-loading": loading })}
                  type="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
