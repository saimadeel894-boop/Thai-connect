"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CreditCard,
  Trash2,
  Lock,
  Plus,
  Crown,
  Check,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  Eye,
  AlertCircle,
} from "lucide-react";

// Tabs
type TabType = "subscription" | "history" | "methods";

// Interfaces
interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  paymentMethod: {
    brand: string;
    last4: string;
  };
  invoiceUrl?: string;
}

interface Subscription {
  planType: "free" | "premium" | "premium_plus";
  status: "active" | "cancelled" | "expired";
  pricePerMonth: number;
  currentPeriodEnd: string;
  cancelAt?: string;
}

// Mock data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "25",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: "03",
    expiryYear: "26",
    isDefault: false,
  },
];

const mockSubscription: Subscription = {
  planType: "premium",
  status: "active",
  pricePerMonth: 299,
  currentPeriodEnd: "2024-02-17T10:00:00Z",
};

const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    date: "2024-01-17T10:00:00Z",
    description: "Premium Monthly Subscription",
    amount: 299,
    currency: "THB",
    status: "succeeded",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
    },
    invoiceUrl: "#",
  },
  {
    id: "txn_002",
    date: "2023-12-17T10:00:00Z",
    description: "Premium Monthly Subscription",
    amount: 299,
    currency: "THB",
    status: "succeeded",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
    },
    invoiceUrl: "#",
  },
  {
    id: "txn_003",
    date: "2023-11-17T10:00:00Z",
    description: "Premium Monthly Subscription",
    amount: 299,
    currency: "THB",
    status: "succeeded",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
    },
    invoiceUrl: "#",
  },
];

// Plan definitions
const plans = [
  {
    id: "premium",
    name: "Premium",
    price: 299,
    features: [
      "Unlimited matches",
      "See who likes you",
      "Advanced filters",
      "Read receipts",
      "5 Super Likes per day",
    ],
  },
  {
    id: "premium_plus",
    name: "Premium Plus",
    price: 499,
    features: [
      "All Premium features",
      "Priority profile visibility",
      "Unlimited Super Likes",
      "Monthly profile boost",
      "See who viewed your profile",
    ],
    popular: true,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("subscription");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
    }
  };

  const handleAddPayment = () => {
    alert("Add payment method - Stripe integration coming soon!");
  };

  const getCardIcon = (type: string) => {
    const colors = {
      visa: "text-red-500",
      mastercard: "text-orange-500",
      amex: "text-green-500",
    };
    return colors[type as keyof typeof colors] || "text-gray-400";
  };

  const getCardName = (type: string) => {
    return type.toUpperCase();
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const styles = {
      succeeded: "bg-green-500/10 text-green-500 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const getPlanName = (planType: string) => {
    const names = {
      free: "Free",
      premium: "Premium",
      premium_plus: "Premium Plus",
    };
    return names[planType as keyof typeof names] || planType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("da-DK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount} ${currency}`;
  };

  const totalSpent = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Payment & Billing</h1>
              <p className="text-sm text-gray-400">
                Manage your subscription and payment methods
              </p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("subscription")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "subscription"
                ? "border-b-2 border-red-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "history"
                ? "border-b-2 border-red-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab("methods")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "methods"
                ? "border-b-2 border-red-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Payment Methods
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-xl font-bold text-white">
                      {getPlanName(subscription.planType)}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        subscription.status === "active"
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {subscription.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {subscription.pricePerMonth} ฿
                    <span className="text-lg font-normal text-gray-400">/month</span>
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {subscription.status === "active" ? (
                      <span>
                        Renews on {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    ) : (
                      <span>
                        Expires on {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {subscription.status === "active" ? (
                    <>
                      <button className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900">
                        Change Plan
                      </button>
                      <button className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Available Plans */}
            {subscription.planType === "free" && (
              <div>
                <h3 className="mb-4 text-lg font-bold text-white">Upgrade Your Plan</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`rounded-2xl border p-6 ${
                        plan.popular
                          ? "border-red-500 bg-red-500/5"
                          : "border-gray-800 bg-gray-900"
                      }`}
                    >
                      {plan.popular && (
                        <div className="mb-2 inline-flex items-center rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                          MOST POPULAR
                        </div>
                      )}
                      <h3 className="mb-2 text-xl font-bold text-white">{plan.name}</h3>
                      <p className="mb-4 text-3xl font-bold text-white">
                        {plan.price} ฿
                        <span className="text-lg font-normal text-gray-400">/month</span>
                      </p>
                      <ul className="mb-6 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button className="w-full rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600">
                        Upgrade to {plan.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-2 text-sm text-gray-400">Total Spent</div>
                <div className="text-2xl font-bold text-white">
                  {formatAmount(totalSpent, "฿")}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-2 text-sm text-gray-400">Transactions</div>
                <div className="text-2xl font-bold text-white">{transactions.length}</div>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-2 text-sm text-gray-400">Next Payment</div>
                <div className="text-lg font-bold text-white">
                  {formatDate(subscription.currentPeriodEnd)}
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between rounded-xl border border-gray-800 bg-black/30 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{txn.description}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                          <span>{formatDate(txn.date)}</span>
                          <span>•</span>
                          <span>
                            {txn.paymentMethod.brand.toUpperCase()} ••••{" "}
                            {txn.paymentMethod.last4}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-white">
                          {formatAmount(txn.amount, txn.currency)}
                        </div>
                        <div className="mt-1">{getStatusBadge(txn.status)}</div>
                      </div>
                      <button
                        onClick={() => setSelectedTransaction(txn)}
                        className="rounded-lg bg-gray-800 p-2 text-white transition hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-600" />
                  <p className="mt-4 text-gray-400">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "methods" && (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${getCardIcon(method.type)}`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {getCardName(method.type)} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-400">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Payment Method */}
          <button
            onClick={handleAddPayment}
            className="w-full rounded-2xl border-2 border-dashed border-gray-800 bg-gray-900/50 p-6 text-center transition hover:border-gray-700 hover:bg-gray-900"
          >
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Payment Method</span>
            </div>
          </button>

          {/* Security Notice */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <p className="text-sm text-gray-400">
                  Your payment information is encrypted and secure. We never store your full
                  card details.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-950 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Receipt</h2>
                <p className="text-sm text-gray-400">Transaction ID: {selectedTransaction.id}</p>
              </div>
              {getStatusBadge(selectedTransaction.status)}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                <div className="mb-2 text-xs text-gray-400">Description</div>
                <div className="font-medium text-white">{selectedTransaction.description}</div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <div className="mb-2 text-xs text-gray-400">Amount</div>
                  <div className="text-lg font-bold text-white">
                    {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <div className="mb-2 text-xs text-gray-400">Date</div>
                  <div className="font-medium text-white">
                    {formatDate(selectedTransaction.date)}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                <div className="mb-2 text-xs text-gray-400">Payment Method</div>
                <div className="flex items-center gap-2 font-medium text-white">
                  <CreditCard className="h-4 w-4" />
                  {selectedTransaction.paymentMethod.brand.toUpperCase()} ••••{" "}
                  {selectedTransaction.paymentMethod.last4}
                </div>
              </div>

              <div className="flex gap-3">
                {selectedTransaction.invoiceUrl && (
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600">
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </button>
                )}
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-xl border border-gray-800 bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
