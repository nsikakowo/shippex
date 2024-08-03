import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuEye, LuEyeOff, LuLock, LuUsers } from 'react-icons/lu';
import apiClient from '../../config/apiClient';
import { useNavigate } from 'react-router-dom';
import Loader from '../ui/Loader';

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [revealPassword, setRevealPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setloading(true);
    seterrorMessage('');
    try {
      const response = await apiClient.post('/login', {
        usr: data.email,
        pwd: data.password,
      });
      setloading(false);

      console.log('Login successful', response);
      navigate('/track-shipment');
    } catch (error: any) {
      seterrorMessage(error.response.data.message);
      setloading(false);
    }
  };

  const email = watch('email');
  const password = watch('password');

  return (
    <main className="h-screen">
      <div className="px-[32px] pt-[24px] ">
        <img src="/assets/vectors/logo.png" alt="" />
      </div>
      <section className="w-full flex justify-center items-center mt-[98px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-4 max-w-md w-full lg:w-[342px] mx-auto"
        >
          <div className="text-center mx-auto">
            <h2 className="text-[24px] font-bold text-black mb-2">Sign in</h2>
            <p className="text-brandGrey text-[14px]">
              Don't have an account yet?
              <span className="text-primary ml-2">Sign Up</span>
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-darkPrimary"
            >
              Username
            </label>
            <div
              className={`mt-1 flex items-center h-[46px] pl-4 w-full border ${
                emailFocused
                  ? 'border-blue-500 outline-green-500 shadow-lg'
                  : 'border-[#e8e8e8]'
              } rounded-lg shadow-sm`}
            >
              <LuUsers className="text-iconColor" />
              <input
                id="email"
                type="email"
                placeholder="Enter Username"
                {...register('email', { required: 'Email is required' })}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="ml-3 w-full text-[15px] text-darkPrimary h-full rounded-lg outline-none focus:ring-0"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-8 mt-4">
            <label
              htmlFor="password"
              className="flex justify-between items-center text-sm font-medium text-darkPrimary"
            >
              <span>Password</span>
              <span className="text-primary cursor-pointer">
                Forgot Password?
              </span>
            </label>
            <div
              className={`mt-1 flex items-center justify-between h-[46px] px-4 w-full border ${
                passwordFocused
                  ? 'border-blue-500 outline-green-500 shadow-lg'
                  : 'border-[#e8e8e8]'
              } rounded-lg shadow-sm`}
            >
              <div className="flex items-center justify-start w-full h-full">
                <LuLock size={20} className="text-iconColor" />
                <input
                  id="password"
                  type={revealPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  autoComplete="off"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="ml-3 w-full text-[15px] text-darkPrimary mr-2 h-full rounded-lg outline-none focus:ring-0"
                />
              </div>
              <p
                onClick={() => setRevealPassword(!revealPassword)}
                className="text-iconColor cursor-pointer"
              >
                {revealPassword ? <LuEyeOff /> : <LuEye />}
              </p>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center mb-4">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={!email || !password}
            className={`w-full py-2 h-[46px] flex justify-center mt-2 items-center px-4 font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 ${
              email && password
                ? 'bg-primary text-white'
                : 'bg-lightBlue text-white cursor-not-allowed'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {errorMessage && (
            <p className="mt-2 text-center mx-auto text-sm text-red-600">
              {errorMessage}
            </p>
          )}
        </form>
        {loading && (
          <div className="bg-[#ffffffd8] absolute top-0 left-0 flex h-screen w-screen justify-center items-center">
            <Loader />
          </div>
        )}
      </section>
    </main>
  );
};

export default LoginForm;
