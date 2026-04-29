import { useEffect } from "react";
import { usePasswords } from "../hooks/usePasswords";
import {
  getPasswordStrength,
  STRENGTH_LEVELS,
  categoriseByStrength,
} from "../utils/passworStrength";

/* ── Small inline bar used only inside the strength breakdown ── */
const StatBar = ({ color, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="stat-bar-track">
        {/* Fill width + colour are dynamic — must stay inline */}
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="stat-bar-count">{count}</span>
    </div>
  );
};

/* ── Stat summary card ─────────────────────────────────────────── */
const StatCard = ({ title, value, sub, color }) => (
  <div className="stat-card">
    <p className="stat-card-label">{title}</p>
    {/* Colour is dynamic per-card — stays inline */}
    <p className="stat-card-value" style={color ? { color } : {}}>
      {value}
    </p>
    {sub && <p className="stat-card-sub">{sub}</p>}
  </div>
);

/* ─────────────────────────────────────────────────────────────── */

const Stats = () => {
  const { passwords, loadPasswords, loading } = usePasswords();

  useEffect(() => { loadPasswords(); }, [loadPasswords]);

  /* Derived data */
  const total = passwords.length;
  const counts = categoriseByStrength(passwords);
  const weakCount = (counts["Very weak"] ?? 0) + (counts["Weak"] ?? 0);
  const favoriteCount = passwords.filter((p) => p.favorite).length;

  const avgScore =
    total > 0
      ? (
        passwords.reduce(
          (acc, p) => acc + getPasswordStrength(p.password || "").score,
          0
        ) / total
      ).toFixed(1)
      : "—";

  const avgLevel = total > 0 ? STRENGTH_LEVELS[Math.round(Number(avgScore))] : null;

  return (
    <div className="page-root">

      <div className="page-header-row">
        <h1 className="page-heading">Statistics</h1>
      </div>

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : total === 0 ? (
        <p className="empty-state">No passwords saved yet.</p>
      ) : (
        <>
          {/* ── Summary cards ───────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              title="Total passwords"
              value={total}
            />
            <StatCard
              title="Average strength"
              value={avgLevel?.label ?? "—"}
              sub={`score ${avgScore} / 4`}
              color={avgLevel?.color}
            />
            <StatCard
              title="Weak passwords"
              value={weakCount}
              sub="need attention"
              color={weakCount > 0 ? "#f97316" : "#22c55e"}
            />
            <StatCard
              title="Favorites"
              value={favoriteCount}
              sub={`of ${total} total`}
            />
          </div>

          {/* ── Strength breakdown ───────────────────── */}
          <div className="stat-section">
            <h2 className="stat-section-title">Strength breakdown</h2>

            <div className="space-y-3">
              {STRENGTH_LEVELS.map(({ label, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    {/* Label colour is dynamic */}
                    <span
                      className="text-xs font-medium"
                      style={{ color }}
                    >
                      {label}
                    </span>
                    <span className="text-xs text-theme-muted">
                      {counts[label] ?? 0} password
                      {counts[label] !== 1 ? "s" : ""}
                      {total > 0 && (
                        <span className="opacity-50 ml-1">
                          ({Math.round(((counts[label] ?? 0) / total) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <StatBar
                    color={color}
                    count={counts[label] ?? 0}
                    total={total}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Warning banner ───────────────────────── */}
          {weakCount > 0 && (
            <div className="stat-warning-banner">
              <span className="text-lg mt-0.5" style={{ color: "#fb923c" }}>⚠</span>
              <div>
                <p className="stat-warning-title">
                  {weakCount} weak password{weakCount !== 1 ? "s" : ""} detected
                </p>
                <p className="stat-warning-body">
                  Open each password in the Passwords tab and update them
                  to improve your security score.
                </p>
              </div>
            </div>
          )}

          {/* ── All-good banner ──────────────────────── */}
          {weakCount === 0 && total > 0 && (
            <div className="stat-success-banner">
              <span className="text-lg mt-0.5" style={{ color: "#6ee7b7" }}>✓</span>
              <div>
                <p className="stat-success-title">
                  All passwords are at least Fair strength
                </p>
                <p className="stat-success-body">
                  Great work! Keep reviewing regularly and aim for Strong
                  or Very strong.
                </p>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Stats;