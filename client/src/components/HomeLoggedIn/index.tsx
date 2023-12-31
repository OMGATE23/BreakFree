// @ts-nocheck

import { useEffect, useState } from "react";
//import { gql } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import useTokenFetch from '../../utils/useTokenFetch'
import DisplayTimers from '../DisplayTimers';
import CreateTimerForm from '../CreateTimerForm';
import { API_URL } from "../../constants";

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
  const [response, setResponse] = useState();
  const [refresh, setRefresh] = useState(false);
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
    let token = await getAccessToken()
    const res = await fetch(API_URL, {
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

    const data = await res.json();
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
      <CreateTimerForm token={token} refreshData={() => setRefresh(prev => !prev)} />
      <DisplayTimers token = {token} refresh={refresh}/>
      </div>)}
    </div>
  )
}

export default HomeLoggedIn