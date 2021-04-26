import {
  TFormDataArrayNode,
  TFormDataObjectNode,
  TFormNodePath,
  TFormObjectGetter
} from '../../useForm.types'
import {
  getObjectPathChild,
  mergePaths,
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
    replaceAtPath(formDataRef, path, data, formParams, formTools)
    formTools.handleModified(null)
    if (refresh) formTools.refresh()
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
    remove
  }
}

export default objectGetter
