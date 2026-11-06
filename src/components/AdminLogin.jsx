import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('admin@labbaikhorizon.com');
  const [password, setPassword] = useState('Labbaik@VIP2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authAPI.login(identifier, password);
      setIsLoading(false);

      if (res.success) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        if (onLoginSuccess) {
          onLoginSuccess(res.data?.user || res.user);
        }
      } else {
        setErrorMessage(res.message || 'Invalid administrator credentials. Access denied.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Server connection error. Please verify backend service.');
    }
  };

  const handleFillDemo = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIdentifier('admin@labbaikhorizon.com');
    setPassword('Labbaik@VIP2026');
  };

  return (
    <div className="min-h-screen bg-[#080809] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-[#d4af37] selection:text-[#080809]">
      {/* Ambient Gold Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#996515]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Return to Public Website Link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-slate-800 text-slate-400 hover:text-white hover:border-[#d4af37]/40 text-xs font-semibold transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#0a0a0c] border border-[#d4af37]/35 rounded-3xl p-6 sm:p-9 shadow-2xl relative z-10 space-y-6"
      >
        {/* Header Emblem */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37] shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                Restricted Director Portal
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              LabbaikHorizon Control
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Provide verified administrator credentials to access the CMS & E-Commerce Control Center.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Director Username or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:border-[#d4af37] focus:outline-none transition-colors"
              placeholder="admin@labbaikhorizon.com"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Director Authorization Key
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono placeholder-slate-600 focus:border-[#d4af37] focus:outline-none transition-colors"
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="bg-white/[0.02] border border-[#d4af37]/15 p-3 rounded-xl text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Default Director Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] text-slate-400 hover:text-amber-300 underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <p>User: <code className="text-white">admin@labbaikhorizon.com</code> or <code className="text-white">admin</code></p>
            <p>Pass: <code className="text-white">Labbaik@VIP2026</code> or <code className="text-white">horizon2026</code></p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-kiswah-gold hover:bg-kiswah-gold-hover text-[#080809] font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Verifying VIP Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate & Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-1 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-mono">
            LabbaikHorizon Enterprise Core • HAAB-1420 Protocol
          </span>
        </div>
      </motion.div>
    </div>
  );
}
