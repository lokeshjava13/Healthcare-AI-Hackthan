export default function DoctorDashboard(){
  return (
    <div style={{padding:'30px'}}>
      <h2>Hello, Dr. Sharma 👨‍⚕️</h2>
      <div style={{display:'flex', gap:'20px', marginTop:'20px', flexWrap:'wrap'}}>
        <div style={{background:'#dbeafe', padding:'20px', borderRadius:'12px', flex:1}}><h1>128</h1><p>Total Patients</p></div>
        <div style={{background:'#dcfce7', padding:'20px', borderRadius:'12px', flex:1}}><h1>08</h1><p>Today's Appointments</p></div>
        <div style={{background:'#fee2e2', padding:'20px', borderRadius:'12px', flex:1}}><h1>05</h1><p>Pending Reports</p></div>
      </div>
      <h3 style={{marginTop:'30px'}}>Upcoming Appointments</h3>
      <table style={{width:'100%', borderCollapse:'collapse', marginTop:'10px'}}>
        <tbody>
          <tr style={{background:'#f3f4f6'}}><th style={{padding:'10px', textAlign:'left'}}>Patient</th><th>Time</th><th>Status</th><th>Action</th></tr>
          <tr><td style={{padding:'10px'}}>Lokesh</td><td>10:00 AM</td><td>Pending</td><td><button style={{background:'#22c55e', color:'white', border:'none', padding:'6px 12px', borderRadius:'6px', marginRight:'5px'}}>Approve</button><button style={{background:'#ef4444', color:'white', border:'none', padding:'6px 12px', borderRadius:'6px'}}>Reject</button></td></tr>
          <tr><td style={{padding:'10px'}}>Priya</td><td>11:30 AM</td><td>Approved</td><td>View Report</td></tr>
        </tbody>
      </table>
    </div>
  )
}