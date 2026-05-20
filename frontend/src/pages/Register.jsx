import React from 'react';

function Register(props) {
    return (
        <div className='flex flex-col items-center justify-center h-150'>
            <h1 className="text-3xl font-bold mb-4">Register</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700">Username</label>
                    <input type="text" className="w-75 p-2 border border-gray-300 rounded" />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input type="email" className="w-75 p-2 border border-gray-300 rounded" />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input type="password" className="w-75 p-2 border border-gray-300 rounded" />
                </div>
                <button type="submit" className="bg-black text-white font-extrabold ml-30 p-3 rounded hover:bg-gray-400">Register</button>
            </form>
        </div>
    );
}

export default Register;