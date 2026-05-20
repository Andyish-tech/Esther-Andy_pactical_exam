import React from 'react'

export default function Welcome() {
  return (
    <div>
        {/* WELCOME PAGE hero section text and picture */}
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to CPRMS</h1>
                <p className="text-lg text-gray-700 mb-8">Your one-stop solution for managing your CPR records.</p>
                <a href="/register" className="bg-black hover:bg-gray-400 font-bold text-white px-4 py-2 rounded">Get Started</a>
            </div>
            {/* picture */}
            <div>
                <img src="" alt="CPR" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
        </div>
    </div>
  )
}
