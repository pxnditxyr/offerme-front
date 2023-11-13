import { $, component$, useStyles$ } from '@builder.io/qwik'

import styles from './table.styles.css?inline'

interface ITableProps {
  header:         string[]
  keys:           string[]
  body:           Record<string, any>[]
  onViewClick:    ( id : string ) => void
  onEditClick:    ( id : string ) => void
  onToggleStatus: ( id : string ) => void
  tableType?:     'default' | 'update'
}

export const Table = component$( ( { header, keys, body, onEditClick, onViewClick, onToggleStatus, tableType = 'default' } : ITableProps ) => {
  
  useStyles$( styles )

  const onRowClick = $( ( id : string ) => {
    if ( tableType === 'default' ) return
    onEditClick( id )
  } )

  return (
    <table class="table">
      <thead>
        <tr>
          { header.map( ( item ) => (
            <th>{ item }</th>
          ) ) }
          {
            ( tableType === 'default' ) && (
              <>
                <th>Actions</th>
                <th>Status</th>
              </>
            )
          }
        </tr>
      </thead>
      <tbody>
        {
          body.map( ( item, itemIndex ) => (
            <tr onClick$={ () => onRowClick( item.id ) }>
              {
                keys.map( ( key ) => {
                  if ( key === 'status' )
                    return (
                      <td class={ `${ ( item[ key ] ) ? 'is-active__item' : 'is-inactive__item' }` }> { `${ item[ key ] ? '✔' : '✖' }` } </td>
                    )
                  if ( key === 'id' ) return ( <td> { itemIndex + 1 } </td> )
                  return ( <td> { item[ key ] } </td> )
                } )
              }
              {
                ( tableType === 'default' ) && (
                  <>
                    <td>
                      <button
                        class="button view__button"
                        onClick$={ () => onViewClick( item.id ) }
                      >View</button>
                      <button
                        class="button edit__button"
                        onClick$={ () => onEditClick( item.id ) }
                      >Edit</button>
                    </td>
                    <td>
                      <button
                        class={ `toggle-radius ${ ( item.status ) ? 'is-activate' : 'is-deactivate' }` }
                        onClick$={ () => onToggleStatus( item.id ) }
                      >
                        <span></span>
                      </button>
                  </td>
                </> )
              }
            </tr>
          ) )
        }
      </tbody>
    </table>
  )
} )
