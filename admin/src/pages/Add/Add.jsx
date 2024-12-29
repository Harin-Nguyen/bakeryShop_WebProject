import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"

const Add = ({url}) => {
  
  const [image, setImage] = useState("");  
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Cakey"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      image: image, 
    };

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Cakey"
        });
        setImage("");  // Reset the image field
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error creating the product");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        
        {/* Replace image upload with text input for URL */}
        <div className="add-img-upload flex-col">
          <p>Image URL</p>
          <input 
            type="text" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            placeholder="Paste image URL here" 
            required
          />
        </div>
        
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Type here' 
            required 
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows="6" 
            placeholder='Write here' 
            required
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select 
              onChange={onChangeHandler} 
              name="category" 
              value={data.category}
            >
              <option value="Cakey">Cakey</option>
              <option value="Donut">Donut</option>
              <option value="Macaron">Macaron</option>
              <option value="Croissant">Croissant</option>
              <option value="Panna Cotta">Panna Cotta</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Bread">Bread</option>
              <option value="Cookies">Cookies</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="number" 
              name='price' 
              placeholder='$' 
              required
            />
          </div>
        </div>

        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
}

export default Add;
