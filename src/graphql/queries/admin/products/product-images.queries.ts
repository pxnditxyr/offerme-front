const managementProductImageData = `
  id
  url
  alt
  status
`

export const managementProductImageQuery = `
query ProductImage($productImageId: ID!) {
  productImage(id: $productImageId) {
    ${ managementProductImageData }
  }
}`

export const managementProductImageCreateMutation = `
mutation CreateProductImage($createProductImageInput: CreateProductImageInput!) {
  createProductImage(createProductImageInput: $createProductImageInput) {
    ${ managementProductImageData }
  }
}`

export const toggleStatusManagementProductImageMutation = `
mutation ToggleStatusProductImage($toggleStatusProductImageId: ID!) {
  toggleStatusProductImage(id: $toggleStatusProductImageId) {
    ${ managementProductImageData }
  }
}`
