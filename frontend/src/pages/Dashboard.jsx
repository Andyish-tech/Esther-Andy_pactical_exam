import React from 'react'
import Sidebar from '../components/sidebar'
import Toast from '../components/toast'

export default function Dashboard() {
  return (
    <div className='flex'>
        <Sidebar />
        <div className='flex-1 p-10'>
            <h1 className='text-3xl font-bold mb-4'>Welcome to the Dashboard</h1>
            <p className='text-gray-700'>This is your dashboard where you can manage your profile, settings, and more.</p>
        </div>
        <Toast />
    </div>
  )
}
