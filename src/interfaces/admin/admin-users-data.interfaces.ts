export interface IAdminUsersData {
  id:              string
  email:           string
  isVerifiedEmail: boolean
  status:          boolean
  createdAt:       string
  createdBy:       string | null
  updatedAt:       string
  updatedBy:       string | null
  creator:         IAdminActorData | null
  updater:         IAdminActorData | null
  peopleInfo:      IAdminPeopleInfoData
  role:            IAdminRoleData
  avatars:         string[]
}

export interface IAdminPeopleInfoData {
  id:              string
  name:            string
  paternalSurname: string
  maternalSurname: string
}

export interface IAdminRoleData {
  id:   string
  name: string
}

export interface IAdminActorData {
  id:              string
  email:           string
}
