import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { api } from "../../api";
import "./CommunityDashboard.css";

export default function CommunityDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    totalMembers: 0,
    currentUserRank: null,
    leaderboard: [],
  });

  useEffect(() => {
    let mounted = true;

    const fetchLeaderboard = async () => {
      try {
        const { data: result } = await api.get("/users/leaderboard");
        if (!mounted) return;
        setData({
          totalMembers: result?.totalMembers || 0,
          currentUserRank: result?.currentUserRank ?? null,
          leaderboard: result?.leaderboard || [],
        });
      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.msg ||
            "Failed to load community leaderboard",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      mounted = false;
    };
  }, []);

  const currentRank = data.currentUserRank;
  const totalMembers = data.totalMembers;
  const currentMember = data.leaderboard.find(
    (member) => member.rank === currentRank,
  );
  const nextBetterMember =
    currentRank && currentRank > 1
      ? data.leaderboard.find((member) => member.rank === currentRank - 1)
      : null;

  const usageGapKg =
    currentMember && nextBetterMember
      ? Number(
          (
            (currentMember.monthlyUsageKg ?? currentMember.totalUsageKg ?? 0) -
            (nextBetterMember.monthlyUsageKg ??
              nextBetterMember.totalUsageKg ??
              0)
          ).toFixed(2),
        )
      : null;

  const rankingSuggestions = (() => {
    if (!currentRank || !totalMembers) {
      return [
        "Submit your first monthly calculation to get ranked in the community leaderboard.",
        "Start with small wins: reduce electricity and transport first for quick impact.",
        "Track one month consistently, then compare rank movement next month.",
      ];
    }

    if (currentRank === 1) {
      return [
        "Great job, you are #1. Focus on consistency to hold your position.",
        "Submit monthly updates on time so your leaderboard lead stays visible.",
        "Share your best reduction habit with others to strengthen community results.",
      ];
    }

    if (currentRank <= Math.max(3, Math.ceil(totalMembers * 0.3))) {
      return [
        "You are in the top group. Keep reducing your highest category each month.",
        usageGapKg
          ? `Reduce about ${usageGapKg} kg CO2 to move ahead of rank #${currentRank - 1}.`
          : "You are close to the next rank; keep your monthly reductions steady.",
        "Prioritize no-flight weeks and lower standby electricity to gain quick points.",
      ];
    }

    if (currentRank <= Math.ceil(totalMembers * 0.7)) {
      return [
        "You are in the middle zone. Focus on one category at a time for consistent rank gains.",
        usageGapKg
          ? `Target at least ${usageGapKg} kg CO2 reduction to pass rank #${currentRank - 1}.`
          : "Aim to beat the next rank with one focused monthly reduction goal.",
        "Use your calculator AI plan and submit updated values monthly to climb faster.",
      ];
    }

    return [
      "You can climb quickly by cutting the biggest contributor in your footprint first.",
      usageGapKg
        ? `A reduction of around ${usageGapKg} kg CO2 can move you above rank #${currentRank - 1}.`
        : "Set a realistic target this month and compare rank change next cycle.",
      "Start with low-effort actions: fewer short car trips, efficient lighting, and reduced heating/cooling waste.",
    ];
  })();

  return (
    <>
      <Header />
      <main className="community-page">
        <div className="container community-content">
          <p className="community-kicker">COMMUNITY</p>
          <h1>Community Dashboard</h1>
          <p className="community-subtitle">
            See how your carbon impact compares with all members.
          </p>

          {loading && <p>Loading leaderboard...</p>}
          {error && <p className="community-error">{error}</p>}

          {!loading && !error && (
            <>
              <section className="community-rank-card">
                <h2>Your Current Rank</h2>
                <p className="community-rank-value">
                  {data.currentUserRank
                    ? `#${data.currentUserRank}`
                    : "Not ranked yet"}
                </p>
                <p className="community-rank-note">
                  Total members in leaderboard: {data.totalMembers}
                </p>
              </section>

              <section className="community-suggestions">
                <h2>Suggestions for Your Rank</h2>
                <ul>
                  {rankingSuggestions.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </section>

              <section className="community-table-wrap">
                <h2>Member Rankings</h2>
                <div className="community-table-scroll">
                  <table className="community-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Member</th>
                        <th>Username</th>
                        <th>Monthly Usage (kg CO2)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leaderboard.length ? (
                        data.leaderboard.map((member) => (
                          <tr key={member.userId}>
                            <td>#{member.rank}</td>
                            <td>{member.name}</td>
                            <td>{member.username || "-"}</td>
                            <td>
                              {Number(
                                member.monthlyUsageKg ??
                                  member.totalUsageKg ??
                                  0,
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No members available yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
