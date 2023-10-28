interface SignupData {
  name: string
  paternalSurname: string
  maternalSurname: string
  birthdate: string
  email: string
  password: string
  gender: string
}

export const signupApi = async ( data : SignupData ) => {
  const url = import.meta.env.PUBLIC_AUTH_API_URL
  const response = await fetch( `${ url}/signup` , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data ),
  } )
  const json = await response.json()
  return json
}
