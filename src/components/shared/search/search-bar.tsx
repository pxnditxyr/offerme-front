import { QwikSubmitEvent, component$, useStyles$ } from '@builder.io/qwik'

import styles from './search-bar.styles.css?inline'

interface ISearchBarProps {
  onSearchSubmit: ( event : QwikSubmitEvent<HTMLFormElement> ) => void
  value: string
}

export const SearchBar = component$( ( { onSearchSubmit, value } : ISearchBarProps ) => {
  useStyles$( styles )

  return (
    <div class="search-bar__container">
      <form onSubmit$={ onSearchSubmit } class="search__form">
        <input
          class="search__input"
          type="search"
          name="search"
          placeholder="Search"
          value={ value }
          required
        />
        <button class="search__button">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 4.99 1.5-1.5-4.99-5zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill="currentColor"></path>
          </svg>
        </button>
      </form>
    </div>
  )
} )
