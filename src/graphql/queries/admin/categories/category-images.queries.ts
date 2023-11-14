export const getManagementCategoryImageByIdQuery = `
query CategoryImage($categoryImageId: ID!) {
  categoryImage(id: $categoryImageId) {
    id
    url
    alt
    status
  }
}`

export const createManagementCategoryImageMutation = `
mutation CreateCategoryImage($createCategoryImageInput: CreateCategoryImageInput!) {
  createCategoryImage(createCategoryImageInput: $createCategoryImageInput) {
    id
    url
    alt
    status
  }
}`

export const toggleStatusManagementCategoryImageMutation = `
mutation ToggleStatusCategoryImage($toggleStatusCategoryImageId: ID!) {
  toggleStatusCategoryImage(id: $toggleStatusCategoryImageId) {
    id
    url
    alt
    status
  }
}`
