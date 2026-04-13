import React, { useEffect } from "react";
import { usePasswords } from "../hooks/usePasswords";
import { getPasswordStrength,STRENGTH_LEVELS,categoriseByStrength } from "../utils/passworStrength";

// ── Small bar used only in the stats breakdown ──────────────────────────────
const StatBar = ({ color, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
    </div>
  );
};

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, color }) => (
  <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
    <p className="text-xs text-gray-400 mb-1">{title}</p>
    <p className="text-2xl font-semibold" style={color ? { color } : {}}>
      {value}
    </p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const Stats = () => {
  const { passwords, loadPasswords, loading } = usePasswords();

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const total = passwords.length;
  const counts = categoriseByStrength(passwords);

  const weakCount = (counts["Very weak"] ?? 0) + (counts["Weak"] ?? 0);
  const strongCount = (counts["Strong"] ?? 0) + (counts["Very strong"] ?? 0);
  const fairCount = counts["Fair"] ?? 0;

  const favoriteCount = passwords.filter((p) => p.favorite).length;

  // Average score
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
    <div className="p-6 max-w-4xl mx-auto">

      <div className="flex px-1 my-3 items-center mb-6">
        <h1 className="sm:!text-5xl !text-3xl font-semibold">Statistics</h1>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm px-1">Loading…</p>
      ) : total === 0 ? (
        <p className="text-gray-400 text-sm px-1">No passwords saved yet.</p>
      ) : (
        <>
          {/* ── Summary cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard title="Total passwords" value={total} />
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

          {/* ── Strength breakdown ────────────────────────────────────────── */}
          <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-5 mb-6">
            <h2 className="text-base font-medium mb-4">Strength breakdown</h2>

            <div className="space-y-3">
              {STRENGTH_LEVELS.map(({ label, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium" style={{ color }}>
                      {label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {counts[label] ?? 0} password
                      {counts[label] !== 1 ? "s" : ""}
                      {total > 0 && (
                        <span className="text-gray-600 ml-1">
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

          {/* ── Action banner if weak passwords exist ─────────────────────── */}
          {weakCount > 0 && (
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-orange-400 text-lg mt-0.5">⚠</span>
              <div>
                <p className="text-sm font-medium text-orange-300">
                  {weakCount} weak password{weakCount !== 1 ? "s" : ""} detected
                </p>
                <p className="text-xs text-orange-400/70 mt-0.5">
                  Open each password in the Passwords tab and update them to improve
                  your security score.
                </p>
              </div>
            </div>
          )}

          {/* ── All-strong congratulation ────────────────────────────────── */}
          {weakCount === 0 && total > 0 && (
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-emerald-400 text-lg mt-0.5">✓</span>
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  All passwords are at least Fair strength
                </p>
                <p className="text-xs text-emerald-400/70 mt-0.5">
                  Great work! Keep reviewing regularly and aim for Strong or Very strong.
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