import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login({ setToken }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setToken(data.token);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="card card-ui p-2 p-md-4">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Login to Your Account</h2>
            <form onSubmit={handleSubmit} className="d-grid gap-3">
              <div className="form-floating">
                <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control" required />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating">
                <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="form-control" required />
                <label htmlFor="password">Password</label>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 mt-2">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}