import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Feedback() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting feedback.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* Animated Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <Link to="/" className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
        <i className="fa-solid fa-arrow-left"></i> Back to Portfolio
      </Link>

      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl relative z-10">
        {!submitted ? (
          <>
            <h1 className="text-5xl font-black mb-2 tracking-tighter text-center">Feedback</h1>
            <p className="text-gray-400 text-center mb-10 font-medium">I'd love to hear your thoughts on my portfolio.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Rating</label>
                <div className="flex gap-2 justify-center bg-black/50 border border-white/10 rounded-xl p-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star} 
                      className={`fa-star text-3xl cursor-pointer transition-colors ${star <= formData.rating ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-600 hover:text-yellow-400/50'}`}
                      onClick={() => setFormData({...formData, rating: star})}
                    ></i>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                  placeholder="Your website is amazing!"
                ></textarea>
              </div>

              {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-white text-black font-black text-xl py-4 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {submitting ? 'Sending...' : 'SEND FEEDBACK'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-5xl mb-6">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="text-4xl font-black mb-4">Thank You!</h2>
            <p className="text-gray-400 font-medium mb-8">Your feedback has been submitted successfully. I really appreciate it!</p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', message: '', rating: 5 });
              }}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors"
            >
              Submit Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
