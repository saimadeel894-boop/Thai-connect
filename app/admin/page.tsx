"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  MessageSquare,
  Heart,
  AlertTriangle,
  DollarSign,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
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

  const loadDashboardData = async () => {
    try {
      const supabase = createClient();

      // Count total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Count premium users (from subscriptions)
      const { count: premiumUsers } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .in("plan_type", ["premium", "premium_plus"]);

      // Calculate total revenue from transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("status", "succeeded");

      const totalRevenue = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Calculate MRR from active subscriptions
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("price_per_month")
        .eq("status", "active");

      const mrr = subscriptions?.reduce((sum, s) => sum + s.price_per_month, 0) || 0;

      // Count messages
      const { count: totalMessages } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

      setDashboardStats({
        totalUsers: totalUsers || 0,
        premiumUsers: premiumUsers || 0,
        freeUsers: (totalUsers || 0) - (premiumUsers || 0),
        totalRevenue,
        mrr,
        totalMessages: totalMessages || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setDashboardStats({
        totalUsers: 0,
        premiumUsers: 0,
        freeUsers: 0,
        totalRevenue: 0,
        mrr: 0,
        totalMessages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Live stats from database
  const stats = dashboardStats ? [
    {
      name: "Total Brugere",
      value: dashboardStats.totalUsers.toLocaleString(),
      change: "N/A",
      trend: "up",
      icon: Users,
      color: "bg-gray-800",
    },
    {
      name: "Premium Brugere",
      value: dashboardStats.premiumUsers.toLocaleString(),
      change: "N/A",
      trend: "up",
      icon: UserCheck,
      color: "bg-gray-800",
      subtext: dashboardStats.totalUsers > 0 
        ? `${((dashboardStats.premiumUsers / dashboardStats.totalUsers) * 100).toFixed(1)}% conversion`
        : "0% conversion",
    },
    {
      name: "Gratis Brugere",
      value: dashboardStats.freeUsers.toLocaleString(),
      change: "N/A",
      trend: "up",
      icon: Users,
      color: "bg-gray-800",
      subtext: dashboardStats.totalUsers > 0
        ? `${((dashboardStats.freeUsers / dashboardStats.totalUsers) * 100).toFixed(1)}% af total`
        : "0% af total",
    },
    {
      name: "Omsætning (Total)",
      value: `${dashboardStats.totalRevenue.toLocaleString()} ฿`,
      change: "N/A",
      trend: "up",
      icon: DollarSign,
      color: "bg-gray-800",
      subtext: `MRR: ${dashboardStats.mrr.toLocaleString()} ฿`,
    },
    {
      name: "Total Beskeder",
      value: dashboardStats.totalMessages.toLocaleString(),
      change: "N/A",
      trend: "up",
      icon: MessageSquare,
      color: "bg-gray-800",
      subtext: "Platform aktivitet",
    },
  ] : [];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: "signup",
      message: "Ny bruger tilmeldt: Sarah Jensen",
      time: "2 min siden",
      icon: Users,
      color: "text-white",
    },
    {
      id: 2,
      type: "payment",
      message: "Betaling modtaget: 299 ฿ (Premium)",
      time: "8 min siden",
      icon: DollarSign,
      color: "text-white",
    },
    {
      id: 3,
      type: "match",
      message: "Nyt match oprettet mellem John & Emma",
      time: "15 min siden",
      icon: Heart,
      color: "text-white",
    },
    {
      id: 4,
      type: "support",
      message: "Ny support sag: Login problem",
      time: "23 min siden",
      icon: AlertTriangle,
      color: "text-white",
    },
    {
      id: 5,
      type: "approval",
      message: "Profil godkendt: Michael Hansen",
      time: "1 time siden",
      icon: CheckCircle,
      color: "text-white",
    },
  ];

  // Mock system alerts
  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "7 profiler afventer godkendelse",
      action: "Gennemse nu",
      icon: Clock,
      color: "bg-gray-800 border-gray-700 text-white",
    },
    {
      id: 2,
      type: "info",
      message: "Server responstid: 234ms (Normal)",
      icon: CheckCircle,
      color: "bg-gray-800 border-gray-700 text-white",
    },
    {
      id: 3,
      type: "error",
      message: "3 betalinger fejlede i dag",
      action: "Se detaljer",
      icon: XCircle,
      color: "bg-gray-800 border-gray-700 text-white",
    },
  ];

  // Mock revenue data for chart (last 7 days)
  const revenueData = [
    { day: "Man", amount: 4200 },
    { day: "Tir", amount: 5800 },
    { day: "Ons", amount: 7200 },
    { day: "Tor", amount: 6100 },
    { day: "Fre", amount: 8900 },
    { day: "Lør", amount: 12400 },
    { day: "Søn", amount: 9800 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.amount));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-red-500"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUpRight className="h-4 w-4" />;
    if (trend === "down") return <ArrowDownRight className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Welcome to ThaiConnect Admin Panel
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Sidste opdatering</div>
          <div className="text-white">
            {new Date().toLocaleString("da-DK")}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${getTrendColor(stat.trend)}`}
                >
                  {getTrendIcon(stat.trend)}
                  <span className="font-medium">{stat.change}</span>
                  <span className="text-gray-500">vs sidste uge</span>
                </div>
                {stat.subtext && (
                  <p className="mt-1 text-xs text-gray-500">{stat.subtext}</p>
                )}
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Omsætning (Sidste 7 Dage)
              </h2>
              <p className="text-sm text-gray-400">
                Total: {revenueData.reduce((a, b) => a + b.amount, 0).toLocaleString()} ฿
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="flex h-48 items-end justify-between gap-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full flex-1 relative">
                  <div
                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-red-500 to-red-400 transition-all hover:from-red-600 hover:to-red-500"
                    style={{ height: `${(data.amount / maxRevenue) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">{data.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-4 text-xl font-bold text-white">
            Seneste Aktivitet
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg border border-gray-800 bg-black/30 p-3"
              >
                <div className={`${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Alerts */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              System Advarsler
            </h2>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${alert.color}`}
                >
                  <div className="flex items-center gap-3">
                    <alert.icon className="h-5 w-5" />
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  {alert.action && (
                    <button className="rounded-lg bg-white/10 px-3 py-1 text-sm font-medium transition hover:bg-white/20">
                      {alert.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
          <div className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg border border-gray-800 bg-black/30 p-4 text-left transition hover:border-red-500 hover:bg-red-500/10">
              <CheckCircle className="h-5 w-5 text-white" />
              <div>
                <div className="font-medium text-white">Godkend Profiler</div>
                <div className="text-xs text-gray-400">7 afventer</div>
              </div>
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg border border-gray-800 bg-black/30 p-4 text-left transition hover:border-red-500 hover:bg-red-500/10">
              <MessageSquare className="h-5 w-5 text-white" />
              <div>
                <div className="font-medium text-white">Support Sager</div>
                <div className="text-xs text-gray-400">12 åbne</div>
              </div>
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg border border-gray-800 bg-black/30 p-4 text-left transition hover:border-red-500 hover:bg-red-500/10">
              <DollarSign className="h-5 w-5 text-white" />
              <div>
                <div className="font-medium text-white">Se Betalinger</div>
                <div className="text-xs text-gray-400">3 fejlede</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

