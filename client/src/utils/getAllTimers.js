const GET_TIMERS_QUERY = `
  query TimerSearch($sub : String!) @live {
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
  `;

export default async function getAllTimers(token , sub) {
    try {
        const res = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: GET_TIMERS_QUERY,
            variables: {
              sub: sub,
            },
          }),
        });
        //console.log("this failed!!")

        const dataRecieved = await res.json();
        console.log(dataRecieved?.data?.timerSearch?.edges)
        if(dataRecieved.data){
        return dataRecieved?.data?.timerSearch?.edges
        }
        
        if (dataRecieved.errors[0]) {
          return (
              dataRecieved.errors[0]  
          );
        }
      } catch (err) {
        return JSON.stringify(err);
      }
}