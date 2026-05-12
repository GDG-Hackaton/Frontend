import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Clock3,
  Filter,
  MapPin,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import { caseService } from "../services/caseService";
import { useAuth } from "../hooks/useAuth";
import {
  formatDateTime,
  formatRelativeTime,
  getCaseAddress,
  getCaseImageSource,
  getCaseLastSeenAt,
  getCaseSummary,
} from "../lib/caseFormatting";
import { isAdminRole } from "../lib/authRoles";
import { useLanguage } from "../lib/i18n";

const defaultStats = {
  total: 0,
  today: 0,
  byStatus: [],
};

const statusChipClass = {
  active: "status-active",
  resolved: "status-resolved",
  pending_verification: "status-pending",
};

export const MissingCasesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const canAccessAdmin = isAdminRole(user?.role);

  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("active");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activeCount = useMemo(
    () => stats.byStatus.find((item) => item._id === "active")?.count || 0,
    [stats],
  );

  const resolvedCount = useMemo(
    () => stats.byStatus.find((item) => item._id === "resolved")?.count || 0,
    [stats],
  );

  const highPriorityCount = useMemo(
    () => stats.byStatus.find((item) => item._id === "active")?.highPriority || 0,
    [stats],
  );

  const loadStats = async () => {
    const response = await caseService.getStats();
    setStats(response.data || defaultStats);
  };

  const loadCases = async (nextStatus = status, nextQuery = query) => {
    setLoading(true);
    try {
      const response = nextQuery.trim()
        ? await caseService.searchCases(nextQuery.trim(), nextStatus || undefined)
        : await caseService.getAllCases({
            status: nextStatus === "all" ? undefined : nextStatus,
            limit: 40,
          });

      setCases(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.allSettled([loadStats(), loadCases("active", "")]);
  }, []);

  return (
    <div className="mt-16 min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            {language === "am" ? "የጉዳይ እንቅስቃሴ ማዕከል" : "Case Operations Hub"}
          </p>
          <h1 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-charcoal sm:text-4xl">
            {language === "am"
              ? "ንቁ ጉዳዮችን በቀላሉ ይመልከቱ እና በፍጥነት እርምጃ ይውሰዱ"
              : "Find critical cases quickly and take action without confusion"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            {language === "am"
              ? "ይህ ገጽ በጊዜ ላይ ጥራት ያለው ውሳኔ ለመውሰድ የተዘጋጀ ነው። ፍለጋ ያድርጉ፣ ማጣሪያ ይጠቀሙ እና ወዲያውኑ ወደ ሪፖርት ወይም የማስተባበር ስራ ይግቡ።"
              : "This screen is designed for high-stress moments. Search fast, filter clearly, and move directly into reporting or coordinated response."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/report"
              className="inline-flex items-center justify-center rounded-2xl bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay"
            >
              {language === "am" ? "አዲስ ሪፖርት አስገባ" : "Start New Report"}
            </Link>
            <Link
              to="/volunteers"
              className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
            >
              {isAuthenticated ? "Coordinate Volunteers" : "Sign In to Coordinate"}
            </Link>
            {canAccessAdmin ? (
              <Link
                to="/admin"
                className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
              >
                Open Command Center
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="surface-card-dense">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Active
            </p>
            <p className="mt-2 text-2xl font-semibold text-charcoal">{activeCount}</p>
          </div>
          <div className="surface-card-dense border-red-200 bg-red-50/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
              High Priority
            </p>
            <p className="mt-2 text-2xl font-semibold text-red-700">{highPriorityCount}</p>
          </div>
          <div className="surface-card-dense border-emerald-200 bg-emerald-50/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Resolved
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">{resolvedCount}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, location, case detail"
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/10"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    loadCases(status, query);
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => loadCases(status, query)}
              className="rounded-xl bg-charcoal px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          {showFilters ? (
            <div className="mt-3 grid gap-3 border-t border-stone-100 pt-3 sm:grid-cols-[1fr_auto]">
              <select
                value={status}
                onChange={(event) => {
                  const nextStatus = event.target.value;
                  setStatus(nextStatus);
                  loadCases(nextStatus, query);
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-terracotta/40"
              >
                <option value="active">Active</option>
                <option value="pending_verification">Pending verification</option>
                <option value="resolved">Resolved</option>
                <option value="all">All cases</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setStatus("active");
                  loadCases("active", query);
                }}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                High Priority View
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <p className="mb-3 text-sm text-stone-500">
          {loading
            ? "Loading cases..."
            : `${cases.length} ${cases.length === 1 ? "case" : "cases"} found`}
        </p>

        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="surface-card-dense animate-pulse"
              >
                <div className="h-40 rounded-xl bg-stone-100" />
                <div className="mt-3 h-4 w-24 rounded bg-stone-100" />
                <div className="mt-2 h-6 w-2/3 rounded bg-stone-100" />
                <div className="mt-2 h-4 w-full rounded bg-stone-100" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && cases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-stone-400" />
            <h2 className="mt-3 text-lg font-semibold text-charcoal">No cases matched</h2>
            <p className="mt-2 text-sm text-stone-500">
              Try another filter or submit a new report.
            </p>
          </div>
        ) : null}

        {!loading && cases.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {cases.map((caseItem) => {
              const caseStatus = caseItem.status || "unknown";
              const priorityLevel = caseItem.priority?.level || "normal";
              const imageSource = getCaseImageSource(caseItem);
              return (
                <Link
                  key={caseItem.caseId}
                  to={`/cases/${caseItem.caseId}`}
                  className="group block surface-card-dense transition hover:border-terracotta/40 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4">
                    <div className="relative h-48 overflow-hidden rounded-xl bg-stone-100">
                      {imageSource ? (
                        <img
                          src={imageSource}
                          alt={caseItem.person?.name || "Missing person"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShieldAlert className="h-8 w-8 text-stone-400" />
                        </div>
                      )}
                      <span className="status-badge absolute left-2 top-2 bg-black/60 text-white">
                        {priorityLevel}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span
                        className={`status-badge ${
                          statusChipClass[caseStatus] || "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {caseStatus.replaceAll("_", " ")}
                      </span>

                      <h3 className="text-lg font-semibold text-charcoal group-hover:text-terracotta">
                        {caseItem.person?.name || "Unknown person"}
                      </h3>

                      <p className="line-clamp-2 text-sm text-stone-600">
                        {getCaseSummary(caseItem)}
                      </p>

                      <div className="space-y-1.5 text-sm text-stone-600">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-terracotta" />
                          <span>{getCaseAddress(caseItem)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-terracotta" />
                          <span>{formatRelativeTime(getCaseLastSeenAt(caseItem))}</span>
                        </p>
                        <p className="text-xs text-stone-500">
                          {formatDateTime(getCaseLastSeenAt(caseItem))}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {caseItem.sightings?.length || 0} sightings
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {caseItem.assignedVolunteers?.length || 0} volunteers
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default MissingCasesPage;
