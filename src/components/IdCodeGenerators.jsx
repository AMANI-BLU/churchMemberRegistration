import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import QRCodeLib from 'qrcode';

export const RealBarcode = ({
  value,
  format = 'CODE128',
  width = 1.4,
  height = 20,
  lineColor = '#0f172a',
  className = 'id-svg-barcode'
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, String(value), {
          format,
          width,
          height,
          displayValue: false,
          margin: 0,
          background: 'transparent',
          lineColor
        });
      } catch (err) {
        console.error('Barcode generation error:', err);
      }
    }
  }, [value, format, width, height, lineColor]);

  return <svg ref={svgRef} className={className} />;
};

export const RealQRCode = ({
  value,
  size = 42,
  darkColor = '#000000',
  lightColor = '#ffffff',
  className = '',
  onClick,
  title
}) => {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (value) {
      // Use 'L' error correction for lower module density -> much larger pixels, super fast phone camera recognition
      QRCodeLib.toDataURL(String(value), {
        errorCorrectionLevel: 'L',
        margin: 2, // 2-module clear quiet zone required by optical camera scanners
        width: Math.max(size * 4, 300), // Sharp high-res rendering
        color: {
          dark: darkColor,
          light: lightColor
        }
      })
        .then((url) => {
          if (isMounted) setDataUrl(url);
        })
        .catch((err) => {
          console.error('QR code generation error:', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor]);

  if (!dataUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: '#ffffff',
          borderRadius: 4
        }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Member Verification QR Code"
      title={title || "Scan with phone camera"}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        objectFit: 'contain',
        imageRendering: 'crisp-edges',
        cursor: onClick ? 'pointer' : 'default'
      }}
      className={className}
    />
  );
};
