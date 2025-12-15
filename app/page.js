// app/page.js
'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // ==========================================
  // 1. CONFIGURATION
  // ==========================================
  // REPLACE THIS with your actual Railway Project URL
  // Example: "https://web-production-a1b2.up.railway.app"
  const API_URL = "https://ee495smarthome-production.up.railway.app"; 

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================
  const [sensorData, setSensorData] = useState({});
  const [status, setStatus] = useState("Connecting...");
  const [lastUpdated, setLastUpdated] = useState("");

  // ==========================================
  // 3. FETCH DATA (POLLING)
  // ==========================================
  const fetchData = async () => {
    try {
      if (API_URL.includes("PASTE_YOUR")) {
        setStatus("⚠️ Config Error: Missing URL");
        return;
      }

      const res = await fetch(`${API_URL}/realtime`);
      if (!res.ok) throw new Error("Backend invalid");
      
      const data = await res.json();
      setSensorData(data);
      setStatus("System Online");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setStatus("Backend Offline");
    }
  };

  // Run immediately, then every 2 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // 4. SEND COMMANDS
  // ==========================================
  const sendCommand = async (device, action) => {
    try {
      await fetch(`${API_URL}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device, action })
      });
      alert(`Sent: ${action} to ${device}`);
    } catch (err) {
      alert("Failed to send command");
    }
  };

  // ==========================================
  // 5. VISUAL INTERFACE (UI)
  // ==========================================
  return (
    <main style={styles.main}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>🏠 Smart Home Hub</h1>
        <div style={styles.statusBar}>
          <span style={{ 
            ...styles.statusDot, 
            backgroundColor: status === "System Online" ? '#10b981' : '#ef4444' 
          }} />
          {status} <span style={styles.timestamp}>({lastUpdated})</span>
        </div>
      </header>

      {/* SENSOR GRID */}
      <div style={styles.grid}>
        {Object.keys(sensorData).length === 0 ? (
          <div style={styles.emptyState}>Waiting for Sensor Data...</div>
        ) : (
          Object.values(sensorData).map((node, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>📍 {node.node || "Unknown Device"}</h3>
                <span style={styles.cardTime}>{node.time}</span>
              </div>
              
              <div style={styles.metrics}>
                {/* Temperature */}
                <div style={styles.metric}>
                  <span style={styles.icon}>🌡️</span>
                  <div style={styles.metricValue}>
                    {node.temp ? `${node.temp}°C` : "--"}
                    <span style={styles.label}>Temp</span>
                  </div>
                </div>

                {/* Gas */}
                <div style={styles.metric}>
                  <span style={styles.icon}>☁️</span>
                  <div style={styles.metricValue}>
                    {node.gas ? `${node.gas}V` : "--"}
                    <span style={styles.label}>Gas Level</span>
                  </div>
                </div>
              </div>

              {/* Thresholds (Limits) */}
              <div style={styles.limits}>
                <small>Limits: Max Temp {node.temp_th}°C | Max Gas {node.gas_th}V</small>
              </div>

              {/* Quick Actions */}
              <div style={styles.actions}>
                <button 
                  onClick={() => sendCommand(node.node, "LIGHT_ON")}
                  style={{...styles.btn, backgroundColor: '#3b82f6'}}
                >
                  Light ON
                </button>
                <button 
                  onClick={() => sendCommand(node.node, "LIGHT_OFF")}
                  style={{...styles.btn, backgroundColor: '#1e293b'}}
                >
                  Light OFF
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

// ==========================================
// 6. STYLES (CSS)
// ==========================================
const styles = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#0f172a', // Dark Navy
    color: 'white',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
    borderBottom: '1px solid #1e293b',
    paddingBottom: '1rem'
  },
  title: { margin: 0, fontSize: '1.8rem' },
  statusBar: { 
    backgroundColor: '#1e293b', 
    padding: '8px 16px', 
    borderRadius: '20px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'block'
  },
  timestamp: { color: '#94a3b8', fontSize: '0.8rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  emptyState: {
    textAlign: 'center',
    color: '#64748b',
    gridColumn: '1 / -1',
    padding: '4rem',
    fontSize: '1.2rem',
    border: '2px dashed #1e293b',
    borderRadius: '1rem'
  },
  card: {
    backgroundColor: '#1e293b', // Card Background
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    alignItems: 'center'
  },
  cardTime: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    backgroundColor: '#0f172a',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  metric: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  icon: { fontSize: '1.5rem' },
  metricValue: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  label: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    fontWeight: 'normal'
  },
  limits: {
    fontSize: '0.8rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '1rem',
    borderTop: '1px solid #334155',
    paddingTop: '0.5rem'
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  btn: {
    border: 'none',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'opacity 0.2s'
  }
};
