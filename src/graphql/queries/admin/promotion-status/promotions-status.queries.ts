const managementPromotionStatusData = `
  id
  adminApprovedStatus
  adminApprovedAt
  adminApprovedBy
  adminRejectedStatus
  adminRejectedAt
  adminRejectedBy
  adminComment
  adminReason
  status
  createdAt
  updatedAt
  promotionRequest {
    id
    title
    description
    code
    inversionAmount
    currencyId
    comment
    status
  }
  adminApproved {
    id
    email
    status
  }
  adminRejected {
    id
    email
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

export const managementPromotionStatusesApprovedQuery = `
query PromotionStatusesApproved($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotionStatusesApproved(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementPromotionStatusData }
  }
}`

export const managementPromotionStatusesRejectedQuery = `
query PromotionStatusesRejected($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotionStatusesRejected(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementPromotionStatusData }
  }
}`

export const managementPromotionStatusesPendingQuery = `
query PromotionStatusesPending($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotionStatusesPending(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementPromotionStatusData }
  }
}`

export const managementPromotionStatusesQuery = `
query PromotionStatuses($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotionStatuses(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementPromotionStatusData }
  }
}`

export const managementPromotionStatesQuery = `
query PromotionStates($promotionStatesId: ID!) {
  promotionStates(id: $promotionStatesId) {
    ${ managementPromotionStatusData }
  }
}`

export const managementPromotionStatusCreateMutation = `
mutation CreatePromotionStatus($createPromotionStatusInput: CreatePromotionStatusInput!) {
  createPromotionStatus(createPromotionStatusInput: $createPromotionStatusInput) {
    ${ managementPromotionStatusData }
  }
}`

export const managementPromotionStatusApproveMutation = `
mutation ApprovePromotionStatus($statusUpdatePromotionStatusInput: StatusUpdatePromotionStatusInput!) {
  approvePromotionStatus(statusUpdatePromotionStatusInput: $statusUpdatePromotionStatusInput) {
    ${ managementPromotionStatusData }
  }
}`

export const managementPromotionStatusRejectMutation = `
mutation RejectPromotionStatus($statusUpdatePromotionStatusInput: StatusUpdatePromotionStatusInput!) {
  rejectPromotionStatus(statusUpdatePromotionStatusInput: $statusUpdatePromotionStatusInput) {
    ${ managementPromotionStatusData }
  }
}`
