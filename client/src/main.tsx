import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from "@apollo/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { SSELink, isLiveQuery } from '@grafbase/apollo-link'
import { getOperationAST } from "graphql";



const GRAFBASE_API_URL = "https://breakfree-omgate23.grafbase.app/graphql"

export const createApolloLink = () => {
  const JWT_TOKEN = (localStorage.getItem('token')!);
  const sseLink = new SSELink({
    uri: GRAFBASE_API_URL,
    headers: {
      authorization: `Bearer ${JWT_TOKEN}`
    }
  });

  const httpLink = new HttpLink({
    uri: GRAFBASE_API_URL,
    headers: {
      authorization: `Bearer ${JWT_TOKEN}`
    }
  });

  return split(
    ({ query, operationName, variables }) =>
      isLiveQuery(getOperationAST(query, operationName), variables),
    sseLink,
    httpLink
  );
}

const link = createApolloLink()

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link

});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-1pbxe73ku53gx4m7.us.auth0.com"
      clientId="gjHCuU281OYrmdakK17WGsF3188TL5yH"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience : 'https://grafbase.com',
        scope: "read:current_user update:current_user_metadata"
        
      }}
    >
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </Auth0Provider>
  </React.StrictMode>
);
