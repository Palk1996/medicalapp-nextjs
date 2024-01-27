"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import loginImage from '@/app/assets/images/loginImage.png'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Link from 'next/link'

const LoginForm = (props) => {
  const { theme } = useTheme();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='flex flex-col space-y-3'>
      <div className='m-auto'>
        <span style={{ color: theme.primaryColor }} className='text-3xl font-bold' >Sign In</span>
      </div>

      <form className='flex flex-col space-y-5' action="">
        <input type="text" name='username' placeholder='Username' />
        <input type="password" name='password' placeholder='Password' />
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
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='flex flex-col space-y-3'>
      <div className='m-auto'>
        <span style={{ color: theme.primaryColor }} className='text-3xl font-bold' >Sign Up</span>
      </div>

      <form className='flex flex-col space-y-5' action="">
        <input type="text" name='username' placeholder='Email Address' />
        <input type="text" name='username' placeholder='Username' />
        <input type="password" name='password' placeholder='Password' />
        <input type="password" name='password' placeholder='Confirm Password' />
        <div className='flex justify-between'>
          <input type="date" name='username' placeholder='Birth' />
          <input type="text" name='username' placeholder='Gender' />
        </div>
        <input type="text" name='username' placeholder='Tel.' />
      </form>
      <div className='h-[1px] bg-slate-300'></div>
      <div className='m-auto flex flex-col space-y-2'>
        <button style={{ background: theme.primaryColor }} className='text-md font-bold py-2 px-4 text-[#eeeeee] rounded-md' >SIGN UP</button>
        <span>Already member? <button onClick={(e) => props.formSwitcher(e)} style={{ color: theme.primaryColor }} className='font-bold' href="#">Sign In</button></span>
      </div>
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
          <Image src={loginImage} />
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