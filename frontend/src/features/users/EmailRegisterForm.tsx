// src/features/users/EmailRegisterForm.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function EmailRegisterForm() {
  const { register, error, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [accountType, setAccountType] = useState<'buyer'|'service'|'parts'|'rental'|'insurance'|'dealer'|'admin'>('buyer');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== password2) {
      setLocalError('Passwords do not match');
      return;
    }
    if (!phone) {
      setLocalError('Phone is required');
      return;
    }
    await register({ email, full_name: fullName, phone, password, account_type: accountType });
  };

  return (
    <form onSubmit={handleSubmit}>
      {(localError || error) && <p className="text-red-500 mb-4">{localError || error}</p>}
      <div className="mb-4">
        <label>Full Name</label>
        <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} required className="w-full p-2 border rounded"/>
      </div>
      <div className="mb-4">
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full p-2 border rounded"/>
      </div>
      <div className="mb-4">
        <label>Phone Number</label>
        <input type="tel" placeholder="+380XXXXXXXXX" value={phone} onChange={e=>setPhone(e.target.value)} required className="w-full p-2 border rounded"/>
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full p-2 border rounded"/>
      </div>
      <div className="mb-4">
        <label>Confirm Password</label>
        <input type="password" value={password2} onChange={e=>setPassword2(e.target.value)} required className="w-full p-2 border rounded"/>
      </div>
      <div className="mb-4">
        <label>Account Type</label>
        <select value={accountType} onChange={e=>setAccountType(e.target.value as any)} className="w-full p-2 border rounded">
          <option value="buyer">Buyer</option>
          <option value="service">Service</option>
          <option value="parts">Parts</option>
          <option value="rental">Rental</option>
          <option value="insurance">Insurance</option>
          <option value="dealer">Dealer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
