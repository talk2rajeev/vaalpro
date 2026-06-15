import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/auth/authSlice';
import { useLoginMutation } from '@/features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/core-components/button';

type LoginError = {
  status?: number;
};

const isLoginError = (error: unknown): error is LoginError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

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
      dispatch(setCredentials({ user: username, accessToken: userData.accessToken }));
      navigate('/dashboard');
    } catch (err: unknown) {
      if (!isLoginError(err) || !err.status) {
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
    <div className="relative min-h-screen flex items-center bg-slate-900 overflow-hidden px-8 sm:px-12 md:px-24 w-full">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.15] bg-no-repeat"
        style={{ backgroundImage: 'url("/images/bg.png")' }}
      ></div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between gap-12">
        
        {/* Left Side: Branding & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex flex-col flex-1 text-white pr-12"
        >
          <img
            src="/images/vaalpro-logo.png"
            alt="Vaalpro"
            className="mb-8 h-auto w-72"
          />
          
          <h2 className="text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Precision in <br /> Pharma Compliance
          </h2>
          
          <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
            The industry-leading platform for real-time equipment monitoring, automated validation workflows, and digital compliance certification.
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-lg">
            {[
              { title: 'Real-time Monitoring', desc: 'Continuous asset tracking' },
              { title: 'Auto Certification', desc: 'Instant PDF generation' },
              { title: 'Global Compliance', desc: 'FDA & EU standards' },
              { title: 'Secure Audit logs', desc: 'Full traceability' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-400">
                  <CheckCircle2 size={16} />
                  <span className="font-bold text-sm uppercase tracking-wider">{item.title}</span>
                </div>
                <span className="text-slate-500 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px] bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 flex flex-col items-center border border-white/20"
        >
          <div className="flex lg:hidden flex-col items-center mb-10 w-full text-center">
            <img
              src="/images/vaalpro-logo.png"
              alt="Vaalpro"
              className="h-auto w-64 max-w-full"
            />
          </div>

          <div className="text-left w-full mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Sign In</h3>
            <p className="text-slate-500 mt-1">Please enter your credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-xl text-xs text-center font-bold border border-red-100"
              >
                {errorMsg}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all transform active:scale-[0.98] mt-4 h-auto"
            >
              {isLoading ? 'SIGNING IN...' : 'Sign In to Platform'}
            </Button>
          </form>

          <div className="mt-12 text-center w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pb-1 border-b border-slate-100 inline-block">
              Pharma Compliance Standard v1.0
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
