// app/page.js
'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState("Loading...");
  const [users, setUsers] = useState([]);

  // Fetch data from your Python backend
  useEffect(() => {
    // Note: We fetch from /api/index because we moved the file there
    fetch('/api/index') 
      .then((res) => res.json())
      .then((data) => {
        setStatus("System Online");
        // If your python script returns users, set them here
        if (data.users) setUsers(data.users);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setStatus("Backend Offline (Check logs)");
      });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏠 Smart Home Dashboard</h1>
        
        <div style={styles.statusBox}>
          <span style={styles.label}>System Status:</span>
          <span style={{ 
            ...styles.badge, 
            backgroundColor: status.includes("Online") ? '#10b981' : '#ef4444' 
          }}>
            {status}
          </span>
        </div>

        {users.length > 0 && (
          <div style={styles.userSection}>
            <h3>Active Users</h3>
            <ul>
              {users.map((u, i) => <li key={i}>{u.name || JSON.stringify(u)}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple styles to make it look good immediately
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    backgroundColor: '#222',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    width: '400px',
    textAlign: 'center',
  },
  title: { margin: '0 0 1.5rem 0' },
  statusBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  userSection: { textAlign: 'left', marginTop: '1rem' }
};
