import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import {
  Search,
  Info,
  X,
  Pill,
  AlertTriangle,
  Stethoscope,
  Thermometer,
  Sparkles,
  Activity,
  Droplets,
} from 'lucide-react'

export default function Home() {
  const [obat, setObat] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedObat, setSelectedObat] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('obat').select('*')
    setObat(data || [])
    setLoading(false)
  }

  const filtered = obat.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kegunaan?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    // BACKGROUND: Nuansa Peach/Pink lembut ala referensi
    <div className="min-h-screen -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-[#FFF5F5] font-sans text-gray-800 relative overflow-hidden">
      {/* BACKGROUND DECORATION (Blobs Abstrak) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/40 rounded-full mix-blend-multiply filter blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[60px] -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-20 w-[400px] h-[400px] bg-orange-100/60 rounded-full mix-blend-multiply filter blur-[60px] translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10">
        {/* --- HEADER --- */}
        {/* Style dibuat mirip referensi: Putih bersih, rounded besar, shadow halus */}
        <div className="text-center py-12 px-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-rose-900/5 border border-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Digital Pharmacy
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-3">
            Kamus Obat <span className="text-rose-500">Digital</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            Cari obat, periksa dosis, dan pantau efek samping dalam hitungan detik.
          </p>

          {/* Search Bar ala Referensi */}
          <div className="relative max-w-lg mx-auto mt-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-rose-400">
              <Search size={24} />
            </div>
            <input
              type="text"
              placeholder="Cari nama obat (misal: Paracetamol)..."
              className="w-full py-4 pl-14 pr-6 bg-white border-2 border-rose-100 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all text-gray-700 placeholder-gray-400 font-medium shadow-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- GRID OBAT --- */}
        {loading ? (
          <div className="text-center py-20 text-rose-400 font-bold animate-pulse">Sedang memuat database...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <ObatCard key={item.id} data={item} onClick={() => setSelectedObat(item)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedObat && <ObatModal data={selectedObat} onClose={() => setSelectedObat(null)} />}
    </div>
  )
}

// --- CARD STYLE BARU (Mirip Referensi Client) ---
function ObatCard({ data, onClick }) {
  // Logic warna background card (Pastel soft)
  const getTheme = (simbol) => {
    const s = simbol?.toLowerCase() || ''
    if (s.includes('merah'))
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-100',
        iconBg: 'bg-rose-200',
        text: 'text-rose-700',
        icon: <AlertTriangle size={32} className="text-rose-600" />,
      }
    if (s.includes('biru'))
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        iconBg: 'bg-blue-200',
        text: 'text-blue-700',
        icon: <Activity size={32} className="text-blue-600" />,
      }
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-200',
      text: 'text-emerald-700',
      icon: <Droplets size={32} className="text-emerald-600" />,
    }
  }

  const theme = getTheme(data.simbol)

  return (
    <div
      onClick={onClick}
      className={`relative group p-6 rounded-4xl border ${theme.border} ${theme.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}
    >
      {/* Dekorasi Background Card (Lingkaran Pudar) */}
      <div
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${theme.iconBg} opacity-20 group-hover:scale-150 transition-transform duration-500`}
      ></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1 pr-4">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${theme.text} bg-white/60 px-2 py-1 rounded-lg`}
          >
            {data.golongan || 'Umum'}
          </span>
          <h3 className="text-xl font-black text-gray-800 mt-2 mb-1 leading-tight group-hover:text-rose-600 transition-colors">
            {data.nama}
          </h3>

          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Kandungan</p>
            <p className="text-sm font-medium text-gray-600 line-clamp-2 leading-snug">{data.kandungan || '-'}</p>
          </div>
        </div>

        {/* ICON BESAR DI KANAN (Imitasi Gambar 3D) */}
        <div
          className={`w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-inner mt-2 group-hover:rotate-12 transition-transform duration-300`}
        >
          {theme.icon}
        </div>
      </div>

      {/* Tombol Info Kecil */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white p-2 rounded-full shadow-sm text-gray-400">
          <Info size={16} />
        </div>
      </div>
    </div>
  )
}

// --- MODAL (Tetap sama tapi disesuaikan dikit warnanya) ---
function ObatModal({ data, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800">{data.nama}</h2>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
                {data.golongan}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  data.simbol?.includes('Merah')
                    ? 'bg-rose-100 text-rose-600'
                    : data.simbol?.includes('Biru')
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {data.simbol}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase mb-2">
                <Sparkles size={18} /> Efek Positif
              </div>
              <p className="text-gray-700 text-sm font-medium">{data.kegunaan}</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-rose-600 font-black text-sm uppercase mb-2">
                <AlertTriangle size={18} /> Efek Negatif
              </div>
              <p className="text-gray-700 text-sm font-medium">{data.efek_samping || '-'}</p>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <DetailRow label="Kandungan" value={data.kandungan} icon={<Pill size={16} />} />
            <DetailRow label="Dosis Dewasa" value={data.dosis_dewasa} icon={<Thermometer size={16} />} />
            <DetailRow label="Dosis Anak" value={data.dosis_anak} />
            <DetailRow label="Waktu Konsumsi" value={data.waktu_konsumsi} />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl">
            <h4 className="font-bold text-indigo-700 text-xs uppercase mb-1">⚠️ Interaksi Obat</h4>
            <p className="text-sm text-indigo-900 font-medium">{data.interaksi || 'Tidak ada data.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, icon }) {
  if (!value || value === '-') return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-gray-200 last:border-0 pb-2 last:pb-0">
      <span className="text-xs font-bold text-gray-400 uppercase w-32 flex items-center gap-1 shrink-0">
        {icon} {label}
      </span>
      <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
  )
}
