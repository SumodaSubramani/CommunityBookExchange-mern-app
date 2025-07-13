import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '', city: '', state: '' });
  const navigate = useNavigate();
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="card card-ui p-2 p-md-4">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Create an Account</h2>
            <form onSubmit={handleSubmit} className="d-grid gap-3">
              <div className="form-floating">
                <input id="username" name="username" type="text" placeholder="Username" onChange={handleChange} className="form-control" required />
                <label htmlFor="username">Username</label>
              </div>
              <div className="form-floating">
                <input id="email" name="email" type="email" placeholder="Email" onChange={handleChange} className="form-control" required />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating">
                <input id="password" name="password" type="password" placeholder="Password" onChange={handleChange} className="form-control" required />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-floating">
                <input id="phone" name="phone" type="tel" placeholder="Phone Number" onChange={handleChange} className="form-control" required />
                <label htmlFor="phone">Phone Number</label>
              </div>
              <div className="row g-2">
                <div className="col-md">
                  <div className="form-floating">
                    <input id="city" name="city" type="text" placeholder="City" onChange={handleChange} className="form-control" required />
                    <label htmlFor="city">City</label>
                  </div>
                </div>
                <div className="col-md">
                  <div className="form-floating">
                    <input id="state" name="state" type="text" placeholder="State" onChange={handleChange} className="form-control" required />
                    <label htmlFor="state">State</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 mt-2">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}