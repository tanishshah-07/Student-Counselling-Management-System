import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';

const CounselorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notesDesc, setNotesDesc] = useState('');
  
  // Profile Form State
  const [specialization, setSpecialization] = useState('Mental Health');
  const [experience, setExperience] = useState(0);
  const [availability, setAvailability] = useState([{ day: 'Monday', slots: ['09:00', '10:00'] }]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/appointments/${currentAppointment._id}/record`, {
        notes: notesDesc
      });
      toast.success('Session notes added successfully');
      setShowNotesModal(false);
      setNotesDesc('');
      setCurrentAppointment(null);
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to add notes');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/counselors/profile', {
        specialization,
        experience,
        availability
      });
      toast.success('Profile updated successfully');
      setShowProfileModal(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Counselor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your sessions and update availability</p>
        </div>
        <button 
          onClick={() => setShowProfileModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          Update Profile/Availability
        </button>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
        
        {loading ? (
           <p className="text-muted-foreground">Loading...</p>
        ) : appointments.length === 0 ? (
           <p className="text-muted-foreground">No upcoming appointments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{apt.studentId?.name || 'Unknown'}</span>
                        {apt.studentId && (
                          <button 
                            onClick={() => {
                              setSelectedStudent(apt.studentId);
                              setShowStudentModal(true);
                            }}
                            className="text-xs text-primary hover:underline bg-primary/10 px-2 py-1 rounded"
                          >
                            View Profile
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{new Date(apt.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{apt.timeSlot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${apt.status === 'accepted' ? 'bg-blue-100 text-blue-800' : ''}
                        ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${apt.status === 'rejected' || apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                       {apt.status === 'pending' && (
                         <>
                           <button onClick={() => updateStatus(apt._id, 'accepted')} className="text-primary hover:underline">Accept</button>
                           <button onClick={() => updateStatus(apt._id, 'rejected')} className="text-destructive hover:underline">Reject</button>
                         </>
                       )}
                       {apt.status === 'accepted' && (
                         <button onClick={() => updateStatus(apt._id, 'completed')} className="text-green-600 hover:underline">Mark Completed</button>
                       )}
                       {apt.status === 'completed' && (
                         <button 
                           onClick={() => {
                             setCurrentAppointment(apt);
                             setShowNotesModal(true);
                           }} 
                           className="text-primary hover:underline"
                         >
                           Add Notes
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Session Notes for {currentAppointment?.studentId?.name}</h3>
            <form onSubmit={handleNotesSubmit}>
              <textarea
                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-primary bg-background resize-none h-32"
                placeholder="Enter confidential notes..."
                required
                value={notesDesc}
                onChange={(e) => setNotesDesc(e.target.value)}
              ></textarea>
              <div className="mt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowNotesModal(false)} className="px-4 py-2 text-sm text-foreground bg-secondary rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-primary-foreground bg-primary rounded-md">Save Notes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Update Profile & Availability</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input 
                  type="text" 
                  className="w-full border border-border rounded-md p-2 bg-background" 
                  value={specialization} 
                  onChange={(e)=>setSpecialization(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                <input 
                  type="number" 
                  className="w-full border border-border rounded-md p-2 bg-background" 
                  value={experience} 
                  onChange={(e)=>setExperience(Number(e.target.value))} 
                  required 
                  min="0"
                />
              </div>
              <div className="text-sm text-muted-foreground mt-4 mb-2">Note: For demo purposes, default availability is set to Monday 9AM and 10AM. Advanced slot management requires a complex UI component.</div>
              <div className="mt-4 flex justify-end space-x-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 text-sm text-foreground bg-secondary rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-primary-foreground bg-primary rounded-md">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 max-w-lg w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-foreground">Student Profile</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 border-b border-border pb-6">
                <div className="h-20 w-20 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-border">
                  {selectedStudent.profilePicture ? (
                    <img src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${selectedStudent.profilePicture}`} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl text-muted-foreground uppercase">{selectedStudent.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedStudent.name}</h4>
                  <p className="text-muted-foreground">{selectedStudent.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{selectedStudent.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedStudent.gender || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedStudent.age || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{selectedStudent.bloodGroup || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Education</p>
                  <p className="font-medium">{selectedStudent.education || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Degree / Program</p>
                  <p className="font-medium">{selectedStudent.degree || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end pt-4 border-t border-border">
                <button onClick={() => setShowStudentModal(false)} className="px-6 py-2 text-sm text-primary-foreground bg-primary rounded-md font-medium hover:bg-primary/90">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;
