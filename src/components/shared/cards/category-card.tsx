import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './category-card.styles.css?inline'

interface ICategoryCardProps {
  id: string
  name: string
  description: string
  onClick: ( id : string ) => void
}

export const CategoryCard = component$( ( { id, name, description, onClick } : ICategoryCardProps ) => {

  useStyles$( styles )

  return (
    <>
      <div class="card" onClick$={ () => onClick( id ) }>
        <span class="icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 9.5V5.5C4.5 4.94772 4.94772 4.5 5.5 4.5H9.5C10.0523 4.5 10.5 4.94772 10.5 5.5V9.5C10.5 10.0523 10.0523 10.5 9.5 10.5H5.5C4.94772 10.5 4.5 10.0523 4.5 9.5Z"
            />
            <path
              d="M13.5 18.5V14.5C13.5 13.9477 13.9477 13.5 14.5 13.5H18.5C19.0523 13.5 19.5 13.9477 19.5 14.5V18.5C19.5 19.0523 19.0523 19.5 18.5 19.5H14.5C13.9477 19.5 13.5 19.0523 13.5 18.5Z"
            />
            <path d="M4.5 19.5L7.5 13.5L10.5 19.5H4.5Z" />
            <path
              d="M16.5 4.5C18.1569 4.5 19.5 5.84315 19.5 7.5C19.5 9.15685 18.1569 10.5 16.5 10.5C14.8431 10.5 13.5 9.15685 13.5 7.5C13.5 5.84315 14.8431 4.5 16.5 4.5Z"
            />
          </svg>
        </span>
        <h4>{ name }</h4>
        <p>
          { description }
        </p>
        <div class="shine"></div>
        <div class="background">
          <div class="tiles">
            <div class="tile tile-1"></div>
            <div class="tile tile-2"></div>
            <div class="tile tile-3"></div>
            <div class="tile tile-4"></div>

            <div class="tile tile-5"></div>
            <div class="tile tile-6"></div>
            <div class="tile tile-7"></div>
            <div class="tile tile-8"></div>

            <div class="tile tile-9"></div>
            <div class="tile tile-10"></div>
          </div>

          <div class="line line-1"></div>
          <div class="line line-2"></div>
          <div class="line line-3"></div>
        </div>
      </div>
      </>
  )
} )
