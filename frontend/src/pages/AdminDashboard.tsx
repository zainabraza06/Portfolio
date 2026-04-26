import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  fetchProjects, createProject, updateProject, deleteProject,
  fetchExperience, createExperience, updateExperience, deleteExperience,
  fetchAllTestimonials, approveTestimonial, deleteTestimonial,
  fetchMessages, markMessageRead, deleteMessage,
  fetchCertificates, createCertificate, updateCertificate, deleteCertificate, syncProjects,
  changePassword
} from '../api/services';

type Tab = 'projects' | 'certificates' | 'experience' | 'testimonials' | 'messages';

interface Item { _id: string; [key: string]: unknown; }

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'projects',     label: 'Projects',      icon: '🛠' },
  { id: 'certificates', label: 'Certificates',  icon: '🏆' },
  { id: 'experience',   label: 'Experience',     icon: '📅' },
  { id: 'testimonials', label: 'Testimonials',   icon: '💬' },
  { id: 'messages',     label: 'Messages',       icon: '📬' },
];

const emptyProject = { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false, order: 0 };
const emptyCert    = { title: '', issuer: '', date: '', linkedInUrl: '', imageUrl: '', order: 0 };
const emptyExp     = { company: '', role: '', duration: '', description: '', logo: '', type: 'work', order: 0 };

// ── Generic Modal ────────────────────────────────────────────────
function Modal({ title, onClose, onSave, children }: {
  title: string; onClose: () => void; onSave: () => void; children: React.ReactNode;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.3s ease both' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#e8edf2] font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-[#6b7fa3] hover:text-[#e8edf2] transition-colors text-xl">✕</button>
        </div>
        {children}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1 justify-center py-2 text-sm">Cancel</button>
          <button onClick={onSave}  className="btn-primary flex-1 justify-center py-2 text-sm"><span>Save</span></button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Field component ──────────────────────────────────────────────
function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[#6b7fa3] mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

// ── Projects Tab ─────────────────────────────────────────────────
function ProjectsTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm]   = useState({ ...emptyProject });
  const [editId, setEditId] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setItems(await fetchProjects()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const openAdd  = () => { setForm({ ...emptyProject }); setModal('add'); };
  const openEdit = (p: Item) => {
    setForm({ title: p.title as string, description: p.description as string,
      techStack: (p.techStack as string[]).join(', '), liveUrl: p.liveUrl as string,
      githubUrl: p.githubUrl as string, imageUrl: p.imageUrl as string,
      featured: p.featured as boolean, order: p.order as number });
    setEditId(p._id); setModal('edit');
  };

  const save = async () => {
    const payload = { ...form, techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean) };
    if (modal === 'add') await createProject(payload);
    else await updateProject(editId, payload);
    setModal(null); load();
  };

  const remove = async (id: string) => { if (confirm('Delete this project?')) { await deleteProject(id); load(); } };

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await syncProjects();
      alert(res.message);
      load();
    } catch (err: any) {
      alert('Sync failed: ' + err.message);
      setLoading(false);
    }
  };

  const FormFields = () => (
    <div className="space-y-3">
      <Field label="Title *" id="p-title"><input id="p-title" className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Project title" /></Field>
      <Field label="Description *" id="p-desc"><textarea id="p-desc" className="form-input resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Project description" /></Field>
      <Field label="Tech Stack (comma separated)" id="p-tech"><input id="p-tech" className="form-input" value={form.techStack} onChange={e => set('techStack', e.target.value)} placeholder="React, Node.js, MongoDB" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="GitHub URL" id="p-gh"><input id="p-gh" className="form-input" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} placeholder="https://github.com/..." /></Field>
        <Field label="Live URL" id="p-live"><input id="p-live" className="form-input" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://..." /></Field>
      </div>
      <Field label="Image URL" id="p-img"><input id="p-img" className="form-input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." /></Field>
      <div className="flex items-center gap-3">
        <input id="p-feat" type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-[#20b2a6]" />
        <label htmlFor="p-feat" className="text-sm text-[#6b7fa3]">Mark as Featured</label>
        <input id="p-order" type="number" className="form-input w-20 ml-auto" value={form.order} onChange={e => set('order', Number(e.target.value))} placeholder="Order" />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#e8edf2] font-bold text-xl">Projects <span className="text-[#6b7fa3] font-normal text-sm ml-2">{items.length} total</span></h2>
        <div className="flex gap-3">
          <button onClick={handleSync} disabled={loading} className="btn-outline py-2 px-4 text-sm bg-[#1e2d3d] flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            Sync GitHub
          </button>
          <button onClick={openAdd} className="btn-primary py-2 px-4 text-sm"><span>+ Add Project</span></button>
        </div>
      </div>
      {loading ? <p className="text-[#6b7fa3]">Loading…</p> : (
        <div className="space-y-3">
          {items.map(p => (
            <div key={p._id} className="glass-card p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[#e8edf2] font-semibold truncate">{p.title as string}</h3>
                  {p.featured && <span className="text-[10px] bg-[#f5a623]/20 text-[#f5a623] px-2 py-0.5 rounded-full">⭐ Featured</span>}
                </div>
                <p className="text-[#6b7fa3] text-sm mt-1 line-clamp-2">{p.description as string}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(p.techStack as string[]).slice(0,4).map(t => <span key={t} className="skill-tag text-[10px] px-2 py-0.5">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="btn-outline py-1.5 px-3 text-xs">Edit</button>
                <button onClick={() => remove(p._id)} className="py-1.5 px-3 text-xs rounded-full border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="glass-card p-8 text-center text-[#6b7fa3]">No projects yet. Add your first one!</div>}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)} onSave={save}>
          <FormFields />
        </Modal>
      )}
    </div>
  );
}

// ── Certificates Tab ─────────────────────────────────────────────
function CertificatesTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm]   = useState({ ...emptyCert });
  const [editId, setEditId] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setItems(await fetchCertificates()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const openAdd  = () => { setForm({ ...emptyCert }); setModal('add'); };
  const openEdit = (c: Item) => {
    setForm({ title: c.title as string, issuer: c.issuer as string, date: c.date as string,
      linkedInUrl: c.linkedInUrl as string, imageUrl: c.imageUrl as string, order: c.order as number });
    setEditId(c._id); setModal('edit');
  };
  const save = async () => {
    if (modal === 'add') await createCertificate(form);
    else await updateCertificate(editId, form);
    setModal(null); load();
  };
  const remove = async (id: string) => { if (confirm('Delete?')) { await deleteCertificate(id); load(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#e8edf2] font-bold text-xl">Certificates <span className="text-[#6b7fa3] font-normal text-sm ml-2">{items.length} entries</span></h2>
        <button onClick={openAdd} className="btn-primary py-2 px-4 text-sm"><span>+ Add Certificate</span></button>
      </div>
      {loading ? <p className="text-[#6b7fa3]">Loading…</p> : (
        <div className="space-y-3">
          {items.map(c => (
            <div key={c._id} className="glass-card p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-[#e8edf2] font-semibold">{c.title as string}</h3>
                <p className="text-[#20b2a6] text-sm">{c.issuer as string} · {c.date as string}</p>
                {c.linkedInUrl && <a href={c.linkedInUrl as string} target="_blank" rel="noreferrer" className="text-xs text-[#6b7fa3] hover:text-[#20b2a6] underline mt-1 block">View Post / Credential</a>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(c)} className="btn-outline py-1.5 px-3 text-xs">Edit</button>
                <button onClick={() => remove(c._id)} className="py-1.5 px-3 text-xs rounded-full border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="glass-card p-8 text-center text-[#6b7fa3]">No certificates yet. Add your LinkedIn achievements!</div>}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Certificate' : 'Edit Certificate'} onClose={() => setModal(null)} onSave={save}>
          <div className="space-y-3">
            <Field label="Title *" id="c-title"><input id="c-title" className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Meta Front-End Developer" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Issuer *" id="c-iss"><input id="c-iss" className="form-input" value={form.issuer} onChange={e => set('issuer', e.target.value)} placeholder="e.g. Coursera" /></Field>
              <Field label="Date" id="c-date"><input id="c-date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} placeholder="e.g. Aug 2024" /></Field>
            </div>
            <Field label="LinkedIn Post / Credential URL" id="c-url"><input id="c-url" className="form-input" value={form.linkedInUrl} onChange={e => set('linkedInUrl', e.target.value)} placeholder="https://linkedin.com/..." /></Field>
            <Field label="Image URL" id="c-img"><input id="c-img" className="form-input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." /></Field>
            <Field label="Order" id="c-ord"><input id="c-ord" type="number" className="form-input w-24" value={form.order} onChange={e => set('order', Number(e.target.value))} /></Field>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Experience Tab ───────────────────────────────────────────────
function ExperienceTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm]   = useState({ ...emptyExp });
  const [editId, setEditId] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setItems(await fetchExperience()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const openAdd  = () => { setForm({ ...emptyExp }); setModal('add'); };
  const openEdit = (e: Item) => {
    setForm({ company: e.company as string, role: e.role as string, duration: e.duration as string,
      description: e.description as string, logo: e.logo as string, type: e.type as string, order: e.order as number });
    setEditId(e._id); setModal('edit');
  };
  const save = async () => {
    if (modal === 'add') await createExperience(form);
    else await updateExperience(editId, form);
    setModal(null); load();
  };
  const remove = async (id: string) => { if (confirm('Delete?')) { await deleteExperience(id); load(); } };

  const typeColors: Record<string, string> = { work: '#20b2a6', education: '#a78bfa' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#e8edf2] font-bold text-xl">Experience <span className="text-[#6b7fa3] font-normal text-sm ml-2">{items.length} entries</span></h2>
        <button onClick={openAdd} className="btn-primary py-2 px-4 text-sm"><span>+ Add Entry</span></button>
      </div>
      {loading ? <p className="text-[#6b7fa3]">Loading…</p> : (
        <div className="space-y-3">
          {items.map(e => (
            <div key={e._id} className="glass-card p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{ background: `${typeColors[e.type as string]}18`, color: typeColors[e.type as string] }}>
                    {e.type as string}
                  </span>
                  <span className="text-[#6b7fa3] text-xs font-mono">{e.duration as string}</span>
                </div>
                <h3 className="text-[#e8edf2] font-semibold">{e.role as string}</h3>
                <p className="text-[#20b2a6] text-sm">{e.company as string}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(e)} className="btn-outline py-1.5 px-3 text-xs">Edit</button>
                <button onClick={() => remove(e._id)} className="py-1.5 px-3 text-xs rounded-full border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="glass-card p-8 text-center text-[#6b7fa3]">No entries yet.</div>}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={() => setModal(null)} onSave={save}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role *" id="e-role"><input id="e-role" className="form-input" value={form.role} onChange={ev => set('role', ev.target.value)} placeholder="Software Engineer" /></Field>
              <Field label="Company *" id="e-comp"><input id="e-comp" className="form-input" value={form.company} onChange={ev => set('company', ev.target.value)} placeholder="Acme Inc." /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duration *" id="e-dur"><input id="e-dur" className="form-input" value={form.duration} onChange={ev => set('duration', ev.target.value)} placeholder="2022 – Present" /></Field>
              <Field label="Type" id="e-type">
                <select id="e-type" className="form-input" value={form.type} onChange={ev => set('type', ev.target.value)}>
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                </select>
              </Field>
            </div>
            <Field label="Description *" id="e-desc"><textarea id="e-desc" className="form-input resize-none" rows={3} value={form.description} onChange={ev => set('description', ev.target.value)} /></Field>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Testimonials Tab ─────────────────────────────────────────────
function TestimonialsTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setItems(await fetchAllTestimonials()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => { await approveTestimonial(id); load(); };
  const remove  = async (id: string) => { if (confirm('Delete?')) { await deleteTestimonial(id); load(); } };

  return (
    <div>
      <h2 className="text-[#e8edf2] font-bold text-xl mb-6">Testimonials <span className="text-[#6b7fa3] font-normal text-sm ml-2">{items.length} total</span></h2>
      {loading ? <p className="text-[#6b7fa3]">Loading…</p> : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t._id} className={`glass-card p-4 flex items-start justify-between gap-4 ${!t.approved ? 'opacity-70' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.approved ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#f5a623]/20 text-[#f5a623]'}`}>
                    {t.approved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <span key={i} className={i <= (t.rating as number) ? 'star-filled text-xs' : 'star-empty text-xs'}>★</span>)}
                  </div>
                </div>
                <p className="text-[#6b7fa3] text-sm italic line-clamp-2">"{t.text as string}"</p>
                <p className="text-[#e8edf2] text-sm font-medium mt-1">{t.name as string} · {t.role as string} @ {t.company as string}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!t.approved && <button onClick={() => approve(t._id)} className="btn-primary py-1.5 px-3 text-xs"><span>Approve</span></button>}
                <button onClick={() => remove(t._id)} className="py-1.5 px-3 text-xs rounded-full border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="glass-card p-8 text-center text-[#6b7fa3]">No testimonials yet.</div>}
        </div>
      )}
    </div>
  );
}

// ── Messages Tab ─────────────────────────────────────────────────
function MessagesTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => { setLoading(true); setItems(await fetchMessages()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => { await markMessageRead(id); load(); };
  const remove   = async (id: string) => { if (confirm('Delete?')) { await deleteMessage(id); load(); } };

  const unread = items.filter(m => !m.read).length;

  return (
    <div>
      <h2 className="text-[#e8edf2] font-bold text-xl mb-6">
        Messages{' '}
        <span className="text-[#6b7fa3] font-normal text-sm ml-2">{items.length} total</span>
        {unread > 0 && <span className="ml-2 bg-[#20b2a6] text-white text-xs px-2 py-0.5 rounded-full">{unread} unread</span>}
      </h2>
      {loading ? <p className="text-[#6b7fa3]">Loading…</p> : (
        <div className="space-y-3">
          {items.map(m => (
            <div key={m._id} className={`glass-card overflow-hidden ${!m.read ? 'border-[#20b2a6]/40' : ''}`}>
              <div
                className="p-4 flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => { setExpanded(e => e === m._id ? null : m._id as string); if (!m.read) markRead(m._id); }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!m.read && <span className="w-2 h-2 rounded-full bg-[#20b2a6] flex-shrink-0" />}
                    <span className="text-[#e8edf2] font-semibold text-sm">{m.name as string}</span>
                    <span className="text-[#6b7fa3] text-xs">{m.email as string}</span>
                  </div>
                  <p className="text-[#20b2a6] text-sm font-medium">{m.subject as string}</p>
                  <p className="text-[#6b7fa3] text-xs mt-0.5">{new Date(m.createdAt as string).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); remove(m._id); }} className="py-1 px-2.5 text-xs rounded-full border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">Delete</button>
                  <span className="text-[#6b7fa3] text-xs self-center">{expanded === m._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === m._id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3">
                  <p className="text-[#6b7fa3] text-sm leading-relaxed">{m.message as string}</p>
                  <a href={`mailto:${m.email as string}?subject=Re: ${m.subject as string}`}
                    className="btn-outline inline-flex mt-3 py-1.5 px-4 text-xs">Reply via Email</a>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div className="glass-card p-8 text-center text-[#6b7fa3]">No messages yet.</div>}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('projects');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('portfolio_token')) navigate('/admin');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
    navigate('/admin');
  };

  const user = JSON.parse(localStorage.getItem('portfolio_user') ?? '{}');

  const PasswordModal = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
      setError('');
      if (newPassword !== confirmPassword) return setError('New passwords do not match');
      if (newPassword.length < 6) return setError('Password must be at least 6 characters');
      setLoading(true);
      try {
        await changePassword(currentPassword, newPassword);
        setSuccess(true);
        setTimeout(() => setShowPasswordModal(false), 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to change password');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal title="Change Password" onClose={() => setShowPasswordModal(false)} onSave={handleSubmit}>
        <div className="space-y-4">
          {success ? (
            <div className="p-4 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] rounded-xl text-center">
              ✅ Password updated successfully!
            </div>
          ) : (
            <>
              <Field label="Current Password" id="pwd-curr">
                <input id="pwd-curr" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="form-input" />
              </Field>
              <Field label="New Password" id="pwd-new">
                <input id="pwd-new" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-input" />
              </Field>
              <Field label="Confirm New Password" id="pwd-conf">
                <input id="pwd-conf" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-input" />
              </Field>
              {error && <p className="text-[#ef4444] text-sm bg-[#ef4444]/10 p-2 rounded">{error}</p>}
              {loading && <p className="text-[#6b7fa3] text-sm">Updating password...</p>}
            </>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-[#080d12]">
      {/* Top bar */}
      <header className="glass border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#20b2a6] to-[#178f85] flex items-center justify-center text-white font-bold text-xs">ZR</div>
            <div>
              <p className="text-[#e8edf2] font-semibold text-sm">Admin Dashboard</p>
              <p className="text-[#6b7fa3] text-xs">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-sm text-[#6b7fa3] hover:text-[#20b2a6] transition-colors hidden sm:block">← Portfolio</button>
            <button onClick={() => setShowPasswordModal(true)} className="btn-outline py-1.5 px-4 text-xs">Change Password</button>
            <button onClick={logout} className="btn-primary py-1.5 px-4 text-xs"><span>Logout</span></button>
          </div>
        </div>
      </header>

      {showPasswordModal && <PasswordModal />}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 glass rounded-2xl p-1.5 w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-[#20b2a6] text-white shadow-lg'
                  : 'text-[#6b7fa3] hover:text-[#e8edf2] hover:bg-white/5'
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
          {tab === 'projects'     && <ProjectsTab />}
          {tab === 'certificates' && <CertificatesTab />}
          {tab === 'experience'   && <ExperienceTab />}
          {tab === 'testimonials' && <TestimonialsTab />}
          {tab === 'messages'     && <MessagesTab />}
        </div>
      </div>
    </div>
  );
}
