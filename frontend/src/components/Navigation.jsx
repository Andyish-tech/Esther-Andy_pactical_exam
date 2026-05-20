import React from 'react';

function Navigation(props) {
    return (
        <div className='border-b border-gray-300 mb-4'>
            <nav className="bg-white-transparent-10 flex p-5 items-center justify-center gap-60">
                {/* logo */}
                <a href="/" className="text-black font-bold text-xl">CPRMS</a>
                {/* REGISTER AND LOGIN BUTTONS */}
                <div className="flex space-x-4 pl-5 rounded w-40 p-2">
                    <a href="/register" className="text-black font-extrabold hover:text-gray-300 ">Register</a><p>|</p>
                    <a href="/login" className="text-gray-500 font-extrabold hover:text-black ">Login</a>
                </div>
            </nav>
        </div>
    );
}

export default Navigation;