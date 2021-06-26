import {
  TFormDataArrayNode,
  TFormDataNode,
  TFormDataObjectNode,
  TFormDataRawNode,
  TFormDataValueNode
} from '../useForm.types'

export function formNodeToJSON(formNode: TFormDataNode): any {
  switch (formNode?.__node) {
    case 'object':
      return formNodeObjectToJSON(formNode)
    case 'array':
      return formNodeArrayToJSON(formNode)
    case 'value':
      return formNodeValueToJSON(formNode)
    case 'raw':
      return formNodeRawToJSON(formNode)
  }
}

function formNodeObjectToJSON(formNode: TFormDataObjectNode) {
  const json: { [key: string]: any } = {}

  for (const key of Object.keys(formNode.__children)) {
    if (key !== 'getPath') {
      const value = formNodeToJSON(formNode.__children[key])

      if (value !== undefined) json[key] = value
    }
  }

  return json
}

function formNodeArrayToJSON(formNode: TFormDataArrayNode) {
  return formNode.__children.map((child) => formNodeToJSON(child))
}

function formNodeValueToJSON(formNode: TFormDataValueNode) {
  if (formNode.__schema.__params.ignoreInJSON) return undefined
  return formNode.__value
}

function formNodeRawToJSON(formNode: TFormDataRawNode) {
  return formNode.__value
}
