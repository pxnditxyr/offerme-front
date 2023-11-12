import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './form-field.styles.css?inline'

type TInputType = 'text' | 'password' | 'email' | 'number' | 'date' | 'select'

interface IFormOption {
  id: string
  name: string
}

interface FormFieldProps {
  name: string
  type: TInputType
  placeholder?: string
  value?: string
  isRequired?: boolean
  label?: string
  error?: string
  options?: IFormOption[]
}

export const FormField = component$<FormFieldProps>( ( { name, type = 'text', placeholder = '', value = '', isRequired = false, label = '', error = '', options = [] } ) => {

  useStyles$( styles )

  return (
    <div class="form__field">
      {
        label && (
          <label for={ name }>
            { label }
          </label>
        )
      }
      {
        ( type === 'select' ) ? (
          <div class="form__field__select__container">
            <select
              id={ name }
              name={ name }
              class={ `${ ( error ) ? 'form__field__input--error' : 'form__field__input' }` }
            >
              {
                options.map( ( option ) => (
                  <option value={ option.id } key={ option.id } selected={ option.id === value }>
                    { option.name }
                  </option>
                ) )
              }
            </select>
          </div>
        ) : (
          <input
            id={ name }
            type={ type }
            name={ name }
            placeholder={ placeholder }
            value={ value }
            required={ isRequired }
            class={ `${ ( error ) ? 'form__field__input--error' : 'form__field__input' }` }
          />
        )
      }
      {
        ( error ) && (
          <span class="form__field__error">
            { error }
          </span>
        )
      }
    </div>
  )
} )
