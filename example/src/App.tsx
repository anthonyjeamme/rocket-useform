import React, { useEffect, useRef } from 'react'
// import { TFormEvent } from '../../hooks/useForm/useForm.types'
import { useForm, textField, numberField, arrayField } from 'rocket-useform'

const data = {
  enabled: false,
  creation: { complete: false, currentStep: 0 },
  miniature: null,
  gallery: [],
  title: '',
  description: '',
  note: '',
  informations: { gender: 'unisex', moods: [], labels: [], who: [] },
  about: null,
  tags: null,
  pricing: null,
  options: [],
  reservation_policy: null,
  activities: [],
  category: null,
  type: 'product',
  delivery: {
    ownDelivery: {
      enabled: false,
      freeAfterOrderPrice: null,
      note: '',
      preparationDelay: null,
      price: null,
      pricing: null
    },
    shippingOptions: [],
    takeAway: { enabled: false, preparationDelay: null, note: '' }
  },
  giftPackage: { available: false, price: null },
  characteristics: {
    height: null,
    length: null,
    volume: null,
    weight: null,
    width: null
  },
  id: '60a15faf64f3b30782b3b3a8'
}

const schema = {
  type: textField(),
  title: textField(),
  category: textField(),
  tva: numberField(),
  description: textField({ required: true }),
  note: textField({ required: false, defaultValue: '' }),
  schedules: {
    type: textField()
  },
  informations: {
    gender: textField({ required: true, defaultValue: 'unisex' }),
    moods: arrayField(textField()),
    who: arrayField(textField(), {
      defaultValue: ['everyone']
    }),
    labels: arrayField(textField())
  },

  time_limit: numberField({
    // validation: (value, get) => {
    // 	return true
    // 	if (get('parent._type').value !== 'service') return true
    // 	return !!value
    // }
  }),
  reservation_policy: {
    confirmation_method: textField({ required: true }),
    cancellation: textField({ required: true })
  },
  activities: arrayField(textField(), {})
}

const BasicExample = () => {
  const refreshCounter = useRef<number>(0)
  const form = useForm(data, schema)
  const textareaRef = useRef<any>()

  useEffect(() => {
    const handleChange = (event: any) => {
      console.log(event)
      // @ts-ignore
      textareaRef.current.value = JSON.stringify(form.toJSON(), null, 2)
    }

    form.addEventListener('change', handleChange)
    return () => {
      form.removeEventListener('change', handleChange)
    }
  }, [])

  const handleSave = () => {
    if (form.checkForm()) {
      form.setModified(false)
    } else {
      console.log(`There is error(s) in form`)
    }
  }

  return null

  return (
    <div
      style={{
        display: 'flex',
        padding: 40
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            padding: 40
          }}
        >
          {form.getArray('closed_periods').map(() => (
            <div>item</div>
          ))}

          <button
            onClick={() => {
              form.getArray('closed_periods').insert({})
            }}
          >
            text
          </button>
        </div>

        <div>Refresh counter : {refreshCounter.current++}</div>

        <div>
          <Input
            placeholder='firstName'
            {...matchCustomInput(form.get('user.firstName'))}
          />
          <Input
            placeholder='lastName'
            {...matchCustomInput(form.get('user.lastName'))}
          />
          <Input
            type='number'
            placeholder='age'
            {...matchCustomInput(form.get('user.age'))}
          />
        </div>

        <div>
          <button disabled={!form.modified} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          ref={textareaRef}
          style={{
            width: '100%',
            height: 500,
            fontSize: 12
          }}
          readOnly
          defaultValue={JSON.stringify(form.toJSON(), null, 2)}
        />
      </div>
    </div>
  )
}

export default BasicExample

const Input = ({ value, onChange, error, ...props }: any) => (
  <input
    {...props}
    defaultValue={value}
    onChange={(e) => {
      onChange(e.target.value)
    }}
    style={{
      border: error ? `1px solid red` : `1px solid #dddddd`
    }}
  />
)

export const matchCustomInput = ({ value, update, error }: any) => ({
  value,
  onChange: update,
  error
})
