import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddBook({ token }) {
  const [form, setForm] = useState({ title: '', author: '', condition: 'Good', type: 'lend', price: '', city: '', state: '' });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Append all form fields to FormData
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (image) {
      formData.append('image', image);
    }

    try {
        const res = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        toast.success('Book added successfully!');
        navigate('/browse');
    } catch (err) { toast.error(`Error: ${err.message}`); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-7">
        <div className="card card-ui p-2 p-md-4">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Add a New Book</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input id="title" name="title" type="text" placeholder="Title" onChange={handleChange} className="form-control" required />
                <label htmlFor="title">Title</label>
              </div>
              <div className="form-floating mb-3">
                <input id="author" name="author" type="text" placeholder="Author" onChange={handleChange} className="form-control" required />
                <label htmlFor="author">Author</label>
              </div>

              <div className="row g-2 mb-3">
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

              <div className="row g-2 mb-3">
                <div className="col-md">
                  <div className="form-floating">
                    <select id="condition" name="condition" value={form.condition} onChange={handleChange} className="form-select" required>
                      <option>New</option><option>Like New</option><option>Good</option><option>Fair</option><option>Used</option>
                    </select>
                    <label htmlFor="condition">Condition</label>
                  </div>
                </div>
                <div className="col-md">
                  <div className="form-floating">
                    <select id="type" name="type" value={form.type} onChange={handleChange} className="form-select" required>
                      <option value="lend">Lend</option><option value="sell">Sell</option>
                    </select>
                    <label htmlFor="type">Type</label>
                  </div>
                </div>
              </div>

              {form.type === 'sell' && (
                <div className="form-floating mb-3">
                  <input id="price" name="price" type="number" placeholder="Price ($)" value={form.price} onChange={handleChange} className="form-control" required />
                  <label htmlFor="price">Price ($)</label>
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Book Cover Image</label>
                <input type="file" className="form-control" id="image" name="image" onChange={handleImageChange} accept="image/*" required/>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">Add Book</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}