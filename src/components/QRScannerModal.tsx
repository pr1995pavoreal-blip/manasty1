import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { QrCode, X, Search } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [manualToken, setManualToken] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onClose();
        // Check if decodedText is a URL containing /verify/
        let token = decodedText;
        if (decodedText.includes('/verify/')) {
          token = decodedText.split('/verify/')[1];
        }
        navigate(`/verify/${token}`);
      },
      (errorMessage) => {
        // Continuous scanning error ignored
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isOpen, navigate, onClose]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    onClose();
    let token = manualToken.trim();
    if (token.includes('/verify/')) {
      token = token.split('/verify/')[1];
    }
    navigate(`/verify/${token}`);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <QrCode className="text-warning" size={24} />
              <span>Scan Customer Digital QR</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center p-4">
            <div id="qr-reader" style={{ width: '100%' }}></div>

            <hr className="my-4" />

            <form onSubmit={handleManualSubmit}>
              <label className="form-label fw-bold text-muted small">Or Enter Verification Token / URL Manually</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. demo-qr-token-1234567890abcdef"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                />
                <button type="submit" className="btn btn-warning d-flex align-items-center gap-1">
                  <Search size={18} />
                  <span>Verify</span>
                </button>
              </div>
            </form>
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
