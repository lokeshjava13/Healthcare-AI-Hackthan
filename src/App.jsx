import { useState } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'

export default function App(){
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 3000) }

  // Shared state - App level lo ne uncham, pages ki props ga pampistham
  const [appointments, setAppointments] = useState([
    {id:1, name:'Priya', phone:'9876543210', doctor:'Dr. Sharma', time:'10:00 AM', status:'Confirmed'},
    {id:2, name:'Rahul', phone:'9123456780', doctor:'Dr. Priya', time:'11:30 AM', status:'Pending'},
  ])

  const handleLogout = () => { setUser(null); showToast('Logged out. See you soon!') }

  return (
    <div style={{fontFamily:"'Segoe UI', Arial", background:'#f8fafc', minHeight:'100vh', color:'#0f172a'}}>
      <Navbar user={user} onLogout={handleLogout} />
      {toast && <div style={{position:'fixed', top:'70px', left:'50%', transform:'translateX(-50%)', background:'#0f172a', color:'white', padding:'12px 22px', borderRadius:'999px', zIndex:100, fontWeight:'600'}}>{toast}</div>}

      <Routes>
        <Route path='/' element={<Home user={user} showToast={showToast} />} />
        <Route path='/login' element={<Auth isLogin={true} setUser={setUser} showToast={showToast} />} />
        <Route path='/register' element={<Auth isLogin={false} setUser={setUser} showToast={showToast} />} />
        <Route path='/patient' element={user ? <PatientPage user={user} appointments={appointments} /> : <Navigate to='/login' />} />
        <Route path='/doctor' element={<DoctorPage user={user} appointments={appointments} setAppointments={setAppointments} />} />
        <Route path='/receptionist' element={<ReceptionistPage appointments={appointments} setAppointments={setAppointments} showToast={showToast} />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <Footer />
    </div>
  )
}

// ---------- REUSABLE COMPONENTS - Same file lo, kani reusable ga ----------

const card = {background:'white', padding:'20px', borderRadius:'20px', boxShadow:'0 6px 20px rgba(0,0,0,0.06)', flex:1, minWidth:'250px'}
const input = {display:'block', width:'100%', padding:'13px', margin:'10px 0', borderRadius:'12px', border:'1px solid #e2e8f0', outline:'none', fontSize:'15px', boxSizing:'border-box', background:'#f8fafc'}
const primary = {background:'#2563eb', color:'white', padding:'13px 26px', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'700', fontSize:'15px'}

function Button({children, onClick, variant='primary', full=false}){
  const bg = variant==='danger' ? '#ef4444' : variant==='success' ? '#22c55e' : variant==='outline' ? 'white' : '#2563eb'
  const color = variant==='outline' ? '#0f172a' : 'white'
  return <button onClick={onClick} style={{...primary, background:bg, color, width: full ? '100%' : 'auto', border: variant==='outline' ? '1px solid #e2e8f0' : 'none'}}>{children}</button>
}

function InputField({value, onChange, placeholder, type='text', label}){
  return <div>{label && <label style={{fontWeight:'600', fontSize:'14px'}}>{label}</label>}<input value={value} onChange={onChange} placeholder={placeholder} type={type} style={input} /></div>
}

function StatCard({title, value, color='#2563eb', subtitle}){
  return <div style={{...card, textAlign:'center'}}><h1 style={{color, margin:0}}>{value}</h1><p style={{fontWeight:'600'}}>{title}</p>{subtitle && <p style={{color:'#64748b', fontSize:'13px'}}>{subtitle}</p>}</div>
}

function AppointmentCard({a, onConfirm, onCancel, showActions=false}){
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px', background:'#f8fafc', borderRadius:'12px', marginTop:'10px', flexWrap:'wrap', gap:'10px'}}>
      <span><b>{a.name}</b> - {a.time} - {a.doctor}<br/><span style={{color:'#64748b', fontSize:'13px'}}>Phone: {a.phone}</span></span>
      {showActions ? <span style={{display:'flex', gap:'6px'}}><button onClick={onConfirm} style={{background:'#22c55e', color:'white', border:'none', padding:'6px 12px', borderRadius:'8px', cursor:'pointer'}}>Confirm</button><button onClick={onCancel} style={{background:'#fee2e2', color:'#dc2626', border:'none', padding:'6px 12px', borderRadius:'8px', cursor:'pointer'}}>Cancel</button></span>
      : <span style={{background: a.status==='Confirmed' ? '#dcfce7':'#fef3c7', color: a.status==='Confirmed' ? '#15803d':'#b45309', padding:'5px 12px', borderRadius:'999px', fontSize:'13px'}}>{a.status}</span>}
    </div>
  )
}

function Navbar({user, onLogout}){
  const navBtn = {padding:'9px 16px', borderRadius:'999px', fontWeight:'600', color:'#334155', textDecoration:'none'}
  return (
    <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 22px', background:'white', position:'sticky', top:0, zIndex:20, boxShadow:'0 1px 12px rgba(0,0,0,0.06)'}}>
      <Link to='/' style={{display:'flex', alignItems:'center', gap:'9px', textDecoration:'none', color:'#0f172a'}}>
        <span style={{background:'#2563eb', color:'white', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'12px', fontSize:'20px'}}>❤️</span>
        <span style={{fontSize:'22px', fontWeight:'800'}}>Healthcare<span style={{color:'#2563eb'}}> AI</span></span>
      </Link>
      <div style={{display:'flex', gap:'5px', alignItems:'center', flexWrap:'wrap'}}>
        <Link to='/' style={navBtn}>Home</Link>
        <Link to='/patient' style={navBtn}>My Page</Link>
        <Link to='/doctor' style={navBtn}>Doctor</Link>
        <Link to='/receptionist' style={navBtn}>Receptionist</Link>
        {user ? (<><span style={{background:'#dbeafe', padding:'8px 14px', borderRadius:'999px', fontWeight:'700', fontSize:'14px'}}>👋 Hi, {user.name} ({user.role})</span><button onClick={onLogout} style={{...primary, padding:'10px 18px', background:'#ef4444'}}>Logout</button></>) : (<Link to='/login' style={{...primary, padding:'10px 20px', textDecoration:'none'}}>Login →</Link>)}
      </div>
    </nav>
  )
}

function Footer(){
  return <div style={{background:'#0f172a', color:'white', padding:'28px', textAlign:'center', marginTop:'30px'}}><h3>Healthcare AI ❤️</h3><p style={{opacity:0.7, fontSize:'14px'}}>Hyderabad • support@healthcareai.com • 1800-123-4567</p></div>
}

const doctors = [
  {name:'Dr. Sharma', spec:'Cardiology', hosp:'Apollo, Hyderabad', rating:'4.9', exp:'12 Yrs', fee:'₹500', time:'Tomorrow 10:00 AM', emoji:'👨‍⚕️', color:'#dbeafe', talk:'Expert in heart care!'},
  {name:'Dr. Priya', spec:'General Physician', hosp:'Care Hospital', rating:'4.8', exp:'8 Yrs', fee:'₹400', time:'Today 4:00 PM', emoji:'👩‍⚕️', color:'#fce7f3', talk:'Best for fever and cold.'},
  {name:'Dr. Reddy', spec:'Orthopedics', hosp:'Yashoda Hospital', rating:'4.9', exp:'15 Yrs', fee:'₹600', time:'Tomorrow 11:30 AM', emoji:'👨‍⚕️', color:'#dcfce7', talk:'No.1 doctor for joint and bone pain!'},
]

// ---------- PAGES ----------

function Home({user, showToast}){
  const navigate = useNavigate()
  return (
    <div>
      <div style={{background:'linear-gradient(135deg,#1e40af,#2563eb,#06b6d4)', color:'white', padding:'55px 20px 45px', textAlign:'center'}}>
        <span style={{background:'rgba(255,255,255,0.2)', padding:'7px 16px', borderRadius:'999px', fontSize:'13px', fontWeight:'700'}}>✨ YOUR HEALTHCARE AI PARTNER</span>
        <h1 style={{fontSize:'44px', lineHeight:'1.15', margin:'18px 0 10px', fontWeight:'900'}}>{user ? `Hey ${user.name}! 👋` : 'Hey There! 👋'}<br/>How Are You?</h1>
        <p style={{opacity:0.95, fontSize:'17px', maxWidth:'550px', margin:'0 auto'}}>{user ? `I am here ${user.name}, I will take care of everything.` : 'Need a doctor? First create your account, I will take care of the rest.'}</p>
        {!user && <div style={{marginTop:'22px', display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}><Link to='/register' style={{background:'white', color:'#2563eb', padding:'13px 28px', borderRadius:'12px', fontWeight:'800', textDecoration:'none'}}>Create Account - Free →</Link><Link to='/login' style={{background:'rgba(255,255,255,0.2)', color:'white', padding:'13px 28px', border:'1px solid rgba(255,255,255,0.5)', borderRadius:'12px', fontWeight:'700', textDecoration:'none'}}>I Already Have Account</Link></div>}
        {user && <div style={{marginTop:'22px'}}><Link to='/patient' style={{background:'white', color:'#2563eb', padding:'13px 28px', borderRadius:'12px', fontWeight:'800', textDecoration:'none'}}>Go To My Page →</Link></div>}
      </div>
      <div style={{maxWidth:'1050px', margin:'0 auto', padding:'0 18px'}}>
        <h2 style={{margin:'30px 0 6px'}}>Best Doctors For You 👨‍⚕️</h2>
        <div style={{display:'flex', gap:'18px', flexWrap:'wrap'}}>
          {doctors.map(d=>(
            <div key={d.name} style={card}>
              <div style={{display:'flex', gap:'14px', alignItems:'center'}}><span style={{background:d.color, width:'62px', height:'62px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px'}}>{d.emoji}</span><div><b>{d.name}</b><p style={{margin:'2px 0', color:'#64748b', fontSize:'14px'}}>{d.spec} • {d.exp}</p><p style={{margin:0, fontSize:'13px'}}>⭐ {d.rating} • {d.hosp}</p></div></div>
              <p style={{background:'#f1f5f9', padding:'10px 12px', borderRadius:'10px', fontSize:'14px'}}>💬 Healthcare AI Says: <i>{d.talk}</i></p>
              <p style={{color:'#64748b', fontSize:'14px'}}>When? <b style={{color:'#059669'}}>{d.time}</b> • Fee: {d.fee}</p>
              <Button full onClick={()=>{if(!user){showToast('Please login first to book!'); navigate('/login'); return} showToast(`Booking for ${d.name} - Please contact reception`); navigate('/patient')}}>{user ? 'Book This Doctor →' : 'Login To Book →'}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Auth({isLogin, setUser, showToast}){
  const [role, setRole] = useState('Patient')
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPass, setFormPass] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const isValidName = (n) => /^[A-Za-z ]{3,30}$/.test(n.trim())
  const isValidPhone = (p) => /^[6-9][0-9]{9}$/.test(p.trim())
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

  const handleAuth = () => {
    setError('')
    if(!isValidName(formName)){ setError('Please enter a valid name! Only letters, minimum 3 characters. Example: Priya'); return }
    if(!isValidEmail(formEmail)){ setError('Please enter a valid email! Example: priya@gmail.com'); return }
    if(formPass.length < 6){ setError('Password should be minimum 6 characters!'); return }
    if(formPhone && !isValidPhone(formPhone)){ setError('Please enter a valid 10-digit mobile number starting with 6-9! Example: 9876543210'); return }
    const newUser = {name: formName.trim(), email: formEmail, role, phone: formPhone}
    setUser(newUser)
    showToast(isLogin ? `Welcome back ${newUser.name}! ❤️` : `Welcome ${newUser.name}! Account created ❤️`)
    navigate(role==='Patient' ? '/patient' : role==='Doctor' ? '/doctor' : '/receptionist')
  }

  return (
    <div style={{display:'flex', maxWidth:'920px', margin:'30px auto', background:'white', borderRadius:'22px', overflow:'hidden', boxShadow:'0 15px 40px rgba(0,0,0,0.1)'}}>
      <div style={{flex:1, background:'linear-gradient(160deg,#2563eb,#1e40af)', color:'white', padding:'38px', display:'flex', flexDirection:'column', justifyContent:'center'}}><h1>Healthcare AI ❤️</h1><p>You are not alone, I am here.</p><p style={{lineHeight:'30px', marginTop:'18px'}}>✅ Book doctor in 2 mins<br/>✅ Reports safe<br/>✅ Talk even at midnight</p><div style={{background:'rgba(255,255,255,0.15)', padding:'14px', borderRadius:'12px', marginTop:'20px', fontSize:'14px'}}>Validation Rules:<br/>Name: Only letters, min 3<br/>Phone: 10 digits, starts with 6-9<br/>Email: Valid email<br/>Password: Min 6 chars</div></div>
      <div style={{flex:1.1, padding:'36px'}}>
        <h2 style={{margin:0}}>{isLogin ? 'Welcome Back! 👋' : 'Create Your Account'}</h2>
        <div style={{display:'flex', gap:'6px', margin:'18px 0', background:'#f1f5f9', padding:'6px', borderRadius:'999px', flexWrap:'wrap'}}>
          {['Patient','Doctor','Receptionist'].map(r=>(
            <button key={r} onClick={()=>setRole(r)} style={{flex:1, padding:'10px', borderRadius:'999px', border:'none', background: role===r?'white':'transparent', fontWeight:'700', cursor:'pointer'}}>{r==='Patient' ? '🧑 Patient' : r==='Doctor' ? '👨‍⚕️ Doctor' : '💁 Receptionist'}</button>
          ))}
        </div>
        {error && <div style={{background:'#fee2e2', color:'#dc2626', padding:'12px', borderRadius:'10px', fontSize:'14px', fontWeight:'600'}}>⚠️ {error}</div>}
        <InputField value={formName} onChange={e=>setFormName(e.target.value)} placeholder="Your Full Name - Only Letters, Ex: Priya" />
        <InputField value={formPhone} onChange={e=>setFormPhone(e.target.value.replace(/[^0-9]/g,'').slice(0,10))} placeholder="Mobile Number - 10 Digits, Ex: 9876543210" />
        <InputField value={formEmail} onChange={e=>setFormEmail(e.target.value)} placeholder="Your Email - Ex: priya@gmail.com" />
        <InputField value={formPass} onChange={e=>setFormPass(e.target.value)} placeholder="Password - Min 6 characters" type="password" />
        <Button full onClick={handleAuth}>{isLogin ? `Login as ${role} →` : `Register as ${role} →`}</Button>
        <p style={{textAlign:'center', marginTop:'14px'}}>{isLogin ? <>New here? <Link to='/register' style={{color:'#2563eb', fontWeight:'600'}}>Register</Link></> : <>Already have account? <Link to='/login' style={{color:'#2563eb', fontWeight:'600'}}>Login</Link></>}</p>
      </div>
    </div>
  )
}

function PatientPage({user, appointments}){
  // AI PLACEHOLDER ONLY - No fake medical advice
  const [aiMsg, setAiMsg] = useState('')
  const [aiChat, setAiChat] = useState([{from:'ai', text:'Hi! Healthcare AI Assistant is coming soon. For any health concern, please consult a doctor or contact reception.'}])
  const sendAI = () => {
    if(!aiMsg.trim()) return
    setAiChat(prev=>[...prev, {from:'user', text:aiMsg}, {from:'ai', text:'Thanks for sharing. AI Assistant is in development and does not provide medical advice yet. Please book a doctor or contact reception for help.'}])
    setAiMsg('')
  }
  return (
    <div style={{padding:'26px', maxWidth:'1050px', margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px'}}><div><h2 style={{margin:0}}>Hey {user.name}! How are you? 😊</h2><p style={{color:'#64748b'}}>Welcome {user.name}. Phone: {user.phone || 'Not added'}</p></div><Link to='/receptionist' style={{...primary, textDecoration:'none'}}>+ Book a Doctor</Link></div>
      <div style={{display:'flex', gap:'18px', marginTop:'20px', flexWrap:'wrap'}}>
        <div style={{...card, borderTop:'4px solid #2563eb'}}><p style={{color:'#2563eb', fontWeight:'700', margin:0}}>📅 MEETING TOMORROW</p><h3>Dr. Sharma - Cardiology</h3><p style={{color:'#64748b'}}>Tomorrow, 10:00 AM • Patient: {user.name}</p><span style={{background:'#dbeafe', color:'#1d4ed8', padding:'5px 12px', borderRadius:'999px', fontSize:'13px', fontWeight:'700'}}>Booked For {user.name} ✅</span></div>
        <div style={{...card, borderTop:'4px solid #059669'}}><p style={{color:'#059669', fontWeight:'700', margin:0}}>📄 YOUR REPORTS</p><h3>2 New Reports</h3><p style={{color:'#64748b'}}>Blood Test - Available • Owner: {user.name}</p></div>
      </div>
      <div style={{...card, marginTop:'20px'}}><h3>🤖 Healthcare AI Assistant - Preview</h3><p style={{color:'#64748b', fontSize:'13px'}}>UI placeholder only. No medical advice is provided.</p><div style={{background:'#f8fafc', borderRadius:'12px', padding:'14px', maxHeight:'200px', overflowY:'auto'}}>{aiChat.map((m,i)=>(<div key={i} style={{textAlign: m.from==='user' ? 'right':'left', margin:'8px 0'}}><span style={{display:'inline-block', background: m.from==='user' ? '#2563eb':'white', color: m.from==='user'?'white':'#0f172a', padding:'10px 14px', borderRadius:'16px', maxWidth:'85%', fontSize:'14px'}}>{m.text}</span></div>))}</div><div style={{display:'flex', gap:'8px', marginTop:'10px'}}><input value={aiMsg} onChange={e=>setAiMsg(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') sendAI()}} placeholder={`Tell me ${user.name}...`} style={{...input, margin:0}} /><button onClick={sendAI} style={{...primary, padding:'12px 20px'}}>Send →</button></div></div>
      <div style={{...card, marginTop:'20px'}}><h3>Your Appointments</h3>{appointments.slice(0,2).map(a=><AppointmentCard key={a.id} a={a} />)}</div>
    </div>
  )
}

function DoctorPage({user, appointments, setAppointments}){
  return (
    <div style={{padding:'26px', maxWidth:'1050px', margin:'0 auto'}}>
      <h2 style={{margin:0}}>Hello {user && user.role==='Doctor' ? user.name : 'Dr. Sharma'}! 🙏</h2><p style={{color:'#64748b'}}>Today patients waiting for you.</p>
      <div style={{display:'flex', gap:'18px', marginTop:'20px', flexWrap:'wrap'}}>
        <StatCard title='Total Patients' value='128' color='#2563eb' />
        <StatCard title='Today Appointments' value='08' color='#059669' />
        <StatCard title='Reports To Check' value='05' color='#ea580c' />
      </div>
      <div style={{...card, marginTop:'20px'}}><h3>Appointments List</h3>{appointments.map(a=><AppointmentCard key={a.id} a={a} />)}</div>
    </div>
  )
}

function ReceptionistPage({appointments, setAppointments, showToast}){
  const [recName, setRecName] = useState('')
  const [recPhone, setRecPhone] = useState('')
  const [recDoctor, setRecDoctor] = useState('Dr. Sharma')
  const [recTime, setRecTime] = useState('10:00 AM')
  const isValidName = (n) => /^[A-Za-z ]{3,30}$/.test(n.trim())
  const isValidPhone = (p) => /^[6-9][0-9]{9}$/.test(p.trim())
  const handleBook = () => {
    if(!isValidName(recName)){ showToast('Receptionist: Please enter valid patient name! Only letters.'); return }
    if(!isValidPhone(recPhone)){ showToast('Receptionist: Please enter valid 10-digit number! Example: 9876543210'); return }
    const newApp = {id: Date.now(), name: recName.trim(), phone: recPhone.trim(), doctor: recDoctor, time: recTime, status:'Confirmed'}
    setAppointments([newApp, ...appointments])
    showToast(`Done! Appointment booked for ${recName} with ${recDoctor} at ${recTime} ✅`)
    setRecName(''); setRecPhone('')
  }
  return (
    <div style={{padding:'26px', maxWidth:'1050px', margin:'0 auto'}}>
      <h2 style={{margin:0}}>Hello Receptionist! 💁</h2><p style={{color:'#64748b'}}>You are the front desk. Book appointments for patients.</p>
      <div style={{display:'flex', gap:'18px', marginTop:'20px', flexWrap:'wrap'}}>
        <StatCard title='Total Appointments Today' value={appointments.length} />
        <StatCard title='Confirmed' value={appointments.filter(a=>a.status==='Confirmed').length} color='#059669' />
        <StatCard title='Pending' value={appointments.filter(a=>a.status==='Pending').length} color='#ea580c' />
      </div>
      <div style={{display:'flex', gap:'18px', marginTop:'20px', flexWrap:'wrap', alignItems:'flex-start'}}>
        <div style={{...card, flex:1}}>
          <h3>📝 Book For Patient</h3>
          <InputField value={recName} onChange={e=>setRecName(e.target.value)} placeholder="Patient Name - Only Letters, Ex: Priya" />
          <InputField value={recPhone} onChange={e=>setRecPhone(e.target.value.replace(/[^0-9]/g,'').slice(0,10))} placeholder="Patient Phone - 10 Digits, Ex: 9876543210" />
          <select value={recDoctor} onChange={e=>setRecDoctor(e.target.value)} style={input}>{doctors.map(d=><option key={d.name}>{d.name} - {d.spec}</option>)}</select>
          <select value={recTime} onChange={e=>setRecTime(e.target.value)} style={input}><option>10:00 AM</option><option>11:30 AM</option><option>04:00 PM</option><option>05:30 PM</option></select>
          <Button full onClick={handleBook}>Book Appointment For Patient ✅</Button>
        </div>
        <div style={{...card, flex:1.2}}>
          <h3>📋 Today Appointments</h3>
          {appointments.map(a=>(
            <AppointmentCard key={a.id} a={a} showActions={true}
              onConfirm={()=>setAppointments(appointments.map(x=>x.id===a.id ? {...x, status:'Confirmed'} : x))}
              onCancel={()=>setAppointments(appointments.filter(x=>x.id!==a.id))} />
          ))}
        </div>
      </div>
    </div>
  )
}