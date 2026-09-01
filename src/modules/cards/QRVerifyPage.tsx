import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle, AlertOctagon, Calculator, ShieldCheck, Tag } from 'lucide-react';

export const QRVerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState('');

  // Transaction form states
  const [originalAmount, setOriginalAmount] = useState<number>(100);
  const [calculating, setCalculating] = useState(false);
  const [discountResult, setDiscountResult] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (token) verifyCardToken(token);
  }, [token]);

  const verifyCardToken = async (qrToken: string) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/cards/verify/${qrToken}`);
      setVerificationData(res.data.data);
      // Auto calculate initial discount for 100 SAR
      handleCalculateDiscount(100, res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired QR verification token');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateDiscount = async (amount: number, dataObj?: any) => {
    const data = dataObj || verificationData;
    if (!data || !user?.merchantId) return;

    try {
      setCalculating(true);
      const res = await api.post('/transactions/calculate', {
        verificationToken: token,
        merchantId: user.merchantId,
        originalAmount: amount,
      });
      setDiscountResult(res.data.data.discountResult);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Discount calculation failed');
    } finally {
      setCalculating(false);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!user?.merchantId) {
      setError('Merchant ID required to process transaction');
      return;
    }

    try {
      setConfirming(true);
      setError('');
      const res = await api.post('/transactions', {
        verificationToken: token,
        merchantId: user.merchantId,
        employeeId: user.employeeId,
        originalAmount,
      });

      setSuccessMessage(`Transaction ${res.data.data.transactionNo} completed successfully!`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction confirmation failed');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2 text-muted">Verifying QR Token with Node.js API Server...</p>
      </div>
    );
  }

  if (error && !verificationData) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '500px' }}>
        <div className="card shadow border-danger">
          <div className="card-body p-4">
            <AlertOctagon className="text-danger mb-3" size={54} />
            <h4 className="text-danger fw-bold">Verification Error</h4>
            <p className="text-muted mb-4">{error}</p>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { customer, membershipType, card } = verificationData;

  return (
    <div className="container py-4" style={{ maxWidth: '650px' }}>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-dark text-white p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <ShieldCheck className="text-success" size={28} />
              <span>QR Verification Result</span>
            </h4>
            <span className="badge px-3 py-2" style={{ backgroundColor: membershipType.badgeColor }}>
              {membershipType.nameAr || membershipType.name}
            </span>
          </div>
        </div>

        <div className="card-body p-4">
          {successMessage && (
            <div className="alert alert-success text-center py-3 mb-4">
              <CheckCircle className="mb-2" size={36} />
              <h5 className="fw-bold mb-1">Transaction Verified & Saved!</h5>
              <p className="mb-3 small">{successMessage}</p>
              <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/transactions')}>
                View in Transaction History
              </button>
            </div>
          )}

          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

          {/* Customer & Card Overview */}
          <div className="row bg-light rounded-3 p-3 mb-4 g-3 align-items-center">
            <div className="col-md-7">
              <span className="text-muted small text-uppercase">Validated Customer</span>
              <h5 className="fw-bold text-dark mb-0">{customer.fullName}</h5>
              <p className="text-muted small mb-0">{customer.email} • {customer.phone || 'No phone'}</p>
            </div>
            <div className="col-md-5 text-md-end">
              <span className="text-muted small text-uppercase">Card Number</span>
              <p className="font-monospace fw-bold mb-0">{card.cardNumber}</p>
              <span className="badge bg-success small">ACTIVE CARD</span>
            </div>
          </div>

          {/* Discount Calculation & Transaction Execution */}
          {!successMessage && (
            <div className="border rounded-3 p-4 bg-white">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Calculator className="text-primary" size={22} />
                <span>Calculate & Apply Discount</span>
              </h5>

              <div className="mb-3">
                <label className="form-label fw-bold small">Original Purchase Amount (SAR)</label>
                <div className="input-group input-group-lg">
                  <input
                    type="number"
                    className="form-control fw-bold"
                    value={originalAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setOriginalAmount(val);
                      handleCalculateDiscount(val);
                    }}
                  />
                  <span className="input-group-text">SAR</span>
                </div>
              </div>

              {discountResult && (
                <div className="bg-light border p-3 rounded-3 mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Applied Rules:</span>
                    <strong className="text-primary">{discountResult.breakdown}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Discount:</span>
                    <strong className="text-danger fs-5">-{discountResult.discountAmount} SAR</strong>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold text-dark">Final Payable Amount:</span>
                    <strong className="text-success fs-4">{discountResult.finalAmount} SAR</strong>
                  </div>
                </div>
              )}

              <button
                className="btn btn-success btn-lg w-100 fw-bold d-flex justify-content-center align-items-center gap-2"
                onClick={handleConfirmTransaction}
                disabled={confirming || originalAmount <= 0}
              >
                {confirming ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <>
                    <Tag size={20} />
                    <span>Confirm & Execute Transaction</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
