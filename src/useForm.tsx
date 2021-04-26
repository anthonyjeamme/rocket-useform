import { useRef, useState } from 'react'
import checkErrors from './functions/checkErrors'

import { formNodeToJSON } from './functions/formNodeToJSON'
import { generateFormData } from './functions/generateFormNode'
import { useRefresh } from './functions/misc'
import {
  TForm,
  TFormDataNode,
  TFormEventType,
  TFormEventCallback,
  TFormParams,
  TFormSchema,
  TFormTools,
  TFormEventListenerRef
} from './useForm.types'
import { pathToStringPath } from './utils/formPath'
import { getStandardGetters } from './functions/formGetter/formGetter.common'

export function useForm<T = any>(
  data: T,
  schema: TFormSchema,
  formParams?: TFormParams
): TForm {
  const eventListenersRef = useRef<TFormEventListenerRef>({
    change: []
  })
  const [modified, setModified] = useState<boolean>(false)
  const refresh = useRefresh()
  const generateId = useIdGenerator()

  const formTools: TFormTools = {
    handleModified: ({ path, oldValue, newValue }) => {
      setModified(true)

      for (const listener of eventListenersRef.current.change) {
        listener({
          path,
          pathString: pathToStringPath(path),
          type: 'change',
          oldValue,
          newValue
        })
      }
    },
    refresh,
    generateId
  }

  const formDataRef = useRef<TFormDataNode>(
    generateFormData(data, schema, [], formTools)
  )

  const toJSON = () => formNodeToJSON(formDataRef.current)

  const checkForm = () => {
    const isOk = checkErrors({ formTools, formParams, formDataRef })
    refresh()
    return isOk
  }

  const addEventListener = (
    event: TFormEventType,
    callback: TFormEventCallback
  ) => {
    eventListenersRef.current[event].push(callback)
  }
  const removeEventListener = (
    event: TFormEventType,
    callback: TFormEventCallback
  ) => {
    eventListenersRef.current[event] = eventListenersRef.current[event].filter(
      (listener) => listener !== callback
    )
  }

  return {
    toJSON,
    modified,
    setModified,
    checkForm,
    addEventListener,
    removeEventListener,

    // Getters
    ...getStandardGetters({
      formDataRef,
      path: [],
      formTools,
      formParams
    })
  }
}

const useIdGenerator = () => {
  const idCountRef = useRef<number>(0)

  const generateId = () => {
    return (idCountRef.current++).toString()
  }

  return generateId
}
