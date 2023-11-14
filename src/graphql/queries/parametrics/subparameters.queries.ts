
export const getSubparametersByParameterName = `
query SubparametersByParameterName($parameterName: String!, $status: Boolean) {
  subparametersByParameterName(parameterName: $parameterName, status: $status) {
    id
    name
  }
}`

