export const getManagementCategoriesQuery = `
query Categories($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  categories(offset: $offset, limit: $limit, search: $search, status: $status) {
    id
    name
    description
    order
    parentId
    status
    createdAt
    updatedAt
    parent {
      id
      name
      order
      description
    }
    children {
      id
      name
      order
      description
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
  }
}
`

export const getManagementCategoryByIdQuery = `
query Category($categoryId: ID!) {
  category(id: $categoryId) {
    id
    name
    description
    order
    parentId
    status
    createdAt
    updatedAt
    parent {
      id
      name
      order
      description
    }
    children {
      id
      name
      order
      description
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
  }
}`

export const createManagementCategoryMutation = `
mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
  createCategory(createCategoryInput: $createCategoryInput) {
    id
    name
    description
    order
    parentId
    status
    createdAt
    updatedAt
    parent {
      id
      name
      order
      description
    }
    children {
      id
      name
      order
      description
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
  }
}`

export const updateManagementCategoryMutation = `
mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
  updateCategory(updateCategoryInput: $updateCategoryInput) {
    id
    name
    description
    order
    parentId
    status
    createdAt
    updatedAt
    parent {
      id
      name
      order
      description
    }
    children {
      id
      name
      order
      description
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
  }
}`

export const toggleStatusManagementCategoryMutation = `
mutation ToggleStatusCategory($toggleStatusCategoryId: ID!) {
  toggleStatusCategory(id: $toggleStatusCategoryId) {
    id
    name
    description
    order
    parentId
    status
    createdAt
    updatedAt
    parent {
      id
      name
      order
      description
    }
    children {
      id
      name
      order
      description
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
  }
}`
