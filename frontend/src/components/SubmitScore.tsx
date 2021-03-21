import React from "react";

export default function SubmitScore() {
  const radioButton = (value: string | number) => (
              <label className="radio notification" key={value}>
                <input className="radio" type="radio" name="something"/>
                <span className="ml-2 is-size-4">{value}</span>
              </label>)
  return (
    <div className="card">
      <div className="card-content">
        <h2 className="block title is-size-4"> Submit a score</h2>
        <p className="block">
          Please give an indication how how hard you think this is
        </p>
        <form className="block">
          <div className="block field">
            <label className="label">My name is...</label>
            <div className="control">
              <input
                id="yourName"
                placeholder="Hi, my name is ______"
                className="input"
              />
            </div>
          </div>
          <div className="mt-5 block field">
            <label className="label">And I think this task is worth...</label>
            <div className="control">
              {[1,2,3,5,8,13].map(radioButton)}
            </div>
          </div>
          <div className="block field">
            <div className="control">
              <button type="submit" className="button is-success">Scope it!</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
