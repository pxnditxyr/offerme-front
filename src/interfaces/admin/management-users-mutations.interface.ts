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
  birthdate?: string | null
  documentNumber?: string | null
  documentTypeId?: string | null
  email?: string | null
  genderId?: string | null
  maternalSurname?: string | null
  name?: string | null
  paternalSurname?: string | null
  status?: boolean | null
  roleId?: string | null
}
