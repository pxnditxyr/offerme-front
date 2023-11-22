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
  idToRedirect?:  string
  canEdit?:       boolean
  canToggle?:     boolean
}

export const Table = component$( ( { header, keys, body, onEditClick, onViewClick, onToggleStatus, tableType = 'default', idToRedirect, canEdit = true, canToggle = true } : ITableProps ) => {
  
  useStyles$( styles )

  const onRowClick = $( ( id : string ) => {
    if ( tableType === 'default' ) return
    onEditClick( id )
  } )

  return (
    <div class="table__container">
      <table class="table">
        <thead>
          <tr>
            { header.map( ( item ) => (
              <th key={ item }>{ item }</th>
            ) ) }
            {
              ( tableType === 'default' ) && (
                <>
                  <th>Actions</th>
                  {
                    ( canToggle ) && (
                      <th>Status</th>
                    )
                  }
                </>
              )
            }
          </tr>
        </thead>
        <tbody>
          {
            body.map( ( item, itemIndex ) => (
              <tr
                onClick$={ () => onRowClick( item[ idToRedirect || 'id' ] ) } class={ `${ ( tableType === 'update' ) ? 'is-clickable' : 'no-clickable' }` }
                key={ item.id }
              >
                {
                  keys.map( ( key ) => {
                    if ( key === 'status' )
                    return (
                      <td key={ key } class={ `${ ( item[ key ] ) ? 'is-active__item' : 'is-inactive__item' }` }> { `${ item[ key ] ? '✔' : '✖' }` } </td>
                    )
                    if ( key === 'id' ) return ( <td key={ key }> { itemIndex + 1 } </td> )
                    return ( <td key={ key }> { item[ key ] } </td> )
                  } )
                }
                {
                  ( tableType === 'default' ) && (
                    <>
                      <td>
                        <button
                          class="button view__button"
                          onClick$={ () => onViewClick( item[ idToRedirect || 'id' ] ) }
                        >View</button>
                        {
                          ( canEdit ) && (
                            <button
                              class="button edit__button"
                              onClick$={ () => onEditClick( item[ idToRedirect || 'id' ] ) }
                            >Edit</button>
                          )
                        }
                      </td>
                      {
                        ( canToggle ) && (
                          <td>
                            <button
                              class={ `toggle-radius ${ ( item.status ) ? 'is-activate' : 'is-deactivate' }` }
                              onClick$={ () => onToggleStatus( item.id ) }
                            ></button>
                          </td>
                        )
                      }
                    </> )
                }
              </tr>
            ) )
          }
        </tbody>
      </table>
    </div>
  )
} )
