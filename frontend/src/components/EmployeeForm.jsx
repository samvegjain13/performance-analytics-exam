import React, { useState } from 'react';
import api from '../api';

const EmployeeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };
      
      await api.post('/employees', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Department</label>
        <input name="department" type="text" className="form-input" value={formData.department} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Skills (comma-separated)</label>
        <input name="skills" type="text" className="form-input" placeholder="e.g. React, Node.js, MongoDB" value={formData.skills} onChange={handleChange} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Performance Score (0-100)</label>
          <input name="performanceScore" type="number" min="0" max="100" className="form-input" value={formData.performanceScore} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <input name="experience" type="number" min="0" className="form-input" value={formData.experience} onChange={handleChange} required />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
        {loading ? 'Adding...' : 'Add Employee'}
      </button>
    </form>
  );
};

export default EmployeeForm;
