import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formdata, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setFormData({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formdata.username || !formdata.email || !formdata.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',  // specify POST method
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata),

    });
    

      const data = await res.json();
      setLoading(false);
      console.log(data); // Log the response data

      if (!res.ok) {
        setError(data.message || 'An error occurred during sign up');
        return;
      }

      if (data.success) {
        console.log('Redirecting to sign-in');
        navigate('/sign-in'); // Redirect to sign-in
      } else {
        setError(data.message);
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred: ' + error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'> Sign Up </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type="text" 
          placeholder='username'
          className='border p-3 rounded-lg' 
          id='username' 
          onChange={handleChanges} 
        />

        <input 
          type="email" 
          placeholder='email'
          className='border p-3 rounded-lg' 
          id='email' 
          onChange={handleChanges} 
        />

        <input 
          type="password" 
          placeholder='password'
          className='border p-3 rounded-lg' 
          id='password' 
          onChange={handleChanges} 
        />

        <button 
          disabled={loading} 
          className='bg-slate-700 text-white p-3 rounded-lg uppercase 
          hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p> Have an account? </p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>sign in</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
