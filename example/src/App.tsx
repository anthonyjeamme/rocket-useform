import React, { useEffect } from 'react'
// import { TFormEvent } from '../../hooks/useForm/useForm.types'
import { arrayField, booleanField, textField, useForm } from 'rocket-useform'

const data = {
  // enabled: false,
  // creation: { complete: false, currentStep: 0 },
  // miniature: null,
  // gallery: [],
  // title: '',
  // description: '',
  // note: '',
  // informations: { gender: 'unisex', moods: [], labels: [], who: [] },
  // about: null,
  // tags: null,
  // pricing: null,
  // options: [],
  // reservation_policy: null,
  // activities: [],
  // category: null,
  // type: 'product',
  // delivery: {
  //   ownDelivery: {
  //     enabled: false,
  //     freeAfterOrderPrice: null,
  //     note: '',
  //     preparationDelay: null,
  //     price: null,
  //     pricing: null
  //   },
  //   shippingOptions: [],
  //   takeAway: { enabled: false, preparationDelay: null, note: '' }
  // },
  // giftPackage: { available: false, price: null },
  // characteristics: {
  //   height: null,
  //   length: null,
  //   volume: null,
  //   weight: null,
  //   width: null
  // },
  id: 'xce'
}

const schema = {
  test: {
    name: textField(),
    majeur: booleanField()
  },

  list: arrayField({
    name: textField()
  })
}

const BasicExample = () => {
  const form = useForm(data, schema)

  useEffect(() => {
    const handleUp = ({ ...p }) => {
      console.log('ok', p)
    }

    form.addEventListener('change', handleUp)
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
      <h1>okok</h1>

      <input
        value={form.getValue('test.name').value}
        onChange={(e) => {
          form.getValue('test.name').update(e.target?.value, true)
        }}
      />

      <hr />

      {form.getArray('list').map((item) => (
        <div key={item.id}>
          <input
            value={item.getValue('name').value}
            onChange={(e) => {
              item.getValue('name').update(e.target?.value, true)
            }}
          />
          <button
            onClick={() => {
              item.remove()
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <hr />
      <button
        onClick={() => {
          form.getArray('list').insert({})
        }}
      >
        plust
      </button>

      <button
        onClick={() => {
          form.getArray('list').set([], true)
        }}
      >
        replace
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
