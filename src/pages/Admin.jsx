import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Trash2, Plus, Save, Search, X, Info, LayoutDashboard, Pill, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Admin() {
  const [obat, setObat] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    interaksi: '',
    aturan_penyimpanan: '',
    pembuangan: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('obat').select('*').order('id', { ascending: false })
    setObat(data || [])
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nama) return alert('Nama obat wajib diisi!')

    const { error } = await supabase.from('obat').insert([form])

    if (!error) {
      alert('✅ Obat berhasil ditambahkan!')
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
      setIsModalOpen(false) // Tutup modal (untuk tampilan mobile)
      fetchData()
    } else {
      alert('Gagal: ' + error.message)
    }
  }

  async function handleDelete(id, nama) {
    if (!confirm(`Yakin mau menghapus "${nama}"?`)) return
    const { error } = await supabase.from('obat').delete().eq('id', id)
    if (!error) fetchData()
    else alert(error.message)
  }

  const filteredObat = obat.filter((item) => item.nama.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: obat.length,
    keras: obat.filter((o) => o.simbol?.includes('Merah')).length,
    bebas: obat.filter((o) => o.simbol?.includes('Hijau')).length,
    terbatas: obat.filter((o) => o.simbol?.includes('Biru')).length,
  }

  return (
    <div className="space-y-8 pb-12">
      {/* --- HEADER --- */}
      <div>
        <h2 className="text-3xl font-bold text-pharma-dark flex items-center gap-3">
          <LayoutDashboard className="text-pharma-primary" /> Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard title="Total" count={stats.total} icon={<Pill />} color="bg-gray-100 text-gray-600" />
          <StatCard title="Keras" count={stats.keras} icon={<AlertTriangle />} color="bg-red-50 text-red-600" />
          <StatCard title="Terbatas" count={stats.terbatas} icon={<Info />} color="bg-blue-50 text-blue-600" />
          <StatCard title="Bebas" count={stats.bebas} icon={<CheckCircle />} color="bg-emerald-50 text-emerald-600" />
        </div>
      </div>

      {/* --- MAIN LAYOUT (Hybrid Grid) --- */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* 1. FORM SECTION (DESKTOP: Sidebar Kiri, MOBILE: Hidden) */}
        <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800 border-b pb-4 sticky top-0 bg-white z-10">
            <Plus className="bg-pharma-primary text-white rounded-full p-1" size={24} />
            Tambah Data
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kita panggil komponen FormContent biar kodingan ga duplikat */}
            <FormContent form={form} setForm={setForm} />
            <button
              type="submit"
              className="w-full bg-pharma-primary hover:bg-teal-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition flex justify-center items-center gap-2 mt-4"
            >
              <Save size={20} /> Simpan
            </button>
          </form>
        </div>

        {/* Tambahkan min-w-0 disini. Ini PENTING biar dia ga dipaksa melar sama tabel */}
        <div className="lg:col-span-2 space-y-4 w-full min-w-0">
          {/* 1. CONTAINER SEARCH BAR */}
          {/* Ini berdiri sendiri, lebarnya ngikutin grid layar, bukan tabel */}
          <div className="sticky left-0 w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 w-full sm:flex-1 transition-all">
                <Search className="text-gray-400 ml-2 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Cari obat..."
                  className="w-full outline-none text-gray-700 bg-transparent min-w-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Tombol Tambah Mobile */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="lg:hidden w-full sm:w-auto bg-pharma-primary text-white px-5 py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <Plus size={20} /> Tambah Obat
              </button>
            </div>
          </div>

          {/* 2. CONTAINER TABEL */}
          {/* Tabelnya kita kurung disini biar cuma dia yang scroll */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full overflow-hidden relative">
            {/* Wrapper Scroll: Cuma tabel di dalam sini yang bisa geser */}
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full min-w-[700px] text-left text-sm">
                {/* min-w biar memicu scroll di HP */}
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="p-4 border-b whitespace-nowrap">Nama Obat</th>
                    <th className="p-4 border-b whitespace-nowrap">Kandungan</th>
                    <th className="p-4 border-b whitespace-nowrap">Golongan</th>
                    <th className="p-4 border-b text-center whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredObat.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">
                        Kosong.
                      </td>
                    </tr>
                  ) : (
                    filteredObat.map((item) => (
                      <tr key={item.id} className="hover:bg-teal-50/30 transition duration-150">
                        <td className="p-4">
                          <div className="font-bold text-gray-800 text-base">{item.nama}</div>
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
                        <td className="p-4 text-gray-600 max-w-xs truncate">{item.kandungan}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap inline-block">
                            {item.golongan}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="text-gray-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
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
          </div>
        </div>
      </div>

      {/* --- 3. MODAL FORM (KHUSUS MOBILE) --- */}
      {/* Modal ini hanya muncul jika isModalOpen = true */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in lg:hidden">
          <div className="bg-white w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Tambah Obat Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Panggil komponen isi form yang sama */}
                <FormContent form={form} setForm={setForm} />
                <button type="submit" className="w-full bg-pharma-primary text-white py-3 rounded-xl font-bold mt-4">
                  Simpan Data
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- SUB-COMPONENT: ISI FORM (Supaya tidak menulis codingan 2x) ---
function FormContent({ form, setForm }) {
  return (
    <>
      <FormInput
        label="Nama Obat"
        value={form.nama}
        onChange={(e) => setForm({ ...form, nama: e.target.value })}
        placeholder="Paracetamol"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Simbol</label>
          <select
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pharma-primary outline-none transition text-sm"
            value={form.simbol}
            onChange={(e) => setForm({ ...form, simbol: e.target.value })}
          >
            <option value="Hijau">🟢 Bebas</option>
            <option value="Biru">🔵 Terbatas</option>
            <option value="Merah">🔴 Keras</option>
          </select>
        </div>
        <FormInput
          label="Golongan"
          value={form.golongan}
          onChange={(e) => setForm({ ...form, golongan: e.target.value })}
          placeholder="Analgesik"
        />
      </div>

      <FormInput
        label="Kandungan"
        value={form.kandungan}
        onChange={(e) => setForm({ ...form, kandungan: e.target.value })}
      />
      <FormTextArea
        label="Efek Positif"
        value={form.kegunaan}
        onChange={(e) => setForm({ ...form, kegunaan: e.target.value })}
      />
      <FormTextArea
        label="Efek Negatif"
        value={form.efek_samping}
        onChange={(e) => setForm({ ...form, efek_samping: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Dosis Dewasa"
          value={form.dosis_dewasa}
          onChange={(e) => setForm({ ...form, dosis_dewasa: e.target.value })}
        />
        <FormInput
          label="Dosis Anak"
          value={form.dosis_anak}
          onChange={(e) => setForm({ ...form, dosis_anak: e.target.value })}
        />
      </div>

      <FormInput
        label="Waktu Konsumsi"
        value={form.waktu_konsumsi}
        onChange={(e) => setForm({ ...form, waktu_konsumsi: e.target.value })}
      />
      <FormTextArea
        label="Interaksi"
        value={form.interaksi}
        onChange={(e) => setForm({ ...form, interaksi: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed">
        <FormInput
          label="Penyimpanan"
          value={form.aturan_penyimpanan}
          onChange={(e) => setForm({ ...form, aturan_penyimpanan: e.target.value })}
        />
        <FormInput
          label="Pembuangan"
          value={form.pembuangan}
          onChange={(e) => setForm({ ...form, pembuangan: e.target.value })}
        />
      </div>
    </>
  )
}

// --- Helpers ---
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
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">{label}</label>
      <input
        type="text"
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pharma-primary outline-none transition text-sm"
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
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">{label}</label>
      <textarea
        rows="2"
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pharma-primary outline-none transition text-sm resize-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
