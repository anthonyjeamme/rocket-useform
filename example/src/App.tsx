import React, { useEffect } from 'react'
// import { TFormEvent } from '../../hooks/useForm/useForm.types'
import { arrayField, textField, useForm } from 'rocket-useform'

const data = {
  list: [{}]
}

const schema = {
  list: arrayField(
    {
      name: textField({
        required: true,
        validation: (value) => {
          return !!value
        },
        defaultValue: 'bla'
      })
    },
    {
      required: true,
      validation: (value: any) => {
        console.log({ value })
        console.log('XXXXXXXXXX')
        return false
      }
    }
  ),
  xxx: textField({
    defaultValue: 'xxx',
    ignoreInJSON: true
  })
}

const BasicExample = () => {
  const form = useForm(data, schema)

  useEffect(() => {
    console.log(form.checkForm())
  }, [])

  // useEffect(() => {
  //   const handleChange = (event: any) => {
  //     console.log(event)
  //     // @ts-ignore
  //     textareaRef.current.value = JSON.stringify(form.toJSON(), null, 2)
  //   }

  //   form.addEventListener('change', handleChange)
  //   return () => {
  //     form.removeEventListener('change', handleChange)
  //   }
  // }, [])

  // const handleSave = () => {
  //   if (form.checkForm()) {
  //     form.setModified(false)
  //   } else {
  //     console.log(`There is error(s) in form`)
  //   }
  // }

  return (
    <div>
      {form.getArray('list').map((item) => (
        <div key={item.id}>ok</div>
      ))}
      <button
        onClick={() => {
          console.log(form.toJSON())
        }}
      >
        OK
      </button>
    </div>
  )
}

export default BasicExample

// const Input = ({ value, onChange, error, ...props }: any) => (
//   <input
//     {...props}
//     defaultValue={value}
//     onChange={(e) => {
//       onChange(e.target.value)
//     }}
//     style={{
//       border: error ? `1px solid red` : `1px solid #dddddd`
//     }}
//   />
// )

export const matchCustomInput = ({ value, update, error }: any) => ({
  value,
  onChange: update,
  error
})
