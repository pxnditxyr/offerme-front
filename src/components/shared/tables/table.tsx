import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './table.styles.css?inline'

interface ITableProps {
  header:         string[];
  keys:           string[];
  body:           Record<string, any>[];
  onViewClick:    ( id : string ) => void;
  onEditClick:    ( id : string ) => void;
  onToggleStatus: ( id : string ) => void;
}

export const Table = component$( ( { header, keys, body, onEditClick, onViewClick, onToggleStatus } : ITableProps ) => {
  
  useStyles$( styles )

  return (
    <table class="table">
      <thead>
        <tr>
          { header.map( ( item ) => (
            <th>{ item }</th>
          ) ) }
          <th>Actions</th>
          <th>Deactivate</th>
        </tr>
      </thead>
      <tbody>
        {
          body.map( ( item ) => (
            <tr>
              {
                keys.map( ( key, index ) => {
                  if ( key === 'status' )
                    return (
                      <td class={ `${ ( item[ key ] ) ? 'is-active__item' : 'is-inactivate__item' }` }> { `${ item[ key ] ? 'Active' : 'Inactive' }` } </td>
                    )
                  if ( key === 'id' ) return ( <td> { index } </td> )
                  return ( <td> { item[ key ] } </td> )
                } )
              }
              <td>
                <button
                  class="button is-primary"
                  onClick$={ () => onViewClick( item.id ) }
                >View</button>
                <button
                  class="button is-primary"
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
            </tr>
          ) )
        }
      </tbody>
    </table>
  )
} )
