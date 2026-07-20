'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import btnStyles from '@/styles/components/buttons.module.css';

export default function SettingsClient() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        
        if (data.delivery_locations && data.delivery_locations.length > 0) {
          setLocations(data.delivery_locations);
        } else {
          // Fallback to initial default if empty or not set yet
          setLocations([
            { id: 'loc-1', name: 'Lagos - Island', fee: 2500 },
            { id: 'loc-2', name: 'Lagos - Mainland', fee: 3000 },
            { id: 'loc-3', name: 'Outside Lagos', fee: 5000 }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleAddLocation = () => {
    setLocations([...locations, { id: `loc-${Date.now()}`, name: '', fee: 0 }]);
  };

  const handleRemoveLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const handleLocationChange = (id, field, value) => {
    setLocations(locations.map(loc => {
      if (loc.id === id) {
        return { ...loc, [field]: field === 'fee' ? parseFloat(value) || 0 : value };
      }
      return loc;
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_locations: locations,
          // Keep these for backward compatibility if needed, or set to 0
          shipping_standard: locations.length > 0 ? locations[0].fee : 2500,
          shipping_express: 5000,
        })
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 className="spin" /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Store Settings</h1>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Delivery Locations & Fees</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
          Manage the delivery zones and their respective fees.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '600px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {locations.map((loc, index) => (
              <div key={loc.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: index === 0 ? 'block' : 'none', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px' }}>Location Name</label>
                  <input 
                    type="text" 
                    value={loc.name}
                    onChange={(e) => handleLocationChange(loc.id, 'name', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    placeholder="e.g. Lagos - Island"
                    required
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: index === 0 ? 'block' : 'none', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px' }}>Fee (₦)</label>
                  <input 
                    type="number" 
                    value={loc.fee}
                    onChange={(e) => handleLocationChange(loc.id, 'fee', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    placeholder="2500"
                    required
                  />
                </div>
                <div style={{ marginTop: index === 0 ? '20px' : '0' }}>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveLocation(loc.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '10px' }}
                    title="Remove Location"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleAddLocation}
            className={`${btnStyles.btn} ${btnStyles.outline}`}
            style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
          >
            <Plus size={16} /> Add Location
          </button>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
            <button 
              type="submit" 
              className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`} 
              disabled={isSaving}
              style={{ width: 'fit-content' }}
            >
              {isSaving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
              {isSaving ? 'Saving Settings...' : 'Save Settings'}
            </button>
          </div>

          {message && (
            <div style={{ 
              marginTop: 'var(--space-2)', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.875rem',
              background: message.includes('Error') ? 'var(--color-danger-50)' : 'var(--color-success-50)',
              color: message.includes('Error') ? 'var(--color-danger)' : 'var(--color-success)',
              fontWeight: 500
            }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
