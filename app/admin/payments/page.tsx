"use client";
// Database fix: createdAt -> created_at, refundedAt -> refunded_at
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RotateCcw,
  FileText,
  User,
} from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "succeeded" | "failed" | "refunded" | "partially_refunded";
  type: "subscription" | "one_time" | "refund";
  description: string;
  plan_name?: string;
  billing_period?: string;
  failure_code?: string;
  failure_message?: string;
  refunded_amount?: number;
  refund_reason?: string;
  refunded_at?: string;
  receipt_url?: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    profile_image?: string;
  };
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    checkAdminAccess();
    loadTransactions();
  }, []);

  const checkAdminAccess = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      router.push("/admin/login");
    }
  };

  const loadTransactions = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:user_id(id, name, email, profile_image)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
      } else {
        setTransactions((data || []) as Transaction[]);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // Search filter
      const matchesSearch =
        txn.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || txn.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  // Calculate stats from real transactions
  const stats = useMemo(() => {
    const succeededTxns = transactions.filter((t) => t.status === "succeeded");
    const totalRevenue = succeededTxns.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = transactions
      .filter((t) => t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);
    const failedAmount = transactions
      .filter((t) => t.status === "failed")
      .reduce((sum, t) => sum + t.amount, 0);
    const refundedAmount = transactions
      .filter((t) => t.status === "refunded")
      .reduce((sum, t) => sum + (t.refunded_amount || t.amount), 0);
    const successRate = transactions.length > 0 
      ? (succeededTxns.length / transactions.length) * 100 
      : 0;

    return {
      totalRevenue,
      pendingAmount,
      failedAmount,
      refundedAmount,
      totalTransactions: transactions.length,
      successRate: Math.round(successRate * 10) / 10,
      mrr: 0, // Calculate from subscriptions
      growth: 0, // Calculate from historical data
    };
  }, [transactions]);

  const getStatusBadge = (status: Transaction["status"]) => {
    const styles = {
      succeeded: "bg-green-500/10 text-green-500 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      partially_refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };

    const icons = {
      succeeded: <CheckCircle className="h-3 w-3" />,
      pending: <Clock className="h-3 w-3" />,
      processing: <RefreshCw className="h-3 w-3 animate-spin" />,
      failed: <XCircle className="h-3 w-3" />,
      refunded: <RotateCcw className="h-3 w-3" />,
      partially_refunded: <RotateCcw className="h-3 w-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {status.replace("_", " ")}
      </span>
    );
  };

  const getCardIcon = (brand: string) => {
    const colors = {
      visa: "text-blue-500",
      mastercard: "text-orange-500",
      amex: "text-green-500",
      discover: "text-purple-500",
      unionpay: "text-red-500",
    };
    return colors[brand as keyof typeof colors] || "text-gray-400";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("da-DK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-red-500"></div>
          <p className="text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Betalinger</h1>
          <p className="mt-2 text-gray-400">
            Håndter alle transaktioner og betalinger
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600">
          <Download className="h-4 w-4" />
          Eksporter Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Total Omsætning</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {formatAmount(stats.totalRevenue, "฿")}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">+{stats.growth}%</span>
                <span className="text-gray-500">vs sidste måned</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Afventende</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {formatAmount(stats.pendingAmount, "฿")}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {transactions.filter((t) => t.status === "pending").length} betalinger
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Failed */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Fejlede</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {formatAmount(stats.failedAmount, "฿")}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {transactions.filter((t) => t.status === "failed").length} betalinger
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Refunds */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Refunderinger</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {formatAmount(stats.refundedAmount, "฿")}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {transactions.filter((t) => t.status === "refunded").length} refunds
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Omsætning Trend</h2>
              <p className="text-sm text-gray-400">Sidste 30 dage</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white">
                7D
              </button>
              <button className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white">
                30D
              </button>
              <button className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-white">
                90D
              </button>
            </div>
          </div>
          {transactions.length > 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-gray-400">
                <TrendingUp className="mx-auto h-12 w-12 mb-2" />
                <p>Revenue chart will be displayed here</p>
                <p className="text-sm">Based on transaction history</p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-gray-400">
                <AlertCircle className="mx-auto h-12 w-12 mb-2" />
                <p>No transaction data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Success Rate */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Success Rate</h2>
          <div className="flex items-center justify-center">
            <div className="relative h-40 w-40">
              {/* Donut Chart Placeholder */}
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray={`${stats.successRate * 2.51} ${(100 - stats.successRate) * 2.51}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white">{stats.successRate}%</div>
                <div className="text-xs text-gray-400">Success</div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400">Succeeded</span>
              </div>
              <span className="font-medium text-white">{stats.successRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-700"></div>
                <span className="text-gray-400">Failed</span>
              </div>
              <span className="font-medium text-white">
                {(100 - stats.successRate).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Transaktioner</h2>
          <p className="text-sm text-gray-400">
            Viser {filteredTransactions.length} af {transactions.length} transaktioner
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Søg bruger, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-black py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <option value="all">Alle Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <option value="7">Sidste 7 dage</option>
            <option value="30">Sidste 30 dage</option>
            <option value="90">Sidste 90 dage</option>
            <option value="365">Sidste år</option>
          </select>

          {/* Export */}
          <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
            <Download className="h-4 w-4" />
            Eksporter
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="pb-3 font-medium">Bruger</th>
                <th className="pb-3 font-medium">Dato & Tid</th>
                <th className="pb-3 font-medium">Beløb</th>
                <th className="pb-3 font-medium">Betalingsmetode</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-gray-800 transition hover:bg-gray-900/50"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {txn.user?.profile_image ? (
                        <img
                          src={txn.user.profile_image}
                          alt={txn.user?.name || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-white">
                          {txn.user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{txn.user?.name || "Unknown"}</div>
                        <div className="text-xs text-gray-400">{txn.user?.email || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-white">{formatDate(txn.created_at)}</div>
                    <div className="text-xs text-gray-400">ID: {txn.id.slice(0, 8)}...</div>
                  </td>
                  <td className="py-4">
                    <div className="font-medium text-white">
                      {formatAmount(txn.amount, txn.currency)}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {txn.type === "subscription" ? "Subscription" : "One-time"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">{getStatusBadge(txn.status)}</td>
                  <td className="py-4">
                    <div className="text-sm text-white">{txn.plan_name || "N/A"}</div>
                    {txn.billing_period && (
                      <div className="text-xs text-gray-400">{txn.billing_period}</div>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setSelectedTransaction(txn)}
                      className="inline-flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                      <Eye className="h-4 w-4" />
                      Detaljer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-600" />
              <p className="mt-4 text-gray-400">Ingen transaktioner fundet</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Transaction Detaljer</h2>
                <p className="text-sm text-gray-400">ID: {selectedTransaction.id}</p>
              </div>
              {getStatusBadge(selectedTransaction.status)}
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <User className="h-4 w-4" />
                  Kunde Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-gray-400">Navn</div>
                    <div className="mt-1 font-medium text-white">
                      {selectedTransaction.user?.name || "Ukendt"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="mt-1 font-medium text-white">
                      {selectedTransaction.user?.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <DollarSign className="h-4 w-4" />
                  Betalings Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-gray-400">Beløb</div>
                    <div className="mt-1 text-lg font-bold text-white">
                      {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Dato & Tid</div>
                    <div className="mt-1 font-medium text-white">
                      {formatDate(selectedTransaction.created_at)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Plan</div>
                    <div className="mt-1 font-medium text-white">
                      {selectedTransaction.plan_name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Betalingsmetode</div>
                    <div className="mt-1 flex items-center gap-2 font-medium text-white">
                      <CreditCard className="h-4 w-4" />
                      Stripe
                    </div>
                  </div>
                </div>
              </div>

              {/* Failure Info (if failed) */}
              {selectedTransaction.status === "failed" && selectedTransaction.failure_message && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    Fejl Information
                  </h3>
                  <p className="text-sm text-red-400">{selectedTransaction.failure_message}</p>
                  {selectedTransaction.failure_code && (
                    <p className="mt-1 text-xs text-red-400/60">
                      Code: {selectedTransaction.failure_code}
                    </p>
                  )}
                </div>
              )}

              {/* Refund Info (if refunded) */}
              {selectedTransaction.status === "refunded" && (
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <RotateCcw className="h-4 w-4" />
                    Refund Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-400">Refunderet Beløb</div>
                      <div className="mt-1 font-medium text-white">
                        {formatAmount(
                          selectedTransaction.refunded_amount || 0,
                          selectedTransaction.currency
                        )}
                      </div>
                    </div>
                    {selectedTransaction.refund_reason && (
                      <div>
                        <div className="text-xs text-gray-400">Årsag</div>
                        <div className="mt-1 text-sm text-white">
                          {selectedTransaction.refund_reason}
                        </div>
                      </div>
                    )}
                    {selectedTransaction.refunded_at && (
                      <div>
                        <div className="text-xs text-gray-400">Refunderet Dato</div>
                        <div className="mt-1 text-sm text-white">
                          {formatDate(selectedTransaction.refunded_at)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedTransaction.status === "succeeded" && (
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600">
                    <RotateCcw className="h-4 w-4" />
                    Issue Refund
                  </button>
                )}
                {selectedTransaction.status === "failed" && (
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600">
                    <RefreshCw className="h-4 w-4" />
                    Retry Payment
                  </button>
                )}
                {selectedTransaction.receipt_url && (
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-800 bg-black py-3 font-medium text-white transition hover:bg-gray-900">
                    <FileText className="h-4 w-4" />
                    Download Receipt
                  </button>
                )}
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-xl border border-gray-800 bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-900"
                >
                  Luk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
