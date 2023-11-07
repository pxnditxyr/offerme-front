export const isUUID = ( id : string ) => ( id.length === 36 && id[ 14 ] === '4' ) || ( id.length === 32 )
