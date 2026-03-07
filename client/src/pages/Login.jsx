import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      if (!res || !res.token) throw new Error('Token not received from server');
      localStorage.setItem('token', res.token);
      localStorage.setItem('userName', res.user.name);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-10rem', right: '-10rem',
        width: '24rem', height: '24rem',
        background: 'rgba(99,102,241,0.1)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10rem', left: '-10rem',
        width: '24rem', height: '24rem',
        background: 'rgba(245,158,11,0.08)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="ss-logo" style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
            StudySync
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Your academic productivity hub
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1.4rem', color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}>
            Welcome back 👋
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: 'var(--text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.05em', marginBottom: '0.5rem',
              }}>Email</label>
              <input
                type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="you@university.edu" required
                autoComplete="off"
                style={{
                  width: '100%', background: 'var(--bg-base)',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  padding: '0.75rem 1rem', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: 'var(--text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.05em', marginBottom: '0.5rem',
              }}>Password</label>
              <input
                type="password" name="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••" required
                style={{
                  width: '100%', background: 'var(--bg-base)',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  padding: '0.75rem 1rem', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: 'var(--red)', fontSize: '0.875rem',
                padding: '0.75rem 1rem', borderRadius: '8px',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              style={{
                width: '100%',
                background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: 'none', borderRadius: '8px',
                color: '#fff', fontWeight: 600,
                padding: '0.875rem', fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? <><span>⚙️</span> Signing in…</> : 'Sign In'}
            </button>
          </div>

          <p style={{
            textAlign: 'center', color: 'var(--text-muted)',
            fontSize: '0.875rem', marginTop: '1.5rem',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: 'var(--text-accent)', fontWeight: 600,
              textDecoration: 'none',
            }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}