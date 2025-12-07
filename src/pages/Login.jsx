import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, KeyRound, Sparkles, ArrowRight } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulasi loading biar berasa "aplikasi beneran"
    setTimeout(() => {
      if (username === 'admin' && password === 'pharmapedia123') {
        localStorage.setItem('isLoggedIn', 'true')
        navigate('/admin')
      } else {
        alert('Username atau Password salah!')
        setLoading(false)
      }
    }, 800)
  }

  return (
    // BACKGROUND: Peach Soft + Blobs (Sama persis kayak Home)
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F5] font-sans relative overflow-hidden px-4">
      {/* DEKORASI BACKGROUND (Blobs Abstrak) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-200/40 rounded-full mix-blend-multiply filter blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-rose-900/5 border border-white animate-in zoom-in-95 duration-500">
        {/* Header: Icon Gembok '3D' */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-rose-100 to-rose-50 text-rose-500 shadow-inner mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
            <Lock size={36} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
            Admin <span className="text-rose-500">Access</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">Masuk untuk mengelola database obat.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Username */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-3">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="text-rose-300 group-focus-within:text-rose-500 transition-colors" size={20} />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all font-medium text-slate-700 placeholder-slate-300 shadow-sm group-hover:border-rose-200"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-3">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="text-rose-300 group-focus-within:text-rose-500 transition-colors" size={20} />
              </div>
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all font-medium text-slate-700 placeholder-slate-300 shadow-sm group-hover:border-rose-200"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            disabled={loading}
            className="w-full group relative overflow-hidden bg-linear-to-r from-rose-400 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="animate-spin" size={18} /> Memproses...
              </span>
            ) : (
              <>
                Masuk Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Kecil */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2025 Pharmapedia Security</p>
        </div>
      </div>
    </div>
  )
}
