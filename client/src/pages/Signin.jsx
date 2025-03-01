import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function Signin() {
  const [formdata, setFormData] = useState({
    email: '',
    password: ''
  });

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setFormData({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!formdata.email.trim() || !formdata.password.trim()) {
      dispatch(signInFailure("All fields are required"));
      return;
    }

    dispatch(signInStart()); // Start loading

    try {
      const res = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      // Check if the response is OK
      if (!res.ok) {
        const data = await res.json(); // Try to parse the error response
        dispatch(signInFailure(data.message || 'An error occurred during sign in'));
        return;
      }

      const data = await res.json(); // Parse the response data

      if (!data.success) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data.message)); // Pass the user info if needed
        navigate('/'); // Navigate to home or desired page after successful login
      }
    } catch (error) { 
      dispatch(signInFailure('Network error: ' + error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'> Sign In </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="email"
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChanges}
          required
        />

        <input
          type="password"
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChanges}
          required
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p> Don't have an account? </p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
