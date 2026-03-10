import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { analytics, posts, campaigns as campaignsApi } from "@/lib/api";
import { Link } from "react-router-dom";
import {
  BarChart3, TrendingUp, Users, FileText, Plus, ArrowUpRight, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [campaignList, setCampaignList] = useState([]);

  useEffect(() => {
    const brandId = user?.brand?.id;
    if (!brandId) return;
    analytics.overview(brandId).then((r) => setOverview(r.data)).catch(() => {});
    posts.list({ brand_id: brandId }).then((r) => setRecentPosts(r.data?.slice(0, 5) || [])).catch(() => {});
    campaignsApi.list(brandId).then((r) => setCampaignList(r.data?.slice(0, 3) || [])).catch(() => {});
  }, [user]);

  const stats = [
    { label: "Total Posts", value: overview?.total_posts || 0, icon: FileText, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Engagement Rate", value: `${overview?.engagement_rate || 0}%`, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Followers", value: overview?.total_followers?.toLocaleString() || "0", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Reach Growth", value: `+${overview?.reach_growth || 0}%`, icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-[Outfit]">
            Welcome back, <span className="text-orange-400">{user?.name?.split(" ")[0] || "there"}</span>
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Here's your social media performance overview</p>
        </div>
        <Link to="/content/create">
          <Button data-testid="create-content-btn" className="bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all">
            <Plus className="w-4 h-4 mr-2" /> Create Content
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="card-grid-border p-5 animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-2xl font-bold font-[Outfit] tracking-tight text-white">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="card-grid-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300 font-[Outfit]">Recent Posts</h3>
            <Link to="/content/create" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">View all</Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">No posts yet</p>
              <Link to="/content/create">
                <Button variant="outline" size="sm" className="mt-3 text-xs border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-md bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors">
                  <div className="w-2 h-2 rounded-full" style={{ background: p.status === "published" ? "#10b981" : p.status === "scheduled" ? "#3b82f6" : "#71717a" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{p.caption || "Untitled post"}</p>
                    <p className="text-xs text-zinc-500">{p.platforms?.join(", ") || "No platform"} · {p.post_type}</p>
                  </div>
                  <span className="text-xs text-zinc-600 capitalize">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campaigns */}
        <div className="card-grid-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300 font-[Outfit]">Active Campaigns</h3>
            <Link to="/campaigns" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">View all</Link>
          </div>
          {campaignList.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">No campaigns yet</p>
              <Link to="/campaigns">
                <Button variant="outline" size="sm" className="mt-3 text-xs border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Create a campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {campaignList.map((c) => (
                <Link key={c.id} to={`/campaigns/${c.id}`} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-md bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors">
                    <Megaphone className="w-4 h-4 text-orange-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate">{c.name}</p>
                      <p className="text-xs text-zinc-500">{c.post_count || 0} posts · {c.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
