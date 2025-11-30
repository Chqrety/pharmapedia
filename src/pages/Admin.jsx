import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Trash2, Plus, Save, Search, LayoutDashboard, Pill, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Admin() {
  const [obat, setObat] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // --- STATE FORM LENGKAP ---
  const [form, setForm] = useState({
    nama: '',
    kandungan: '',
    golongan: '',
    kegunaan: '',
    efek_samping: '',
    dosis_dewasa: '',
    dosis_anak: '',
    simbol: 'Hijau',
    waktu_konsumsi: '',
    interaksi: '', // Tambahan
    aturan_penyimpanan: '', // Tambahan Wajib
    pembuangan: '', // Tambahan Wajib
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('obat').select('*').order('id', { ascending: false })
    setObat(data || [])
    setLoading(false)
  }

  // Handle Tambah
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nama) return alert('Nama obat wajib diisi!')

    const { error } = await supabase.from('obat').insert([form])

    if (!error) {
      alert('✅ Obat berhasil ditambahkan!')
      // Reset form LENGKAP
      setForm({
        nama: '',
        kandungan: '',
        golongan: '',
        kegunaan: '',
        efek_samping: '',
        dosis_dewasa: '',
        dosis_anak: '',
        simbol: 'Hijau',
        waktu_konsumsi: '',
        interaksi: '',
        aturan_penyimpanan: '',
        pembuangan: '',
      })
      fetchData()
    } else {
      alert('Gagal: ' + error.message)
    }
  }

  // Handle Hapus
  async function handleDelete(id, nama) {
    if (!confirm(`Yakin mau menghapus "${nama}" dari database?`)) return
    const { error } = await supabase.from('obat').delete().eq('id', id)
    if (!error) fetchData()
    else alert(error.message)
  }

  const filteredObat = obat.filter((item) => item.nama.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: obat.length,
    keras: obat.filter((o) => o.simbol?.includes('Merah')).length,
    bebas: obat.filter((o) => o.simbol?.includes('Hijau')).length,
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Stats */}
      <div>
        <h2 className="text-3xl font-bold text-pharma-dark flex items-center gap-3">
          <LayoutDashboard className="text-pharma-primary" /> Admin Dashboard
        </h2>
        <p className="text-gray-500 mt-1">Kelola database obat Pharmapedia di sini.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <StatCard title="Total Obat" count={stats.total} icon={<Pill />} color="bg-blue-50 text-blue-600" />
          <StatCard title="Obat Keras" count={stats.keras} icon={<AlertTriangle />} color="bg-red-50 text-red-600" />
          <StatCard
            title="Obat Bebas"
            count={stats.bebas}
            icon={<CheckCircle />}
            color="bg-emerald-50 text-emerald-600"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* FORM INPUT */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800 border-b pb-4 sticky top-0 bg-white z-10">
            <Plus className="bg-pharma-primary text-white rounded-full p-1" size={24} />
            Tambah Data Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Nama Obat"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Paracetamol"
            />

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori Simbol</label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pharma-primary focus:border-transparent outline-none transition text-sm"
                value={form.simbol}
                onChange={(e) => setForm({ ...form, simbol: e.target.value })}
              >
                <option value="Hijau">🟢 Hijau (Obat Bebas)</option>
                <option value="Biru">🔵 Biru (Bebas Terbatas)</option>
                <option value="Merah">🔴 Merah (Obat Keras)</option>
              </select>
            </div>

            <FormInput
              label="Kandungan"
              value={form.kandungan}
              onChange={(e) => setForm({ ...form, kandungan: e.target.value })}
              placeholder="Zat aktif..."
            />
            <FormInput
              label="Golongan"
              value={form.golongan}
              onChange={(e) => setForm({ ...form, golongan: e.target.value })}
              placeholder="Analgesik, Antibiotik..."
            />

            <FormTextArea
              label="Kegunaan (Manfaat)"
              value={form.kegunaan}
              onChange={(e) => setForm({ ...form, kegunaan: e.target.value })}
              placeholder="Untuk mengobati..."
            />
            <FormTextArea
              label="Efek Samping (Negatif)"
              value={form.efek_samping}
              onChange={(e) => setForm({ ...form, efek_samping: e.target.value })}
              placeholder="Mual, pusing..."
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Dosis Dewasa"
                value={form.dosis_dewasa}
                onChange={(e) => setForm({ ...form, dosis_dewasa: e.target.value })}
                placeholder="3x1 tab"
              />
              <FormInput
                label="Dosis Anak"
                value={form.dosis_anak}
                onChange={(e) => setForm({ ...form, dosis_anak: e.target.value })}
                placeholder="1/2 tab"
              />
            </div>

            <FormInput
              label="Waktu Konsumsi"
              value={form.waktu_konsumsi}
              onChange={(e) => setForm({ ...form, waktu_konsumsi: e.target.value })}
              placeholder="Sesudah makan..."
            />

            <FormTextArea
              label="Interaksi Obat"
              value={form.interaksi}
              onChange={(e) => setForm({ ...form, interaksi: e.target.value })}
              placeholder="Jangan diminum bersama..."
            />

            {/* --- BAGIAN BARU YANG KITA TAMBAH --- */}
            <div className="grid grid-cols-1 gap-3 pt-2 border-t border-dashed">
              <FormInput
                label="Aturan Penyimpanan"
                value={form.aturan_penyimpanan}
                onChange={(e) => setForm({ ...form, aturan_penyimpanan: e.target.value })}
                placeholder="Suhu ruang, kering..."
              />
              <FormInput
                label="Cara Pembuangan"
                value={form.pembuangan}
                onChange={(e) => setForm({ ...form, pembuangan: e.target.value })}
                placeholder="Hancurkan tablet..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-pharma-primary to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-4"
            >
              <Save size={20} /> Simpan ke Database
            </button>
          </form>
        </div>

        {/* TABEL DATA */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
            <Search className="text-gray-400 ml-2" size={20} />
            <input
              type="text"
              placeholder="Cari obat di database..."
              className="flex-1 outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="p-5 border-b">Nama Obat</th>
                    <th className="p-5 border-b hidden sm:table-cell">Kandungan</th>
                    <th className="p-5 border-b">Golongan</th>
                    <th className="p-5 border-b text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400">
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredObat.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400">
                        Tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredObat.map((item) => (
                      <tr key={item.id} className="hover:bg-teal-50/30 transition duration-150 group">
                        <td className="p-5">
                          <div className="font-bold text-gray-800 text-base">{item.nama}</div>
                          <div className="text-xs text-gray-400 mt-1 sm:hidden">{item.kandungan}</div>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                              item.simbol?.includes('Merah')
                                ? 'text-red-600 bg-red-50 border-red-100'
                                : item.simbol?.includes('Biru')
                                ? 'text-blue-600 bg-blue-50 border-blue-100'
                                : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                            }`}
                          >
                            {item.simbol || 'Umum'}
                          </span>
                        </td>
                        <td className="p-5 hidden sm:table-cell text-gray-600 max-w-xs truncate">{item.kandungan}</td>
                        <td className="p-5">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap inline-block">
                            {item.golongan}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                            title="Hapus Obat"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t text-xs text-gray-500 text-center">
              Menampilkan {filteredObat.length} dari {obat.length} data obat
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Components Helpers ---
function StatCard({ title, count, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{count}</div>
        <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">{title}</div>
      </div>
    </div>
  )
}

function FormInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      <input
        type="text"
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pharma-primary focus:border-transparent outline-none transition text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

function FormTextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      <textarea
        rows="2"
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pharma-primary focus:border-transparent outline-none transition text-sm resize-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
