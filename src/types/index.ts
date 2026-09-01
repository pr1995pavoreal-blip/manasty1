export type RoleName = 'SUPER_ADMIN' | 'ADMIN' | 'MERCHANT_OWNER' | 'MERCHANT_EMPLOYEE' | 'CUSTOMER';
export type CardStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'FAILED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  roles: RoleName[];
  merchantId?: string;
  employeeId?: string;
  customerId?: string;
  isActive?: boolean;
}

export interface MembershipType {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  badgeColor: string;
  discountPercent: number;
  minSpend: number;
  perks?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface Customer {
  id: string;
  userId: string;
  nationalId?: string;
  city?: string;
  user: User;
  membershipCard?: MembershipCard;
}

export interface MembershipCard {
  id: string;
  cardNumber: string;
  verificationToken: string;
  customerId: string;
  membershipTypeId: string;
  status: CardStatus;
  issuedAt: string;
  expiresAt: string;
  membershipType: MembershipType;
  customer?: Customer;
}

export interface MerchantBranch {
  id: string;
  merchantId: string;
  name: string;
  nameAr?: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  googleMapsUrl?: string;
  distanceKm?: number | null;
  merchant?: Merchant & {
    offers?: Offer[];
    discounts?: DiscountRule[];
    products?: (Product & { category?: Category })[];
  };
}

export interface Product {
  id: string;
  merchantId: string;
  categoryId?: string;
  name: string;
  nameAr?: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  merchantCount?: number;
}

export interface Merchant {
  id: string;
  ownerId: string;
  businessName: string;
  businessNameAr?: string;
  logoUrl?: string;
  commercialReg?: string;
  categoryName?: string;
  businessCategoryId?: string;
  businessCategory?: BusinessCategory;
  description?: string;
  isActive: boolean;
  status?: 'APPROVED' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  owner?: { id: string; email: string; fullName: string; phone?: string };
  branches?: MerchantBranch[];
  products?: Product[];
  categories?: Category[];
}

export interface Category {
  id: string;
  merchantId: string;
  name: string;
  nameAr?: string;
  icon?: string;
  isActive: boolean;
}

export interface DiscountRule {
  id: string;
  merchantId: string;
  branchId?: string;
  title: string;
  titleAr?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  branch?: MerchantBranch;
  membershipType?: MembershipType;
}

export interface Offer {
  id: string;
  merchantId: string;
  branchId?: string;
  categoryId?: string;
  productId?: string;
  discountRuleId?: string;
  title: string;
  titleAr?: string;
  description: string;
  imageUrl?: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  merchant?: Merchant;
  category?: { name: string; nameAr?: string };
  product?: { name: string; nameAr?: string };
  discountRule?: DiscountRule;
  offerProducts?: { product: Product }[];
}

export interface Transaction {
  id: string;
  transactionNo: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: TransactionStatus;
  createdAt: string;
  customer?: { user: { fullName: string; email: string } };
  merchant?: { businessName: string };
  card?: { cardNumber: string; membershipType: MembershipType };
  discountRule?: DiscountRule;
}
