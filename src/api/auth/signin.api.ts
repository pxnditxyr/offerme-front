interface SigninData {
  email: string
  password: string
}

export const signinApi = async ( data : SigninData ) => {
  const url = import.meta.env.PUBLIC_AUTH_API_URL
  const response = await fetch( `${ url}/signin` , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data ),
  } )
  const json = await response.json()
  return json
}
