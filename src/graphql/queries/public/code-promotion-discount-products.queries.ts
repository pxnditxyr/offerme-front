export const publicFindAllCodePromotionDiscountProductsQuery = `
query CodePromotionDiscountProducts($offset: Int, $search: String, $status: Boolean, $limit: Int) {
  codePromotionDiscountProducts(offset: $offset, search: $search, status: $status, limit: $limit) {
    id
    code
    discountProductId
    isUsed
    isRedeemed
    status
  }
}
`

export const publicFindAllDiscountProductsQuery = `
query DiscountProducts($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  discountProducts(offset: $offset, limit: $limit, search: $search, status: $status) {
    id
    productId
    title
    description
    discountPercentage
    discountAmount
    discountPrice
    promotionRequestId
    status
  }
}
`

export const publicFindAllProductsQuery = `
query Products($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  products(offset: $offset, limit: $limit, search: $search, status: $status) {
    id
    name
    description
    companyId
    productTypeId
    stock
    price
    code
    notes
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
    company {
      id
      name
    }
    productType {
      id
      name
    }
    images {
      id
      url
      alt
      status
    }
    categories {
      id
      productId
      categoryId
      status
    }
  }
}
`

export const publicFindAllPromotionsQuery = `
query Promotions($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotions(offset: $offset, limit: $limit, search: $search, status: $status) {
    id
    userId
    companyId
    promotionPaymentId
    promotionRequestId
    title
    code
    description
    promotionTypeId
    reason
    comment
    promotionStartAt
    promotionEndAt
    status
  }
}
`
