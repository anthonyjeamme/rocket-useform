import {
  TFormDataArrayNode,
  TFormDataValueFieldType,
  TFormDataValueNode,
  TFormValueGetter,
  TValueFormSchemaNode
} from '../../useForm.types'

import {
  getObjectPathChild,
  mergePaths,
  pathToArrayPath,
  pathToStringPath
} from '../../utils/formPath'
import { getGetterGenericFields, getStandardGetters } from './formGetter.common'
import { TGetterProps } from './formGetter.types'

const parseValue = (value: any, type: TFormDataValueFieldType) => {
  switch (type) {
    case 'string':
      return value?.toString?.()
    case 'number':
      return !value && value !== 0 ? null : parseFloat(value)
    case 'boolean':
      return !!value
  }
}

const valueGetter = ({
  formDataRef,
  path,
  formTools,
  formParams
}: TGetterProps): TFormValueGetter => {
  const child = getObjectPathChild(formDataRef.current, path, formParams)
  if (child.__node !== 'value') {
    console.error(`${pathToStringPath(path)} is not a value`)
    return null
  }

  const update = (value, refresh = false) => {
    const node = getObjectPathChild(
      formDataRef.current,
      path,
      formParams
    ) as TFormDataValueNode

    const params = (node.__schema as TValueFormSchemaNode).__params

    if (params.readOnly) {
      console.error(`Can't write ${pathToStringPath(path)} : readOnly field`)
      return
    }

    // TODO check entry value ?
    const oldValue = node.__value

    let needRefresh = false

    if (node.__error) {
      node.__error = false
      needRefresh = true
    }

    node.__value = parseValue(value, node.__type)
    formTools.handleModified({
      path: pathToArrayPath(path),
      oldValue,
      newValue: node.__value
    })
    if (needRefresh || refresh || params.autoRefresh) formTools.refresh()
  }

  const remove = () => {
    const node = getObjectPathChild(
      formDataRef.current,
      path,
      formParams
    ) as TFormDataValueNode

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
    ...getStandardGetters({
      formDataRef,
      formParams,
      formTools,
      path
    }),
    value: child.__value,
    remove,
    update
  }
}

export default valueGetter
