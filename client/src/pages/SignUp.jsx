import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numIn8, setNumIn8] = useState(false);
  const [numMsg, setNumMsg] = useState('');
  const [countSubmit, setCountSubmit] = useState(0);
  const [isUnder16, setIsUnder16] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleChange = (e) => {
    
    setFormData(
      {
        ...formData,
        [e.target.id]:e.target.value,
      } 
    );
    if (e.target.id === 'num'){
      if(e.target.value.length===8){
        setNumIn8(true)
      } else {
        setNumIn8(false)
      }
    }
    if (e.target.id === 'dateNaissance') {
      setCountSubmit(1);
      const enteredDate = new Date(e.target.value);
      const currentDate = new Date();
      const ageInMilliseconds = currentDate - enteredDate;
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
      if (ageInYears < 16) {
        setIsUnder16(true)
      } else {
        setIsUnder16(false)
      }
    }
    if (e.target.id === 'password'){
      if (e.target.value.length<=32 && e.target.value.length>=4 ) {
        setValidPassword(true);
      } else{ 
        setValidPassword(false);
      }
    }
  };
  const verifNum = (num) => {
    const stringNum= num.toString();
    if (stringNum.length==8) {
      setNumIn8(true);
      return t
    }
  }

  const handleSubmit = async(e) => {  
    e.preventDefault();
    // Check for empty passwords
    if (password === '' || confirmPassword === '') {
      // At least one of the passwords is empty, you can proceed with form submission
      console.log('Form submitted successfully');
    } else {
      // Both passwords are non-empty, check if they match
      if (password === confirmPassword) {
        // Passwords match, you can proceed with form submissionsetCountSubmit(1);
      try {
        if ((numIn8) && (validPassword)) {
          setLoading(true)
          const res = await fetch ('/api/auth/signup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (data.success === false) {
            setLoading(false);
            setError(data.message);
            return
          }
          setLoading(false);
          setError(null);
          navigate('/sign-in');
        } else if (!verifNum(num)) {
          return(setNumMsg('le numero doit contenir 8 chiffres'));
        } else if (!validPassword){
          return (setPasswordMsg('le mot de passe doit etre entre 4 et 16 chiffres'))
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
        console.log('Form submitted successfully with confirmed password');
      } else {
        // Passwords do not match, show an error or take appropriate action
        console.error('Passwords do not match');
      }
    }

    
  }
  return (
    <div className='p-3 ml-20 mt-4 max-w-lg mx-auto '>
      <h1 className='text-4xl text-center font-semibold my-7 pr-20'>Sign up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-11/12 pt-10'> 
        <input 
          type="text" 
          placeholder='username'
          
          className='border p-3 rounded-lg ' 
          id='username'
          onChange={handleChange}/>
        <input 
          type="text" 
          placeholder='nom'
          className='border p-3 rounded-lg' 
          id='nom'
          onChange={handleChange}/>
        <input 
          type="text" 
          placeholder='prenom'
          className='border p-3 rounded-lg' 
          id='prenom'
          onChange={handleChange}/>
        <input 
          type="number" 
          placeholder='numero'
          className='border p-3 rounded-lg' 
          id='num'
          onChange={handleChange}/>
        {(!numIn8) &&(countSubmit==1)&& <p style={{marginTop:'-15px'}} className='text-red-600 mt-5'> {numMsg}</p>}
        <input 
          type="date" 
          className='border p-3 rounded-lg' 
          id='dateNaissance'
          onChange={handleChange}/>
          {(countSubmit==1) &&isUnder16 && <p style={{marginTop:'-15px'}} className='text-red-600 mt-5'> l'age doit etre superieur a 16 ans</p>}
        <input 
          type="email" 
          placeholder='email'
          className='border p-3 rounded-lg' 
          id='email'
          onChange={handleChange}/>
        <input 
          type="password" 
          placeholder='password'
          className='border p-3 rounded-lg' 
          id='password'
          onChange={handleChange}/>
          {countSubmit==1 && validPassword && <p style={{marginTop:'-15px'}} className='text-red-600 mt-5'> {passwordMsg}</p>}
        <button disabled={loading} className='bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95 
        disabled: opacitiy-80'>
          {loading? 'Loading... ' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-5'> {error}</p>}
    </div>
  )
}
