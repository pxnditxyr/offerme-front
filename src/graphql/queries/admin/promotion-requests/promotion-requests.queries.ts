const managementPromotionRequestData = `
    id
    requestingUserId
    title
    code
    description
    reason
    comment
    promotionStartAt
    promotionEndAt
    inversionAmount
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
    requestingUser {
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
    currency {
      id
      name
    }
    creator {
      id
      email
    }
    updater {
      id
      email
    }
    images {
      id
      url
      alt
      status
    }
    targetProducts {
      id
      productId
      description
      status
    }
    promotionStatus {
      id
      adminApprovedBy
      adminApprovedAt
      adminApprovedStatus
      adminComment
      adminReason
      adminRejectedBy
      adminRejectedAt
      adminRejectedStatus
      status
    }
    promotionPayments {
      id
      paymentDate
      amount
      paymentDate
      voucher
      paymentMethodId
      status
    }
    discountProducts {
      id
      productId
      title
      description
      discountAmount
      discountPercentage
      discountPrice
      status
    }
`

export const managementPromotionRequestsQuery = `
query PromotionRequests($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotionRequests(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementPromotionRequestData }
  }
}`

export const managementPromotionRequestQuery = `
query PromotionRequest($promotionRequestId: ID!) {
  promotionRequest(id: $promotionRequestId) {
    ${ managementPromotionRequestData }
  }
}`

export const managementPromotionRequestCreateMutation = `
mutation CreatePromotionRequest($createPromotionRequestInput: CreatePromotionRequestInput!) {
  createPromotionRequest(createPromotionRequestInput: $createPromotionRequestInput) {
    ${ managementPromotionRequestData }
  }
}`

export const managementPromotionRequestUpdateMutation = `
mutation UpdatePromotionRequest($updatePromotionRequestInput: UpdatePromotionRequestInput!) {
  updatePromotionRequest(updatePromotionRequestInput: $updatePromotionRequestInput) {
    ${ managementPromotionRequestData }
  }
}`

export const managementPromotionRequestToggleStatusMutation = `
mutation ToggleStatusPromotionRequest($toggleStatusPromotionRequestId: ID!) {
  toggleStatusPromotionRequest(id: $toggleStatusPromotionRequestId) {
    ${ managementPromotionRequestData }
  }
}`
