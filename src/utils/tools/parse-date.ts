export const parseDate = ( date : string ) => {
  const dateArray = date.split( 'T' )
  const timeArray = dateArray[ 1 ].split( '.' )
  return `${ dateArray[ 0 ] } ${ timeArray[ 0 ] }`
}
