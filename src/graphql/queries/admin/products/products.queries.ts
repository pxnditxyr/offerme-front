const managementProductsData = `
    id
    name
    description
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
    categories {
      id
      productId
      categoryId
      status
    }
    promotionRequests {
      id
      promotionRequestId
      productId
      status
    }
    discountProducts {
      id
      productId
      userId
      promotionRequestId
      title
      description
      status
    }
`

export const managementProductsQuery = `
query Products($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  products(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ managementProductsData }
  }
}
`

export const managementProductQuery = `
query Product($productId: ID!) {
  product(id: $productId) {
    ${ managementProductsData }
  }
}
`

export const managementProductCreateMutation = `
mutation CreateProduct($createProductInput: CreateProductInput!) {
  createProduct(createProductInput: $createProductInput) {
    ${ managementProductsData }
  }
}
`

export const managementProductUpdateMutation = `
mutation UpdateProduct($updateProductInput: UpdateProductInput!) {
  updateProduct(updateProductInput: $updateProductInput) {
    ${ managementProductsData }
  }
}
`

export const managementProductToggleStatusMutation = `
mutation ToggleStatusProduct($toggleStatusProductId: ID!) {
  toggleStatusProduct(id: $toggleStatusProductId) {
    ${ managementProductsData }
  }
}
`
