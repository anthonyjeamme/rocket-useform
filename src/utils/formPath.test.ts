import { generateFormData } from '../functions/generateFormNode'
import { TFormDataValueNode } from '../useForm.types'
import { textField } from '../useFormSchema'
import {
  pathToArrayPath,
  evalPath,
  pathToStringPath,
  getObjectPathChild,
  mergePaths
} from './formPath'

describe(`formPath`, () => {
  describe(`evalPath`, () => {
    it(`works with simple path`, () => {
      const path = [`a`, `b`, `c`, `d`]
      expect(evalPath(path, {})).toStrictEqual(path)
    })

    it(`works with parents`, () => {
      const path = [`a`, `b`, `parent`, `c`, `d`, `parent`, `parent`]
      expect(evalPath(path, {})).toStrictEqual([`a`])
    })

    it(`works with root`, () => {
      const path = [`a`, `b`, `c`, `d`, `root`, `a`]
      expect(evalPath(path, {})).toStrictEqual([`a`])
    })

    it(`works mixed`, () => {
      const path = [`a`, `b`, `c`, `d`, `parent`, `root`, `a`, `b`, `parent`]
      expect(evalPath(path, {})).toStrictEqual([`a`])
    })
  })

  describe(`pathToArrayPath`, () => {
    it(`works with string path`, () => {
      expect(pathToArrayPath('a.b.c')).toStrictEqual(['a', 'b', 'c'])
      expect(pathToArrayPath('')).toStrictEqual([])
    })
    it(`works with array path`, () => {
      expect(pathToArrayPath(['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c'])
      expect(pathToArrayPath([])).toStrictEqual([])
    })
    it(`works with node path / string`, () => {
      expect(pathToArrayPath({ getPath: () => 'a.b.c' })).toStrictEqual([
        'a',
        'b',
        'c'
      ])
    })

    it(`works with node path / array`, () => {
      expect(
        pathToArrayPath({ getPath: () => ['a', 'b', 'c'] })
      ).toStrictEqual(['a', 'b', 'c'])
    })

    it(`returns null if no correct entry`, () => {
      expect(pathToArrayPath(null)).toBeNull()
      expect(pathToArrayPath({})).toBeNull()
      expect(pathToArrayPath(true)).toBeNull()
      expect(pathToArrayPath(1)).toBeNull()
    })
  })

  describe('pathToStringPath', () => {
    it('works with string path', () => {
      expect(pathToStringPath('a.b.c')).toBe('a.b.c')
    })

    it('works with array path', () => {
      expect(pathToStringPath(['a', 'b', 'c'])).toBe('a.b.c')
    })

    it('works with node path / string', () => {
      expect(pathToStringPath({ getPath: () => 'a.b.c' })).toBe('a.b.c')
    })

    it('works with node path / array', () => {
      expect(pathToStringPath({ getPath: () => ['a', 'b', 'c'] })).toBe('a.b.c')
    })

    it('returns null if no correct entry', () => {
      expect(pathToStringPath(null)).toBeNull()
      expect(pathToStringPath({})).toBeNull()
      expect(pathToStringPath(true)).toBeNull()
      expect(pathToStringPath(1)).toBeNull()
    })
  })

  describe('mergePaths', () => {
    it('works with string paths', () => {
      expect(mergePaths(['a', 'b.c'])).toStrictEqual(['a', 'b', 'c'])
    })

    it('works with array paths', () => {
      expect(mergePaths([['a'], ['b', 'c']])).toStrictEqual(['a', 'b', 'c'])
    })

    it('works with node path / string', () => {
      expect(
        mergePaths([
          { getPath: () => 'a' } as any,
          { getPath: () => 'b.c' } as any
        ])
      ).toStrictEqual(['a', 'b', 'c'])
    })

    it('works mixed', () => {
      expect(
        mergePaths([
          'a.b',
          ['c', 'd'],
          {
            getPath: () => 'e.f'
          } as any
        ])
      ).toStrictEqual(pathToArrayPath('a.b.c.d.e.f'))
    })
  })

  describe('getObjectPathChild', () => {
    const dataNode = generateFormData(
      { a: { b: { c: 'success' } } },
      {
        a: { b: { c: textField() } }
      },
      [],
      {
        generateId: () => '0',
        handleModified: () => {},
        refresh: () => {}
      }
    )

    expect(
      // @ts-ignore
      (getObjectPathChild(dataNode, ['a', 'b', 'c'], {}) as TFormDataValueNode)
        .__value
    ).toBe('success')
  })
})
