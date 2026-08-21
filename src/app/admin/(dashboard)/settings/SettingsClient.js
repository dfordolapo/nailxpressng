'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Tag } from 'lucide-react';
import btnStyles from '@/styles/components/buttons.module.css';

export default function SettingsClient() {
  const [locations, setLocations] = useState([]);
  const [presets, setPresets] = useState({
    factory: { lagos: '24-48 hours', outside: '3-5 working days' },
    handmade: { lagos: '3-5 working days', outside: '5-7 working days' },
    custom: { lagos: '5-7 working days', outside: '7-10 working days' }
  });
  const [discount, setDiscount] = useState(0);
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
        if (data.delivery_presets) {
          setPresets(data.delivery_presets);
        }
        if (typeof data.sitewide_discount === 'number') {
          setDiscount(data.sitewide_discount);
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

  const handlePresetChange = (category, region, value) => {
    setPresets(prev => ({
      ...prev,
      [category]: { ...prev[category], [region]: value }
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
          delivery_presets: presets,
          shipping_standard: locations.length > 0 ? locations[0].fee : 2500,
          shipping_express: 5000,
          sitewide_discount: parseFloat(discount) || 0,
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

      {/* Sitewide Discount Banner */}
      {discount > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #fff4e0, #ffe8b0)',
          border: '1px solid #f5c842',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 20px',
          marginBottom: 'var(--space-6)',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#7a5700',
        }}>
          <Tag size={18} />
          Active Sitewide Discount: <span style={{ fontSize: '1.1rem', marginLeft: 4 }}>{discount}% OFF</span> — applied to all product prices at checkout
        </div>
      )}

      {/* Sitewide Discount Card */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2)' }}>
          <Tag size={20} color='var(--color-primary)' />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Sitewide Discount</h2>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
          Set a percentage discount applied to all products sitewide. Set to <strong>0</strong> to disable.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px' }}>
          <input
            id="sitewide-discount-input"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={discount}
            onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
            style={{ flex: 1, padding: '10px 14px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 600, textAlign: 'center' }}
          />
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary)' }}>%</span>
          {discount > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              ✓ {discount}% active
            </span>
          )}
        </div>
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
                <div style={{ flex: 1.5 }}>
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
                <div style={{ flex: 1.2 }}>
                  <label style={{ display: index === 0 ? 'block' : 'none', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px' }}>Est. Delivery Time</label>
                  <input 
                    type="text" 
                    value={loc.estimated_time || ''}
                    onChange={(e) => handleLocationChange(loc.id, 'estimated_time', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    placeholder="e.g. 3-5 Hours"
                  />
                </div>
                <div style={{ width: '110px' }}>
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
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Estimated Delivery Times</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
              Set the estimated delivery times for each product category automatically shown on the product page.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Factory Made */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Factory Made</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Within Lagos</label>
                    <input 
                      type="text" 
                      value={presets.factory.lagos}
                      onChange={(e) => handlePresetChange('factory', 'lagos', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Outside Lagos</label>
                    <input 
                      type="text" 
                      value={presets.factory.outside}
                      onChange={(e) => handlePresetChange('factory', 'outside', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Handmade */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Handmade</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Within Lagos</label>
                    <input 
                      type="text" 
                      value={presets.handmade.lagos}
                      onChange={(e) => handlePresetChange('handmade', 'lagos', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Outside Lagos</label>
                    <input 
                      type="text" 
                      value={presets.handmade.outside}
                      onChange={(e) => handlePresetChange('handmade', 'outside', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Orders */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Custom Orders</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Within Lagos</label>
                    <input 
                      type="text" 
                      value={presets.custom.lagos}
                      onChange={(e) => handlePresetChange('custom', 'lagos', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Outside Lagos</label>
                    <input 
                      type="text" 
                      value={presets.custom.outside}
                      onChange={(e) => handlePresetChange('custom', 'outside', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
