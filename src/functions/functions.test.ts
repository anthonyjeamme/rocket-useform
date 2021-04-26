import { textField } from '../useFormSchema'
import { formNodeToJSON } from './formNodeToJSON'
import { generateFormData } from './generateFormNode'

describe('Hook functions', () => {
	describe('raw matches toJSON', () => {
		describe('without schema', () => {
			it('object works properly', () => {
				const data = {
					user: {
						firstname: 'jean',
						lastname: 'moulin',
						age: 30
					}
				}

				const res = generateFormData(data, {}, [], {
					generateId: () => '0',
					handleModified: () => {},
					refresh: () => {}
				})

				expect(formNodeToJSON(res)).toStrictEqual(data)
			})

			it('array works properly', () => {
				const data = {
					users: [
						{
							firstname: 'jean',
							lastname: 'moulin',
							age: 30
						}
					]
				}

				const res = generateFormData(data, {}, [], {
					generateId: () => '0',
					handleModified: () => {},
					refresh: () => {}
				})

				expect(formNodeToJSON(res)).toStrictEqual(data)
			})

			it('works with complexe object', () => {
				const data = {
					a: [
						{
							b: {
								c: [
									{
										d: 'ok'
									}
								]
							},
							e: 'hop'
						}
					],
					f: {
						g: {
							h: [
								{
									i: 1
								},
								{
									i: 2
								},
								{
									i: 3
								},
								{
									i: 4,
									j: {
										k: 'ok'
									}
								}
							]
						}
					}
				}

				const res = generateFormData(data, {}, [], {
					generateId: () => '0',
					handleModified: () => {},
					refresh: () => {}
				})

				expect(formNodeToJSON(res)).toStrictEqual(data)
			})
		})

		describe('without data', () => {
			it('works with simple schema', () => {
				const schema = {
					firstname: textField(),
					lastname: textField()
				}

				const res = generateFormData({}, schema, [], {
					generateId: () => '0',
					handleModified: () => {},
					refresh: () => {}
				})

				expect(formNodeToJSON(res)).toStrictEqual({
					firstname: null,
					lastname: null
				})
			})
		})
	})
})
