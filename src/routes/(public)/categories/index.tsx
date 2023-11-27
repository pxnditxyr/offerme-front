import { $, component$, useStyles$ } from '@builder.io/qwik'
import { CategoryCard, UnexpectedErrorPage } from '~/components/shared'

import styles from './sectors.styles.css?inline'
import { routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { PublicCategoriesService } from '~/services'

export const useGetCurrentCategory = routeLoader$( async () => {
  const categories = await PublicCategoriesService.findAll({ status: true, order: "0" })
  return categories
} )

export default component$( () => {
  useStyles$( styles )

  const categories = useGetCurrentCategory().value
  if ( 'errors' in categories ) return ( <UnexpectedErrorPage error={ categories.errors } /> )

  const nav = useNavigate()

  const onCategoryClick = $( ( id : string ) => {
    nav( `/categories/${ btoa( id ) }` )
  } )

  return (
    <div class="sectors__container">
      <div class="sectors__title">
        <h1> Sectors </h1>
        <p> Please select a sector to view the available categories </p>
      </div>
      <div class="sectors__gallery">
        {
          categories.map( ( category ) => (
            <CategoryCard 
              id={ category.id }
              name={ category.name }
              description={ category.description }
              onClick={ onCategoryClick }
            />
          ) )
            
        }
      </div>
    </div>
  )
} )
