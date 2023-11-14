import { $, useContext } from '@builder.io/qwik'
import { ManagementCategoriesContext } from '~/context'
import { IManagementCategory } from '~/interfaces'

export const useManagementCategoriesStore = () => {
  const categoriesStore = useContext( ManagementCategoriesContext )

  const setCategories = $( ( categories : IManagementCategory[] ) => {
    categoriesStore.categories = structuredClone( categories )
  } )

  const addCategory = $( ( category : IManagementCategory ) => {
    categoriesStore.categories.push( category )
  } )

  const updateCategory = $( ( category : IManagementCategory ) => {
    categoriesStore.categories = categoriesStore.categories.map( currentCategory => {
      if ( currentCategory.id === category.id ) return category
      return currentCategory
    } )
  } )

  const toggleStatusCategory = $( ( id : string ) => {
    categoriesStore.categories = categoriesStore.categories.map( category => {
      if ( category.id === id ) return { ...category, status: !category.status }
      return category
    } )
  } )

  const setErrors = $( ( errors : string | null ) => {
    categoriesStore.errors = errors
  } )
  
  return {
    categories: categoriesStore.categories,
    isLoading: categoriesStore.isLoading,
    errors: categoriesStore.errors,
    categoriesStore,

    setCategories,
    addCategory,
    updateCategory,
    toggleStatusCategory,
    setErrors
  }
}
