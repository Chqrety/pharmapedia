import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { Pill, LogOut } from 'lucide-react'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Login from './pages/Login'

// --- KOMPONEN PROTEKSI ADMIN ---
// Kalau belum login, tendang balik ke /login
function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('isLoggedIn')
  return isAuth ? children : <Navigate to="/login" replace />
}

// --- KOMPONEN NAVBAR BARU ---
// Navbar dipisah biar rapi & bisa cek lokasi (untuk sembunyikan navbar di halaman login)
function Navbar() {
  const location = useLocation()
  const isAuth = localStorage.getItem('isLoggedIn')

  // Jangan tampilkan navbar di halaman Login
  if (location.pathname === '/login') return null

  const handleLogout = () => {
    if (confirm('Keluar dari Admin?')) {
      localStorage.removeItem('isLoggedIn')
      window.location.href = '/'
    }
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Kiri */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-pharma-primary text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Pill size={24} />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-pharma-primary to-teal-600 bg-clip-text text-transparent tracking-tight">
              Pharmapedia
            </span>
          </Link>

          {/* Menu Kanan */}
          <div className="flex items-center gap-4">
            {/* Tombol Home selalu ada */}
            <Link to="/" className="text-gray-500 hover:text-pharma-primary font-medium text-sm transition">
              Beranda
            </Link>

            {/* Tombol Logout HANYA MUNCUL jika di halaman Admin */}
            {location.pathname === '/admin' && isAuth && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-pharma-bg">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Rute Rahasia (Diproteksi) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer simple */}
        <footer className="text-center py-8 text-gray-400 text-xs">© 2025 Pharmapedia. Database Obat Digital.</footer>
      </div>
    </Router>
  )
}

export default App
