//import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
//import { gql } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import HomeLoggedIn from "../../components/HomeLoggedIn";
import HomeNotLoggedIn from "../../components/HomeNotLoggedIn";
import './landingpage.css'

const GET_ALL_USERS = `
  query UserCollection {
  userCollection(first : 10){
    edges {
      node {
        email
        password
      }
    }
  }
}
`;
const getTimers = `
query TimerSearch($sub : String!) {
  timerSearch(filter: {sub : {eq : $sub}} , first: 50 ){
    edges {
      node {
        sub
        url
        id
        timer {
          hours
          minutes
          seconds
        }
      }
    }
  }
}
`
const createTimerGqlQuery = `
  mutation TimerCreate($TimerCreateInput : TimerCreateInput!) {
  timerCreate(input: $TimerCreateInput){
    timer {
      sub
      id
      url
      timer {
        hours
        minutes
        seconds
      }
    }
  }
}
`

export default function LandingPage() {
  const {isAuthenticated , isLoading} = useAuth0()

  if(isLoading){
    return <div className="flex w-[100vw] h-[100vh] flex-col justify-center items-center gap-8">

      <img className="w-[200px] plant" src="./assets/plant.png" />
      <p className="text-3xl text-green-600">Hang in there!</p>
    </div>
  }

  return (
    <div>
      <Header />

      {
        isAuthenticated && (
          <div>
            
            <HomeLoggedIn />
          </div>
        )
      }
      {
        !isAuthenticated && (
          <HomeNotLoggedIn />
        )
      }
    </div>
  );
}
