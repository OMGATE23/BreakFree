// @ts-nocheck

import { useEffect, useState } from "react";
//import { gql } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import useTokenFetch from '../../utils/useTokenFetch'
import DisplayTimers from '../DisplayTimers';
import CreateTimerForm from '../CreateTimerForm';

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



const HomeLoggedIn = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [response, setResponse] = useState()
  const [token, setToken] = useState<null | string>(null)
  //const [createTimer , {createTimerData , createTimerError , createTimerLoading}] = useMutation(createTimerGqlQuery)

  if (user) {
    localStorage.setItem('sub', user?.sub)
  }

  

  async function getAccessToken() {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://grafbase.com',
        scope: "read:current_user",
      }
    })
    localStorage.setItem('token', JSON.stringify(accessToken))
    return accessToken;
  }


  async function setTimerFormHandler(e) {
    e.preventDefault()

    let formData = new FormData(e.target)
    console.log(formData.get('url'))
    console.log(user?.sub)
    let variableForCreateTimer = {
      TimerCreateInput: {
        url: formData.get('url'),
        sub: user?.sub,
        timer: {
          hours: Number(formData.get('hours')),
          minutes: Number(formData.get('minutes')),
          seconds: Number(formData.get('seconds')),
        }
      }
    }
    console.log(
      (variableForCreateTimer)
    )
    let token = await getAccessToken()
    console.log("timer set TOKEN", token)
    const res = await fetch("http://localhost:4000/graphql", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: createTimerGqlQuery,
        variables: {
          TimerCreateInput: {
            url: formData.get('url'),
            sub: user?.sub,
            timer: {
              hours: Number(formData.get('hours')),
              minutes: Number(formData.get('minutes')),
              seconds: Number(formData.get('seconds')),
            }
          }
        }
      })
    })
    //console.log("this failed!!")

    const data = await res.json();
    console.log(data)
    console.log(data?.data?.timerSearch?.edges)
    setResponse(data)
  }
  const websiteOptions = [
    'instagram.com',
    'linkedin.com',
    'facebook.com',
    'twitter.com',
    'youtube.com',
  ];

  useEffect(() => {
    async function getAccessToken() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://grafbase.com',
            scope: "read:current_user",
          }
        })
        localStorage.setItem('token', JSON.stringify(accessToken))
        setToken(accessToken)
      } catch (err) {
        console.log(err)
      }
    }
      getAccessToken()
  }, [])

  return (
    <div className='flex flex-col items-center gap-8 w-[100vw] min-h-[100vh] justify-center'>

      {token && (<div className='flex w-[90vw] gap-8 flex-col sm:flex-row mx-auto justify-center '>
      <CreateTimerForm token={token} />
      <DisplayTimers token = {token}/>
      </div>)}
    </div>
  )
}

export default HomeLoggedIn