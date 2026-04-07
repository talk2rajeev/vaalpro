import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApi';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ username, password }).unwrap();
      // Assume the API returns { accessToken: '...' }
      // We'll use the username as the user for now
      dispatch(setCredentials({ user: username, accessToken: userData.accessToken }));
      navigate('/dashboard');
    } catch (err: any) {
      if (!err?.status) {
        setErrorMsg('No Server Response');
      } else if (err.status === 400) {
        setErrorMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrorMsg('Unauthorized');
      } else {
        setErrorMsg('Login Failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Valdoc</h1>
          <p className="text-slate-500 mt-2 text-center">Equipment Monitoring & Certification Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center font-medium"
            >
              {errorMsg}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Pharma Compliance Standard v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
