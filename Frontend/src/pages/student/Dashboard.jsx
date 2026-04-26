import React, { useState, useEffect } from 'react';
import CounselorList from './CounselorList';
import api from '../../services/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      toast.error('Failed to load your appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBook = async (counselor, day, timeSlot) => {
    if (isBooking) return;
    setIsBooking(true);
    
    // In a real app we'd map "Monday" to a real Date, but for simplicity we'll just use the next matching day or a dummy date.
    // For now let's just use tomorrow's date for demonstration so we have a valid Date object.
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    try {
      await api.post('/appointments', {
        counselorId: counselor._id,
        date: date.toISOString(),
        timeSlot: timeSlot
      });
      toast.success('Appointment booked successfully!');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Accepted</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Rejected</span>;
      case 'completed': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Completed</span>;
      case 'cancelled': return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Cancelled</span>;
      default: return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>;
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">Find a counselor and book your sessions</p>
        </div>
        <a href="/profile" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium">
          My Profile
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Available Counselors</h2>
            <CounselorList onBook={handleBook} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md text-center">No appointments booked yet.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt._id} className="border border-border p-4 rounded-md flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{apt.counselorId?.user?.name || 'Counselor'}</div>
                      {getStatusBadge(apt.status)}
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-4">
                      <span>{new Date(apt.date).toLocaleDateString()}</span>
                      <span>{apt.timeSlot}</span>
                    </div>
                    {apt.status === 'pending' && (
                      <button 
                        onClick={() => cancelAppointment(apt._id)}
                        className="mt-2 text-xs text-destructive hover:underline self-start"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
