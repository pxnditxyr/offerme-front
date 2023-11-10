export interface IManagementUsersData {
  id:              string
  email:           string
  isVerifiedEmail: boolean
  status:          boolean
  createdAt:       string
  updatedAt:       string
  creator:         IManagementActorData | null
  updater:         IManagementActorData | null
  peopleInfo:      IManagementPeopleInfoData
  role:            IManagementRoleData
  mainAvatar:      string | null
  mainPhone:       string | null
  mainAddress:     IManagementAddressData | null
  avatars:         IManagementAvatarData[]
  phones:          IManagementPhoneData[]
  addresses:       IManagementAddressData[]
  creditCards:     IManagementCreditCardData[]
}

export interface IManagementAvatarData {
  id:     string
  isMain: boolean
  url:    string
  status: boolean
}

export interface IManagementPhoneData {
  id:         string
  number:     string
  phoneType:  IManagementSubparameterData
  status:     boolean
}

export interface IManagementCreditCardData {
  id:              string
  number:          string
  cvv:             string
  expMonth:        string
  expYear:         string
  isMain:          boolean
  status:          boolean
  creditCardType:  IManagementSubparameterData
}

export interface IManagementPeopleInfoData {
  id:              string
  name:            string
  paternalSurname: string
  maternalSurname: string
  birthdate:       string
  gender:          IManagementSubparameterData
  documentNumber:  string
  documentType:    IManagementSubparameterData
}

export interface IManagementAddressData {
  id:      string
  street:  string
  city:    string
  state:   string
  country: string
  zipCode: string
  status:  boolean
}

export interface IManagementSubparameterData {
  id:   string
  name: string
}

export interface IManagementRoleData {
  id:   string
  name: string
}

export interface IManagementActorData {
  id:              string
  email:           string
}

export interface IManagementUsersState {
  users: IManagementUsersData[]
  isLoading: boolean
  error: any
}
