import { useState } from 'react'

export const mergeStringPaths = (paths: string[]) => paths.join('.')

export const useRefresh = () => {
	const [, setN] = useState(0)

	const refresh = () => {
		setN(n => n + 1)
	}

	return refresh
}

export const matchInput = ({ value, update }) => ({
	defaultValue: value,
	onChange: e => {
		update(e.target.value)
	}
})

export const matchCustomInput = ({ value, update, error }) => ({
	value,
	onChange: update,
	error
})
