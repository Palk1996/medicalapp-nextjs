"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import loginImage from '@/app/assets/images/loginImage.png'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Link from 'next/link'
import registerImage from '@/app/assets/images/registerImage.png';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

const LoginForm = (props) => {
  const { theme } = useTheme();
  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle login logic here
    console.log(data);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='flex flex-col space-y-3'>
      <div className='m-auto'>
        <span style={{ color: theme.primaryColor }} className='text-3xl font-bold' >Sign In</span>
      </div>

      <form className='flex flex-col space-y-5' action="" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          defaultValue=""
          control={control}
          render={({ field, fieldState }) => (
            <>
              <input {...field} type="text" placeholder='Username' className='mt-3' />
              {fieldState.error && <span className="text-red-500">*{fieldState.error.message}</span>}
            </>
          )}
        />
        <Controller
          name="password"
          defaultValue=""
          control={control}
          render={({ field, fieldState }) => (
            <>
              <input {...field} type="password" placeholder='Password' className='mt-3' />
              {fieldState.error && <span className="text-red-500">*{fieldState.error.message}</span>}
            </>
          )}
        />
        <div style={{ color: "#757575" }} className='flex justify-between items-center'>
          <div className='flex items-center space-x-1'>
            <input type="checkbox" name="" />
            <span>Remember me</span>
          </div>
          <Link href="#">Forgot password?</Link>
        </div>
      </form>
      <div className='h-[1px] bg-slate-300'></div>
      <div className='m-auto flex flex-col space-y-2'>
        <button style={{ background: theme.primaryColor }} className='text-md font-bold py-2 px-4 text-[#eeeeee] rounded-md' >SIGN IN</button>
        <span>Not a member? <button onClick={(e) => props.formSwitcher(e)} style={{ color: theme.primaryColor }} className='font-bold' href="#">Sign Up</button></span>
      </div>
    </motion.div>
  );
}

const RegisterForm = (props) => {
  const { theme } = useTheme();
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required('First Name is required'),

    lastName: yup
      .string()
      .required('Last Name is required'),

    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),

    username: yup
      .string()
      .matches(/^[a-zA-Z0-9_]+$/, 'Invalid username format (only letters, numbers, and underscores are allowed)')
      .required('Username is required'),

    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w!@#$%^&*()\-_=+{};:'",<.>/?\\[\]`~|]{8,}$/,
        'Password must have at least 8 characters, one uppercase letter, and one lowercase letter'
      ),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),

    birth: yup
      .date()
      .nullable()
      .typeError('Invalid date format'),

    gender: yup
      .string()
      .required('Gender is required'),
    tel: yup
      .string()
      .length(10)
      .required('Gender is required'),
  });


  const { control, handleSubmit, setError } = useForm({
    resolver: yupResolver(schema),
  });
  const inputFields = [
    { name: 'firstName', type: 'text', placeholder: 'First Name' },
    { name: 'lastName', type: 'text', placeholder: 'Last Name' },
    { name: 'username', type: 'text', placeholder: 'Username' },
    { name: 'email', type: 'email', placeholder: 'Email Address' },
    { name: 'password', type: 'password', placeholder: 'Password' },
    { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
    { name: 'birth', type: 'date', placeholder: 'Birth' },
    { name: 'gender', type: 'text', placeholder: 'Gender' },
    { name: 'tel', type: 'text', placeholder: 'Tel.' },
  ];


  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }
      console.log('Registration successful!');
    } catch (error) {
      setError('username', {
        type: 'manual',
        message: error.message,
      });
    }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='flex flex-col space-y-3'>
      <div className='m-auto'>
        <span style={{ color: theme.primaryColor }} className='text-3xl font-bold' >Sign Up</span>
      </div>

      <form className='flex flex-col' action="" onSubmit={handleSubmit(onSubmit)}>
        {inputFields.map((fields, index) => (
          <Controller
            key={index}
            name={fields.name}
            control={control}
            defaultValue={fields.type === 'date' ? null : ''}
            render={({ field, fieldState }) => (
              <>
                {field.name === "gender" ?
                  <select className='mt-3' name="Gender" id="" {...field}>
                    <option value="" selected disabled> Select Gender </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select> : <input className='mt-3' {...field} type={fields.name === "birth" ? "date" : fields.type} placeholder={fields.name === "birth" ? 'Birth' : fields.placeholder} />}
                {fieldState.error && <span className="text-red-500">*{fieldState.error.message}</span>}
              </>
            )}
          />
        ))}
        <div className='h-[1px] bg-slate-300'></div>
        <div className='m-auto flex flex-col space-y-2 mt-3'>
          <button type='submit' style={{ background: theme.primaryColor }} className='text-md font-bold py-2 px-4 text-[#eeeeee] rounded-md' >SIGN UP</button>
          <span>Already member? <button onClick={(e) => props.formSwitcher(e)} style={{ color: theme.primaryColor }} className='font-bold' href="#">Sign In</button></span>
        </div>
      </form>
    </motion.div>
  );
}

function SignIn() {
  const [isFormSwicthed, setIsFormSwitched] = useState(0);
  const formSwitchHandler = (e) => {
    e.preventDefault();
    setIsFormSwitched(!isFormSwicthed);
  }

  return (
    <div className='h-[65vh] m-12'>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='w-[50%] flex m-auto p-6 border border-[#c3c3c3] rounded-md'>
        <div className='w-[50%] m-auto'>
          <Image src={isFormSwicthed ? loginImage : registerImage} alt='image' />
        </div>
        <div className='w-[50%] m-auto'>
          {
            isFormSwicthed ? <RegisterForm formSwitcher={formSwitchHandler} /> : <LoginForm formSwitcher={formSwitchHandler} />
          }

        </div>
      </motion.div>

    </div>
  )
}

export default SignIn