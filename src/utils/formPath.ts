import { generateFormData } from '../functions/generateFormNode'
import {
	TFormDataArrayNode,
	TFormDataNode,
	TFormNodePath,
	TFormParams,
	TFormNodeArrayPath
} from '../useForm.types'

/**
 * Handle parents.
 */
export const evalPath = (
	arrayPath: TFormNodeArrayPath,
	formParams: TFormParams
) => {
	let path: TFormNodePath = []

	const parentKeyword = formParams?.parentKeyword || 'parent'

	for (const p of arrayPath) {
		if (p === parentKeyword) {
			if (path.length === 0) throw "Can't parent on root"
			path = path.slice(0, -1)
		} else if (p === 'root') {
			path = []
		} else {
			path.push(p)
		}
	}
	return path
}

export const pathToArrayPath = (path: any) => {
	if (typeof path === 'string') return path.length === 0 ? [] : path.split('.')
	if (Array.isArray(path)) return path
	if (typeof path?.getPath === 'function')
		return pathToArrayPath(path.getPath())
	return null
}

export const pathToStringPath = (path: any) => {
	if (typeof path === 'string') return path
	if (Array.isArray(path)) return path.join('.')
	if (typeof path?.getPath === 'function')
		return pathToStringPath(path.getPath())
	return null
}

export const replaceAtPath = (
	formDataRef: React.MutableRefObject<TFormDataNode>,
	path: TFormNodePath,
	data: any,
	formParams,
	formTools
) => {
	const arrayPath = pathToArrayPath(path)

	let parent = getObjectPathChild(
		formDataRef.current,
		arrayPath.slice(0, -1),
		formParams
	)

	let node = getObjectPathChild(formDataRef.current, arrayPath, formParams)

	const lastKey = arrayPath.slice(-1)[0]

	if (parent.__node === 'object' || parent.__node === 'array') {
		parent.__children[lastKey] = generateFormData(
			data,
			node.__schema,
			arrayPath,
			formTools
		)
	}

	return
}

export function getObjectPathChild<T = any>(
	object: TFormDataNode,
	path: TFormNodePath,
	formParams: TFormParams
) {
	const pathKeys = evalPath(pathToArrayPath(path), formParams)

	let child: TFormDataNode = object

	for (const key of pathKeys)
		switch (child.__node) {
			case 'object':
				if (!child.__children[key])
					throw `Can't get ${pathToStringPath(path)}, [${key}] doesn't exists`
				child = child.__children[key]
				break
			case 'array':
				if (!child.__children[key])
					throw `Can't get ${pathToStringPath(path)}, [${key}] doesn't exists`
				child = (child as TFormDataArrayNode).__children[key]
				break
		}

	return child
}

export const mergePaths = (paths: TFormNodePath[]) => {
	return paths.reduce(
		(acc: TFormNodeArrayPath, path) => [...acc, ...pathToArrayPath(path)],
		[]
	)
}
