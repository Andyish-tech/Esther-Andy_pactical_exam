import React from 'react'

export default function login() {
  return (
    <div className='flex flex-col items-center justify-center h-150'>
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form className="space-y-4">
            <div>
                <label className="block text-gray-700">Email</label>
                <input type="email" className="w-75 p-2 border border-gray-300 rounded" />
            </div>
            <div>
                <label className="block text-gray-700">Password</label>
                <input type="password" className="w-75 p-2 border border-gray-300 rounded" />
            </div>
            <button type="submit" className="bg-black font-extrabold hover:bg-gray-400 text-white p-3 rounded ml-30">Login</button>
        </form>
      
    </div>
  )
}
