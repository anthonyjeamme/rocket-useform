import { TFormNodePath } from '../../useForm.types'
import {
  getObjectPathChild,
  mergePaths,
  pathToArrayPath
} from '../../utils/formPath'
import { formNodeToJSON } from '../formNodeToJSON'
import arrayGetter from './arrayGetter'
import formGetter from './formGetter'
import valueGetter from './valueGetter'
import objectGetter from './objectGetter'

export const getGetterGenericFields = ({
  formDataRef,
  child,
  path,
  formParams
}: any) => ({
  id: child.__id,
  error: child.__error,
  getPath: () => pathToArrayPath(path),
  toJSON: () => {
    return formNodeToJSON(
      getObjectPathChild(formDataRef.current, path, formParams)
    )
  }
})

export const getStandardGetters = ({
  formDataRef,
  path,
  formTools,
  formParams
}: any) => {
  const getterProps = (targetPath: any) => ({
    formDataRef,
    path: mergePaths([path, targetPath]),
    formTools,
    formParams
  })

  return {
    get: (targetPath: TFormNodePath) => {
      return formGetter(getterProps(targetPath))
    },
    getObject: (targetPath: TFormNodePath) => {
      return objectGetter(getterProps(targetPath))
    },
    getArray: (targetPath: TFormNodePath) => {
      return arrayGetter(getterProps(targetPath))
    },
    getValue: (targetPath: TFormNodePath) => {
      return valueGetter(getterProps(targetPath))
    }
  }
}
