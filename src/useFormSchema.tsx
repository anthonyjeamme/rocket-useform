import {
  TFormNodeArrayPath,
  TFormSchema,
  TFormSchemaArrayParams,
  TFormSchemaNode,
  TFormSchemaObjectParams,
  TFormSchemaValueParams,
  TFormValueGetter
} from './useForm.types'

export const textField = (
  params: TFormSchemaValueParams<TFormValueGetter, string> = {}
) => ({
  __node: 'value',
  __type: 'string',
  __params: params
})

export const booleanField = (
  params: TFormSchemaValueParams<TFormValueGetter, boolean> = {}
) => ({
  __node: 'value',
  __type: 'boolean',
  __params: params
})

export const numberField = (
  params: TFormSchemaValueParams<TFormValueGetter, number> = {}
) => ({
  __node: 'value',
  __type: 'number',
  __params: params
})

export const arrayField = (
  childType: any,
  params: TFormSchemaArrayParams = {}
) => ({
  __node: 'array',
  __childType: childType,
  __params: params
})

export const objectField = (
  type: any,
  params: TFormSchemaObjectParams = {}
) => ({
  __node: 'object',
  __params: params,
  ...type
})

export const Schema = (schema: TFormSchemaNode): TFormSchema => ({ ...schema })

const generateSchemaFromRaw = (
  schemaNode: any,
  path: TFormNodeArrayPath
): any => {
  switch (schemaNode.__node) {
    case 'value':
      return {
        ...schemaNode,
        getPath: () => path
      }
    case 'array':
      return {
        ...schemaNode,
        getPath: () => path,
        at: (n: number) =>
          generateSchemaFromRaw(schemaNode.__childType, [...path, `${n}`])
      }

    case 'object':
    default:
      const schema: { [key: string]: any } = {
        getPath: () => path
      }

      for (const key of Object.keys(schemaNode)) {
        schema[key] = generateSchemaFromRaw(schemaNode[key], [...path, key])
      }

      return schema
  }
}

export function FormSchema<T = any>(rawSchema: any): T {
  return generateSchemaFromRaw(rawSchema, [])
}
