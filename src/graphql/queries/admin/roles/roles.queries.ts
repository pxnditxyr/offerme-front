export const getRoles = `
query Roles($status: Boolean) {
  roles(status: $status) {
    id
    name
  }
}`
