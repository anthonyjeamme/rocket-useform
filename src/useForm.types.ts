import { TFormValidator } from './validators/Validator.types'

export type TUseForm<T = any> = () => TUseFormReturns<T>

export type TForm = {
  toJSON: () => any
  modified: boolean
  setModified: (modified: boolean) => void
  checkForm: () => boolean

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
  addEventListener: (event: TFormEventType, callbackTFormEventCallback) => void

  /**
   *
   */
  removeEventListener: (
    event: TFormEventType,
    callbackTFormEventCallback
  ) => void
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

export class TFormDataNodeInterface {
  __id: string
  __schema: TFormSchema
  __path: TFormNodePath
  __node: TFormSchemaNodeType
}

export class TFormDataValueNode<T = any> extends TFormDataNodeInterface {
  __node: 'value'
  __type: TFormDataValueFieldType
  __error: boolean
  __value: T
  __listeners: {
    change: any[]
  }
}

export class TFormDataArrayNode extends TFormDataNodeInterface {
  __node: 'array'
  __error: boolean
  __children: TFormDataNode[]
  __listeners: {
    change: any[]
  }
}

export class TFormDataObjectNode extends TFormDataNodeInterface {
  __node: 'object'
  __error: boolean
  __children: { [key: string]: TFormDataNode }
  __listeners: {
    change: any[]
  }
}

export class TFormDataRawNode extends TFormDataNodeInterface {
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

  addEventListener: (event, callback) => void
  removeEventListener: (event, callback) => void
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
  insert: (data: any, index?: number) => void
} & TFormGetters

export type TFormGetters = {
  get: (path: TFormNodePath) => any
  getObject: (path: TFormNodePath) => TFormObjectGetter
  getArray: (path: TFormNodePath) => TFormArrayGetter
  getValue: (path: TFormNodePath) => TFormValueGetter
}

export type TFormValidationFunction = (
  value?: any,
  get?: (path: any) => any
) => boolean

//
// SCHEMA
//

export class TFormSchemaNode {
  getPath: () => TFormNodeArrayPath
}

export class TValueFormSchemaNode extends TFormSchemaNode {
  __node: 'value'
  __params: TFormSchemaValueParams<any, any>
  __type: TFormDataValueFieldType
}

export class TObjectFormSchemaNode extends TFormSchemaNode {
  __node?: 'object'
}

export class TArrayFormSchemaNode extends TFormSchemaNode {
  __node: 'array'
  __childType: TFormSchemaNode
  __params: TFormSchemaArrayParams
}

export type TFormSchemaValueParams<TGetter, TDataType> = {
  required?: boolean | ((getter: TGetter) => boolean)
  readOnly?: boolean
  defaultValue?: TDataType
  validation?: TFormValidationFunction
  validators?: TFormValidator[]
  autoRefresh?: boolean
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
