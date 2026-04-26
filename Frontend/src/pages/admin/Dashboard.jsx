import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, appointmentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/appointments')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
       toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System overview and management</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className={`bg-card p-6 rounded-lg border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:border-primary ${activeTab === 'users' ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
            onClick={() => setActiveTab('users')}
          >
            <div className="bg-primary/10 p-4 rounded-full text-primary">
               <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.users.total}</h3>
            </div>
          </div>
          
          <div 
            className={`bg-card p-6 rounded-lg border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:border-blue-500 ${activeTab === 'appointments' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-border'}`}
            onClick={() => setActiveTab('appointments')}
          >
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
               <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
              <h3 className="text-2xl font-bold">{stats.appointments.total}</h3>
            </div>
          </div>
          
          <div 
            className={`bg-card p-6 rounded-lg border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:border-green-500 ${activeTab === 'completed' ? 'border-green-500 ring-1 ring-green-500' : 'border-border'}`}
            onClick={() => setActiveTab('completed')}
          >
            <div className="bg-green-100 p-4 rounded-full text-green-600">
               <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Sessions</p>
              <h3 className="text-2xl font-bold">{stats.appointments.completed}</h3>
            </div>
          </div>
          
          <div 
            className={`bg-card p-6 rounded-lg border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:border-yellow-500 ${activeTab === 'pending' ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-border'}`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
               <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
              <h3 className="text-2xl font-bold">{stats.appointments.pending}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'appointments' && 'All Appointments'}
            {activeTab === 'completed' && 'Completed Sessions'}
            {activeTab === 'pending' && 'Pending Requests'}
          </h3>
        </div>
        <div className="px-6 py-5">
           <div className="overflow-x-auto">
             {activeTab === 'users' ? (
               <table className="min-w-full divide-y divide-border">
                 <thead>
                   <tr>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Joined Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {users.map(user => (
                     <tr key={user._id}>
                       <td className="px-4 py-3 text-sm text-foreground">{user.name}</td>
                       <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                       <td className="px-4 py-3 text-sm">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium
                           ${user.role === 'admin' ? 'bg-red-100 text-red-800' : ''}
                           ${user.role === 'counselor' ? 'bg-blue-100 text-blue-800' : ''}
                           ${user.role === 'student' ? 'bg-green-100 text-green-800' : ''}
                         `}>
                           {user.role}
                         </span>
                       </td>
                       <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <table className="min-w-full divide-y divide-border">
                 <thead>
                   <tr>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Student</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Counselor</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date & Time</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {appointments
                     .filter(apt => {
                       if (activeTab === 'completed') return apt.status === 'completed';
                       if (activeTab === 'pending') return apt.status === 'pending';
                       return true;
                     })
                     .map(apt => (
                       <tr key={apt._id}>
                         <td className="px-4 py-3 text-sm text-foreground">{apt.studentId?.name || 'Unknown'}</td>
                         <td className="px-4 py-3 text-sm text-foreground">{apt.counselorId?.user?.name || 'Unknown'}</td>
                         <td className="px-4 py-3 text-sm text-muted-foreground">
                           {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
                         </td>
                         <td className="px-4 py-3 text-sm">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium
                             ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                             ${apt.status === 'accepted' ? 'bg-blue-100 text-blue-800' : ''}
                             ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                             ${apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                             ${apt.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                           `}>
                             {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                           </span>
                         </td>
                       </tr>
                   ))}
                   {appointments.filter(apt => {
                       if (activeTab === 'completed') return apt.status === 'completed';
                       if (activeTab === 'pending') return apt.status === 'pending';
                       return true;
                     }).length === 0 && (
                     <tr>
                       <td colSpan="4" className="px-4 py-8 text-center text-muted-foreground">
                         No appointments found for this category.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
