import React, { FormEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import classnames from "classnames";

const SUBMIT_SCOPE_SCORE = gql`
  mutation SubmitScore($id: String!, $score: Int!, $name: String!){
    submitScore(sessionId: $id, score: $score, name: $name) {
      __typename
      id
      averageScore
      scores {
        name
        score
      }
    }
  }
`;

export default function SubmitScore({ id }: { id: string }) {
  const [userName, setUserName] = useState(
    localStorage.getItem("users_name") || ""
  );
  const [score, setScore] = useState(0);

  const [submitted, setSubmitted] = useState(false);

  const [submitScopeScore, { error, loading }] = useMutation(
    SUBMIT_SCOPE_SCORE,
    {
      variables: {
        id,
        name: userName,
        score: score,
      },
    }
  );

  const formSubmission = (ev: FormEvent) => {
    ev.preventDefault();
    submitScopeScore().then(() => setSubmitted(true));
  };

  const radioButton = (value: string | number) => (
    <label className="radio notification" key={value}>
      <input
        className="radio"
        type="radio"
        name="something"
        onClick={() => setScore(parseInt(value.toString()))}
      />
      <span className="ml-2 is-size-4">{value}</span>
    </label>
  );

  if (error) return <div>{error.message}</div>;

  if (!submitted) {
    return (
      <div className="card">
        <div className="card-content">
          <h2 className="block title is-size-4"> Submit a score</h2>
          <p className="block">
            Please give an indication how how hard you think this is
          </p>
          <form className="block" onSubmit={formSubmission}>
            <div className="block field">
              <label className="label">My name is...</label>
              <div className="control">
                <input
                  id="yourName"
                  placeholder="Hi, my name is ______"
                  className="input"
                  value={userName}
                  onChange={(ev) => setUserName(ev.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 block field">
              <label className="label">And I think this task is worth...</label>
              <div className="control">
                {[1, 2, 3, 5, 8, 13].map(radioButton)}
              </div>
            </div>
            <div className="block field">
              <div className="control">
                <button
                  type="submit"
                  className={classnames("button is-success", {
                    "is-loading": loading,
                  })}
                >
                  Scope it!
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
