const managementPromotionTargetProductsData = `
  id
  promotionRequestId
  productId
  description
  status
  createdAt
  updatedAt
  creator {
    id
    email
  }
  updater {
    id
    email
  }
`

export const managementPromotionTargetProductsQuery = `
query PromotionTargetProducts($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotionTargetProductss(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementPromotionTargetProductsData }
  }
}`

export const managementPromotionTargetProductQuery = `
query PromotionTargetProducts($promotionTargetProductsId: ID!) {
  promotionTargetProducts(id: $promotionTargetProductsId) {
    ${ managementPromotionTargetProductsData }
  }
}`

export const managementPromotionTargetProductsCreateMutation = `
mutation CreatePromotionTargetProduct($createPromotionTargetProductInput: CreatePromotionTargetProductInput!) {
  createPromotionTargetProduct(createPromotionTargetProductInput: $createPromotionTargetProductInput) {
    ${ managementPromotionTargetProductsData }
  }
}`

export const managementPromotionTargetProductsUpdateMutation = `
mutation UpdatePromotionTargetProducts($updatePromotionTargetProductsInput: UpdatePromotionTargetProductsInput!) {
  updatePromotionTargetProducts(updatePromotionTargetProductsInput: $updatePromotionTargetProductsInput) {
    ${ managementPromotionTargetProductsData }
  }
}`

export const managementPromotionTargetProductsToggleStatusMutation = `
mutation ToggleStatusPromotionTargetProducts($toggleStatusPromotionTargetProductsId: ID!) {
  toggleStatusPromotionTargetProducts(id: $toggleStatusPromotionTargetProductsId) {
    ${ managementPromotionTargetProductsData }
  }
}`
