import { component$ } from '@builder.io/qwik'

interface FormFieldProps {
  name: string
  type: string
  placeholder?: string
  value?: string
  isRequired?: boolean
  label?: string
  error?: string
}

export const FormField = component$<FormFieldProps>( ( { name, type, placeholder = '', value = '', isRequired = false, label = '', error = '' } ) => {
  return (
    <div>
      {
        label && (
          <label for={ name }>
            { label }
          </label>
        )
      }
      <input
        id={ name }
        type={ type }
        name={ name }
        placeholder={ placeholder }
        value={ value }
        required={ isRequired }
      />
      {
        ( error ) && (
          <span>
            { error }
          </span>
        )
      }
    </div>
  )
} )
