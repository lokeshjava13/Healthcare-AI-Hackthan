export default function Home(){
  return (
    <div style={{padding:'40px', textAlign:'center'}}>
      <h1 style={{fontSize:'42px', color:'#2563eb'}}>HealthMitra ❤️</h1>
      <p>Your Trusted Healthcare Partner</p>
      <div style={{display:'flex', gap:'20px', justifyContent:'center', marginTop:'30px', flexWrap:'wrap'}}>
        <a href="/login" style={{background:'#2563eb', color:'white', padding:'12px 24px', borderRadius:'10px', textDecoration:'none'}}>Login / Register</a>
        <a href="/patient-dashboard" style={{background:'#ecfdf5', color:'#059669', padding:'12px 24px', borderRadius:'10px', textDecoration:'none', border:'1px solid #059669'}}>Patient Dashboard</a>
        <a href="/doctor-dashboard" style={{background:'#fff7ed', color:'#ea580c', padding:'12px 24px', borderRadius:'10px', textDecoration:'none', border:'1px solid #ea580c'}}>Doctor Dashboard</a>
      </div>
    </div>
  )
}