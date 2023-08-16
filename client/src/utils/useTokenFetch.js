import { useAuth0 } from "@auth0/auth0-react";

export default async function useTokenFetch (){
    const {isAuthenticated , getAccessTokenSilently} = useAuth0()
    let token;
        async function getAccessToken() {
          try {
            const accessToken = await getAccessTokenSilently({
              authorizationParams: {
                audience: 'https://grafbase.com',
                scope: "read:current_user",
              }
            })
            localStorage.setItem('token', JSON.stringify(accessToken))
            token = (accessToken)
          } catch (err) {
            console.log(err)
          }
        }
    
        if (isAuthenticated && !localStorage.getItem('token')) {
          getAccessToken()
        }
    return token;
}