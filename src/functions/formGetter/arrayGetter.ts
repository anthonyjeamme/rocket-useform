import {
  TArrayFormSchemaNode,
  TFormArrayGetter,
  TFormDataArrayNode
} from '../../useForm.types'
import {
  getObjectPathChild,
  mergePaths,
  pathToArrayPath,
  pathToStringPath,
  replaceAtPath
} from '../../utils/formPath'
import { formNodeToJSON } from '../formNodeToJSON'
import { generateFormData } from '../generateFormNode'
import formGetter from './formGetter'
import { getGetterGenericFields, getStandardGetters } from './formGetter.common'
import { TGetterProps } from './formGetter.types'

const arrayGetter = ({
  formDataRef,
  path,
  formTools,
  formParams
}: TGetterProps): TFormArrayGetter | null => {
  const child = getObjectPathChild(formDataRef.current, path, formParams)
  if (child.__node !== 'array') {
    console.error(`${pathToStringPath(path)} is not an array`)
    return null
  }

  const set = (data: any, refresh = false) => {
    replaceAtPath(formDataRef, path, data, formParams, formTools)
    formTools.handleModified({
      path: pathToArrayPath(path)
    })
    if (refresh) formTools.refresh()

    formTools.handleModified({
      path: pathToArrayPath(path),
      oldValue: null,
      newValue: null,
      action: 'set',
      targetType: 'array'
    })
  }

  const remove = () => {
    const node = getObjectPathChild(
      formDataRef.current,
      path,
      formParams
    ) as TFormDataArrayNode

    const parent = getObjectPathChild(
      formDataRef.current,
      mergePaths([path, 'parent']),
      formParams
    ) as TFormDataArrayNode

    if (parent.__node !== 'array')
      throw `Can't remove ${pathToStringPath(path)}, parent isn't an array`

    parent.__children = parent.__children.filter(
      (child) => child.__id !== node.__id
    )

    formTools.refresh()
    formTools.handleModified({
      path: pathToArrayPath(node.__path).slice(0, -1),
      oldValue: null,
      newValue: null,
      action: 'remove',
      removedIndex: parseInt(pathToArrayPath(node.__path).slice(-1)[0], 10),
      targetType: 'array'
    })
  }

  return {
    ...getGetterGenericFields({ formDataRef, child, path, formParams }),
    set,
    length: child.__children.length,
    map: (callback) => {
      return child.__children.map((_, index: number) => {
        return callback(
          formGetter({
            formDataRef,
            path: mergePaths([path, index.toString()]),
            formTools,
            formParams
          }),
          index
        )
      })
    },
    ...getStandardGetters({
      formDataRef,
      formParams,
      formTools,
      path
    }),
    remove,
    insert: (data: any, index: number | null = null) => {
      const child = getObjectPathChild(
        formDataRef.current,
        path,
        formParams
      ) as TFormDataArrayNode
      const childType = (child.__schema as TArrayFormSchemaNode).__childType
      const params = (child.__schema as TArrayFormSchemaNode).__params

      const _index = index === null ? child.__children.length : index

      if (params?.constraints?.maxLength) {
        if (child.__children.length + 1 > params?.constraints?.maxLength) {
          return
        }
      }

      const children = [
        ...child.__children.slice(0, _index),
        generateFormData(
          data,
          childType,
          mergePaths([path, child.__children.length.toString()]),
          formTools
        ),
        ...child.__children.slice(_index)
      ]

      // @ts-ignore
      child.__children = children

      formTools.refresh()

      formTools.handleModified({
        path: pathToArrayPath(path),
        oldValue: null,
        newValue: null,
        action: 'insert',
        targetType: 'array'
      })
    },

    toJSON: () => {
      return formNodeToJSON(
        getObjectPathChild(formDataRef.current, path, formParams)
      )
    }
  } as TFormArrayGetter
}

export default arrayGetter
