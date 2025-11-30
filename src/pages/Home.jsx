import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Search, Info, X, Pill, AlertTriangle, Stethoscope, Thermometer } from 'lucide-react'

export default function Home() {
  const [obat, setObat] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedObat, setSelectedObat] = useState(null) // State untuk Modal

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
    <div className="space-y-8 pb-10">
      {/* Header Search */}
      <div className="text-center py-10 space-y-4 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-3xl font-bold text-pharma-dark">Kamus Obat Digital</h2>
        <p className="text-gray-500">Cari obat, cek dosis, dan pantau efek sampingnya.</p>

        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Cari nama obat (e.g., Paracetamol)..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-pharma-primary focus:outline-none shadow-sm transition"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Grid Obat */}
      {loading ? (
        <p className="text-center text-gray-500">Sedang mengambil data obat...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

// --- KOMPONEN CARD BARU (Compact & Colorful) ---
function ObatCard({ data, onClick }) {
  // Logic Warna Berdasarkan Simbol
  const getColorScheme = (simbol) => {
    const s = simbol?.toLowerCase() || ''
    if (s.includes('merah'))
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'bg-red-100 text-red-600',
        hover: 'hover:border-red-400',
      }
    if (s.includes('biru'))
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'bg-blue-100 text-blue-600',
        hover: 'hover:border-blue-400',
      }
    // Default Hijau
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: 'bg-emerald-100 text-emerald-600',
      hover: 'hover:border-emerald-400',
    }
  }

  const theme = getColorScheme(data.simbol)

  return (
    <div
      className={`relative rounded-2xl border-2 ${theme.bg} ${theme.border} ${theme.hover} transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-lg flex flex-col h-full`}
      onClick={onClick}
    >
      {/* Tombol Info di Pojok Kanan Atas */}
      <div
        className={`absolute top-3 right-3 p-2 rounded-full ${theme.icon} shadow-sm group-hover:scale-110 transition-transform`}
      >
        <Info size={18} strokeWidth={2.5} />
      </div>

      <div className="p-5 flex flex-col h-full">
        {/* Nama & Golongan */}
        <div className="pr-8 mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text} opacity-70`}>
            {data.golongan || 'Tanpa Golongan'}
          </span>
          <h3 className={`text-xl font-extrabold ${theme.text} leading-tight mt-1`}>{data.nama}</h3>
        </div>

        {/* Kandungan Singkat */}
        <div className="mt-auto pt-3 border-t border-black/5">
          <p className="text-xs text-gray-500 font-medium mb-1">Kandungan Utama:</p>
          <p className="text-sm font-semibold text-gray-700 line-clamp-2">{data.kandungan || '-'}</p>
        </div>
      </div>
    </div>
  )
}

// --- KOMPONEN MODAL (Detail Lengkap) ---
function ObatModal({ data, onClose }) {
  // Tutup modal kalau klik area gelap
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative">
        {/* Header Modal */}
        <div className="bg-gray-50 border-b p-5 flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{data.nama}</h2>
            <div className="flex gap-2 mt-2">
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                {data.golongan}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold uppercase border
                ${
                  data.simbol?.includes('Merah')
                    ? 'text-red-600 border-red-200 bg-red-50'
                    : data.simbol?.includes('Biru')
                    ? 'text-blue-600 border-blue-200 bg-blue-50'
                    : 'text-emerald-600 border-emerald-200 bg-emerald-50'
                }`}
              >
                Simbol: {data.simbol}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Body Modal (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section: Manfaat & Efek Samping */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                <Stethoscope size={18} /> Kegunaan / Manfaat
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{data.kegunaan}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <AlertTriangle size={18} /> Efek Samping
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{data.efek_samping || 'Tidak ada data spesifik.'}</p>
            </div>
          </div>

          {/* Section: Informasi Teknis */}
          <div className="space-y-4">
            <InfoItem label="Kandungan" value={data.kandungan} icon={<Pill size={16} />} />
            <InfoItem label="Dosis Dewasa" value={data.dosis_dewasa} icon={<Thermometer size={16} />} />
            <InfoItem label="Dosis Anak" value={data.dosis_anak} />
            <InfoItem label="Aturan Pakai" value={data.waktu_konsumsi} />

            {/* Informasi Tambahan (Jika ada) */}
            <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400 mt-4">
              <h4 className="font-bold text-blue-800 text-sm mb-1">⚠️ Interaksi Obat</h4>
              <p className="text-sm text-blue-900">{data.interaksi || 'Tidak ada data interaksi.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 pt-4 border-t">
              <div>
                <strong>Penyimpanan:</strong>
                <br />
                {data.aturan_penyimpanan}
              </div>
              <div>
                <strong>Pembuangan:</strong>
                <br />
                {data.pembuangan}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-400">Konsultasikan dengan dokter jika gejala berlanjut.</p>
        </div>
      </div>
    </div>
  )
}

// Helper kecil untuk item info
function InfoItem({ label, value, icon }) {
  if (!value || value === '-') return null
  return (
    <div className="border-b border-gray-100 pb-2 last:border-0">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
        {icon} {label}
      </span>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  )
}
