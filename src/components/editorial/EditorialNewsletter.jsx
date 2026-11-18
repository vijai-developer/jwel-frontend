import React, { useState } from 'react';
import axios from 'axios';

export const EditorialNewsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus({ state: 'error', message: 'Please provide a valid email address (e.g. name@domain.com).' });
      return;
    }

    try {
      setStatus({ state: 'loading', message: '' });
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
      const res = await axios.post(`${backendUrl}/newsletter/subscribe`, { email: email.trim().toLowerCase() });
      setStatus({
        state: 'success',
        message: res.data?.message || 'Welcome to the Private Client Circle.'
      });
      setEmail('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Unable to subscribe. Please try again.';
      setStatus({
        state: 'error',
        message: errorMsg
      });
    }
  };

  return (
    <section className="py-16 sm:py-28 px-4 sm:px-12 bg-[#1F3A32] text-[#F8F3EA] border-t border-[#B89B5E]/30 w-full max-w-full overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">

        <span className="text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#D4BE8D] font-medium block mb-2 sm:mb-3">
          Private Client Circle
        </span>

        {/* Heading in Ivory Serif */}
        <h2 className="font-serif text-2xl sm:text-5xl font-normal tracking-[0.02em] text-[#F8F3EA] mb-3 sm:mb-4">
          Be the First to <span className="font-serif italic text-[#B89B5E]">Know</span>
        </h2>

        <p className="text-xs sm:text-sm text-[#F8F3EA]/75 font-light leading-relaxed max-w-md mx-auto mb-10">
          Receive exclusive invitations to private trunk shows, limited bridal editions, and secret festive previews.
        </p>

        {/* Single-line Email Field with Thin Gold Underline */}
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto relative">
          <div className="flex items-center border-b border-[#B89B5E] pb-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-[#F8F3EA] placeholder:text-[#F8F3EA]/40 focus:outline-hidden font-light tracking-wide px-1"
              required
            />
            {/* Small 'Subscribe' Text Button */}
            <button
              type="submit"
              disabled={status.state === 'loading'}
              className="editorial-link-underline text-[11px] uppercase tracking-[0.22em] text-[#D4BE8D] hover:text-white shrink-0 font-medium pb-0.5 cursor-pointer"
            >
              <span>{status.state === 'loading' ? 'Joining...' : 'Subscribe'}</span>
              <span>→</span>
            </button>
          </div>

          {/* Inline Feedback */}
          {status.message && (
            <p className={`text-xs mt-3 tracking-wide ${status.state === 'error' ? 'text-red-300' : 'text-[#D4BE8D]'}`}>
              {status.message}
            </p>
          )}
        </form>

      </div>
    </section>
  );
};

