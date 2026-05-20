import React from 'react'

export default function Sidebar() {
  return (
    <div>
            <div className="w-64 h-screen bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">CPRMS</h2>
                <ul className="space-y-4">
                    <li><a href="/" className="block p-2 rounded hover:bg-gray-700">Dashboard</a></li>
                    <li><a href="/profile" className="block p-2 rounded hover:bg-gray-700">Profile</a></li>
                    <li><a href="/settings" className="block p-2 rounded hover:bg-gray-700">Settings</a></li>
                    <li><a href="/logout" className="block p-2 rounded hover:bg-gray-700">Logout</a></li>
                </ul>
            </div>
      
    </div>
  )
}
