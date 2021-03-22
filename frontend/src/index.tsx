import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
  InMemoryCache,
} from "@apollo/client";

const backend_url =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8004/graphql";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      ScopeSession: {
        keyFields: ["id"],
      },
    },
  }),
  uri: backend_url,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
