import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import reuniteImg from "../../assets/reunite.png";
import {
  Bot,
  ChevronDown,
  Globe,
  Inbox,
  LogOut,
  Menu,
  MessageCircle,
  Shield,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../hooks/useAuth";
import { wantedApi } from "../../features/wanted/services/wantedApi";
import { TrustBadge } from "../../features/wanted/components/profile/TrustBadge";
import { isAdminRole } from "../../lib/authRoles";

const primaryLinks = [
  { path: "/cases", label: { en: "Cases", am: "ኬሶች" } },
  { path: "/report", label: { en: "Report Missing", am: "የጠፉ ሰዎችን ያመልክቱ" } },
  {
    path: "/volunteers",
    label: { en: "Volunteer Response", am: "የበጎ ፈቃደኞች ምላሽ" },
  },
  { path: "/admin", label: { en: "Command Center", am: "Command Center" } },
  { path: "/ai", label: { en: "Help", am: "ዕርዳታ" }, icon: Bot },
];

const reconnectLinks = [
  {
    path: "/wanted",
    label: { en: "Reconnect Hub", am: "የተራራቁ ሰዎች መገንናኛ ማዕከል" },
    description: { en: "Browse reconnect posts", am: "የተለጠፉ ትዝታዎችን ይመልከቱ" },
  },
  {
    path: "/wanted/create",
    label: { en: "Share Memory Post", am: "የተለጠፉ ትዝታዎትን ያጋሩ" },
    description: { en: "Create a reconnect memory post", am: "የእርሶን ትዝታ የጋሩ" },
  },
  {
    path: "/wanted/stories",
    label: { en: "Success Stories", am: "የተሳኩ ታሪኮች" },
    description: { en: "Read successful reconnect stories", am: "የተሳኩ ታሪኮችን ያንብቡ" },
  },
  {
    path: "/wanted/stories/share",
    label: { en: "Share Success Story", am: "የተሳኩ ታሪኮችን ያጋሩ" },
    description: { en: "Publish a completed reconnect story", am: "የተሳኩሎትን ታሮኮች ለሌሎች ያጋሩ" },
  },
];

export const MainHeader = () => {
  const { language, setLanguage } = useLanguage();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isReconnectMenuOpen, setIsReconnectMenuOpen] = useState(false);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const canAccessAdmin = isAdminRole(user?.role);
  const reconnectMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const visiblePrimaryLinks = primaryLinks.filter(
    (link) => link.path !== "/admin" || canAccessAdmin,
  );

  const isReconnectActive = useMemo(
    () => location.pathname.startsWith("/wanted"),
    [location.pathname],
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      setPendingClaimsCount(0);
      return;
    }
    const loadClaims = async () => {
      try {
        const claims = await wantedApi.getPendingClaims();
        setPendingClaimsCount(claims?.length || 0);
      } catch (error) {
        setPendingClaimsCount(0);
      }
    };
    loadClaims();
    const interval = window.setInterval(loadClaims, 30000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated, profile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reconnectMenuRef.current && !reconnectMenuRef.current.contains(event.target)) {
        setIsReconnectMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-stone-200/80 bg-white/95 shadow-md backdrop-blur-xl dark:border-stone-700/60 dark:bg-stone-900/95"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between md:h-24">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 rounded-xl py-1 transition-opacity duration-200 hover:opacity-80">
              <img src={reuniteImg} alt="Reunite" width={52} className="drop-shadow-sm" />
              <div>
                <div className="font-display text-2xl font-bold text-charcoal dark:text-white md:text-3xl">
                  Reunite
                </div>
                <div className="hidden text-sm text-stone-500 dark:text-stone-400 md:block">
                  Missing-person response first
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden items-center gap-1 md:flex">
              {visiblePrimaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-full px-5 py-3 text-base font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-terracotta/10 text-terracotta shadow-sm dark:bg-terracotta/20 dark:text-terracotta"
                      : "text-stone-700 hover:bg-stone-100 hover:text-charcoal hover:shadow-sm hover:scale-105 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {link.icon ? <link.icon className="h-5 w-5" /> : null}
                    {language === "am" ? link.label.am : link.label.en}
                  </span>
                </Link>
              ))}

              {/* Reconnect dropdown */}
              <div className="relative" ref={reconnectMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsReconnectMenuOpen((c) => !c)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-semibold transition-all duration-200 ${
                    isReconnectActive
                      ? "bg-terracotta/10 text-terracotta shadow-sm dark:bg-terracotta/20 dark:text-terracotta"
                      : "text-stone-700 hover:bg-stone-100 hover:text-charcoal hover:shadow-sm hover:scale-105 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
                  }`}
                >
                  <span>{language === "am" ? "እንደገና ለመገናኘት" : "Reconnect"}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isReconnectMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isReconnectMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-xl dark:border-stone-700 dark:bg-stone-900"
                    >
                      {reconnectLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsReconnectMenuOpen(false)}
                          className="block rounded-xl px-4 py-3 text-base font-medium text-stone-700 transition-colors duration-150 hover:bg-stone-50 hover:text-charcoal dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
                        >
                          {language === "am" ? link.label.am : link.label.en}
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1">

              {/* Language switcher */}
              <div className="relative hidden sm:block" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((c) => !c)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-base font-medium text-stone-600 transition-all duration-200 hover:bg-stone-100 hover:text-charcoal hover:scale-105 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                >
                  <Globe className="h-5 w-5" />
                  <span>{language === "am" ? "አማ" : "EN"}</span>
                </button>

                <AnimatePresence>
                  {isLangMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-36 rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-xl dark:border-stone-700 dark:bg-stone-900"
                    >
                      {[
                        { code: "en", label: "English" },
                        { code: "am", label: "አማርኛ" },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setLanguage(item.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`block w-full rounded-xl px-3 py-2.5 text-left text-base font-medium transition-colors duration-150 ${
                            language === item.code
                              ? "bg-terracotta/10 text-terracotta"
                              : "text-stone-700 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {isAuthenticated ? (
                <>
                  {/* Claims */}
                  <Link
                    to="/wanted/claims"
                    className="relative rounded-full p-2 text-stone-600 transition-all duration-200 hover:bg-stone-100 hover:text-charcoal dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                    aria-label="Claims"
                  >
                    <Inbox className="h-5 w-5" />
                    {pendingClaimsCount > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-semibold text-white shadow-sm">
                        {pendingClaimsCount > 9 ? "9+" : pendingClaimsCount}
                      </span>
                    ) : null}
                  </Link>

                  {/* Chat */}
                  <Link
                    to="/wanted/chat"
                    className="rounded-full p-2 text-stone-600 transition-all duration-200 hover:bg-stone-100 hover:text-charcoal dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                    aria-label="Reconnect chat"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>

                  {/* Profile dropdown */}
                  <div className="relative hidden sm:block" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen((c) => !c)}
                      className="inline-flex items-center gap-1.5 rounded-full p-1 transition-all duration-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-terracotta to-sahara text-sm font-semibold text-white ring-2 ring-white dark:ring-stone-800">
                        {profile?.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt={profile?.realName || user?.name || "Profile"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          profile?.realName?.[0]?.toUpperCase() ||
                          user?.name?.[0]?.toUpperCase() ||
                          user?.email?.[0]?.toUpperCase() ||
                          "R"
                        )}
                      </div>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-stone-500 transition-transform duration-200 dark:text-stone-400 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-72 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-xl dark:border-stone-700 dark:bg-stone-900"
                        >
                          {/* User info */}
                          <div className="rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-800">
                            <p className="font-semibold text-charcoal dark:text-white">
                              {profile?.realName || user?.name || "Reunite user"}
                            </p>
                            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                              {user?.email || user?.phone || "Authenticated"}
                            </p>
                            {profile?.trustScore ? (
                              <div className="mt-2.5">
                                <TrustBadge score={profile.trustScore} size="sm" />
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-1.5 space-y-0.5">
                            <Link
                              to="/wanted/profile"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                            >
                              <User className="h-4 w-4 text-stone-400" />
                              Profile
                            </Link>
                            <Link
                              to="/volunteers"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                            >
                              <Users className="h-4 w-4 text-stone-400" />
                              Volunteer response
                            </Link>
                            {canAccessAdmin ? (
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                              >
                                <Shield className="h-4 w-4 text-stone-400" />
                                Command Center
                              </Link>
                            ) : null}
                            <Link
                              to="/settings"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                            >
                              <Settings className="h-4 w-4 text-stone-400" />
                              Settings
                            </Link>

                            <div className="my-1 border-t border-stone-100 dark:border-stone-700" />

                            <button
                              type="button"
                              onClick={handleLogout}
                              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    to="/auth/login"
                    className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition-all duration-200 hover:bg-stone-100 hover:text-charcoal dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-clay hover:shadow-md"
                  >
                    Join Reunite
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((c) => !c)}
                className="rounded-full p-2 text-charcoal transition-all duration-200 hover:bg-stone-100 dark:text-white dark:hover:bg-stone-800 md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.22 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[20rem] overflow-y-auto bg-white px-5 py-6 shadow-2xl dark:bg-stone-900">

              <div className="space-y-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  Missing-person operations
                </p>
                {visiblePrimaryLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      isActive(link.path)
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-stone-700 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                    }`}
                  >
                    {language === "am" ? link.label.am : link.label.en}
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  Reconnect
                </p>
                {reconnectLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      isActive(link.path)
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-stone-700 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                    }`}
                  >
                    {language === "am" ? link.label.am : link.label.en}
                  </Link>
                ))}
              </div>

              {/* Language toggle */}
              <div className="mt-6 rounded-2xl border border-stone-200 p-4 dark:border-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal dark:text-white">
                    Language
                  </span>
                  <div className="flex gap-2">
                    {[
                      { code: "en", label: "EN" },
                      { code: "am", label: "አማ" },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setLanguage(item.code)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                          language === item.code
                            ? "bg-terracotta text-white"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="mt-6 space-y-1">
                  <Link
                    to="/wanted/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors duration-150 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await handleLogout();
                    }}
                    className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-2.5">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-700 transition-colors duration-150 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl bg-terracotta px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-clay"
                  >
                    Join Reunite
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="h-16 md:h-20" />
    </>
  );
};
