import { Link } from 'react-router-dom'
export default function Navbar(){
  return (
    <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 30px', background:'white', boxShadow:'0 2px 10px rgba(0,0,0,0.1)'}}>
      <Link to="/" style={{fontSize:'22px', fontWeight:'bold', color:'#2563eb', textDecoration:'none'}}>HealthMitra ❤️</Link>
      <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
        <Link to="/" style={{textDecoration:'none', color:'black'}}>Home</Link>
        <Link to="/patient-dashboard" style={{textDecoration:'none', color:'black'}}>Patient Dashboard</Link>
        <Link to="/doctor-dashboard" style={{textDecoration:'none', color:'black'}}>Doctor Dashboard</Link>
        <Link to="/login" style={{background:'#2563eb', color:'white', padding:'8px 16px', borderRadius:'8px', textDecoration:'none'}}>Login</Link>
      </div>
    </nav>
  )
}