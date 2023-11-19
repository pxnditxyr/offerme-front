
import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './mini-card.styles.css?inline'

interface MiniCardProps {
  header: string[]
  keys: string[]
  body: {
    id: string
    [ key: string ]: string | number | boolean | null | undefined
  }
  existsImage?: boolean
  image?: string | null
  type?: 'default' | 'image'
  onViewClick: ( id : string ) => void
}

export const MiniCard = component$( ({ header, keys, existsImage = false, image, body, type = 'default', onViewClick } : MiniCardProps ) => {
  useStyles$( styles )

  return (
    <article class="card" onClick$={ () => onViewClick( body[ 'id' ] ) }>
      {
        ( type === 'default' )
          ? (
            <>
              <section class="card__image">
                {
                  ( keys.length > 0 && !existsImage ) && (
                    <span class="card__title__no-image">
                      { body[ keys[ 0 ] ] }
                    </span>
                  )
                }
                <img
                  src={ ( existsImage && image ) || ( ( existsImage ) ? '/images/fallback-image.png' : '/offer-me-icon.svg' ) }
                  alt="icon"
                  width="100"
                  height="100"
                />
              </section>
              <div class="card__overlay">
                <section class="card__header">
                  <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
                  <img class="card__thumb" src="/offer-me-icon.svg" alt="" />
                  <div class="card__header-text">
                    <h3 class="card__title"> { body[ keys[ 0 ] ] } </h3>
                    <span class="card__status"> { header[ 1 ] }: { body[ keys[ 1 ] ] } </span>
                  </div>
                </section>
                <section class="card__description">
                  {
                    keys.map( ( key, index ) => {
                      if ( index < 2 ) return ( <></> )
                      return (
                        <p class="card__description__item">
                          <span class="card__item__title"> { header[ index ] }: </span>
                          <span class="card__item__value"> { body[ key ] } </span>
                        </p>
                      )
                    } )
                  }
                </section>
              </div>
            </>
          ) : (
            <>
              <section class="card__image">
                <img
                  src={ image ? image : '/images/fallback-image.png' }
                  alt="icon"
                  width="100"
                  height="100"
                />
              </section>
              <div class="card__overlay">
                <section class="card__header">
                  <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
                  <img class="card__thumb" src="/offer-me-icon.svg" alt="" />
                  <div class="card__header-text">
                    <h3 class="card__title"> { body[ keys[ 0 ] ] } </h3>
                    <span class="card__status"> Status: { body[ 'Status' ] ? 'Active' : 'Inactive' } </span>
                  </div>
                </section>
                <section class="card__description">
                  <span class="card__item__title"> Click Card to View Details </span>
                </section>
              </div>
            </>
          )
      }
    </article>
  )
} )
