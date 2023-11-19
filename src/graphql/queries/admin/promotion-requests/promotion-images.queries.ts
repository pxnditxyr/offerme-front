const managementPromotionImageData = `
  id
  url
  alt
  status
`

export const managementPromotionImageQuery = `
query PromotionImage($promotionImageId: ID!) {
  promotionImage(id: $promotionImageId) {
    ${ managementPromotionImageData }
  }
}`

export const managementPromotionImageCreateMutation = `
mutation CreatePromotionImage($createPromotionImageInput: CreatePromotionImageInput!) {
  createPromotionImage(createPromotionImageInput: $createPromotionImageInput) {
    ${ managementPromotionImageData }
  }
}`

export const toggleStatusManagementPromotionImageMutation = `
mutation ToggleStatusPromotionImage($toggleStatusPromotionImageId: ID!) {
  toggleStatusPromotionImage(id: $toggleStatusPromotionImageId) {
    ${ managementPromotionImageData }
  }
}`
