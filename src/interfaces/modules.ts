export interface ISubmodule {
  name: string
  label: string
}

export interface IModule {
  name: string
  label: string
  submodules: ISubmodule[]
}
