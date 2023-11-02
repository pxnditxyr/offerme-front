export interface IMenuData {
  label: string
  name: string
  isExpanded: boolean
  crud: boolean
  link: string
  submenu?: IMenuData[]
}
