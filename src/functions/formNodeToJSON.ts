import {
	TFormDataArrayNode,
	TFormDataNode,
	TFormDataObjectNode,
	TFormDataRawNode,
	TFormDataValueNode
} from '../useForm.types'

export function formNodeToJSON(formNode: TFormDataNode) {
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
	const json = {}

	for (const key of Object.keys(formNode.__children)) {
		if (key !== 'getPath') json[key] = formNodeToJSON(formNode.__children[key])
	}

	return json
}

function formNodeArrayToJSON(formNode: TFormDataArrayNode) {
	return formNode.__children.map(child => formNodeToJSON(child))
}

function formNodeValueToJSON(formNode: TFormDataValueNode) {
	return formNode.__value
}

function formNodeRawToJSON(formNode: TFormDataRawNode) {
	return formNode.__value
}
