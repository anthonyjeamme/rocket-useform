import { TFormValidator } from './validators/Validator.types'

export type TUseForm<T = any> = () => TUseFormReturns<T>

export type TForm = {
  toJSON: () => any
  modified: boolean
  setModified: (modified: boolean) => void
  checkForm: (params?: TCheckFormParams) => boolean

  /**
   * Generic field getter. Better to use getObject, getArray or getValue.
   */
  get: (path: string) => any

  /**
   *
   */
  getObject: (path: TFormNodePath) => TFormObjectGetter

  /**
   *
   */
  getArray: (path: TFormNodePath) => TFormArrayGetter

  /**
   *
   */
  getValue: (path: TFormNodePath) => TFormValueGetter

  /**
   *
   */
  addEventListener: (
    event: TFormEventType,
    callbackTFormEventCallback: any
  ) => void

  /**
   *
   */
  removeEventListener: (
    event: TFormEventType,
    callbackTFormEventCallback: any
  ) => void
}

export type TCheckFormParams = {
  log?: boolean
}

export type TFormEventListenerRef = {
  change: TFormEventCallback[]
}
export type TFormEventType = 'change'
export type TFormEventCallback = (event: TFormEvent) => void
export type TFormEvent = {
  type?: TFormEventType
  path?: TFormNodeArrayPath
  pathString?: TFormNodeStringPath
  oldValue?: any
  newValue?: any
}

export type TFormSchema = any
export type TFormData<T> = T

export type TUseFormReturns<T = any> = {
  toJSON: () => any
}

export type TFormDataValueFieldType = 'string' | 'boolean' | 'number'
export type TFormSchemaNodeType = 'value' | 'object' | 'array' | 'raw'

export interface TFormDataNodeInterface {
  __id: string
  __schema: TFormSchema
  __path: TFormNodePath
  __node: TFormSchemaNodeType
}

export interface TFormDataValueNode<T = any> extends TFormDataNodeInterface {
  __node: 'value'
  __type: TFormDataValueFieldType
  __error: boolean
  __value: T
  __listeners: {
    change: any[]
  }
}

export interface TFormDataArrayNode extends TFormDataNodeInterface {
  __node: 'array'
  __error: boolean
  __children: TFormDataNode[]
  __listeners: {
    change: any[]
  }
}

export interface TFormDataObjectNode extends TFormDataNodeInterface {
  __node: 'object'
  __error: boolean
  __children: { [key: string]: TFormDataNode }
  __listeners: {
    change: any[]
  }
}

export interface TFormDataRawNode extends TFormDataNodeInterface {
  __node: 'raw'
  __value: any
}

export type TFormDataNode =
  | TFormDataValueNode
  | TFormDataArrayNode
  | TFormDataObjectNode
  | TFormDataRawNode

export type TFormNodePath =
  | TFormNodeStringPath
  | TFormNodeArrayPath
  | TFormSchemaNode

export type TFormNodeStringPath = string
export type TFormNodeArrayPath = string[]

export type TFormTools = {
  handleModified: (props: {
    path?: TFormNodeArrayPath
    oldValue?: any
    newValue?: any
    action?: string
    targetType?: string
    removedIndex?: number
  }) => void
  refresh: () => void
  generateId: () => string
}

export type TFormParams = {
  parentKeyword?: string
}

//
// GETTER
//

export type TFormValueGetter = {
  id: string
  value: any
  remove: () => void
  update: (value: any, refresh?: boolean) => void
  error: boolean
  getPath: () => TFormNodeArrayPath
} & TFormGetters

export type TFormGetter =
  | TFormObjectGetter
  | TFormArrayGetter
  | TFormValueGetter

export type TFormObjectGetter = {
  id: string
  value: any
  error: boolean
  toJSON: () => any
  remove: () => void
  set: (data: any, refresh?: boolean) => void
  getPath: () => TFormNodeArrayPath

  addEventListener: (event: any, callback: any) => void
  removeEventListener: (event: any, callback: any) => void
} & TFormGetters

export type TFormArrayGetter = {
  id: string
  toJSON: () => any
  error: boolean
  set: (data: any, refresh?: boolean) => void
  getPath: () => TFormNodeArrayPath

  // Array specific fields
  remove: () => void
  length: number
  map: (callback: (props: any, index: number) => any) => any[]
  insert: (data: any, index?: number) => any
} & TFormGetters

export type TFormGetters = {
  get: (path: TFormNodePath) => any
  getObject: (path: TFormNodePath) => TFormObjectGetter
  getArray: (path: TFormNodePath) => TFormArrayGetter
  getValue: (path: TFormNodePath) => TFormValueGetter
}

export type TFormValidationFunction<TGetter, TDataType> = (
  value: TDataType,
  getters: TFormGetters
) => boolean

//
// SCHEMA
//

export interface TFormSchemaNode {
  getPath: () => TFormNodeArrayPath
}

export interface TValueFormSchemaNode extends TFormSchemaNode {
  __node: 'value'
  __params: TFormSchemaValueParams<any, any>
  __type: TFormDataValueFieldType
}

export interface TObjectFormSchemaNode extends TFormSchemaNode {
  __node?: 'object'
}

export interface TArrayFormSchemaNode extends TFormSchemaNode {
  __node: 'array'
  __childType: TFormSchemaNode
  __params: TFormSchemaArrayParams
}

export type TFormSchemaValueParams<TGetter, TDataType> = {
  required?: boolean | ((getter: TGetter) => boolean)
  readOnly?: boolean
  defaultValue?: TDataType
  validation?: TFormValidationFunction<TGetter, TDataType>
  validators?: TFormValidator[]
  autoRefresh?: boolean
  ignoreInJSON?: boolean
}

export type TFormSchemaArrayParams = {
  required?: boolean
  defaultValue?: any // TODO
  validation?: any // TODO
  constraints?: TFormSchemaArrayParamsContraints
}

export type TFormSchemaArrayParamsContraints = {
  minLength?: number
  maxLength?: number
}

export type TFormSchemaObjectParams = {
  // useless ?
}
