import { component$, useStyles$ } from '@builder.io/qwik'
import { Form } from '@builder.io/qwik-city'

import styles from './create.styles.css?inline'

const documentTypes = [
  {
    id: '1',
    name: 'DNI',
  },
  {
    id: '2',
    name: 'Carnet de Extranjería',
  },
  {
    id: '3',
    name: 'Pasaporte',
  }
]

const genders = [
  {
    id: '1',
    name: 'Masculino',
  },
  {
    id: '2',
    name: 'Femenino',
  },
  {
    id: '3',
    name: 'Otro',
  }
]

const roles = [
  {
    id: '1',
    name: 'Administrador',
  },
  {
    id: '2',
    name: 'Usuario',
  },
  {
    id: '3',
    name: 'Invitado',
  }
]

export default component$( () => {
  useStyles$( styles )
  return (
    <>
      <h1> Create New User </h1>
      <div class="form__container">
        <Form class="form">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="Name" />
            </div>
          </div>
          <div class="field">
            <label class="label">Paternal Surname</label>
            <div class="control">
              <input class="input" type="text" placeholder="Paternal Surname" />
            </div>
          </div>
          <div class="field">
            <label class="label">Maternal Surname</label>
            <div class="control">
              <input class="input" type="text" placeholder="Maternal Surname" />
            </div>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" placeholder="Email" />
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input class="input" type="password" placeholder="Password" />
            </div>
          </div>
          <div class="field">
            <label class="label">Document Type</label>
            <div class="control">
              <div class="select">
                <select>
                  {documentTypes.map( ( { id, name } ) => (
                    <option value={id}>{name}</option>
                  ) )}
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Document Number</label>
            <div class="control">
              <input class="input" type="text" placeholder="Document Number" />
            </div>
          </div>
          <div class="field">
            <label class="label">Gender</label>
            <div class="control">
              <div class="select">
                <select>
                  {
                    genders.map( ( { id, name } ) => (
                      <option value={id}>{name}</option>
                    ) )
                  }
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Birthdate</label>
            <div class="control">
              <input
                class="input"
                type="date"
                placeholder="Birthdate"
                value={ new Date().toISOString().split( 'T' )[0] }
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Role</label>
            <div class="control">
              
              <div class="select">
                <select>
                  {
                    roles.map( ( { id, name } ) => (
                      <option value={id}>{name}</option>
                    ) )
                  }
                </select>
              </div>
            </div>
          </div>
          <button class="button is-primary">Create</button>
        </Form>
      </div>
    </>
  )
} )
