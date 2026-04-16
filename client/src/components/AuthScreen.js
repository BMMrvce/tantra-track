import React, { useState } from 'react';

function AuthScreen({ onAuth, loading, error, authMode, setAuthMode }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAuth(formData);
  };

  return (
    <div className="auth-shell">
      <div className="auth-backdrop auth-backdrop-left" />
      <div className="auth-backdrop auth-backdrop-right" />

      <div className="auth-card card">
        <div className="auth-branding">
          <div className="auth-logo">Tantra<span>track</span></div>
          <p className="auth-tagline">Private budget tracking with Supabase Auth</p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${authMode === 'signin' ? 'active' : ''}`}
            onClick={() => setAuthMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => setAuthMode('signup')}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              minLength="6"
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : authMode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer-note">
          <span>Powered by Tantravruksha.in</span>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;