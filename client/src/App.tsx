// @ts-nocheck

import './App.css'
import AllRoutes from './routes'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from "@apollo/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { SSELink, isLiveQuery } from '@grafbase/apollo-link'
import { getOperationAST } from "graphql";
import { createContext, useEffect, useState } from 'react';
import {setContext} from '@apollo/client/link/context'


const GRAFBASE_API_URL = "http://localhost:4000/graphql"
const JWT_TOKEN = ""

export const createApolloLink = (JWT_TOKEN: string) => {
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

const authLink = setContext ((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});



function App() {
  const {getAccessTokenSilently} = useAuth0()
  async function getAccessToken() {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://grafbase.com',
        scope: "read:current_user",
      }
    })
    localStorage.setItem('token' , accessToken)
    return accessToken;
  }
  //let token = await getAccessToken()
  useEffect( () => {
    
  }, [])
  const link = createApolloLink(localStorage.getItem('token') + "")

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link

});

const [allTimers , setAllTimers] = useState([])
const TimerDataContext = createContext(null)
  return (
    <ApolloProvider client={client}>
      <TimerDataContext.Provider value={{allTimers , setAllTimers}}>
        <div className='font-poppins'>
        <AllRoutes/>
        </div>
      </TimerDataContext.Provider>
      
    </ApolloProvider>
  )
}

export default App
