import React from 'react'

const ProfileShort = ({ user }) => {
  
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-900/80 backdrop-blur-md border border-emerald-700 rounded-xl px-4 py-3 shadow-lg flex items-center gap-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-semibold text-white">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* User info */}
      <div className="flex flex-col text-sm">
        <span className="font-semibold">{user.name}</span>
        <span className="text-emerald-200 text-xs">{user.email}</span>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
      >
        Logout
      </button>
    </div>
  )
}

export default ProfileShort

