import {
	TFormDataValueFieldType,
	TFormDataValueNode,
	TFormValueGetter,
	TValueFormSchemaNode
} from '../../useForm.types'

import {
	getObjectPathChild,
	pathToArrayPath,
	pathToStringPath
} from '../../utils/formPath'
import { getGetterGenericFields, getStandardGetters } from './formGetter.common'
import { TGetterProps } from './formGetter.types'

const parseValue = (value: any, type: TFormDataValueFieldType) => {
	switch (type) {
		case 'string':
			return value.toString()
		case 'number':
			return parseFloat(value)
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

	return {
		...getGetterGenericFields({ formDataRef, child, path, formParams }),
		...getStandardGetters({
			formDataRef,
			formParams,
			formTools,
			path
		}),
		value: child.__value,
		update
	}
}

export default valueGetter
