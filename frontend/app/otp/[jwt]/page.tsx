'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OtpBox from '@components/OtpBox';

export default function OTP({ params }: { params: { jwt: string } }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/users/email/${params.jwt}`
        );
        setEmail(data.email);
      } catch (err) {
        alert('something went wrong')
      }
    };
    fetchEmail();
  }, [params.jwt]);

  const handleSubmit = async (otp: string[]) => {
    const otpValue = otp.join('');
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/users/emailVerification',
        {
          username: email,
          code: otpValue,
        }
      );

      if (data) {
        window.location.href = '/';
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <OtpBox handleSubmit={handleSubmit} email={email} />
    </div>
  );
}
