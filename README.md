<center>
  <img height="200" src="https://res.cloudinary.com/anthony-jeamme-stuff/image/upload/w_200/shares/rocket-userform-logo.png">

# Rocket useForm

</center>

<b>WARNING: library in alpha version</b>

Rocket useForm is a rich React library based on useRef.
It's an easy-to-use solution to build big and complex forms.

## Installation

```bash
npm i rocket-useform
```

## Getting started

```tsx

const data = {
	name: 'john doe'
}

const schema = Schema({
	name: textField({required:true, validation: (name)=>name.length > 3})
})

const MyForm = () => {

	const form = useForm(data, schema)

	const handleSave = () => {

		if(form.checkForm()){
			console.log(form.toJSON())
			form.setModified(false)
		} else {
			console.warn('Il y a des champs incorrects !')
		}
	}

	return (
		<div>
			{form.modified ? 'Modifié':''}
			<input {...matchInput(form.get('name))}>
			<button onClick={()=>handleSave()}>SAVE</button>
		</div>
	)
}

```

## Main concepts

### Schema based

```tsx
const schema = Schema({
  name: textField()
})
```

Possible fields types:

- `textField`
- `numberField`
- `booleanField`
- `arrayField`

Each field schema can take a param argument, where you will define validation rules, defaultValue and so on:

```tsx
const schema = Schema({
  email: textField({
    validators: [Validator.TEmail]
  })
})
```

See docs for more details

### Path system

```jsx
const cityField = form.get('user.address.city')
```

Can also be splitted :

```jsx
const addressField = form.get('user.address')
const cityField = addressField.get('city')
```

Get parent :

```jsx
const cityField = form.get('user.address.city')
const addressField = addressField.get('parent')
```

From root :

```jsx
const cityField = form.get('user.address.city')
const nameField = addressField.get('root.user.name')
```

### Node

Form is a tree of Nodes reachable through path:

```jsx
const rootNode = form.get('')
const userNode = rootNode.get('user')
```

### Stateless

Rocket useForm is stateless for performance. It means that data flow is unidirectional.

- You need sur match input with defaultValue :

```jsx
	<input
		defaultValue={form.get('name').value}
		onChange={e => form.get('name').update(e.target.value)}
	>
```

But don't worry ! You can force refresh this way :

```jsx
	<input
		defaultValue={form.get('name').value}
		onChange={e => form.get('name').update(e.target.value, true)}
	>
```

update function take a boolean as second argument : forceRefresh

## Schema

### Field

- Text field

```tsx
const schema = {
  name: textField()
}
```

- Number field

```tsx
const schema = {
  name: numberField()
}
```

- Boolean field

```tsx
const schema = {
  name: booleanField()
}
```

### Object

### Array

```tsx
const schema = {
  users: arrayField({
    name: textField()
  })
}
```

### Params
