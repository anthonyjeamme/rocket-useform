import {
	TFormDataArrayNode,
	TFormDataNode,
	TFormDataObjectNode,
	TFormDataRawNode,
	TFormDataValueNode,
	TFormNodePath,
	TFormSchemaNode,
	TFormSchemaNodeType,
	TFormTools,
	TValueFormSchemaNode
} from '../useForm.types'
import { mergePaths, pathToStringPath } from '../utils/formPath'

export function generateFormData(
	data,
	schema,
	path: TFormNodePath = [],
	formTools: TFormTools
): TFormDataNode {
	if (!schema) return generateRawFormNode(data, path, formTools)

	const type: TFormSchemaNodeType = checkSchemaMatchData(data, schema, path)

	switch (type) {
		case 'object':
			return generateObjectFormNode(data, schema, path, formTools)
		case 'array':
			return generateArrayFormNode(data, schema, path, formTools)
		case 'value':
			return generateValueFormNode(data, schema, path, formTools)
	}

	return null
}

const generateRawFormNode = (
	data,
	path: TFormNodePath,
	formTools: TFormTools
): TFormDataRawNode => ({
	__id: formTools.generateId(),
	__node: 'raw',
	__value: data,
	__path: path,
	__schema: null
})

function generateObjectFormNode(
	data,
	schema,
	path: TFormNodePath,
	formTools: TFormTools
): TFormDataObjectNode | TFormDataRawNode {
	const keys = Array.from(
		new Set(
			!data
				? Object.keys(schema)
				: !schema
				? Object.keys(data)
				: [...Object.keys(data), ...Object.keys(schema)]
		)
	)

	let formData: TFormDataObjectNode = {
		__id: formTools.generateId(),
		__error: false,
		__path: path,
		__schema: schema,
		__node: 'object',
		__children: {}
	}

	for (const key of keys) {
		formData.__children[key] = generateFormData(
			data?.[key],
			schema?.[key],
			mergePaths([path, [key]]),
			formTools
		)
	}

	return formData
}

function generateArrayFormNode(
	data,
	schema,
	path: TFormNodePath,
	formTools: TFormTools
): TFormDataArrayNode | TFormDataRawNode {
	return {
		__id: formTools.generateId(),
		...schema,
		__error: false,
		__schema: schema,
		__children: data.map((item, i) =>
			generateFormData(
				item,
				schema.__childType,
				mergePaths([path, [`${i}`]]),
				formTools
			)
		)
	}
}

function generateValueFormNode(
	value,
	schema: TValueFormSchemaNode,
	path: TFormNodePath,
	formTools: TFormTools
): TFormDataValueNode | TFormDataRawNode {
	const __value = value || schema.__params.defaultValue || null

	return {
		__id: formTools.generateId(),
		__error: false,
		__schema: schema,
		__node: schema.__node,
		__type: schema.__type,
		__value,
		__path: path
	}
}

function checkSchemaMatchData(
	data,
	schema: TFormSchemaNode,
	path: TFormNodePath
) {
	const dataType =
		data === undefined
			? null
			: Array.isArray(data)
			? 'array'
			: typeof data === 'object'
			? 'object'
			: 'value'

	const schemaType = getSchemaNodeType(schema)

	if (!dataType) return schemaType

	if (schemaType !== dataType)
		throw `Type '${schemaType}' expected by schema, but got '${dataType}' in data for field '${pathToStringPath(
			path
		)}'`

	return schemaType
}

const getSchemaNodeType = (
	schemaNode: TFormSchemaNode
): TFormSchemaNodeType => {
	if (!schemaNode) return null
	if (!schemaNode.__node) return 'object'
	return schemaNode?.__node
}
