import {
  TFormDataArrayNode,
  TFormDataObjectNode,
  TFormNodePath,
  TFormObjectGetter
} from '../../useForm.types'
import {
  getObjectPathChild,
  mergePaths,
  pathToArrayPath,
  pathToStringPath,
  replaceAtPath
} from '../../utils/formPath'
import { getGetterGenericFields, getStandardGetters } from './formGetter.common'
import { TGetterProps } from './formGetter.types'

const objectGetter = ({
  formDataRef,
  path,
  formTools,
  formParams
}: TGetterProps): TFormObjectGetter => {
  const child = getObjectPathChild(formDataRef.current, path, formParams)

  if (child.__node !== 'object') {
    console.error(`${pathToStringPath(path)} is not an object`)
    return null
  }

  const set = (data, refresh = false) => {
    const node = getObjectPathChild(
      formDataRef.current,
      path,
      formParams
    ) as TFormDataObjectNode

    replaceAtPath(formDataRef, path, data, formParams, formTools)
    formTools.handleModified({
      path: pathToArrayPath(node.__path).slice(0, -1),
      oldValue: null,
      newValue: null,
      action: 'set',
      targetType: 'array'
    })
    if (refresh) formTools.refresh()

    child.__listeners.change.forEach((func) => {
      func()
    })
  }

  const value = (targetPath: TFormNodePath) => {
    const _path = mergePaths([path, targetPath])
    const child = getObjectPathChild(formDataRef.current, _path, formParams)

    if (child.__node !== 'value')
      console.error(`Can't get ${_path} value (not row|value) type`)

    return child
  }

  const remove = () => {
    const node = getObjectPathChild(
      formDataRef.current,
      path,
      formParams
    ) as TFormDataObjectNode

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

  const addEventListener = (event, callback) => {
    child.__listeners[event].push(callback)
  }

  const removeEventListener = (event, callback) => {
    child.__listeners[event] = child.__listeners[event].filter(
      (c) => c !== callback
    )
  }

  return {
    ...getGetterGenericFields({ formDataRef, child, path, formParams }),
    ...getStandardGetters({
      formDataRef,
      formParams,
      formTools,
      path
    }),
    set,
    value,
    remove,
    addEventListener,
    removeEventListener
  }
}

export default objectGetter
