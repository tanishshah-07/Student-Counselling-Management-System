import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

const CounselorList = ({ onBook }) => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    fetchCounselors();
  }, [search, specialization]);

  const fetchCounselors = async () => {
    try {
      const res = await api.get('/counselors', {
        params: { search, specialization }
      });
      setCounselors(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch counselors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="">All Specializations</option>
          <option value="Academic">Academic</option>
          <option value="Career">Career</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Financial">Financial</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading counselors...</div>
      ) : counselors.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">No counselors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counselors.map((counselor) => (
            <div key={counselor._id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{counselor.user?.name}</h3>
                    <p className="text-primary text-sm font-medium">{counselor.specialization}</p>
                  </div>
                  <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                    {counselor.experience} yrs exp
                  </span>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Available Schedule
                  </h4>
                  {counselor.availability && counselor.availability.length > 0 ? (
                    <div className="space-y-2">
                      {counselor.availability.map((avail, idx) => (
                        <div key={idx} className="bg-muted p-2 rounded-md">
                          <span className="text-sm font-medium block mb-1">{avail.day}</span>
                          <div className="flex flex-wrap gap-2">
                            {avail.slots.map((slot, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => onBook(counselor, avail.day, slot)}
                                className="text-xs bg-background border border-border px-2 py-1 rounded hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
                              >
                                <Clock className="h-3 w-3" /> {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No availability set</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounselorList;
