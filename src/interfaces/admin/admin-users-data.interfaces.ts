export interface IAdminUsersData {
  id:              string
  email:           string
  isVerifiedEmail: boolean
  status:          boolean
  createdAt:       string
  updatedAt:       string
  creator:         IAdminActorData | null
  updater:         IAdminActorData | null
  peopleInfo:      IAdminPeopleInfoData
  role:            IAdminRoleData
  mainAvatar:      string | null
  mainPhone:       string | null
  mainAddress:     IAdminAddressData | null
  avatars:         IAdminAvatarData[]
  phones:          IAdminPhoneData[]
  addresses:       IAdminAddressData[]
  creditCards:     IAdminCreditCardData[]
}

export interface IAdminAvatarData {
  id:     string
  isMain: boolean
  url:    string
  status: boolean
}

export interface IAdminPhoneData {
  id:         string
  number:     string
  phoneType:  IAdminSubparameterData
  status:     boolean
}

export interface IAdminCreditCardData {
  id:              string
  number:          string
  cvv:             string
  expMonth:        string
  expYear:         string
  isMain:          boolean
  status:          boolean
  creditCardType:  IAdminSubparameterData
}

export interface IAdminPeopleInfoData {
  id:              string
  name:            string
  paternalSurname: string
  maternalSurname: string
  birthdate:       string
  gender:          IAdminSubparameterData
  documentNumber:  string
  documentType:    IAdminSubparameterData
}

export interface IAdminAddressData {
  id:      string
  street:  string
  city:    string
  state:   string
  country: string
  zipCode: string
  status:  boolean
}

export interface IAdminSubparameterData {
  id:   string
  name: string
}

export interface IAdminRoleData {
  id:   string
  name: string
}

export interface IAdminActorData {
  id:              string
  email:           string
}
