import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Search, Info, X, Pill, AlertTriangle, Stethoscope, Thermometer } from 'lucide-react'

export default function Home() {
  const [obat, setObat] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedObat, setSelectedObat] = useState(null)

  useEffect(() => {
    fetchObat()
  }, [])

  async function fetchObat() {
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
    <div className="space-y-6 md:space-y-8 pb-10 px-2 md:px-0">
      {/* --- RESPONSIVE HEADER --- */}
      <div className="text-center py-8 md:py-12 space-y-3 md:space-y-4 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 px-4 md:p-8">
        {/* Font size mengecil di mobile (text-2xl) membesar di desktop (text-3xl) */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-pharma-dark tracking-tight">Kamus Obat Digital</h2>
        <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
          Cari obat, cek dosis, dan pantau efek sampingnya dalam hitungan detik.
        </p>

        <div className="relative max-w-lg mx-auto pt-2">
          <input
            type="text"
            placeholder="Cari nama obat (e.g., Paracetamol)..."
            className="w-full pl-11 pr-4 py-3 text-sm md:text-base rounded-xl md:rounded-full border-2 border-gray-200 focus:border-pharma-primary focus:outline-none shadow-sm transition"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/4 text-gray-400" size={18} />
        </div>
      </div>

      {/* --- RESPONSIVE GRID --- */}
      {/* Mobile: 1 kolom, Tablet: 2 kolom, Desktop: 3 kolom, Layar Lebar: 4 kolom */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">Sedang memuat database...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((item) => (
            <ObatCard key={item.id} data={item} onClick={() => setSelectedObat(item)} />
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedObat && <ObatModal data={selectedObat} onClose={() => setSelectedObat(null)} />}
    </div>
  )
}

// --- CARD COMPONENT ---
function ObatCard({ data, onClick }) {
  const getColorScheme = (simbol) => {
    const s = simbol?.toLowerCase() || ''
    if (s.includes('merah'))
      return {
        bg: 'bg-red-50/80',
        border: 'border-red-100',
        text: 'text-red-800',
        icon: 'bg-red-100 text-red-600',
        hover: 'group-hover:border-red-300',
      }
    if (s.includes('biru'))
      return {
        bg: 'bg-blue-50/80',
        border: 'border-blue-100',
        text: 'text-blue-800',
        icon: 'bg-blue-100 text-blue-600',
        hover: 'group-hover:border-blue-300',
      }
    return {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-100',
      text: 'text-emerald-800',
      icon: 'bg-emerald-100 text-emerald-600',
      hover: 'group-hover:border-emerald-300',
    }
  }

  const theme = getColorScheme(data.simbol)

  return (
    <div
      className={`relative rounded-xl md:rounded-2xl border-2 ${theme.bg} ${theme.border} ${theme.hover} transition-all duration-200 cursor-pointer group active:scale-[0.98] hover:-translate-y-1 hover:shadow-md flex flex-col h-full`}
      onClick={onClick}
    >
      <div className={`absolute top-3 right-3 p-1.5 md:p-2 rounded-full ${theme.icon} shadow-sm`}>
        <Info size={16} strokeWidth={2.5} />
      </div>

      <div className="p-4 md:p-5 flex flex-col h-full">
        <div className="pr-8 mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text} opacity-70`}>
            {data.golongan || 'Umum'}
          </span>
          {/* Judul responsif biar ga kepotong di HP kecil */}
          <h3 className={`text-lg md:text-xl font-extrabold ${theme.text} leading-tight mt-1`}>{data.nama}</h3>
        </div>

        <div className="mt-auto pt-3 border-t border-black/5">
          <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-1">Kandungan Utama:</p>
          <p className="text-xs md:text-sm font-semibold text-gray-700 line-clamp-2">{data.kandungan || '-'}</p>
        </div>
      </div>
    </div>
  )
}

// --- MODAL RESPONSIVE ---
function ObatModal({ data, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-pharma-dark/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      {/* RESPONSIVE MODAL CONTAINER:
         - Mobile: Full width bottom sheet (rounded-t-2xl), max-h-[85vh]
         - Desktop: Center modal (rounded-2xl), max-w-2xl
      */}
      <div className="bg-white w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
        {/* Header Sticky */}
        <div className="bg-white border-b p-4 md:p-5 flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{data.nama}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase">
                {data.golongan}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase border
                ${
                  data.simbol?.includes('Merah')
                    ? 'text-red-600 border-red-200 bg-red-50'
                    : data.simbol?.includes('Biru')
                    ? 'text-blue-600 border-blue-200 bg-blue-50'
                    : 'text-emerald-600 border-emerald-200 bg-emerald-50'
                }`}
              >
                {data.simbol}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 bg-white">
          {/* Grid stack di mobile, side-by-side di desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2 text-sm">
                <Stethoscope size={16} /> Efek Positif
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{data.kegunaan}</p>
            </div>

            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2 text-sm">
                <AlertTriangle size={16} /> Efek Negatif
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{data.efek_samping || '-'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoItem label="Kandungan" value={data.kandungan} icon={<Pill size={16} />} />
            <InfoItem label="Dosis Dewasa" value={data.dosis_dewasa} icon={<Thermometer size={16} />} />
            <InfoItem label="Dosis Anak" value={data.dosis_anak} />
            <InfoItem label="Aturan Pakai" value={data.waktu_konsumsi} />

            <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400 mt-4">
              <h4 className="font-bold text-blue-800 text-xs uppercase mb-1">⚠️ Interaksi Obat</h4>
              <p className="text-sm text-blue-900">{data.interaksi || 'Tidak ada data interaksi.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 pt-4 border-t">
              <div>
                <strong className="text-gray-700">Penyimpanan:</strong>
                <br />
                {data.aturan_penyimpanan || '-'}
              </div>
              <div>
                <strong className="text-gray-700">Pembuangan:</strong>
                <br />
                {data.pembuangan || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value, icon }) {
  if (!value || value === '-') return null
  return (
    <div className="border-b border-gray-100 pb-2 last:border-0">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
        {icon} {label}
      </span>
      <p className="text-gray-800 font-medium text-sm">{value}</p>
    </div>
  )
}
