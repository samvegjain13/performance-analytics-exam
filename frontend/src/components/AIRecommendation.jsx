import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, BookOpen, Award } from 'lucide-react';
import api from '../api';

const AIRecommendation = ({ employeeId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        setLoading(true);
        const res = await api.post('/ai/recommend', { employeeId });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch AI recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, [employeeId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', marginBottom: '1rem' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Generating AI Insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'var(--danger-color)', padding: '2rem', textAlign: 'center' }}>
        <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
        <p>{error}</p>
      </div>
    );
  }

  // Handle Raw Text Fallback
  if (data?.rawText) {
    return (
      <div className="ai-card glass-panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <Sparkles /> Raw AI Analysis
        </h3>
        <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
          {data.rawText}
        </pre>
      </div>
    );
  }

  // Handle Array (Ranking)
  if (Array.isArray(data)) {
    return (
      <div className="ai-card glass-panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <Award /> Global AI Ranking
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.map((item, index) => (
            <div key={index} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${index === 0 ? 'var(--secondary-color)' : 'var(--primary-color)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>#{item.rank} {item.name}</strong>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle Single Employee Object
  return (
    <div className="ai-layout" style={{ marginTop: '1rem' }}>
      <div className="ai-card glass-panel">
        <div className="ai-section">
          <h4><TrendingUp size={16} /> Promotion Recommendation</h4>
          <p style={{ fontSize: '1.1rem', color: data.recommendation?.toLowerCase().includes('yes') ? 'var(--secondary-color)' : 'var(--warning-color)' }}>
            {data.recommendation || 'No recommendation available'}
          </p>
        </div>
        
        <div className="ai-section">
          <h4><AlertCircle size={16} /> Improvement Feedback</h4>
          <p>{data.feedback || 'No specific feedback provided.'}</p>
        </div>
        
        <div className="ai-section">
          <h4><BookOpen size={16} /> Training Suggestions</h4>
          <p>{data.training || 'No training suggestions needed at this time.'}</p>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
        <Sparkles size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>AI Confidence</h3>
        <p style={{ color: 'var(--text-muted)' }}>Analysis generated using advanced LLM models tailored for HR evaluation.</p>
      </div>
    </div>
  );
};

export default AIRecommendation;
