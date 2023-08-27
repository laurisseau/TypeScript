'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("react-bootstrap/Container");
const react_1 = require("react");
const Card_1 = require("react-bootstrap/Card");
const OtpBox = ({ handleSubmit, email }) => {
    const [otp, setOtp] = (0, react_1.useState)(new Array(6).fill(''));
    const inputRefs = (0, react_1.useRef)([]);
    const handleChange = (e, index) => {
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
    };
    const handleKeyDown = (e, index) => {
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
    const handleKeyUp = (e, index) => {
        // Move focus to the next box on key press
        if (e.target instanceof HTMLInputElement &&
            e.target.value !== '' &&
            index !== 5) {
            const nextBox = document.getElementById(`otp-box-${index + 1}`);
            if (nextBox) {
                nextBox.focus();
            }
        }
    };
    return (<Container_1.default className="d-flex justify-content-center ">
      <Card_1.default className="mt-5 p-3 shadow mb-5">
        <h4>We sent you a code</h4>

        <p className="fw-light">enter it below to verify {email}</p>
        <div className="otp-container">
          {otp.map((value, index) => (<input id={`otp-box-${index}`} key={index} type="text" maxLength={1} value={value} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} onKeyUp={(e) => handleKeyUp(e, index)} className="otp-input"/>))}
        </div>
        <div className="d-flex justify-content-center">
          <button className="otp-submit " type="button" onClick={() => handleSubmit(otp)}>
            Submit
          </button>
        </div>
      </Card_1.default>
    </Container_1.default>);
};
exports.default = OtpBox;
