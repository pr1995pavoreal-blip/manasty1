import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Sparkles, TrendingUp, Compass, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AIInsightsWidget: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAI();
  }, [user]);

  const fetchAI = async () => {
    try {
      setLoading(true);
      if (user?.roles.includes('CUSTOMER')) {
        const res = await api.get('/ai/recommendations');
        setRecommendations(res.data.data);
      } else if (user?.merchantId) {
        const res = await api.get(`/ai/merchant-insights/${user.merchantId}`);
        setInsights(res.data.data);
      }
    } catch (error) {
      console.error('AI Widget load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4 bg-gradient bg-dark text-white">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Sparkles className="text-warning animate-pulse" size={24} />
          <h5 className="fw-bold mb-0 text-light">AI Intelligence Layer</h5>
        </div>

        {user?.roles.includes('CUSTOMER') && recommendations.length > 0 && (
          <div>
            <p className="text-muted small mb-2">Personalized Deals & Partner Store Recommendations for You:</p>
            <div className="row g-3">
              {recommendations.slice(0, 2).map((rec: any, idx: number) => (
                <div key={idx} className="col-md-6">
                  <div className="bg-secondary bg-opacity-25 border border-secondary p-3 rounded-3">
                    <span className="badge bg-warning text-dark mb-1">
                      {(rec.confidenceScore * 100).toFixed(0)}% Match Score
                    </span>
                    <h6 className="fw-bold text-warning mb-1">{rec.titleAr || rec.title}</h6>
                    <p className="extra-small text-light mb-1">{rec.description}</p>
                    <div className="extra-small text-info">💡 {rec.reasonAr || rec.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user?.merchantId && insights && (
          <div>
            <p className="text-muted small mb-2">Store Sales Intelligence & Smart Campaign Strategy:</p>
            <div className="row g-3">
              {insights.insights?.map((ins: any, idx: number) => (
                <div key={idx} className="col-md-6">
                  <div className="bg-secondary bg-opacity-25 border border-secondary p-3 rounded-3">
                    <h6 className="fw-bold text-info mb-1">{ins.titleAr || ins.title}</h6>
                    <p className="small text-light mb-0">{ins.suggestionAr || ins.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
