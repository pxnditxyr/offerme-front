const managementPromotionsData = `
    id
    promotionPaymentId
    promotionRequestId
    title
    code
    description
    reason
    comment
    promotionStartAt
    promotionEndAt
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
    user {
      id
      email
    }
    company {
      id
      name
    }
    promotionType {
      id
      name
    }
    promotionRequest {
      id
      code
      title
      description
    }
    promotionPayment {
      id
      amount
      paymentDate
      voucher
      status
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

export const managementPromotionsQuery = `
query Promotions($status: Boolean, $offset: Int, $limit: Int, $search: String) {
  promotions(status: $status, offset: $offset, limit: $limit, search: $search) {
    ${ managementPromotionsData }
  }
}`

export const managementPromotionQuery = `
query Promotion($promotionId: ID!) {
  promotion(id: $promotionId) {
    ${ managementPromotionsData }
  }
}`

export const managementPromotionCreateMutation = `
mutation CreatePromotion($createPromotionInput: CreatePromotionInput!) {
  createPromotion(createPromotionInput: $createPromotionInput) {
    ${ managementPromotionsData }
  }
}`

export const managementPromotionUpdateMutation = `
mutation UpdatePromotion($updatePromotionInput: UpdatePromotionInput!) {
  updatePromotion(updatePromotionInput: $updatePromotionInput) {
    ${ managementPromotionsData }
  }
}`

export const managementPromotionToggleStatusMutation = `
mutation ToggleStatusPromotion($toggleStatusPromotionId: ID!) {
  toggleStatusPromotion(id: $toggleStatusPromotionId) {
    ${ managementPromotionsData }
  }
}`
