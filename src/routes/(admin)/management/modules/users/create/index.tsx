import { component$, useStyles$ } from '@builder.io/qwik'
import { Form, RequestEventLoader, routeLoader$ } from '@builder.io/qwik-city'

import styles from './create.styles.css?inline'
import { SubparametersService } from '~/services'
import { graphqlExceptionsHandler } from '~/utils'
import { IRouteLoaderError, ISubparameter } from '~/interfaces'
import { UnexpectedErrorPage } from '~/components/shared'
import { ManagementRolesService } from '~/services/admin/roles.service'

interface ICreateUserSubparameters {
  documentTypes: ISubparameter[],
  genders: ISubparameter[]
  roles: ISubparameter[]
}

export const getSubparameters = routeLoader$<ICreateUserSubparameters | IRouteLoaderError>( async ( event : RequestEventLoader ) => {
  const { fail, cookie } = event

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  try {
    const documentTypes = await SubparametersService.findAllByParameterName( 'document type' )
    const genders = await SubparametersService.findAllByParameterName( 'gender' )
    const roles = await ManagementRolesService.findAll( jwt.value, true )
    return {
      documentTypes,
      genders,
      roles
    }
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return  fail( 400, { errors } )
  }
} )

export default component$( () => {
  useStyles$( styles )
  const subparameters = getSubparameters()

  if ( 'errors' in subparameters.value ) return <UnexpectedErrorPage />
  
  const { genders, documentTypes, roles } = subparameters.value

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
                  {
                    documentTypes.map( ( { id, name } ) => (
                      <option value={id}>{name}</option>
                   ) )
                  }
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
