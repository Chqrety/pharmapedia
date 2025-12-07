import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { Pill, LogOut, Home as HomeIcon } from 'lucide-react'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Login from './pages/Login'

// --- KOMPONEN PROTEKSI ADMIN ---
function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('isLoggedIn')
  return isAuth ? children : <Navigate to="/login" replace />
}

// --- KOMPONEN NAVBAR ---
function Navbar() {
  const location = useLocation()
  const isAuth = localStorage.getItem('isLoggedIn')

  if (location.pathname === '/login') return null

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar?')) {
      localStorage.removeItem('isLoggedIn')
      window.location.href = '/'
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 transition-all bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm shadow-rose-100/50 supports-backdrop-filter:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-linear-to-br from-rose-400 to-purple-600 text-white p-2 rounded-xl shadow-lg shadow-rose-200 group-hover:rotate-12 transition-transform duration-300">
              <Pill size={20} fill="currentColor" className="text-white/90" />
            </div>
            <span className="text-xl font-black bg-linear-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Pharmapedia
            </span>
          </Link>

          {/* Menu Kanan */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200
                ${
                  location.pathname === '/'
                    ? 'bg-rose-50 text-rose-600 shadow-inner'
                    : 'text-gray-500 hover:bg-white hover:text-rose-500 hover:shadow-sm'
                }`}
            >
              <HomeIcon size={16} /> <span className="hidden sm:inline">Beranda</span>
            </Link>

            {location.pathname === '/admin' && isAuth && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-lg hover:shadow-rose-200 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// --- KOMPONEN FOOTER BARU (Biar bisa disembunyikan) ---
function Footer() {
  const location = useLocation()

  // LOGIKA PENTING: Sembunyikan Footer jika di halaman Login
  if (location.pathname === '/login') return null

  return (
    <footer className="mt-auto border-t border-white/50 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto py-8 px-4 text-center">
        <p className="text-xs font-semibold text-gray-400 tracking-wide">
          © 2025 PHARMAPEDIA • SAHABAT SEHAT ANAK KOST
        </p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
        <Navbar />

        {/* Layout Wrapper */}
        <div className="flex-1 w-full">
          <Routes>
            <Route
              path="/"
              element={
                // Bungkus Home dengan padding-top karena ada Navbar fixed
                <div className="pt-20 px-3">
                  <Home />
                </div>
              }
            />

            {/* Login TIDAK dikasih padding-top biar full screen center */}
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  {/* Admin dikasih padding-top */}
                  <div className=" mx-auto">
                    <Admin />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  )
}

export default App
