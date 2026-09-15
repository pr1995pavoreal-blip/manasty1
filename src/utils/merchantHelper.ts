import { api } from '../services/api';
import { User, Merchant } from '../types';

export async function fetchUserMerchantStore(
  user: User | null,
  urlMerchantId?: string | null
): Promise<Merchant | null> {
  // If specific urlMerchantId is provided (e.g. by admin preview), fetch that directly
  if (urlMerchantId) {
    try {
      const res = await api.get(`/merchants/${urlMerchantId}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.error('Failed to fetch merchant by urlMerchantId:', e);
    }
  }

  // 1. Try my-store endpoint first
  try {
    const res = await api.get('/merchants/my-store');
    if (res.data?.data) return res.data.data;
  } catch (e) {
    // Continue to fallback lookup
  }

  // 2. If user has merchantId directly on user object
  if (user?.merchantId) {
    try {
      const res = await api.get(`/merchants/${user.merchantId}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      // Continue
    }
  }

  // 3. Strict lookup: Fetch merchants and filter strictly by user.id or user.email
  try {
    const resList = await api.get('/merchants');
    const merchants: Merchant[] = resList.data?.data?.merchants || resList.data?.data || [];
    if (Array.isArray(merchants)) {
      const matched = merchants.find(
        (m: any) =>
          (user?.id && m.ownerId === user.id) ||
          (user?.id && m.owner?.id === user.id) ||
          (user?.email && m.owner?.email === user.email)
      );
      if (matched) {
        // Fetch full merchant details with products, branches, categories
        const resDetail = await api.get(`/merchants/${matched.id}`);
        if (resDetail.data?.data) return resDetail.data.data;
        return matched;
      }
    }
  } catch (e) {
    console.error('Failed to fetch merchants list strict lookup:', e);
  }

  return null;
}
