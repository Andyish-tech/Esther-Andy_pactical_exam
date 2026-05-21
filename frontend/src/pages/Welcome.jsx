import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden flex flex-col justify-between">
      {/* Subtle background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gray-100 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-100 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 relative z-10">
        
        {/* Left Side: Text and CTA */}
        <div className="flex-1 text-left animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
            Version 2.0 Now Live
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 sm:mb-6 text-black">
            Car Repair &amp; <br />
            <span className="text-gradient">Payment Management</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mb-6 sm:mb-8 max-w-lg leading-relaxed">
            Welcome to CRPMS, the ultimate modern platform to track vehicle maintenance history, manage repair services, assign expert mechanics, and record billing logs seamlessly.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl font-bold bg-black hover:bg-[#a1a1aa] text-white hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl font-bold bg-white hover:bg-gray-100 border border-black hover:border-[#a1a1aa] text-black hover:text-[#a1a1aa] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Access Dashboard
            </Link>
          </div>
        </div>

        {/* Right Side: Graphic Illustration */}
        <div className="flex-1 flex justify-center items-center relative z-10 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] aspect-square rounded-2xl glass-card flex items-center justify-center p-6 sm:p-8">
            <div className="absolute inset-0 bg-gray-50 rounded-2xl"></div>
            
            {/* SVG Dashboard Graphic */}
            <svg viewBox="0 0 400 400" className="w-full h-auto text-black drop-shadow-[0_0_25px_rgba(0,0,0,0.08)]" fill="none" stroke="currentColor" strokeWidth="2.5">
              {/* Outer Circular Grid */}
              <circle cx="200" cy="200" r="150" stroke="rgba(0, 0, 0, 0.06)" strokeDasharray="5 5" />
              <circle cx="200" cy="200" r="100" stroke="rgba(0, 0, 0, 0.08)" />
              
              {/* Mechanical Gear Center */}
              <g transform="translate(200, 200) scale(0.8)">
                <circle cx="0" cy="0" r="30" stroke="currentColor" fill="rgba(0, 0, 0, 0.05)" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <path
                    key={angle}
                    d="M -10 -45 L 10 -45 L 6 -30 L -6 -30 Z"
                    transform={`rotate(${angle})`}
                    fill="currentColor"
                  />
                ))}
              </g>
              
              {/* Diagnostic Stats Rings */}
              <path d="M 120 200 A 80 80 0 1 1 280 200" stroke="url(#monoGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M 280 200 A 80 80 0 0 1 150 269" stroke="#a1a1aa" strokeWidth="6" strokeLinecap="round" strokeDasharray="100 20" />
              
              {/* Car Icon silhouette */}
              <g transform="translate(145, 180) scale(1.8)" stroke="#000000" strokeWidth="1.5" fill="none">
                <path d="M5,12 L5,8 C5,8 6,5 12,5 C18,5 19,8 19,8 L19,12 L21,13 L21,16 L19,16 L19,15 C19,14 18.5,13.5 17.5,13.5 C16.5,13.5 16,14 16,15 L16,16 L8,16 L8,15 C8,14 7.5,13.5 6.5,13.5 C5.5,13.5 5,14 5,15 L5,16 L3,16 L3,13 Z" />
                <circle cx="6.5" cy="15" r="1.5" fill="white" />
                <circle cx="17.5" cy="15" r="1.5" fill="white" />
              </g>

              {/* Float Points */}
              <circle cx="120" cy="120" r="4" fill="#000000" className="animate-pulse" />
              <circle cx="280" cy="150" r="4" fill="#a1a1aa" className="animate-pulse" />
              <circle cx="180" cy="280" r="5" fill="#000000" />

              {/* Gradients */}
              <defs>
                <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="100%" stopColor="#a1a1aa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-bold mb-8 text-center text-black">Features at a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-black mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V6a1 1 0 00-1-1H11" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Fleet Logging</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Register vehicles, assign dedicated mechanics, and manage specs like model, type, and manufacture year.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-black mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Service Catalog</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Define standard repair jobs, set flat price metrics, and update services catalog in real-time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-black mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Service Records</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Log work dates, bind records to plate numbers, and track diagnostic statuses in a centralized dashboard.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-black mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Secure Payments</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Generate payment receipts, verify pricing logs, and confirm amounts paid directly through security gates.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-black text-center text-sm text-gray-500 relative z-10 w-full">
        <p>&copy; {new Date().getFullYear()} CRPMS - Car Repair &amp; Payment Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
