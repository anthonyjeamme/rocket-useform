import {
  TArrayFormSchemaNode,
  TFormArrayGetter,
  TFormDataArrayNode
} from '../../useForm.types'
import {
  getObjectPathChild,
  mergePaths,
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
}: TGetterProps): TFormArrayGetter => {
  const child = getObjectPathChild(formDataRef.current, path, formParams)
  if (child.__node !== 'array') {
    console.error(`${pathToStringPath(path)} is not an array`)
    return null
  }

  const set = (data, refresh = false) => {
    replaceAtPath(formDataRef, path, data, formParams, formTools)
    formTools.handleModified(null)
    if (refresh) formTools.refresh()
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
    insert: (data: any, index: number = null) => {
      const child = getObjectPathChild(
        formDataRef.current,
        path,
        formParams
      ) as TFormDataArrayNode
      const childType = (child.__schema as TArrayFormSchemaNode).__childType

      const _index = index === null ? child.__children.length : index

      child.__children = [
        ...child.__children.slice(0, _index),
        generateFormData(
          data,
          childType,
          mergePaths([path, child.__children.length.toString()]),
          formTools
        ),
        ...child.__children.slice(_index)
      ]

      formTools.refresh()
    },

    toJSON: () => {
      return formNodeToJSON(
        getObjectPathChild(formDataRef.current, path, formParams)
      )
    }
  }
}

export default arrayGetter
