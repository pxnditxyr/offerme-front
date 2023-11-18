const managementProductCategoryData = `
  id
  productId
  categoryId
  status
  category {
    id
    name
    status
  }
  product {
    id
    name
    description
    status
  }
`

export const managementProductCategoryQuery = `
query ProductCategory($productCategoryId: ID!) {
  productCategory(id: $productCategoryId) {
    ${ managementProductCategoryData }
  }
}`

export const managementProductCategoryCreateMutation = `
mutation CreateProductCategory($createProductCategoryInput: CreateProductCategoryInput!) {
  createProductCategory(createProductCategoryInput: $createProductCategoryInput) {
    ${ managementProductCategoryData }
  }
}`

export const toggleStatusManagementProductCategoryMutation = `
mutation CreateProductCategory($toggleStatusProductCategoryId: ID!) {
  toggleStatusProductCategory(id: $toggleStatusProductCategoryId) {
    ${ managementProductCategoryData }
  }
}`
