export default function PatientDashboard(){
  return (
    <div style={{padding:'30px'}}>
      <h2>Hello, Lokesh 👋</h2>
      <p>How are you feeling today?</p>
      <div style={{display:'flex', gap:'20px', marginTop:'20px', flexWrap:'wrap'}}>
        <div style={{background:'#dbeafe', padding:'20px', borderRadius:'12px', flex:1, minWidth:'220px'}}><h3>📅 Upcoming Appointment</h3><p>Dr. Sharma - Cardiology<br/>Tomorrow, 10:00 AM</p></div>
        <div style={{background:'#dcfce7', padding:'20px', borderRadius:'12px', flex:1, minWidth:'220px'}}><h3>📄 Health Reports</h3><p>Blood Test - Normal<br/>X-Ray - View</p></div>
        <div style={{background:'#fef3c7', padding:'20px', borderRadius:'12px', flex:1, minWidth:'220px'}}><h3>🤖 AI Health Assistant</h3><p>Ask any health question...</p><input placeholder="Type symptoms..." style={{width:'100%', padding:'8px', marginTop:'10px', borderRadius:'8px', border:'1px solid #ddd'}} /></div>
      </div>
      <button style={{marginTop:'20px', background:'#2563eb', color:'white', padding:'12px 24px', border:'none', borderRadius:'10px'}}>+ Book New Appointment</button>
    </div>
  )
}