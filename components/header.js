// components/Header.js

export default function Header() {
    return (
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-red-500">
          PMS+
        </div>
        <div className="flex items-center gap-4">
          <img
            src="/doctor-avatar.png" 
            alt="Doctor Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">Dr. Jason</span>
        </div>
      </header>
    )
  }

  