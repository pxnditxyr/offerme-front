export interface IRole {
  id: string
  name: string
}

export interface IPeopleInfo {
  id: string
  name: string
  paternalSurname: string
  maternalSurname: string
  birthdate: string
  genderId: string
}

export interface IUser {
  id: string
  email: string
  peopleInfo: IPeopleInfo
  mainAvatar?: string | null
  role: IRole
}
