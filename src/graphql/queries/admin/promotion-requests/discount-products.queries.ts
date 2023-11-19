const managementDiscountProductsData = `
  id
  productId
  userId
  promotionRequestId
  title
  description
  discountPercentage
  discountAmount
  discountPrice
  status
  createdAt
  updatedAt
  user {
    id
    email
  }
  creator {
    id
    email
  }
  updater {
    id
    email 
  }
`

export const managementDiscountProductsQuery = `
query DiscountProducts($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  discountProducts(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementDiscountProductsData }
  }
}`

export const managementDiscountProductQuery = `
query DiscountProduct($discountProductId: ID!) {
  discountProduct(id: $discountProductId) {
    ${ managementDiscountProductsData }
  }
}`

export const managementDiscountProductsCreateMutation = `
mutation CreateDiscountProduct($createDiscountProductInput: CreateDiscountProductInput!) {
  createDiscountProduct(createDiscountProductInput: $createDiscountProductInput) {
    ${ managementDiscountProductsData }
  }
}`

export const managementDiscountProductsUpdateMutation = `
mutation UpdateDiscountProduct($updateDiscountProductInput: UpdateDiscountProductInput!) {
  updateDiscountProduct(updateDiscountProductInput: $updateDiscountProductInput) {
    ${ managementDiscountProductsData }
  }
}`

export const managementDiscountProductsToggleStatusMutation = `
mutation ToggleStatusDiscountProduct($toggleStatusDiscountProductId: ID!) {
  toggleStatusDiscountProduct(id: $toggleStatusDiscountProductId) {
    ${ managementDiscountProductsData }
  }
}`
