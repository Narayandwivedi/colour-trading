// UPIQRCode.jsx
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const UPIQRCode = ({
  upiId = 'desinplus1@okicici',
  name = 'Design Plus',
  amount, // optional
  size = 200,
}) => {
  const [qrCodeSvg, setQrCodeSvg] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      let upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`;
      if (amount) {
        upiString += `&am=${amount}`;
      }

      try {
        const svg = await QRCode.toString(upiString, {
          type: 'svg',
          errorCorrectionLevel: 'H',
          margin: 1,
          width: size,
        });
        setQrCodeSvg(svg);
      } catch (err) {
        console.error('QR code generation failed', err);
      }
    };

    generateQRCode();
  }, [upiId, name, amount, size]);

  return (
    <div
      className="p-4 border rounded shadow-sm bg-white inline-block"
      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
    />
  );
};

export default UPIQRCode;
