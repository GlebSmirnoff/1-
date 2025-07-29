import React from 'react';
import PhoneAuthForm from './PhoneAuthForm';

const PhoneAuthPage: React.FC = () => (
  <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
    <h1 className="text-2xl font-bold mb-6">Phone Verification</h1>
    <PhoneAuthForm />
  </div>
);

export default PhoneAuthPage;
