export const serializeDate = ( date : string ) => new Date( date ).toISOString().split( 'T' )[ 0 ]
