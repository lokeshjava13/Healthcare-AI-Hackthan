import { useState } from 'react'
export default function Login(){
  const [role, setRole] = useState('Patient')
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div style={{display:'flex', minHeight:'80vh'}}>
      <div style={{flex:1, background:'#2563eb', color:'white', padding:'50px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <h1>HealthMitra ❤️</h1><p>Your Trusted Healthcare Partner</p><p>✅ Book Appointments<br/>✅ View Reports<br/>✅ AI Health Assistant</p>
      </div>
      <div style={{flex:1, padding:'50px'}}>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <div style={{display:'flex', gap:'10px', margin:'15px 0'}}>
          <button onClick={()=>setRole('Patient')} style={{padding:'8px 20px', borderRadius:'20px', background: role==='Patient' ? '#2563eb':'#e5e7eb', color: role==='Patient'?'white':'black', border:'none'}}>Patient</button>
          <button onClick={()=>setRole('Doctor')} style={{padding:'8px 20px', borderRadius:'20px', background: role==='Doctor' ? '#2563eb':'#e5e7eb', color: role==='Doctor'?'white':'black', border:'none'}}>Doctor</button>
        </div>
        {!isLogin && <input placeholder="Full Name" style={{display:'block', width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}} />}
        <input placeholder="Email" style={{display:'block', width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}} />
        <input placeholder="Password" type="password" style={{display:'block', width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}} />
        <button style={{width:'100%', padding:'12px', background:'#2563eb', color:'white', border:'none', borderRadius:'8px', fontSize:'16px'}}>{isLogin ? `Login as ${role}` : `Register as ${role}`}</button>
        <p onClick={()=>setIsLogin(!isLogin)} style={{color:'#2563eb', cursor:'pointer', textAlign:'center', marginTop:'15px'}}>{isLogin ? "Don't have account? Register" : "Already have account? Login"}</p>
      </div>
    </div>
  )
}