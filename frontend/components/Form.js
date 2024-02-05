import axios from 'axios'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'


// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}
console.log(validationErrors.fullNameTooLong)

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(),
  size: yup
    .string()
    .oneOf(['Small', 'Medium', 'Large'], validationErrors.sizeIncorrect)
    .max(20, validationErrors.fullNameTooLong)
    .required(),
    

})
// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialFormValue = {
  fullName: '',
  size: '',
  toppings: [{ topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' }],

}
export default function Form() {
  const [enabled, setEnabled] = useState(false) 
  const [formData, setFormData] = useState(
    initialFormValue);
  const [message, setMessage] = useState('')
  const [formErrors, setFormErrors] = useState('')
  useEffect(() => {
    formSchema.isValid(formData).then(isValid => {
      setEnabled(isValid)
    })
  })
  const submit = () => {
    const newOrder ={
      fullName: formData.fullName.trim(),
      size: formData.size,
      toppings: formData.toppings,
    }
    const {fullName, size, toppings} = formData
    axios.post('http://localhost:9009/api/order', {fullName, size, toppings})
      .then(res => {
        setMessage(res.data.message)
        setFormErrors(res.response.data.message)
      })
      .catch(err => console.error(err))
      
  }
  const validate = (name, value) => {
    yup.reach(formSchema, name)
    .validate(value)
    .then(() => setFormErrors({ ...formErrors, [name] : ''}))
    .catch(err => setFormErrors({ ...formErrors, [name]: err.errors[0]}))
  }
  const inputChange = (name, value) => {
    // 🔥 STEP 10- RUN VALIDATION WITH YUP
    validate(name, value);
    setFormData({
      ...formData,
      [name]: value // NOT AN ARRAY
    })
  }
    const change = (event) => {
      let { id, name, value, type, checked } = event.target;
      if( type === "checkbox" ) {!true}
      // inputChange(name, valueToUse)
      
      setFormData({...formData, [id]: value, [name]: value  })
    }
      console.log(toppings[0])
    
  
  // const change = (evt) => {
    //   const { name, value, type, checked } = evt.target
    //   setFormData({ ...formData, [name]: value, [type]: checked })
    const handleSubmit = (evt) => {
      evt.preventDefault();
    // setFormData( {fullname: '', size: '', toppings: []})
    //   console.log('sending')
      // handleSubmit()
      submit()
    }
    // }
    return (
      <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {message && <div className='success'>{message}</div>}
      {formErrors && <div className='failure'>{formErrors}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" value={formData.fullName }onChange={change} />
        </div>
        {validationErrors.fullNameTooShort && <div className='error'>{validationErrors.fullNameTooShort}</div> }
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size" >Size</label><br />
          <select id="size" onChange={change} value={formData.size}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            {/* Fill out the missing options */}
            
          </select>
        </div>
        {true && <div className='error'>size must be S or M or L</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping, idx) => {
          return (
            <label key={idx}>
              <input  name='toppings'  type='checkbox' checked={false}  onChange={change}/>
              {topping.text} </label>
          )
        }
        )}
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {/* <label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
            />
          Pepperoni<br />
          <input
            name="Green Peppers"
            type="checkbox"
            />
          Green Peppers<br />
          <input
            name="Pineapple"
            type="checkbox"
          />
          Pineapple<br />
          <input
            name="Mushrooms"
            type="checkbox"
          />
          Mushrooms<br />
          <input
            name="Ham"
            type="checkbox"
          />
          Ham<br />
        </label> */}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enabled} />
    </form>
  )
}
