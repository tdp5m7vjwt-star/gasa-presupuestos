import { supabase, signIn, signOut, getSession } from './lib/supabase';
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Printer, Mail, MessageCircle, Plus, Trash2, Copy, FileText, Save, Users, History, CheckCircle2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';

const CATALOG = [
  { id: 'C001', category: 'Consulta y Diagnóstico', treatment: 'Consulta adulto', price: 700, notes: 'Importado de lista GASA 2026' },
  { id: 'C002', category: 'Consulta y Diagnóstico', treatment: 'Consulta infantil', price: 600, notes: 'Importado de lista GASA 2026' },
  { id: 'P001', category: 'Preventivos', treatment: 'ATBF', price: 700, notes: 'Importado de lista GASA 2026' },
  { id: 'P002', category: 'Preventivos', treatment: 'Blanqueamiento + Limpieza', price: 4500, notes: 'Importado de lista GASA 2026' },
  { id: 'P003', category: 'Preventivos', treatment: 'Clorixin', price: 150, notes: 'Importado de lista GASA 2026' },
  { id: 'P004', category: 'Preventivos', treatment: 'Limpieza adulto', price: 900, notes: 'Importado de lista GASA 2026' },
  { id: 'P005', category: 'Preventivos', treatment: 'Limpieza infantil', price: 700, notes: 'Importado de lista GASA 2026' },
  { id: 'P006', category: 'Preventivos', treatment: 'Saforide', price: 1000, notes: 'Importado de lista GASA 2026' },
  { id: 'P007', category: 'Preventivos', treatment: 'Sellador', price: 600, notes: 'Importado de lista GASA 2026' },
  { id: 'O001', category: 'Operatoria / Estética', treatment: 'Blanqueamiento interno', price: 500, notes: 'Importado de lista GASA 2026' },
  { id: 'O002', category: 'Operatoria / Estética', treatment: 'Carilla E-max', price: null, notes: 'Pendiente de actualización' },
  { id: 'O003', category: 'Operatoria / Estética', treatment: 'Endoposte + reconstrucción Luxa Core Z', price: 2000, notes: 'Importado de lista GASA 2026' },
  { id: 'O004', category: 'Operatoria / Estética', treatment: 'Reconstrucción', price: 1500, notes: 'Importado de lista GASA 2026' },
  { id: 'O005', category: 'Operatoria / Estética', treatment: 'Resina 1 cara', price: 1000, notes: 'Importado de lista GASA 2026' },
  { id: 'O006', category: 'Operatoria / Estética', treatment: 'Resina 2 caras interproximal', price: 1500, notes: 'Importado de lista GASA 2026' },
  { id: 'O007', category: 'Operatoria / Estética', treatment: 'Resina anterior estética', price: 1500, notes: 'Importado de lista GASA 2026' },
  { id: 'O008', category: 'Operatoria / Estética', treatment: 'Resina diente deciduo', price: 700, notes: 'Importado de lista GASA 2026' },
  { id: 'E001', category: 'Endodoncia', treatment: 'Endodoncia', price: 3800, notes: 'Importado de lista GASA 2026' },
  { id: 'E002', category: 'Endodoncia', treatment: 'Retratamiento de endodoncia', price: 4000, notes: 'Importado de lista GASA 2026' },
  { id: 'PER001', category: 'Periodoncia', treatment: 'Curetaje cerrado', price: 1800, notes: 'Importado de lista GASA 2026' },
  { id: 'Q001', category: 'Cirugía / Maxilofacial', treatment: 'Cirugía 3er molar', price: 3300, notes: 'Importado de lista GASA 2026' },
  { id: 'Q002', category: 'Cirugía / Maxilofacial', treatment: 'Cirugía resto radicular', price: 3000, notes: 'Importado de lista GASA 2026' },
  { id: 'Q003', category: 'Cirugía / Maxilofacial', treatment: 'Extracción canino retenido', price: 3300, notes: 'Importado de lista GASA 2026' },
  { id: 'Q004', category: 'Cirugía / Maxilofacial', treatment: 'Extracción compleja', price: 2500, notes: 'Importado de lista GASA 2026' },
  { id: 'Q005', category: 'Cirugía / Maxilofacial', treatment: 'Extracción infantil', price: 700, notes: 'Importado de lista GASA 2026' },
  { id: 'Q006', category: 'Cirugía / Maxilofacial', treatment: 'Extracción resto radicular simple', price: 1800, notes: 'Importado de lista GASA 2026' },
  { id: 'Q007', category: 'Cirugía / Maxilofacial', treatment: 'Extracción simple', price: 1500, notes: 'Importado de lista GASA 2026' },
  { id: 'Q008', category: 'Cirugía / Maxilofacial', treatment: 'Extracción simple (Maxilo)', price: 2000, notes: 'Importado de lista GASA 2026' },
  { id: 'OP001', category: 'Odontopediatría', treatment: 'Corona acero cromo adulto', price: 2500, notes: 'Importado de lista GASA 2026' },
  { id: 'OP002', category: 'Odontopediatría', treatment: 'Pulpotomía/Pulpectomía + corona AC', price: 2700, notes: 'Importado de lista GASA 2026' },
  { id: 'OP003', category: 'Odontopediatría', treatment: 'Pulpotomía/Pulpectomía + corona celuloide', price: 3000, notes: 'Importado de lista GASA 2026' },
  { id: 'OP004', category: 'Odontopediatría', treatment: 'Pulpotomía/Pulpectomía + corona HERES', price: 3700, notes: 'Importado de lista GASA 2026' },
  { id: 'OR001', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Alineadores', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR002', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Bracket recementado', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR003', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Consulta Invisalign Zaira', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR004', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Consulta Ortodoncia Maldonado', price: 1000, notes: 'Importado de lista GASA 2026' },
  { id: 'OR005', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Consulta Ortodoncia Zaira', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR006', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Guarda de acetato', price: 800, notes: 'Importado de lista GASA 2026' },
  { id: 'OR007', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Hyrax', price: 5000, notes: 'Importado de lista GASA 2026' },
  { id: 'OR008', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Máscara facial', price: 5000, notes: 'Importado de lista GASA 2026' },
  { id: 'OR009', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Ortodoncia Final Maldonado', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR010', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Ortodoncia Final Zaira', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR011', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Ortodoncia Inicial Maldonado', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR012', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Ortodoncia Inicial Zaira', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR013', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Ortodoncia Total', price: null, notes: 'Pendiente de actualización' },
  { id: 'OR014', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Placa activa con tornillo expansor inferior', price: 2800, notes: 'Importado de lista GASA 2026' },
  { id: 'OR015', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Placa activa con tornillo expansor superior', price: 4200, notes: 'Importado de lista GASA 2026' },
  { id: 'OR016', category: 'Ortodoncia / Ortopedia / Alineadores', treatment: 'Retiro de ortodoncia', price: 1600, notes: 'Importado de lista GASA 2026' },
  { id: 'R001', category: 'Prótesis y Rehabilitación', treatment: 'Cementado corona permanente', price: 700, notes: 'Importado de lista GASA 2026' },
  { id: 'R002', category: 'Prótesis y Rehabilitación', treatment: 'Cementado corona provisional', price: 0, notes: 'Pendiente de actualización' },
  { id: 'R003', category: 'Prótesis y Rehabilitación', treatment: 'Corona monolítica de zirconia', price: 7500, notes: 'Importado de lista GASA 2026' },
  { id: 'R004', category: 'Prótesis y Rehabilitación', treatment: 'Prótesis parcial cuerpo metal', price: 9500, notes: 'Importado de lista GASA 2026' },
  { id: 'R005', category: 'Prótesis y Rehabilitación', treatment: 'Protesis parcial digital', price: 12000, notes: 'Importado de lista GASA 2026' },
  { id: 'R006', category: 'Prótesis y Rehabilitación', treatment: 'Prótesis parcial unilateral', price: 5000, notes: 'Importado de lista GASA 2026' },
  { id: 'R007', category: 'Prótesis y Rehabilitación', treatment: 'Prótesis total (ambas arcadas)', price: 12500, notes: 'Importado de lista GASA 2026' },
  { id: 'R008', category: 'Prótesis y Rehabilitación', treatment: 'Protesis Total (una arcada)', price: 8500, notes: 'Importado de lista GASA 2026' },
  { id: 'R009', category: 'Prótesis y Rehabilitación', treatment: 'Protesis Valplast bilateral', price: 9500, notes: 'Importado de lista GASA 2026' },
  { id: 'R010', category: 'Prótesis y Rehabilitación', treatment: 'Prótesis Valplast unilateral', price: 8000, notes: 'Importado de lista GASA 2026' },
  { id: 'R011', category: 'Prótesis y Rehabilitación', treatment: 'Provisional maquinado PMMA', price: 3500, notes: 'Importado de lista GASA 2026' },
  { id: 'R012', category: 'Prótesis y Rehabilitación', treatment: 'Retiro de corona', price: 300, notes: 'Importado de lista GASA 2026' },
  { id: 'I001', category: 'Implantología / Injertos', treatment: 'Extracción + injerto de hueso', price: 6000, notes: 'Importado de lista GASA 2026' },
  { id: 'I002', category: 'Implantología / Injertos', treatment: 'Extracción + injerto de hueso + corona zirconia', price: 36000, notes: 'Importado de lista GASA 2026' },
  { id: 'I003', category: 'Implantología / Injertos', treatment: 'Implante + corona zirconia', price: 31000, notes: 'Importado de lista GASA 2026' },
  { id: 'D001', category: 'Consultas por Doctor / Honorarios', treatment: 'Consulta Dr PerezFrutos', price: null, notes: 'Pendiente de actualización' },
  { id: 'D002', category: 'Consultas por Doctor / Honorarios', treatment: 'Consulta Dr Ruiz', price: null, notes: 'Pendiente de actualización' },
  { id: 'D003', category: 'Consultas por Doctor / Honorarios', treatment: 'Consulta Dr Sanchez', price: null, notes: 'Pendiente de actualización' },
  { id: 'D004', category: 'Consultas por Doctor / Honorarios', treatment: 'Consulta Dr Soltero', price: null, notes: 'Pendiente de actualización' },
  { id: 'D005', category: 'Consultas por Doctor / Honorarios', treatment: 'Consulta Dra Gallegos', price: null, notes: 'Pendiente de actualización' },
  { id: 'D006', category: 'Consultas por Doctor / Honorarios', treatment: 'Consulta Dra Herrera', price: null, notes: 'Pendiente de actualización' },
  { id: 'D007', category: 'Consultas por Doctor / Honorarios', treatment: 'Consulta Dra Marina', price: null, notes: 'Pendiente de actualización' },
];

const CLINIC = {
  name: 'Gasa Médicos y Dentistas',
  address: 'Av. Ejército Nacional 7695, Edificio E Local 4, Colonia Del Marquez, C.P. 3207, Cd. Juárez, Chihuahua, México',
  whatsapp: '656 849 0365',
  phone: '656 616 3011',
  email: 'gasamd@hotmail.com',
  primaryColor: '#154A8D',
  logoUrl: '', // Al instalar la app: colocar aquí /logo-gasa.png o /logo-gasa.svg
};

const STATUSES = ['Pendiente', 'Aceptado', 'En tratamiento', 'Cancelado'];
const DOCTORS = [
  'Dirección',
  'Recepción',
  'Dr. Maldonado',
  'Dra. Zaira',
  'Dr. PerezFrutos',
  'Dr. Ruiz',
  'Dr. Sanchez',
  'Dr. Soltero',
  'Dra. Gallegos',
  'Dra. Herrera',
  'Dra. Marina',
  'Dr. Oscar Gaytan',
  'Dra. Velia Muñoz',
  'Dr. Jorge Salas'
  'Dra. Polet Carrillo',
  'Dr. Emilio Esqueda',
];

const emptyItem = () => ({ id: crypto.randomUUID(), catalogId: '', category: '', treatment: '', qty: 1, price: 0, discount: 0, notes: '' });

const newQuote = () => ({
  id: crypto.randomUUID(),
  folio: `GASA-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
  date: new Date().toISOString().slice(0, 10),
  patientId: '',
  patientName: '',
  phone: '',
  email: '',
  doctor: '',
  validUntil: '',
  status: 'Pendiente',
  advance: 0,
  notes: 'Este presupuesto puede variar según diagnóstico definitivo, evolución clínica y tratamientos adicionales requeridos.',
  paymentTerms: 'El presupuesto no aparta cita ni garantiza disponibilidad hasta confirmar agenda y anticipo correspondiente.',
  items: [emptyItem()],
});

export default function AppPresupuestosGASA() {
async function cargarTratamientos() {
  const { data, error } = await supabase
    .from('tratamientos')
    .select('*')
    .order('categoria', { ascending: true })

  if (error) {
    console.error('Error cargando tratamientos:', error)
    return
  }

  const tratamientosConvertidos = data.map((item) => ({
    id: item.id,
    category: item.categoria,
    treatment: item.nombre,
    price: item.precio,
    notes: item.notas || ''
  }))

  console.log('TRATAMIENTOS SUPABASE:', tratamientosConvertidos)
  setCatalogo(tratamientosConvertidos)
}
async function subirCatalogoASupabase() {

  const tratamientosFormateados = CATALOG.map((item) => ({
    nombre: item.treatment,
    categoria: item.category,
    precio: item.price,
    notas: item.notes,
    precio_editable: item.price === null
  }))

  const { data, error } = await supabase
    .from('tratamientos')
    .insert(tratamientosFormateados)

  if (error) {
    console.error('ERROR SUBIENDO:', error)
    return
  }

  console.log('CATALOGO SUBIDO:', data)
}

  const [tab, setTab] = useState('presupuesto');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const [quote, setQuote] = useState(newQuote());
  const [patients, setPatients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [savedNotice, setSavedNotice] = useState('');
  const [catalogo, setCatalogo] = useState([]);
  const [session, setSession] = useState(null);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loadingAuth, setLoadingAuth] = useState(true);

 useEffect(() => {
    cargarTratamientos()
}, [])
useEffect(() => {

  async function revisarSesion() {
    const { data } = await getSession()

    setSession(data.session)
    setLoadingAuth(false)
  }

  revisarSesion()

}, [])

  useEffect(() => {
    setPatients(JSON.parse(localStorage.getItem('gasa_patients') || '[]'));
    setQuotes(JSON.parse(localStorage.getItem('gasa_quotes') || '[]'));
  }, []);

  useEffect(() => localStorage.setItem('gasa_patients', JSON.stringify(patients)), [patients]);
  useEffect(() => localStorage.setItem('gasa_quotes', JSON.stringify(quotes)), [quotes]);

const categories = useMemo(() => ['Todas', ...Array.from(new Set(catalogo.map((i) => i.category)))], [catalogo]);
  const filteredCatalog = useMemo(() => catalogo.filter((item) => {
    const matchesCategory = category === 'Todas' || item.category === category;
    const q = query.toLowerCase();
    const matchesQuery = !q || item.treatment.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
}), [catalogo, query, category]);

  const totals = useMemo(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
    const discount = quote.items.reduce((sum, item) => sum + Number(item.discount || 0), 0);
    const total = Math.max(subtotal - discount, 0);
    const balance = Math.max(total - Number(quote.advance || 0), 0);
    return { subtotal, discount, total, balance };
  }, [quote.items, quote.advance]);

  const patientHistory = useMemo(() => quotes.filter((q) => q.patientId === selectedPatient || (quote.patientId && q.patientId === quote.patientId)), [quotes, selectedPatient, quote.patientId]);

  const money = (n) => Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  const updateQuote = (field, value) => setQuote((q) => ({ ...q, [field]: value }));
  const updateItem = (id, field, value) => setQuote((q) => ({ ...q, items: q.items.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  const addBlankItem = () => setQuote((q) => ({ ...q, items: [...q.items, emptyItem()] }));
  const removeItem = (id) => setQuote((q) => ({ ...q, items: q.items.length === 1 ? q.items : q.items.filter((item) => item.id !== id) }));

  const addCatalogItem = (catalogItem) => {
    const next = { id: crypto.randomUUID(), catalogId: catalogItem.id, category: catalogItem.category, treatment: catalogItem.treatment, qty: 1, price: catalogItem.price ?? 0, discount: 0, notes: catalogItem.notes };
    setQuote((q) => ({ ...q, items: q.items.length === 1 && !q.items[0].treatment ? [next] : [...q.items, next] }));
  };

  const saveQuote = () => {
    const patientId = quote.patientId || crypto.randomUUID();
    const patient = { id: patientId, name: quote.patientName, phone: quote.phone, email: quote.email, notes: '', updatedAt: new Date().toISOString() };
    const savedQuote = { ...quote, patientId, totals, updatedAt: new Date().toISOString() };

    setPatients((prev) => {
      const exists = prev.some((p) => p.id === patientId);
      return exists ? prev.map((p) => p.id === patientId ? { ...p, ...patient } : p) : [patient, ...prev];
    });
    setQuotes((prev) => {
      const exists = prev.some((q) => q.id === savedQuote.id);
      return exists ? prev.map((q) => q.id === savedQuote.id ? savedQuote : q) : [savedQuote, ...prev];
    });
    setQuote(savedQuote);
    setSelectedPatient(patientId);
    setSavedNotice('Presupuesto guardado en historial local.');
    setTimeout(() => setSavedNotice(''), 2500);
  };

  const loadPatient = (patient) => {
    setSelectedPatient(patient.id);
    setQuote((q) => ({ ...q, patientId: patient.id, patientName: patient.name, phone: patient.phone || '', email: patient.email || '' }));
    setTab('presupuesto');
  };

  const loadQuote = (saved) => {
    setQuote(saved);
    setSelectedPatient(saved.patientId);
    setTab('presupuesto');
  };

  const startNew = () => {
    setQuote(newQuote());
    setSelectedPatient('');
    setSavedNotice('');
    setTab('presupuesto');
  };

  const shareText = useMemo(() => {
    const treatmentLines = quote.items.filter((i) => i.treatment).map((i) => `• ${i.treatment} x${i.qty}: ${money(Number(i.qty || 0) * Number(i.price || 0) - Number(i.discount || 0))}`).join('\n');
    return `Presupuesto ${quote.folio}\nPaciente: ${quote.patientName || 'Sin nombre'}\nFecha: ${quote.date}\nEstado: ${quote.status}\n\nTratamientos:\n${treatmentLines || 'Sin tratamientos capturados'}\n\nSubtotal: ${money(totals.subtotal)}\nDescuento: ${money(totals.discount)}\nAnticipo: ${money(quote.advance)}\nTotal: ${money(totals.total)}\nSaldo: ${money(totals.balance)}\n\nNotas: ${quote.notes}`;
  }, [quote, totals]);

  const copyShareText = async () => navigator.clipboard.writeText(shareText);
  const sendEmail = () => { window.location.href = `mailto:${quote.email || ''}?subject=${encodeURIComponent(`Presupuesto dental ${quote.folio}`)}&body=${encodeURIComponent(shareText)}`; };
  const sendWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank'); };

  if (loadingAuth) {
  return <div className="p-10">Cargando...</div>
}

if (!session) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          GASA Login
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full border p-3 rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-3 rounded-xl mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
          onClick={async () => {
            const { data, error } = await signIn(email, password)

            if (error) {
              alert(error.message)
              return
            }

            setSession(data.session)
          }}
        >
          Iniciar sesión
        </button>

      </div>
    </div>
  )
}
  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; } .no-print { display: none !important; } }`}</style>

      <div className="mx-auto max-w-7xl space-y-4">
        <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: CLINIC.primaryColor }}>Sistema de Presupuestos GASA</h1>
            <p className="text-sm text-slate-500">{CLINIC.name} · Presupuestos, pacientes e historial.</p>
          </div>
          <div className="flex gap-2">
            <Button variant={tab === 'presupuesto' ? 'default' : 'outline'} onClick={() => setTab('presupuesto')} className="rounded-xl" style={tab === 'presupuesto' ? { backgroundColor: CLINIC.primaryColor } : {}}><FileText className="mr-2 h-4 w-4" />Presupuesto</Button>
            <Button variant={tab === 'pacientes' ? 'default' : 'outline'} onClick={() => setTab('pacientes')} className="rounded-xl" style={tab === 'pacientes' ? { backgroundColor: CLINIC.primaryColor } : {}}><Users className="mr-2 h-4 w-4" />Pacientes</Button>
            <Button variant={tab === 'historial' ? 'default' : 'outline'} onClick={() => setTab('historial')} className="rounded-xl" style={tab === 'historial' ? { backgroundColor: CLINIC.primaryColor } : {}}><History className="mr-2 h-4 w-4" />Historial</Button>
            <Button
  variant="outline"
  onClick={startNew}
  className="rounded-xl"
>
  Nuevo
</Button>

<button
  type="button"
  onClick={async (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('CERRANDO SESION REAL...')

    const { error } = await signOut()

    console.log('ERROR LOGOUT:', error)

    if (error) {
      alert('No se pudo cerrar sesión')
      return
    }

    setSession(null)
    setEmail('')
    setPassword('')
  }}
  className="rounded-xl border px-4 py-2"
>
  Cerrar sesión
</button>
          </div>
        </div>

        {tab === 'presupuesto' && (
          <div className="grid gap-4 lg:grid-cols-[460px_1fr]">
            <Card className="no-print rounded-2xl shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm">Folio<input className="mt-1 w-full rounded-xl border p-2" value={quote.folio} onChange={(e) => updateQuote('folio', e.target.value)} /></label>
                  <label className="text-sm">Fecha<input type="date" className="mt-1 w-full rounded-xl border p-2" value={quote.date} onChange={(e) => updateQuote('date', e.target.value)} /></label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm">Paciente<input className="mt-1 w-full rounded-xl border p-2" placeholder="Nombre completo" value={quote.patientName} onChange={(e) => updateQuote('patientName', e.target.value)} /></label>
                  <label className="text-sm">Teléfono<input className="mt-1 w-full rounded-xl border p-2" placeholder="WhatsApp" value={quote.phone} onChange={(e) => updateQuote('phone', e.target.value)} /></label>
                  <label className="text-sm">Correo<input className="mt-1 w-full rounded-xl border p-2" value={quote.email} onChange={(e) => updateQuote('email', e.target.value)} /></label>
                  <label className="text-sm">Doctor<select className="mt-1 w-full rounded-xl border p-2" value={quote.doctor} onChange={(e) => updateQuote('doctor', e.target.value)}><option value="">Seleccionar</option>{DOCTORS.map((d) => <option key={d}>{d}</option>)}</select></label>
                  <label className="text-sm">Vigencia<input type="date" className="mt-1 w-full rounded-xl border p-2" value={quote.validUntil} onChange={(e) => updateQuote('validUntil', e.target.value)} /></label>
                  <label className="text-sm">Estado<select className="mt-1 w-full rounded-xl border p-2" value={quote.status} onChange={(e) => updateQuote('status', e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-3">
                  <div className="mb-2 flex items-center gap-2"><Search className="h-4 w-4" /><span className="font-medium">Catálogo GASA 2026</span></div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <input className="rounded-xl border p-2" placeholder="Buscar tratamiento" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <select className="rounded-xl border p-2" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div className="max-h-56 space-y-2 overflow-auto pr-1">
                    {filteredCatalog.map((item) => <button key={item.id} onClick={() => addCatalogItem(item)} className="w-full rounded-xl border bg-white p-2 text-left text-sm hover:bg-slate-100"><div className="flex justify-between gap-2"><span className="font-medium">{item.treatment}</span><span>{item.price === null ? 'PENDIENTE' : money(item.price)}</span></div><div className="text-xs text-slate-500">{item.id} · {item.category}</div></button>)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between"><h2 className="font-medium">Tratamientos agregados</h2><Button onClick={addBlankItem} size="sm" className="rounded-xl"><Plus className="mr-1 h-4 w-4" />Manual</Button></div>
                  {quote.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border bg-white p-3 shadow-sm">
                      <input className="mb-2 w-full rounded-xl border p-2" placeholder="Tratamiento" value={item.treatment} onChange={(e) => updateItem(item.id, 'treatment', e.target.value)} />
                      <div className="mb-2 text-xs text-slate-500">{item.category || 'Sin categoría'} {item.notes ? `· ${item.notes}` : ''}</div>
                      <div className="grid grid-cols-4 gap-2">
                        <label className="text-xs text-slate-500">Cant.<input type="number" min="1" className="mt-1 w-full rounded-xl border p-2 text-slate-900" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} /></label>
                        <label className="text-xs text-slate-500">Precio<input type="number" min="0" className="mt-1 w-full rounded-xl border p-2 text-slate-900" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} /></label>
                        <label className="text-xs text-slate-500">Desc.<input type="number" min="0" className="mt-1 w-full rounded-xl border p-2 text-slate-900" value={item.discount} onChange={(e) => updateItem(item.id, 'discount', e.target.value)} /></label>
                        <button className="mt-5 flex items-center justify-center rounded-xl border p-2 text-red-600" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm">Anticipo<input type="number" min="0" className="mt-1 w-full rounded-xl border p-2" value={quote.advance} onChange={(e) => updateQuote('advance', e.target.value)} /></label>
                  <div className="rounded-xl bg-slate-900 p-3 text-white"><div className="text-xs">Saldo</div><div className="text-xl font-bold">{money(totals.balance)}</div></div>
                </div>

                <label className="block text-sm">Notas<textarea className="mt-1 h-20 w-full rounded-xl border p-2" value={quote.notes} onChange={(e) => updateQuote('notes', e.target.value)} /></label>
                <label className="block text-sm">Condiciones<textarea className="mt-1 h-20 w-full rounded-xl border p-2" value={quote.paymentTerms} onChange={(e) => updateQuote('paymentTerms', e.target.value)} /></label>

                {savedNotice && <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />{savedNotice}</div>}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button onClick={saveQuote} className="rounded-xl" style={{ backgroundColor: CLINIC.primaryColor }}><Save className="mr-2 h-4 w-4" />Guardar</Button>
                  <Button onClick={() => window.print()} className="rounded-xl" style={{ backgroundColor: CLINIC.primaryColor }}><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                  <Button variant="outline" onClick={copyShareText} className="rounded-xl"><Copy className="mr-2 h-4 w-4" />Copiar</Button>
                  <Button variant="outline" onClick={sendWhatsApp} className="rounded-xl"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Button>
                  <Button variant="outline" onClick={sendEmail} className="rounded-xl col-span-2"><Mail className="mr-2 h-4 w-4" />Correo</Button>
                </div>
              </CardContent>
            </Card>

            <PrintableQuote quote={quote} totals={totals} money={money} />
          </div>
        )}

        {tab === 'pacientes' && <PatientsView patients={patients} quotes={quotes} loadPatient={loadPatient} money={money} />}
        {tab === 'historial' && <HistoryView quotes={quotes} loadQuote={loadQuote} money={money} />}
      </div>
    </div>
  );
}

function PrintableQuote({ quote, totals, money }) {
  return <div id="print-area" className="rounded-2xl bg-white p-8 shadow-sm">
    <div className="mb-8 flex items-start justify-between border-b pb-5" style={{ borderColor: CLINIC.primaryColor }}>
      <div className="flex items-start gap-4">
        {CLINIC.logoUrl ? <img src={CLINIC.logoUrl} alt="Logo GASA" className="h-20 w-auto object-contain" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white" style={{ backgroundColor: CLINIC.primaryColor }}>G</div>}
        <div>
          <h2 className="text-3xl font-bold" style={{ color: CLINIC.primaryColor }}>{CLINIC.name}</h2>
          <p className="font-medium text-slate-700">Presupuesto dental</p>
          <p className="mt-1 max-w-xl text-xs text-slate-500">{CLINIC.address}</p>
          <p className="mt-1 text-xs text-slate-500">WhatsApp: {CLINIC.whatsapp} · Tel: {CLINIC.phone} · {CLINIC.email}</p>
        </div>
      </div>
      <FileText className="h-12 w-12 text-slate-300" />
    </div>
    <div className="mb-6 grid grid-cols-2 gap-4 text-sm"><div><b>Folio:</b> {quote.folio}</div><div><b>Fecha:</b> {quote.date}</div><div><b>Paciente:</b> {quote.patientName || '________________________'}</div><div><b>Teléfono:</b> {quote.phone || '________________________'}</div><div><b>Doctor:</b> {quote.doctor || '________________________'}</div><div><b>Vigencia:</b> {quote.validUntil || '________________________'}</div><div><b>Estado:</b> {quote.status}</div></div>
    <table className="mb-6 w-full border-collapse text-sm"><thead><tr className="text-left text-white" style={{ backgroundColor: CLINIC.primaryColor }}><th className="border p-3">Tratamiento</th><th className="border p-3">Categoría</th><th className="border p-3 text-center">Cant.</th><th className="border p-3 text-right">Precio</th><th className="border p-3 text-right">Desc.</th><th className="border p-3 text-right">Importe</th></tr></thead><tbody>{quote.items.map((item) => { const amount = Number(item.qty || 0) * Number(item.price || 0) - Number(item.discount || 0); return <tr key={item.id}><td className="border p-3">{item.treatment || 'Tratamiento pendiente'}</td><td className="border p-3">{item.category || '-'}</td><td className="border p-3 text-center">{item.qty}</td><td className="border p-3 text-right">{money(item.price)}</td><td className="border p-3 text-right">{money(item.discount)}</td><td className="border p-3 text-right font-medium">{money(amount)}</td></tr>; })}</tbody></table>
    <div className="ml-auto mb-8 w-80 space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div><div className="flex justify-between"><span>Descuento</span><span>{money(totals.discount)}</span></div><div className="flex justify-between"><span>Anticipo</span><span>{money(quote.advance)}</span></div><div className="flex justify-between border-t pt-3 text-xl font-bold" style={{ color: CLINIC.primaryColor }}><span>Total</span><span>{money(totals.total)}</span></div><div className="flex justify-between text-lg font-semibold"><span>Saldo</span><span>{money(totals.balance)}</span></div></div>
    <div className="space-y-4 text-sm"><div><h3 className="mb-1 font-semibold">Notas</h3><p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3">{quote.notes}</p></div><div><h3 className="mb-1 font-semibold">Condiciones</h3><p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3">{quote.paymentTerms}</p></div></div>
    <div className="mt-12 grid grid-cols-2 gap-12 text-center text-sm"><div className="border-t pt-2">Firma paciente</div><div className="border-t pt-2">Firma clínica</div></div>
    <div className="mt-8 rounded-xl p-3 text-center text-xs text-white" style={{ backgroundColor: CLINIC.primaryColor }}>
      {CLINIC.name} · WhatsApp {CLINIC.whatsapp} · {CLINIC.email}
    </div>
  </div>;
}

function PatientsView({ patients, quotes, loadPatient, money }) {
  const [q, setQ] = useState('');
  const list = patients.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.phone || '').includes(q));
  return <Card className="rounded-2xl shadow-sm"><CardContent className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Pacientes</h2><input className="rounded-xl border p-2" placeholder="Buscar paciente" value={q} onChange={(e) => setQ(e.target.value)} /></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => { const count = quotes.filter((x) => x.patientId === p.id).length; return <button key={p.id} onClick={() => loadPatient(p)} className="rounded-2xl border bg-white p-4 text-left hover:bg-slate-50"><div className="font-semibold">{p.name || 'Paciente sin nombre'}</div><div className="text-sm text-slate-500">{p.phone || 'Sin teléfono'} · {p.email || 'Sin correo'}</div><div className="mt-2 text-sm">{count} presupuesto(s)</div></button>; })}{list.length === 0 && <div className="text-sm text-slate-500">No hay pacientes guardados todavía.</div>}</div></CardContent></Card>;
}

function HistoryView({ quotes, loadQuote, money }) {
  const [q, setQ] = useState('');
  const list = quotes.filter((x) => !q || x.folio.toLowerCase().includes(q.toLowerCase()) || x.patientName.toLowerCase().includes(q.toLowerCase()) || x.status.toLowerCase().includes(q.toLowerCase()));
  return <Card className="rounded-2xl shadow-sm"><CardContent className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Historial de presupuestos</h2><input className="rounded-xl border p-2" placeholder="Buscar folio, paciente o estado" value={q} onChange={(e) => setQ(e.target.value)} /></div><div className="overflow-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-100 text-left"><th className="p-3">Folio</th><th className="p-3">Paciente</th><th className="p-3">Fecha</th><th className="p-3">Doctor</th><th className="p-3">Estado</th><th className="p-3 text-right">Total</th><th className="p-3"></th></tr></thead><tbody>{list.map((x) => <tr key={x.id} className="border-b"><td className="p-3 font-medium">{x.folio}</td><td className="p-3">{x.patientName}</td><td className="p-3">{x.date}</td><td className="p-3">{x.doctor}</td><td className="p-3">{x.status}</td><td className="p-3 text-right">{money(x.totals?.total || 0)}</td><td className="p-3 text-right"><Button size="sm" variant="outline" className="rounded-xl" onClick={() => loadQuote(x)}>Abrir</Button></td></tr>)}</tbody></table>{list.length === 0 && <div className="p-4 text-sm text-slate-500">No hay presupuestos guardados todavía.</div>}</div></CardContent></Card>;
}
