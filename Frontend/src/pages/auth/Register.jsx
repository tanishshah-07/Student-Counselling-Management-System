import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'counselor') navigate('/counselor');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <input
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <select
                name="role"
                className="appearance-none relative block w-full px-3 py-2 border border-border text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="counselor">Counselor</option>
                {/* Realistically, Admin shouldn't be registrable by public, but we allow it for Demo */}
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-primary hover:text-primary/80">
            Already have an account? Sign in here.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
