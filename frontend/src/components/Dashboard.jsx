import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, Sparkles, UserX } from 'lucide-react';
import api from '../api';
import EmployeeForm from './EmployeeForm';
import AIRecommendation from './AIRecommendation';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (department = '') => {
    try {
      setLoading(true);
      const url = department ? `/employees/search?department=${department}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchQuery);
  };

  const handleAiClick = (employee = null) => {
    setSelectedEmployee(employee);
    setIsAiOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Sparkles size={24} />
          <span>Performance AI</span>
        </div>
        <div className="navbar-user">
          <button className="btn btn-secondary" onClick={() => handleAiClick()}>
            <Sparkles size={18} /> Get Global AI Ranking
          </button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="container animate-fade-in">
        <div className="dashboard-header">
          <div>
            <h2>Employee Directory</h2>
            <p>Manage and analyze your team's performance</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={18} /> Add Employee
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by department (e.g. Development, Marketing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
          {searchQuery && (
            <button type="button" className="btn btn-secondary" onClick={() => { setSearchQuery(''); fetchEmployees(''); }}>
              Clear
            </button>
          )}
        </form>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : employees.length > 0 ? (
          <div className="employee-grid">
            {employees.map(emp => (
              <div key={emp._id} className="employee-card glass-panel" onClick={() => handleAiClick(emp)}>
                <div className="employee-header">
                  <div>
                    <h3 className="employee-name">{emp.name}</h3>
                    <span className="employee-dept">{emp.department}</span>
                  </div>
                  <button className="modal-close" onClick={(e) => handleDelete(e, emp._id)} title="Delete Employee">
                    <UserX size={18} />
                  </button>
                </div>
                
                <div className="tags">
                  {emp.skills.map((skill, i) => (
                    <span key={i} className="tag">{skill}</span>
                  ))}
                </div>

                <div className="employee-stats">
                  <div className="stat-item">
                    <span className="stat-label">Performance</span>
                    <span className={`stat-value ${emp.performanceScore >= 80 ? 'score-high' : emp.performanceScore >= 60 ? 'score-med' : 'score-low'}`}>
                      {emp.performanceScore}/100
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Experience</span>
                    <span className="stat-value">{emp.experience} Yrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>No employees found</h3>
            <p>Try adding a new employee or changing your search criteria.</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ padding: '2rem' }}>
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="modal-close" onClick={() => setIsFormOpen(false)}>✕</button>
            </div>
            <EmployeeForm onSuccess={() => {
              setIsFormOpen(false);
              fetchEmployees();
            }} />
          </div>
        </div>
      )}

      {isAiOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>{selectedEmployee ? `AI Analysis: ${selectedEmployee.name}` : 'Global AI Ranking & Analysis'}</h2>
              <button className="modal-close" onClick={() => setIsAiOpen(false)}>✕</button>
            </div>
            <AIRecommendation employeeId={selectedEmployee?._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
