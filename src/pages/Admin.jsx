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
      setIsModalOpen(false)
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
    // BACKGROUND: Peach Soft (Sama kayak Home)
    <div className="min-h-screen w-full pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FFF5F5] font-sans overflow-x-hidden">
      {/* HEADER DASHBOARD */}
      <div className="mx-auto space-y-8 pb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <LayoutDashboard className="text-rose-500" /> Admin Dashboard
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard title="Total Obat" count={stats.total} icon={<Pill />} color="text-slate-600" />
            <StatCard title="Obat Keras" count={stats.keras} icon={<AlertTriangle />} color="text-rose-600" />
            <StatCard title="Terbatas" count={stats.terbatas} icon={<Info />} color="text-blue-600" />
            <StatCard title="Obat Bebas" count={stats.bebas} icon={<CheckCircle />} color="text-emerald-600" />
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* FORM SIDEBAR (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 bg-white/80 backdrop-blur-xl p-6 rounded-4xl shadow-xl shadow-rose-900/5 border border-white sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-800 border-b border-rose-100 pb-4 sticky top-0 bg-white/95 backdrop-blur z-10">
              <Plus className="bg-rose-100 text-rose-600 rounded-full p-1" size={24} />
              Tambah Data
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormContent form={form} setForm={setForm} />
              <button
                type="submit"
                className="w-full bg-linear-to-r from-rose-500 to-purple-600 hover:opacity-90 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all flex justify-center items-center gap-2 mt-6 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Save size={20} /> Simpan Database
              </button>
            </form>
          </div>

          {/* TABLE SECTION */}
          <div className="lg:col-span-2 space-y-6 w-full min-w-0">
            {/* SEARCH BAR */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sticky top-20 z-30">
              <div className="bg-white/80 backdrop-blur-md p-2 pl-4 rounded-2xl shadow-sm border border-white flex items-center gap-3 w-full sm:flex-1 transition-all focus-within:ring-2 focus-within:ring-rose-100 focus-within:border-rose-300">
                <Search className="text-rose-300 ml-1 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Cari nama obat..."
                  className="w-full py-2 bg-transparent outline-none text-slate-700 font-medium placeholder-slate-400 min-w-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Tombol Tambah Mobile */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="lg:hidden w-full sm:w-auto bg-linear-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-200 flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-transform"
              >
                <Plus size={20} /> Tambah
              </button>
            </div>

            {/* TABEL */}
            <div className="bg-white/70 backdrop-blur-xl rounded-4xl shadow-xl shadow-rose-900/5 border border-white w-full overflow-hidden">
              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-rose-50/50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="p-5 border-b border-rose-100 whitespace-nowrap">Nama Obat</th>
                      <th className="p-5 border-b border-rose-100 whitespace-nowrap">Kandungan</th>
                      <th className="p-5 border-b border-rose-100 whitespace-nowrap">Golongan</th>
                      <th className="p-5 border-b border-rose-100 text-center whitespace-nowrap">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="p-10 text-center text-rose-400 font-medium animate-pulse">
                          Sedang memuat data...
                        </td>
                      </tr>
                    ) : filteredObat.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-10 text-center text-slate-400">
                          Data tidak ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredObat.map((item) => (
                        <tr key={item.id} className="hover:bg-white transition duration-200 group">
                          <td className="p-5">
                            <div className="font-bold text-slate-800 text-base mb-1">{item.nama}</div>
                            <Badge simbol={item.simbol} />
                          </td>
                          <td className="p-5 text-slate-600 max-w-xs truncate font-medium">{item.kandungan}</td>
                          <td className="p-5">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border border-slate-200">
                              {item.golongan}
                            </span>
                          </td>
                          <td className="p-5 text-center">
                            <button
                              onClick={() => handleDelete(item.id, item.nama)}
                              className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2.5 rounded-xl transition-all"
                              title="Hapus"
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
      </div>

      {/* MODAL FORM (Mobile) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in lg:hidden">
          <div className="bg-white w-full max-h-[90vh] rounded-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="font-bold text-xl text-slate-800">Tambah Obat</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormContent form={form} setForm={setForm} />
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-rose-500 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg mt-4 active:scale-95 transition-transform"
                >
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

// --- SUB-COMPONENTS & HELPERS ---

function FormContent({ form, setForm }) {
  return (
    <>
      <FormInput
        label="Nama Obat"
        value={form.nama}
        onChange={(e) => setForm({ ...form, nama: e.target.value })}
        placeholder="Contoh: Paracetamol"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider ml-1">
            Kategori Simbol
          </label>
          <select
            className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition text-sm font-medium text-slate-700 appearance-none shadow-sm"
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
        label="Kandungan Utama"
        value={form.kandungan}
        onChange={(e) => setForm({ ...form, kandungan: e.target.value })}
        placeholder="Zat aktif..."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <FormTextArea
          label="Efek Positif (Manfaat)"
          value={form.kegunaan}
          onChange={(e) => setForm({ ...form, kegunaan: e.target.value })}
          placeholder="Manfaat obat..."
        />
        <FormTextArea
          label="Efek Negatif (Efek Samping)"
          value={form.efek_samping}
          onChange={(e) => setForm({ ...form, efek_samping: e.target.value })}
          placeholder="Risiko obat..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Dosis Dewasa"
          value={form.dosis_dewasa}
          onChange={(e) => setForm({ ...form, dosis_dewasa: e.target.value })}
          placeholder="3x1 Tablet"
        />
        <FormInput
          label="Dosis Anak"
          value={form.dosis_anak}
          onChange={(e) => setForm({ ...form, dosis_anak: e.target.value })}
          placeholder="1/2 Tablet"
        />
      </div>

      <FormInput
        label="Waktu Konsumsi"
        value={form.waktu_konsumsi}
        onChange={(e) => setForm({ ...form, waktu_konsumsi: e.target.value })}
        placeholder="Sesudah makan"
      />
      <FormTextArea
        label="Interaksi Obat"
        value={form.interaksi}
        onChange={(e) => setForm({ ...form, interaksi: e.target.value })}
        placeholder="Hindari bersama..."
      />

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-slate-200">
        <FormInput
          label="Penyimpanan"
          value={form.aturan_penyimpanan}
          onChange={(e) => setForm({ ...form, aturan_penyimpanan: e.target.value })}
          placeholder="Suhu ruang"
        />
        <FormInput
          label="Pembuangan"
          value={form.pembuangan}
          onChange={(e) => setForm({ ...form, pembuangan: e.target.value })}
          placeholder="Hancurkan dulu"
        />
      </div>
    </>
  )
}

function StatCard({ title, count, icon, color }) {
  // Logic warna background soft
  let bgClass = 'bg-slate-50 border-slate-100'
  if (color.includes('rose')) bgClass = 'bg-rose-50 border-rose-100'
  else if (color.includes('blue')) bgClass = 'bg-blue-50 border-blue-100'
  else if (color.includes('emerald')) bgClass = 'bg-emerald-50 border-emerald-100'

  return (
    <div
      className={`p-5 rounded-3xl border ${bgClass} flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-opacity-60 backdrop-blur-sm`}
    >
      <div className={`p-3.5 rounded-2xl bg-white shadow-sm ${color}`}>{icon}</div>
      <div>
        <div className="text-3xl font-black text-slate-800 tracking-tighter">{count}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</div>
      </div>
    </div>
  )
}

function Badge({ simbol }) {
  const styles = {
    Hijau: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Biru: 'bg-blue-100 text-blue-700 border-blue-200',
    Merah: 'bg-rose-100 text-rose-700 border-rose-200',
  }
  const defaultStyle = 'bg-slate-100 text-slate-600 border-slate-200'
  const match = Object.keys(styles).find((key) => simbol?.includes(key))

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
        styles[match] || defaultStyle
      }`}
    >
      {simbol || 'Umum'}
    </span>
  )
}

function FormInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider ml-1">{label}</label>
      <input
        type="text"
        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all text-sm font-medium text-slate-700 placeholder-slate-300 shadow-sm"
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
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider ml-1">{label}</label>
      <textarea
        rows="2"
        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all text-sm font-medium text-slate-700 placeholder-slate-300 resize-none shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
