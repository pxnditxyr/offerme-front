const managementCodePromotionDiscountProductsData = `
  id
  code
  discountProductId
  isUsed
  usedAt
  usedBy
  isRedeemed
  redeemedAt
  redeemedBy
  status
  createdAt
  createdBy
  updatedAt
  updatedBy
  discountProduct {
    id
    discountPrice
    title
    description
  }
  used {
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
  redeemed {
    id
    email
  }
`
export const managementCodePromotionDiscountProductsQuery = `
query CodePromotionDiscountProducts($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  codePromotionDiscountProducts(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementCodePromotionDiscountProductsData }
  }
}
`

export const managementCodePromotionDiscountProductQuery = `
query CodePromotionDiscountProduct($codePromotionDiscountProductId: ID!) {
  codePromotionDiscountProduct(id: $codePromotionDiscountProductId) {
    ${ managementCodePromotionDiscountProductsData }
  }
}
`

export const managementCodePromotionDiscountProductCreateMutation = `
mutation CreateCodePromotionDiscountProduct($createCodePromotionDiscountProductInput: CreateCodePromotionDiscountProductInput!) {
  createCodePromotionDiscountProduct(createCodePromotionDiscountProductInput: $createCodePromotionDiscountProductInput)
}
`

export const managementCodePromotionDiscountProductUpdateMutation = `
mutation UpdateCodePromotionDiscountProduct($updateCodePromotionDiscountProductInput: UpdateCodePromotionDiscountProductInput!) {
  updateCodePromotionDiscountProduct(updateCodePromotionDiscountProductInput: $updateCodePromotionDiscountProductInput) {
    ${ managementCodePromotionDiscountProductsData }
  }
}
`

export const managementCodePromotionDiscountProductToggleStatusMutation = `
mutation ToggleStatusCodePromotionDiscountProduct($toggleStatusCodePromotionDiscountProductId: ID!) {
  toggleStatusCodePromotionDiscountProduct(id: $toggleStatusCodePromotionDiscountProductId) {
    ${ managementCodePromotionDiscountProductsData }
  }
}
`
