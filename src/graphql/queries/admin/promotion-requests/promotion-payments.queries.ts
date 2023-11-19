const managementPromotionPaymentsData = `
  id
  amount
  voucher
  paymentDate
  status
  createdAt
  createdBy
  updatedAt
  updatedBy
  creator {
    id
    email
  }
  paymentMethod {
    id
    name
  }
  updater {
    id
    email
  }
`

export const managementPromotionPaymentsQuery = `
query PromotionPayments($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  promotionPayments(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementPromotionPaymentsData }
  }
}`

export const managementPromotionPaymentQuery = `
query PromotionPayment($promotionPaymentId: ID!) {
  promotionPayment(id: $promotionPaymentId) {
    ${ managementPromotionPaymentsData }
  }
}`

export const managementPromotionPaymentCreateMutation = `
mutation CreatePromotionPayment($createPromotionPaymentInput: CreatePromotionPaymentInput!) {
  createPromotionPayment(createPromotionPaymentInput: $createPromotionPaymentInput) {
    ${ managementPromotionPaymentsData }
  }
}`

export const managementPromotionPaymentUpdateMutation = `
mutation UpdatePromotionPayment($updatePromotionPaymentInput: UpdatePromotionPaymentInput!) {
  updatePromotionPayment(updatePromotionPaymentInput: $updatePromotionPaymentInput) {
    ${ managementPromotionPaymentsData }
  }
}`

export const managementPromotionPaymentToggleStatusMutation = `
mutation ToggleStatusPromotionPayment($toggleStatusPromotionPaymentId: ID!) {
  toggleStatusPromotionPayment(id: $toggleStatusPromotionPaymentId) {
    ${ managementPromotionPaymentsData }
  }
}`
