import React, { useState } from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const {currentUser} =useSelector((state) => state.user)

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any additional form submission logic here
    if (password === '' && confirmPassword === '') {
      // At least one of the passwords is empty, you can proceed with form submission
      console.log('Form submitted successfully');
    } else {
      if (passwordMatch) {
        // Passwords match, you can proceed with form submission
        console.log('Form submitted successfully');
      } else {
        // Passwords do not match, show an error or take appropriate action
        console.error('Passwords do not match');
      }
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <img src={currentUser.avatar} alt='profile'
        className='rounded-full h-32 w-32 object-cover
        cursor-pointer self-center mt-2  mb-6'/>
        <input type='text' placeholder='username'
        id='username' className='border p-3 rounded-lg ' />
        <input type='text' placeholder='fullname'
        id='fullname' className='border p-3 rounded-lg ' />
        <input type='number' placeholder='votre numero'
        id='num' className='border p-3 rounded-lg ' />
        <input type='date' 
        id='dateNaissance' className='border p-3 rounded-lg ' />
        <input type='email' placeholder='email'
        id='email' className='border p-3 rounded-lg ' />
        <input type='password' placeholder='mot de passe'
        id='password' className='border p-3 rounded-lg ' />
        <input type='password' placeholder='confirmer votre mot de passe'
        id='confirmPassword' className='border p-3 rounded-lg ' />
        {!passwordMatch && <p className='text-red-600 mt-5'>Passwords do not match</p>}
        <button type="submit" className='
          bg-slate-700 
          text-white rounded-lg
          p-3
          uppercase hover:opacity-95
          disabled:opacity-80
        '>Submit</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span span className='text-red-800 cursor-pointer'>
          delete account
        </span>        
        <span className='text-red-800 cursor-pointer'>
          deconnexion
        </span>
      </div>
    </div>
  )
}
