import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, KeyRound } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // --- AKUN ADMIN (Hardcoded) ---
    // Ganti ini sesuai keinginanmu
    if (username === 'admin' && password === 'pharmapedia123') {
      localStorage.setItem('isLoggedIn', 'true') // Simpan sesi
      navigate('/admin') // Masuk ke dashboard
    } else {
      alert('Username atau Password salah!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pharma-bg px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-pharma-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pharma-primary">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-pharma-dark">Admin Access</h2>
          <p className="text-gray-500 text-sm">Silakan login untuk mengelola database.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pharma-primary transition"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pharma-primary transition"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-pharma-primary hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 mt-4">
            Masuk Dashboard
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">&copy; Pharmapedia Security System</div>
      </div>
    </div>
  )
}
