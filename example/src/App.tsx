import React from 'react'
// import { TFormEvent } from '../../hooks/useForm/useForm.types'
import { useForm, textField, booleanField } from 'rocket-useform'

const data = {
  required: true,
  name: 'John'
}

const schema = {
  required: booleanField(),
  name: textField({
    validation: (value, { getValue }) => {
      //

      const required = getValue('root.required').value

      if (!required) return true

      return value === 'tony'
    }
  })
}

const BasicExample = () => {
  const form = useForm(data, schema)

  console.log(form.toJSON())

  return (
    <div>
      <div className='container'>
        <input
          type='checkbox'
          checked={form.getValue('required').value}
          onChange={() => {
            form
              .getValue('required')
              .update(!form.getValue('required').value, true)
          }}
        />

        <input
          {...matchInput(form.getValue('name'))}
          style={{
            borderColor: form.getValue('name').error ? 'red' : ''
          }}
        />
        <button
          onClick={() => {
            console.log(
              form.checkForm({
                log: true
              })
            )
          }}
        >
          Test
        </button>
      </div>
    </div>
  )
}

export default BasicExample

export const matchInput = ({ value, update, error }: any, refresh = false) => ({
  value: refresh ? value : undefined,
  defaultValue: refresh ? undefined : value,
  onChange: (e: any) => {
    update(e.target.value, refresh)
  },
  error
})
