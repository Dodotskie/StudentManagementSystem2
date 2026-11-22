import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, ClipboardCheck, LogOut,
  Search, Bell, Menu, X, UserCog,
  CheckCircle2, AlertCircle, Eye, Trash2,
} from 'lucide-react';

type Page = 'Dashboard' | 'Students' | 'Courses' | 'Enrollments' | 'Marks' | 'Users';
type Student = { id: string; name: string; gender: string; birth: string; email: string; status: string };
type Course = { id: string; name: string; duration: string; instructor: string; level: string; module: string };
type Enrollment = { id: string; student: string; course: string; date: string; status: string };
type Mark = { id: string; student: string; course: string; mark: number; status: string };
type SystemUser = { id: string; name: string; email: string; phone: string; role: string };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const studentsSeed: Student[] = [
  { id:'0234', name:'Lebron James', gender:'Male', birth:'2024-05-15', email:'bron@campus.edu', status:'Active' },
  { id:'0240', name:'Johnny Bravo', gender:'Male', birth:'2003-11-02', email:'john@campus.edu', status:'Active' },
  { id:'0238', name:'Kevin Durant', gender:'Female', birth:'2004-01-25', email:'kd@email.com', status:'Inactive' },
  { id:'0238', name:'John Doe', gender:'Male', birth:'2003-08-13', email:'jdoe@email.com', status:'Inactive' },
  { id:'0237', name:'Portgas D Ace', gender:'Male', birth:'2003-09-09', email:'ace@email.com', status:'Active' },
  { id:'0236', name:'Bahay Ni Kuya', gender:'Female', birth:'2003-12-21', email:'bnk@email.com', status:'Active' },
];

const coursesSeed: Course[] = [
  { id:'001', name:'BS Information Technology', duration:'4 years', instructor:'Dr. A. Nicasio', level:'Head of BSIT', module:'0802 123 4567' },
  { id:'002', name:'BS Computer Science', duration:'4 years', instructor:'Dr. A. Nicasio', level:'Head of BSIT', module:'0802 234 5678' },
  { id:'003', name:'BS Business Administration', duration:'4 years', instructor:'Ma. A. Estrera', level:'Instructor', module:'0802 345 6789' },
  { id:'004', name:'Computer Tech', duration:'2 years', instructor:'Mr. E. Cpc', level:'BSIT Instructor', module:'0832 321 1233' },
  { id:'005', name:'Web Development', duration:'1 year', instructor:'Ms.I.Eda', level:'BSIT Instructor', module:'0949 123 4576' },
];

const enrollmentsSeed: Enrollment[] = [
  { id:'EN-0230', student:'Jackie Chan', course:'BS Information Technology', date:'2026-10-15', status:'Active' },
  { id:'EN-0896', student:'Pastor Quiboloy', course:'BS Computer Science', date:'2026-08-12', status:'Active' },
  { id:'EN-0354', student:'Donald Trump', course:'BS Business Administration', date:'2026-08-12', status:'Active' },
  { id:'EN-0355', student:'John Doe', course:'Associate in Computer Tech', date:'2026-08-10', status:'Inactive' },
  { id:'EN-0352', student:'BongBong Marcus', course:'BS Information Technology', date:'2026-08-09', status:'Active' },
];

const marksSeed: Mark[] = [
  { id:'1312', student:'Jackie Chan', course:'Web Development', mark:94, status:'Pass' },
  { id:'1231', student:'John Doe', course:'Database Systems', mark:88, status:'Pass' },
  { id:'1230', student:'Didoy Suan', course:'Business Analytics', mark:91, status:'Pass' },
  { id:'1209', student:'Ambut Lang', course:'Programming 1', mark:62, status:'Fail' },
  { id:'1206', student:'Lebron James', course:'Networking', mark:85, status:'Pass' },
];

const usersSeed: SystemUser[] = [
  { id:'001', name:'Shabam', email:'shabam@campus.edu', phone:'0917 123 4567', role:'Admin' },
  { id:'002', name:'James', email:'james@email.com', phone:'0918 234 5678', role:'User' },
  { id:'003', name:'Time', email:'taym@campus.edu', phone:'0919 345 6789', role:'User' },
  { id:'004', name:'Joe', email:'jo3@email.edu', phone:'0920 456 7890', role:'User' },
];

const nav = [
  { name:'Dashboard' as Page, icon: LayoutDashboard },
  { name:'Students' as Page, icon: Users },
  { name:'Courses' as Page, icon: BookOpen },
  { name:'Enrollments' as Page, icon: GraduationCap },
  { name:'Marks' as Page, icon: ClipboardCheck },
  { name:'Users' as Page, icon: UserCog },
];

function Brand() {
  return <div className="text-white">
    <div className="text-L font-black tracking-wide">STUDENT MANAGEMENT SYSTEM</div>
  </div>;
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [mode,setMode]=useState<'login'|'register'>('login');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('admin@campus.edu');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const submit=async()=>{
    setError('');
    if(mode==='register' && password!==confirm) return setError('Passwords do not match.');
    if(!email.trim() || !password) return setError('Enter your email and password.');
    if(mode==='register' && !name.trim()) return setError('Enter your full name.');
    setLoading(true);
    try{
      const response=await fetch(`${API_URL}/${mode==='register'?'register':'login'}`,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(mode==='register'?{name,email,password}:{email,password}),
      });
      const data=await response.json();
      if(!response.ok){
        const message=data.message || data.errors?.email?.[0] || data.errors?.password?.[0] || 'Authentication failed.';
        throw new Error(message);
      }
      localStorage.setItem('cpc_token',data.token);
      localStorage.setItem('cpc_user',JSON.stringify(data.user));
      onLogin();
    }catch(e){
      setError(e instanceof Error?e.message:'Unable to connect to the backend.');
    }finally{setLoading(false);}
  };

  return <div className="flex min-h-screen items-stretch bg-[#f7f4ef]">
    <div className="relative hidden w-[43%] flex-col justify-between bg-[#c96a05] px-[72px] pb-20 pt-[74px] text-white md:flex">
      <div className="text-center">
        <h2 className="text-[27px] font-black leading-none tracking-wide">STUDENT MANAGEMENT SYSTEM</h2>
        <img
          src="/cpcc.png"
          alt="CPC logo"
          className="mx-auto mt-20 h-44 w-44 object-contain"
        />
      </div>
      <div className="mb-[125px]">
        <h1 className="text-[34px] font-bold leading-tight">Manage your campus.</h1>
        <p className="mt-6 max-w-[360px] text-[18px] leading-[1.55] text-white/90">A simpler way to organize student records,<br/>courses, enrollments, and academic results.</p>
      </div>
    </div>
    <main className="grid flex-1 place-items-center p-6">
      <div className="w-[440px] max-w-[92vw] rounded-[14px] bg-white px-10 py-10 shadow-[0_18px_50px_rgba(31,35,48,.10)]">
        <h2 className="text-[28px] font-bold leading-tight text-[#202b62]">{mode==='login'?'Welcome back':'Create account'}</h2>
        <p className="mt-3 text-[13px] text-[#4b5563]">{mode==='login'?'Sign in to continue to your dashboard.':'Register a new campus account.'}</p>
        {mode==='register'&&<label className="mt-8 block text-[12px] font-bold text-[#374151]">Full name
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-2 h-[48px] w-full rounded-[7px] border border-[#e5e7eb] px-4 text-[14px] outline-none focus:border-[#c96a05]" />
        </label>}
        <label className={`${mode==='register'?'mt-4':'mt-[52px]'} block text-[12px] font-bold text-[#374151]`}>Email address
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 h-[48px] w-full rounded-[7px] border border-[#e5e7eb] px-4 text-[14px] text-[#374151] outline-none focus:border-[#c96a05]" />
        </label>
        <label className="mt-5 block text-[12px] font-bold text-[#374151]">Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 h-[48px] w-full rounded-[7px] border border-[#e5e7eb] px-4 text-[14px] text-[#374151] outline-none focus:border-[#c96a05]" />
        </label>
        {mode==='register'&&<label className="mt-5 block text-[12px] font-bold text-[#374151]">Confirm password
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="mt-2 h-[48px] w-full rounded-[7px] border border-[#e5e7eb] px-4 text-[14px] outline-none focus:border-[#c96a05]" />
        </label>}
        {mode==='login'&&<div className="mt-5 flex items-center justify-between text-[11px]"><label className="flex items-center gap-2 text-[#374151]"><input type="checkbox" /> Remember me</label><button className="font-bold text-[#ed5b16]">Forgot password?</button></div>}
        {error&&<p className="mt-4 text-center text-xs font-semibold text-red-600">{error}</p>}
        <button disabled={loading} onClick={submit} className="mt-7 h-[48px] w-full rounded-[7px] bg-[#cc6c08] text-[13px] font-bold text-white disabled:opacity-60">{loading?'Please wait...':mode==='login'?'Sign in':'Create account'}</button>
        <button type="button" onClick={()=>{setMode(mode==='login'?'register':'login');setError('');}} className="mt-4 w-full text-center text-xs font-bold text-[#cc6c08]">
          {mode==='login'?"Don't have an account? Create one":"Already have an account? Sign in"}
        </button>
        <p className="mt-5 text-center text-[9px] text-[#ea6a32]">Secure access for authorized campus personnel.</p>
      </div>
    </main>
  </div>;
}

function Sidebar({ page, setPage, open, setOpen, logout }: {page:Page; setPage:(p:Page)=>void; open:boolean; setOpen:(v:boolean)=>void; logout:()=>void}) {
  return <><div onClick={()=>setOpen(false)} className={`fixed inset-0 z-40 bg-black/30 lg:hidden ${open?'block':'hidden'}`} />
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[190px] flex-col bg-[#c96a05] text-white transition-transform lg:static lg:w-[190px] lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="px-5 py-7"><Brand /></div>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({name,icon:Icon})=> <button key={name} onClick={()=>{setPage(name);setOpen(false)}} className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-xs transition ${page===name?'bg-[#17171b] text-white':'text-white/90 hover:bg-white/10'}`}><Icon size={16}/>{name}</button>)}
      </nav>
      <div className="mx-4 border-t border-white/40 p-4"><button onClick={logout} className="flex items-center gap-3 text-xs"><LogOut size={15}/>Log out</button></div>
    </aside></>;
}

function PageShell({ title, subtitle, action, children }: {title:string; subtitle:string; action?:React.ReactNode; children:React.ReactNode}) {
  return <div className="w-full">
    <div className="mb-5 flex items-start justify-between">
      <div><p className="text-[9px] font-semibold text-gray-400">Welcome back, Admin!</p><h1 className="text-xl font-bold text-[#202b62]">{title}</h1><p className="mt-1 text-xs text-gray-500">{subtitle}</p></div>
      <Bell size={18} className="mt-2 text-[#c96a05]" />
    </div>
    {action && <div className="mb-4 flex items-center justify-end">{action}</div>}
    {children}
  </div>;
}

function Stat({ title, value, icon:Icon }: {title:string; value:string|number; icon:React.ElementType}) {
  return <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"><div className="mb-5 grid h-7 w-7 place-items-center rounded-md bg-blue-50 text-blue-500"><Icon size={14}/></div><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold text-[#202b62]">{value}</p></div>;
}

function SearchBox({ value, onChange, placeholder='Search...' }: {value:string; onChange:(v:string)=>void; placeholder?:string}) {
  return <div className="flex h-9 w-full items-center gap-2 rounded-md border border-gray-100 px-3 text-gray-400 sm:w-56"><Search size={13}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 text-xs outline-none" /></div>;
}

function Table({ headers, rows }: {headers:string[]; rows:React.ReactNode[][]}) {
  return <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white">
    <table className="w-full min-w-[680px] text-left text-[10px]">
      <thead><tr className="border-b border-gray-100 bg-[#fafafa] text-[9px] uppercase text-gray-400">{headers.map(h=><th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
      <tbody>{rows.map((row,i)=><tr key={i} className="border-b border-gray-100 last:border-0">{row.map((cell,j)=><td key={j} className="px-4 py-3">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function Status({ value }: {value:string}) {
  const active=value==='Active'||value==='Pass'||value==='Active';
  return <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${active?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{value}</span>;
}

export default function SchoolSystem() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [page,setPage]=useState<Page>('Dashboard');
  const [menuOpen,setMenuOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [students,setStudents]=useState(studentsSeed);
  const [courses,setCourses]=useState(coursesSeed);
  const [enrollments,setEnrollments]=useState(enrollmentsSeed);
  const [marks,setMarks]=useState(marksSeed);
  const [users,setUsers]=useState(usersSeed);
  const [modal,setModal]=useState<{title:string; fields:{key:string; label:string}[]; initial:Record<string,string|number>; save:(values:Record<string,string|number>)=>void}|null>(null);

  useEffect(()=>{setQuery('');},[page]);
  const matches=<T extends object>(value:T[])=>value.filter(row=>Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase()));

  const openAdd=(title:string, fields:{key:string;label:string}[], initial:Record<string,string|number>, save:(v:Record<string,string|number>)=>void)=>setModal({title,fields,initial,save});

  if(!loggedIn) return <Login onLogin={()=>setLoggedIn(true)} />;

  const dashboardCards=<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[
    ['Total Students',67,Users],['Active',2,CheckCircle2],['Total Courses',9,BookOpen],['Enrollments',9,GraduationCap]
  ].map(([title,value,Icon])=>{const I=Icon as React.ElementType; return <Stat key={String(title)} title={String(title)} value={String(value)} icon={I}/>})}</div>;

  let content:React.ReactNode;
  if(page==='Dashboard') content=<PageShell title="Dashboard" subtitle="Here's what's happening across your student management system.">{dashboardCards}
    <div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-lg border border-gray-100 p-5"><h3 className="text-sm font-bold">Recent enrollments</h3><div className="mt-4 space-y-3">{enrollments.slice(0,4).map(e=><div key={e.id} className="flex justify-between text-xs"><span>{e.student}</span><span className="text-gray-400">{e.course}</span></div>)}</div></div><div className="rounded-lg border border-gray-100 p-5"><h3 className="text-sm font-bold">Academic summary</h3><div className="mt-5 grid grid-cols-3 gap-3"><Stat title="Avg. mark" value="86.4" icon={ClipboardCheck}/><Stat title="Passed" value="4" icon={CheckCircle2}/><Stat title="Failed" value="1" icon={AlertCircle}/></div></div></div>
  </PageShell>;

  if(page==='Students') { const rows=matches(students) as Student[]; content=<PageShell title="Students" subtitle="View, search, and manage student profiles."><div className="mb-3 flex items-center justify-between gap-3"><SearchBox value={query} onChange={setQuery} placeholder="Search by name, ID or email"/><button onClick={()=>openAdd('Add Student',[{key:'name',label:'Full name'},{key:'email',label:'Email'},{key:'gender',label:'Gender'},{key:'birth',label:'Birth date'}],{name:'',email:'',gender:'Male',birth:''},v=>setStudents([{id:String(240+students.length),status:'Active',...v} as Student,...students]))} className="h-9 shrink-0 rounded-md bg-[#cc6c08] px-4 text-xs font-bold text-white"><span className="mr-1">+</span>Add student</button></div><Table headers={['Student ID','Full name','Gender','Birth date','Email','Status','Actions']} rows={rows.map(s=>[s.id,s.name,s.gender,s.birth,s.email,<Status value={s.status}/>,<div className="flex gap-2"><button title="View"><Eye size={13}/></button><button title="Delete" onClick={()=>setStudents(students.filter(x=>x.id!==s.id))}><Trash2 size={13}/></button></div>])} /></PageShell>; }

  if(page==='Courses') { const rows=matches(courses) as Course[]; content=<PageShell title="Courses" subtitle="Organize course offerings, instructors, and tuition details."><div className="mb-3 flex items-center justify-between gap-3"><SearchBox value={query} onChange={setQuery} placeholder="Search course..."/><button onClick={()=>openAdd('Add Course',[{key:'name',label:'Course name'},{key:'duration',label:'Duration'},{key:'instructor',label:'Instructor'}],{name:'',duration:'',instructor:''},v=>setCourses([...courses,{id:String(courses.length+1).padStart(3,'0'),level:'Instructor',module:'N/A',...v} as Course]))} className="h-9 shrink-0 rounded-md bg-[#cc6c08] px-4 text-xs font-bold text-white">+ Add course</button></div><Table headers={['Course ID','Course name','Duration','Instructor','Level','Mobile #','Actions']} rows={rows.map(c=>[c.id,c.name,c.duration,c.instructor,c.level,c.module,<button onClick={()=>setCourses(courses.filter(x=>x.id!==c.id))}><Trash2 size={13}/></button>])} /></PageShell>; }

  if(page==='Enrollments') { const rows=matches(enrollments) as Enrollment[]; content=<PageShell title="Enrollments" subtitle="Track student registrations and enrollment status."><div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3"><Stat title="Total enrollments" value={rows.length} icon={GraduationCap}/><Stat title="Active" value={914} icon={CheckCircle2}/><Stat title="Inactive" value={72} icon={AlertCircle}/></div><div className="mb-3 flex items-center justify-between gap-3"><SearchBox value={query} onChange={setQuery} placeholder="Search enrollments"/><button onClick={()=>openAdd('New Enrollment',[{key:'student',label:'Student'},{key:'course',label:'Course'}],{student:'',course:''},v=>setEnrollments([{id:`EN-${231+enrollments.length}`,date:'2026-10-19',status:'Active',...v} as Enrollment,...enrollments]))} className="h-9 shrink-0 rounded-md bg-[#cc6c08] px-4 text-xs font-bold text-white">+ New enrollment</button></div><Table headers={['Enrollment ID','Student','Course','Date','Status','Actions']} rows={rows.map(e=>[e.id,e.student,e.course,e.date,<Status value={e.status}/>,<button onClick={()=>setEnrollments(enrollments.filter(x=>x.id!==e.id))}><Trash2 size={13}/></button>])} /></PageShell>; }

  if(page==='Marks') { const rows=matches(marks) as Mark[]; content=<PageShell title="Marks" subtitle="Review academic performance and manage student marks."><div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3"><Stat title="Avg. mark" value="86.4" icon={ClipboardCheck}/><Stat title="Average mark" value="86.4" icon={ClipboardCheck}/><Stat title="Pass count" value={rows.filter(r=>r.status==='Pass').length} icon={CheckCircle2}/></div><div className="mb-3"><SearchBox value={query} onChange={setQuery} placeholder="Search student or course"/></div><Table headers={['Mark ID','Student','Course','Mark','Status','Actions']} rows={rows.map(m=>[m.id,m.student,m.course,m.mark,<Status value={m.status}/>,<button onClick={()=>setMarks(marks.filter(x=>x.id!==m.id))}><Trash2 size={13}/></button>])} /></PageShell>; }

  if(page==='Users') { const rows=matches(users) as SystemUser[]; content=<PageShell title="User management" subtitle="Manage system access and administrative accounts."><div className="mb-3 flex items-center justify-between gap-3"><SearchBox value={query} onChange={setQuery} placeholder="Search by name or email"/><button onClick={()=>openAdd('Add User',[{key:'name',label:'Full name'},{key:'email',label:'Email'},{key:'phone',label:'Phone'},{key:'role',label:'Role'}],{name:'',email:'',phone:'',role:'User'},v=>setUsers([{id:String(users.length+1).padStart(3,'0'),...v} as SystemUser,...users]))} className="h-9 shrink-0 rounded-md bg-[#cc6c08] px-4 text-xs font-bold text-white">+ Add user</button></div><Table headers={['User ID','Full name','Email','Phone','Role','Actions']} rows={rows.map(u=>[u.id,u.name,u.email,u.phone,u.role,<button onClick={()=>setUsers(users.filter(x=>x.id!==u.id))}><Trash2 size={13}/></button>])} /></PageShell>; }

  return <div className="flex min-h-screen bg-[#f7f7f5] text-[#2c2c2c]"><Sidebar page={page} setPage={setPage} open={menuOpen} setOpen={setMenuOpen} logout={()=>setLoggedIn(false)} /><main className="min-w-0 flex-1"><div className="flex h-12 items-center border-b border-gray-100 bg-white px-4 lg:hidden"><button onClick={()=>setMenuOpen(true)} aria-label="Open menu"><Menu size={22}/></button></div><section className="p-5 lg:p-7 xl:p-8">{content}</section></main>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;
}

function Modal({modal,close}:{modal:{title:string;fields:{key:string;label:string}[];initial:Record<string,string|number>;save:(v:Record<string,string|number>)=>void};close:()=>void}) {
  const [values,setValues]=useState(modal.initial);
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-[#202b62]">{modal.title}</h2><button onClick={close}><X size={18}/></button></div><div className="grid gap-3 sm:grid-cols-2">{modal.fields.map(f=><label key={f.key} className="text-xs font-semibold text-gray-600">{f.label}<input value={values[f.key]??''} type={f.key==='birth'||f.key==='date'?'date':'text'} onChange={e=>setValues({...values,[f.key]:e.target.value})} className="mt-1 h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#cc6c08]"/></label>)}</div><div className="mt-6 flex justify-end gap-2"><button onClick={close} className="h-9 rounded-md border px-4 text-xs">Cancel</button><button onClick={()=>{modal.save(values);close();}} className="h-9 rounded-md bg-[#cc6c08] px-4 text-xs font-bold text-white">Save</button></div></div></div>;
}

<div className="absolute -bottom-[125px] left-1/2 grid h-[250px] w-[250px] -translate-x-1/2 place-items-center rounded-full border-[9px] border-white bg-[#17268c] text-center shadow-[0_0_0_8px_rgba(23,38,140,.12)]">
        <div className="mt-[-55px] text-center text-[10px] font-black leading-4 tracking-wider">
          <div className="text-[18px]">CORDOVA PUBLIC</div>
          <div className="mt-1 text-[13px]">COLLEGE</div>
        </div>
      </div>
