// Mock data for payment system
// Will be replaced with real Supabase data

export interface Transaction {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  status: "pending" | "processing" | "succeeded" | "failed" | "refunded" | "partially_refunded";
  type: "subscription" | "one_time" | "refund";
  description: string;
  planName?: string;
  billingPeriod?: string;
  paymentMethod: {
    brand: "visa" | "mastercard" | "amex" | "discover" | "unionpay";
    last4: string;
  };
  stripePaymentIntentId?: string;
  refundedAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  failureCode?: string;
  failureMessage?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  metadata?: {
    ip?: string;
    device?: string;
    browser?: string;
  };
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planType: "free" | "premium" | "premium_plus";
  status: "active" | "cancelled" | "expired" | "past_due" | "trialing";
  pricePerMonth: number;
  currency: string;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAt?: string;
  cancelledAt?: string;
}

export interface RevenueStats {
  totalRevenue: number;
  pendingAmount: number;
  failedAmount: number;
  refundedAmount: number;
  totalTransactions: number;
  successRate: number;
  mrr: number; // Monthly Recurring Revenue
  growth: number; // Percentage growth
}

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    user: {
      id: "user_1",
      name: "Sarah Jensen",
      email: "sarah.jensen@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    amount: 299,
    currency: "THB",
    status: "succeeded",
    type: "subscription",
    description: "Premium Monthly Subscription",
    planName: "Premium",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
    },
    stripePaymentIntentId: "pi_1234567890",
    invoiceUrl: "#",
    receiptUrl: "#",
    metadata: {
      ip: "103.1.2.3",
      device: "iPhone 14 Pro",
      browser: "Safari 17",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
  },
  {
    id: "txn_002",
    user: {
      id: "user_2",
      name: "Michael Hansen",
      email: "michael.h@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    amount: 499,
    currency: "THB",
    status: "succeeded",
    type: "subscription",
    description: "Premium Plus Monthly Subscription",
    planName: "Premium Plus",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "mastercard",
      last4: "8888",
    },
    stripePaymentIntentId: "pi_0987654321",
    invoiceUrl: "#",
    receiptUrl: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "txn_003",
    user: {
      id: "user_3",
      name: "Emma Nielsen",
      email: "emma.n@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    amount: 299,
    currency: "THB",
    status: "failed",
    type: "subscription",
    description: "Premium Monthly Subscription",
    planName: "Premium",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "visa",
      last4: "0002",
    },
    failureCode: "card_declined",
    failureMessage: "Your card was declined. Please try another payment method.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "txn_004",
    user: {
      id: "user_4",
      name: "John Petersen",
      email: "john.p@email.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    amount: 299,
    currency: "THB",
    status: "refunded",
    type: "subscription",
    description: "Premium Monthly Subscription",
    planName: "Premium",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
    },
    refundedAmount: 299,
    refundReason: "Customer requested refund - service not as expected",
    refundedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "txn_005",
    user: {
      id: "user_5",
      name: "Laura Andersen",
      email: "laura.a@email.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    amount: 299,
    currency: "THB",
    status: "pending",
    type: "subscription",
    description: "Premium Monthly Subscription",
    planName: "Premium",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "mastercard",
      last4: "5555",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
  },
  {
    id: "txn_006",
    user: {
      id: "user_6",
      name: "Thomas Madsen",
      email: "thomas.m@email.com",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    },
    amount: 499,
    currency: "THB",
    status: "succeeded",
    type: "subscription",
    description: "Premium Plus Monthly Subscription",
    planName: "Premium Plus",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "amex",
      last4: "1111",
    },
    invoiceUrl: "#",
    receiptUrl: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: "txn_007",
    user: {
      id: "user_7",
      name: "Sophie Larsen",
      email: "sophie.l@email.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    },
    amount: 299,
    currency: "THB",
    status: "succeeded",
    type: "subscription",
    description: "Premium Monthly Subscription",
    planName: "Premium",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
    },
    invoiceUrl: "#",
    receiptUrl: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "txn_008",
    user: {
      id: "user_8",
      name: "Oliver Schmidt",
      email: "oliver.s@email.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    amount: 299,
    currency: "THB",
    status: "failed",
    type: "subscription",
    description: "Premium Monthly Subscription",
    planName: "Premium",
    billingPeriod: "Jan 2024",
    paymentMethod: {
      brand: "visa",
      last4: "0341",
    },
    failureCode: "insufficient_funds",
    failureMessage: "Your card has insufficient funds.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
];

// Mock revenue stats
export const mockRevenueStats: RevenueStats = {
  totalRevenue: 145613,
  pendingAmount: 299,
  failedAmount: 598,
  refundedAmount: 299,
  totalTransactions: 1247,
  successRate: 94.2,
  mrr: 146200,
  growth: 23.1,
};

// Mock revenue data for chart (last 30 days)
export const mockRevenueData = [
  { date: "2024-01-01", amount: 3200 },
  { date: "2024-01-02", amount: 4100 },
  { date: "2024-01-03", amount: 3800 },
  { date: "2024-01-04", amount: 4500 },
  { date: "2024-01-05", amount: 5200 },
  { date: "2024-01-06", amount: 6800 },
  { date: "2024-01-07", amount: 7200 },
  { date: "2024-01-08", amount: 4200 },
  { date: "2024-01-09", amount: 5800 },
  { date: "2024-01-10", amount: 7200 },
  { date: "2024-01-11", amount: 6100 },
  { date: "2024-01-12", amount: 8900 },
  { date: "2024-01-13", amount: 12400 },
  { date: "2024-01-14", amount: 9800 },
  { date: "2024-01-15", amount: 5200 },
  { date: "2024-01-16", amount: 6400 },
  { date: "2024-01-17", amount: 7800 },
];

// Mock subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: "sub_001",
    userId: "user_1",
    userName: "Sarah Jensen",
    userEmail: "sarah.jensen@email.com",
    planType: "premium",
    status: "active",
    pricePerMonth: 299,
    currency: "THB",
    startDate: "2023-12-01T10:00:00Z",
    currentPeriodStart: "2024-01-01T10:00:00Z",
    currentPeriodEnd: "2024-02-01T10:00:00Z",
  },
  {
    id: "sub_002",
    userId: "user_2",
    userName: "Michael Hansen",
    userEmail: "michael.h@email.com",
    planType: "premium_plus",
    status: "active",
    pricePerMonth: 499,
    currency: "THB",
    startDate: "2023-11-15T14:30:00Z",
    currentPeriodStart: "2024-01-15T14:30:00Z",
    currentPeriodEnd: "2024-02-15T14:30:00Z",
  },
];
