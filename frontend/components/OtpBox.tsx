'use client';
import Container from 'react-bootstrap/Container';
import { useState, useRef } from 'react';
import Card from 'react-bootstrap/Card';

interface OtpBoxProps {
  handleSubmit: (otp: string[]) => Promise<void>;
  email: string;
}

const OtpBox: React.FC<OtpBoxProps> = ({ handleSubmit, email }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      // Move focus to the previous box on Backspace key press
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        const prevInput = document.getElementById(`otp-box-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move focus to the next box on key press
    if (
      e.target instanceof HTMLInputElement &&
      e.target.value !== '' &&
      index !== 5
    ) {
      const nextBox = document.getElementById(
        `otp-box-${index + 1}`
      ) as HTMLInputElement | null;
      if (nextBox) {
        nextBox.focus();
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center ">
      <Card className="mt-5 p-3 shadow mb-5">
        <h4>We sent you a code</h4>

        <p className="fw-light">enter it below to verify {email}</p>
        <div className="otp-container">
          {otp.map((value, index) => (
            <input
              id={`otp-box-${index}`}
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onKeyUp={(e) => handleKeyUp(e, index)}
              className="otp-input"
            />
          ))}
        </div>
        <div className="d-flex justify-content-center">
          <button
            className="otp-submit "
            type="button"
            onClick={() => handleSubmit(otp)}
          >
            Submit
          </button>
        </div>
      </Card>
    </Container>
  );
};

export default OtpBox;
