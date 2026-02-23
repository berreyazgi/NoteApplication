import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Orbit } from 'lucide-react';

interface SignUpProps {
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin }) => {
  const { signup, error, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    const success = await signup(email, password, name);
    if (!success && !error) {
      setLocalError('Sign up failed. Please try again.');
    }
  };

  const inputClass = "w-full px-6 py-5 bg-white/[0.04] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 text-white text-lg transition-all placeholder:text-white/10 font-medium";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div
          className="rounded-[2.5rem] p-10 md:p-14 border"
          style={{
            background: 'rgba(12, 14, 30, 0.75)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderColor: 'rgba(123, 108, 246, 0.25)',
            boxShadow: '0 0 60px rgba(123, 108, 246, 0.08), 0 0 120px rgba(123, 108, 246, 0.04), 0 30px 80px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl mb-6 shadow-[0_0_40px_rgba(123,108,246,0.3)]">
              <Orbit size={38} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Note Application</h1>
            <p className="text-white/30 font-medium mt-2 text-base">Create your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || localError) && (
              <div className="bg-red-500/10 text-red-400 px-6 py-4 rounded-2xl text-sm font-semibold border border-red-500/20">
                {error || localError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/25 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={inputClass}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/25 uppercase tracking-[0.2em] ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/25 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={inputClass + " pr-16"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/25 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(123,108,246,0.25)] hover:shadow-[0_0_50px_rgba(123,108,246,0.4)] hover:from-violet-500 hover:to-indigo-500"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-white/25 font-medium text-base">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-violet-400 font-bold hover:text-violet-300 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
