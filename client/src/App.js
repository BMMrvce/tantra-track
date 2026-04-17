import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import supabase, { hasSupabaseConfig, missingSupabaseConfigMessage } from './supabaseClient';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Reports from './components/Reports';
import ExportButton from './components/ExportButton';

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMode, setAuthMode] = useState('signin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('tantratrack-theme') || 'dark');
  const accessToken = session?.access_token;

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('tantratrack-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setAuthLoading(false);
      setAuthError(missingSupabaseConfigMessage);
      return;
    }

    const initializeSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    };

    initializeSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const getAuthHeaders = useCallback(() => {
    if (!accessToken) {
      return { 'Content-Type': 'application/json' };
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    };
  }, [accessToken]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [getAuthHeaders]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      const response = await fetch(`/api/transactions?startDate=${firstDay}&endDate=${today}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (!session?.access_token) {
      return;
    }

    fetchCategories();
    fetchTransactions();
  }, [session, fetchCategories, fetchTransactions]);

  const handleAddTransaction = async (transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transaction)
      });
      const data = await response.json();
      if (data.success) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = async (id, transaction) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(transaction)
      });
      const data = await response.json();
      if (data.success) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error editing transaction:', error);
    }
  };

  const handleAuth = async ({ fullName, email, password }) => {
    if (!hasSupabaseConfig || !supabase) {
      setAuthError(missingSupabaseConfigMessage);
      return;
    }

    try {
      setAuthSubmitting(true);
      setAuthError('');

      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email
            }
          }
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setAuthError('Account created. Check your email to confirm before signing in.');
        }
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setTransactions([]);
    setCategories([]);
    setActiveTab('dashboard');
  };

  const toggleTheme = () => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'));
  };

  if (authLoading) {
    return (
      <div className="app auth-loading-screen">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!hasSupabaseConfig) {
    return (
      <div className="auth-shell">
        <div className="auth-backdrop auth-backdrop-left" />
        <div className="auth-backdrop auth-backdrop-right" />
        <div className="auth-card card">
          <div className="auth-branding">
            <div className="auth-logo">Tantra<span>track</span></div>
            <p className="auth-tagline">Setup required before sign in</p>
          </div>
          <div className="auth-error">
            {missingSupabaseConfigMessage}
          </div>
          <div className="auth-footer-note">
            Add these variables in <strong>client/.env</strong> and restart the client:
            <br />REACT_APP_SUPABASE_URL
            <br />REACT_APP_SUPABASE_ANON_KEY
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <AuthScreen
        onAuth={handleAuth}
        loading={authSubmitting}
        error={authError}
        authMode={authMode}
        setAuthMode={setAuthMode}
      />
    );
  }

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            categories={categories}
            loading={loading}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
          />
        )}
        
        {activeTab === 'add' && (
          <TransactionForm 
            categories={categories}
            onAddTransaction={handleAddTransaction}
          />
        )}
        
        {activeTab === 'reports' && (
          <Reports transactions={transactions} categories={categories} />
        )}
      </main>

      <ExportButton authToken={session.access_token} />
      
      <footer className="app-footer">
        <p>🚀 Powered by <a href="https://tantravruksha.in" target="_blank" rel="noopener noreferrer">Tantravruksha Technologies</a></p>
      </footer>
    </div>
  );
}

export default App;
