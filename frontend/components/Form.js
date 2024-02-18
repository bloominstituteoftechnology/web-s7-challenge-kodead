import axios from 'axios'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'


// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}


// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(),
  size: yup
    .string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
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
  toppings: []

}

const initialErrors = {
  fullName: '',
  size: '',
  }
export default function Form() {
  const [enabled, setEnabled] = useState(false) 
  const [formData, setFormData] = useState(
    initialFormValue);
  const [message, setMessage] = useState('')
  const [formErrors, setFormErrors] = useState(initialErrors)

  useEffect(() => {
    formSchema.isValid(formData).then(isValid => {
      setEnabled(isValid);
    }, [formData]);
  })
  // const submit = () => {
  //   const newOrder ={
  //     fullName: formData.fullName.trim(),
  //     size: formData.size,
  //     toppings: formData.toppings,
  //   }
  //   const {fullName, size, toppings} = formData
  //   axios.post('http://localhost:9009/api/order', {fullName, size, toppings})
  //     .then(res => {
  //       setMessage(res.data.message)
  //       setFormErrors(res.data.message)
  //       console.log(res)
  //     })
  //     .catch(err => console.error(err))
      
  // }
  
  // const inputChange = (id, value) => {
  //   // 🔥 STEP 10- RUN VALIDATION WITH YUP
  //   validate(id, value);
  //   setFormData({
  //     ...formData,
  //     [id]: value // NOT AN ARRAY
  //   })
  // }
    const change = (event) => {
      let { id, value, type, checked } = event.target;
      if( type === "checkbox" ) {
        if (checked) {
          setFormData({
            ...formData, toppings: [...formData.toppings, id],
          });          
        } else {
          setFormData({
            ...formData, toppings: formData.toppings.filter((topping) => topping !== id),
          });
          
        }
      } else {
        setFormData({ ...formData, [id]: value});
        yup.reach(formSchema, id)
        .validate(value.trim())
        .then(() => setFormErrors({ ...formErrors, [id] : ''}))
        .catch((err) => {setFormErrors({ ...formErrors, [id]: err.errors[0]});
      })
      }
      // inputChange(name, valueToUse)
      
      // setFormData({...formData, [id]: value, [name]: value  })
    }
    
    
  
  // const change = (evt) => {
    //   const { name, value, type, checked } = evt.target
    //   setFormData({ ...formData, [name]: value, [type]: checked })
    const handleSubmit = async (evt) => {
      evt.preventDefault();
      const response = await 
      axios.post('http://localhost:9009/api/order', formData);
      setMessage(response.data.message);
      setFormData(initialFormValue);
    // setFormData( {fullname: '', size: '', toppings: []})
    //   console.log('sending')
      // handleSubmit()
    }
    // }
    return (
      <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {message && <div className='success'>{message}</div>}
      {/* {false && <div className='failure'></div>} */}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" value={formData.fullName }onChange={change} />
        </div>
        {formErrors.fullName && (<div className='error'>{formErrors.fullName}</div>) }
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
        {formErrors.size && <div className='error'>{formErrors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping, idx) => {
          return (
            <label key={idx}>
              <input  id={topping.topping_id}  type='checkbox' checked={formData.toppings.includes(topping.topping_id)} onChange={change}/>
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
