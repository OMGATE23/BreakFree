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
            //console.log("before", accessToken);
            localStorage.setItem('token', JSON.stringify(accessToken))
            token = (accessToken)
            //console.log("SET TOKEN IN USEEFFECT", localStorage.getItem("token"))
          } catch (err) {
            console.log(err)
          }
        }
    
        if (isAuthenticated && !localStorage.getItem('token')) {
          console.log(isAuthenticated)
          getAccessToken()
        }
    console.log(token)
    return token;
}