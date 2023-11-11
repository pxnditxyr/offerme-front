
export const getSubparametersByParameterName = `
query getSubparametersByParameterName($parameterName: String!) {
  subparametersByParameterName(parameterName: $parameterName) {
    id
    name
  }
}`

