import React, { useEffect } from 'react'
// import { TFormEvent } from '../../hooks/useForm/useForm.types'
import { booleanField, useForm } from 'rocket-useform'

const data = {
  enabled: false
}

const schema = {
  enabled: booleanField()
}

const BasicExample = () => {
  const form = useForm(data, schema)

  useEffect(() => {
    const handleUp = ({ ...p }) => {
      console.log('ok', p)
    }

    form.addEventListener('change', handleUp)
  }, [])

  console.log(form.getValue('enabled').value)

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

  return <div></div>
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
