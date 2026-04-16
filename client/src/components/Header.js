import React from 'react';

function Header({ activeTab, setActiveTab, user, onLogout, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand-row">
          <div className="logo" role="button" tabIndex={0} onClick={() => setActiveTab('dashboard')} onKeyDown={(event) => event.key === 'Enter' && setActiveTab('dashboard')}>
            Tantra<span>track</span>
          </div>
          {user?.email && <div className="user-pill">{user.email}</div>}
        </div>

        <div className="header-actions">
          <ul className="nav-tabs">
            <li
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </li>
            <li
              className={`nav-tab ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              ➕ Add Transaction
            </li>
            <li
              className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              📈 Reports
            </li>
          </ul>

          <button type="button" className="btn btn-secondary theme-toggle-btn" onClick={onToggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button type="button" className="btn btn-secondary header-logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
