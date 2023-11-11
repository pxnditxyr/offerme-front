export interface ICreateUserManagement {
  birthdate: string
  documentNumber: string | null
  documentTypeId: string | null
  email: string
  genderId: string
  maternalSurname: string
  name: string
  password: string
  paternalSurname: string
  roleId: string
}

export interface IUpdateUserManagement {
  id: string
  birthdate?: string
  documentNumber?: string
  documentTypeId?: string
  email?: string
  genderId?: string
  maternalSurname?: string
  name?: string
  password?: string
  paternalSurname?: string
  status?: boolean
  roleId?: string
}
