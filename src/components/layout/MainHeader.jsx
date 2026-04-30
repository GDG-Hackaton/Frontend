import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import reuniteImg from "../../assets/reunite.png";
import {
  Bot,
  ChevronDown,
  Globe,
  Heart,
  Inbox,
  LogOut,
  Map,
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
  { path: "/", label: { en: "Home", am: "Home" } },
];

const operationsLinks = [
  {
    path: "/map",
    label: { en: "Live Map", am: "Live Map" },
    icon: Map,
    badge: "New",
  },
  { path: "/cases", label: { en: "Cases", am: "ኬሶች" } },
  { path: "/report", label: { en: "Report Missing", am: "የጠፉ ሰዎችን ያመልክቱ" } },
  {
    path: "/volunteers",
    label: { en: "Volunteer Response", am: "የበጎ ፈቃደኞች ምላሽ" },
  },
];

const reconnectLinks = [
  {
    path: "/wanted",
    label: { en: "Reconnect Hub", am: "የተራራቁ ሰዎች መገንናኛ ማዕከል" },
    description: {
      en: "Browse reconnect posts",
      am: "የተለጠፉ ትዝታዎችን ይመልከቱ",
    },
  },
  {
    path: "/wanted/create",
    label: { en: "Share Memory Post", am: "የተለጠፉ ትዝታዎትን ያጋሩ" },
    description: {
      en: "Create a reconnect memory post",
      am: "የእርሶን ትዝታ የጋሩ",
    },
  },
  {
    path: "/wanted/stories",
    label: { en: "Success Stories", am: "የተሳኩ ታሪኮች" },
    description: {
      en: "Read successful reconnect stories",
      am: "የተሳኩ ታሪኮችን ያንብቡ",
    },
  },
  {
    path: "/wanted/stories/share",
    label: { en: "Share Success Story", am: "የተሳኩ ታሪኮችን ያጋሩ" },
    description: {
      en: "Publish a completed reconnect story",
      am: "የተሳኩሎትን ታሮኮች ለሌሎች ያጋሩ",
    },
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
  const [isOperationsMenuOpen, setIsOperationsMenuOpen] = useState(false);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const canAccessAdmin = isAdminRole(user?.role);
  const reconnectMenuRef = useRef(null);
  const operationsMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  const visiblePrimaryLinks = primaryLinks.filter(
    (link) => link.path !== "/admin" || canAccessAdmin,
  );

  const isReconnectActive = useMemo(
    () => location.pathname.startsWith("/wanted"),
    [location.pathname],
  );

  const isOperationsActive = useMemo(
    () => operationsLinks.some(link => location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)),
    [location.pathname]
  );

  useEffect(() => {
    const onScroll = () => {
      // Trigger solid background only after scrolling past the hero (100vh)
      setIsScrolled(window.scrollY > (window.innerHeight - 100));
    };
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
      if (
        reconnectMenuRef.current &&
        !reconnectMenuRef.current.contains(event.target)
      ) {
        setIsReconnectMenuOpen(false);
      }
      if (
        operationsMenuRef.current &&
        !operationsMenuRef.current.contains(event.target)
      ) {
        setIsOperationsMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
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

  const isHomePage = location.pathname === "/";
  const isTransparent = !isScrolled && isHomePage;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-xl"
        }`}
      >
        <nav className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative z-[110]">
                <img src={reuniteImg} alt="Reunite" width={50} className={isTransparent ? "brightness-0 invert" : ""} />
              </div>
              <div>
                <div className={`font-display text-xl font-bold md:text-2xl transition-colors ${isTransparent ? "text-white" : "text-charcoal"}`}>
                  Reunite
                </div>
                <div className={`hidden text-xs md:block transition-colors ${isTransparent ? "text-white/70" : "text-stone-500"}`}>
                  Missing-person response first
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {visiblePrimaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-full px-4 py-2 text-md font-medium transition ${
                    isActive(link.path)
                      ? isTransparent ? "bg-white/20 text-white" : "bg-terracotta/10 text-terracotta"
                      : isTransparent ? "text-white hover:bg-white/10" : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {link.icon ? <link.icon className="h-4 w-4" /> : null}
                    {language === "am" ? link.label.am : link.label.en}
                    {link.badge ? (
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                        isTransparent 
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-stone-200 bg-stone-100 text-stone-600" 
                      }`}>
                        {link.badge}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}

              {/* Operations Dropdown */}
              <div className="relative" ref={operationsMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsOperationsMenuOpen((current) => !current)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isOperationsActive
                      ? isTransparent ? "bg-white/20 text-white" : "bg-terracotta/10 text-terracotta"
                      : isTransparent ? "text-white hover:bg-white/10" : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <span>
                    {language === "am" ? "ክንውኖች" : "Operations"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {isOperationsMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 mt-3 w-72 rounded-3xl border border-stone-200 bg-white p-3 shadow-xl"
                    >
                      {operationsLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsOperationsMenuOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-stone-50"
                        >
                          {link.icon && <link.icon className="h-4 w-4 text-terracotta" />}
                          <div className="font-medium text-charcoal">
                            {language === "am" ? link.label.am : link.label.en}
                          </div>
                          {link.badge && (
                            <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-bold text-terracotta">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Reconnect Dropdown */}
              <div className="relative" ref={reconnectMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsReconnectMenuOpen((current) => !current)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isReconnectActive
                      ? isTransparent ? "bg-white/20 text-white" : "bg-terracotta/10 text-terracotta"
                      : isTransparent ? "text-white hover:bg-white/10" : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <span>
                    {language === "am" ? "እንደገና ለመገናኘት" : "Reconnect"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {isReconnectMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-80 rounded-3xl border border-stone-200 bg-white p-3 shadow-xl"
                    >
                      {reconnectLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsReconnectMenuOpen(false)}
                          className="block rounded-2xl px-4 py-3 transition hover:bg-stone-50"
                        >
                          <div className="font-medium text-charcoal">
                            {language === "am" ? link.label.am : link.label.en}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {canAccessAdmin && (
                <Link
                  to="/admin"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive("/admin")
                      ? isTransparent ? "bg-white/20 text-white" : "bg-terracotta/10 text-terracotta"
                      : isTransparent ? "text-white hover:bg-white/10" : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  {language === "am" ? "አስተዳደር" : "Admin"}
                </Link>
              )}

              {/* Help Button Moved to End of Main Nav Group */}
              <Link
                to="/ai"
                className={`rounded-full px-4 py-2 text-md font-medium transition ${
                  isActive("/ai")
                    ? isTransparent ? "bg-white/20 text-white" : "bg-terracotta/10 text-terracotta"
                    : isTransparent ? "text-white hover:bg-white/10" : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  {language === "am" ? "ዕርዳታ" : "Help"}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((current) => !current)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                    isTransparent ? "text-white hover:bg-white/10" : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === "am" ? "አማ" : "EN"}</span>
                </button>

                <AnimatePresence>
                  {isLangMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-36 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl"
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
                          className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                            language === item.code
                              ? "bg-terracotta/10 text-terracotta"
                              : "text-stone-700 hover:bg-stone-50"
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
                  <Link
                    to="/wanted/claims"
                    className={`relative rounded-full p-2 transition ${
                      isTransparent ? "text-white hover:bg-white/10" : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
                    }`}
                    aria-label="Claims"
                  >
                    <Inbox className="h-5 w-5" />
                    {pendingClaimsCount > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-semibold text-white">
                        {pendingClaimsCount > 9 ? "9+" : pendingClaimsCount}
                      </span>
                    ) : null}
                  </Link>

                  <Link
                    to="/wanted/chat"
                    className={`rounded-full p-2 transition ${
                      isTransparent ? "text-white hover:bg-white/10" : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
                    }`}
                    aria-label="Reconnect chat"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>

                  <div
                    className="relative hidden sm:block"
                    ref={profileMenuRef}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setIsProfileMenuOpen((current) => !current)
                      }
                      className={`inline-flex items-center gap-2 rounded-full p-1.5 transition ${
                        isTransparent ? "hover:bg-white/10" : "hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-terracotta to-sahara text-sm font-semibold text-white">
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
                      <ChevronDown className={`h-4 w-4 transition ${isTransparent ? "text-white" : "text-stone-500"}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 mt-3 w-72 rounded-3xl border border-stone-200 bg-white p-3 shadow-xl"
                        >
                          <div className="rounded-2xl bg-stone-50 p-4">
                            <p className="font-semibold text-charcoal">
                              {profile?.realName ||
                                user?.name ||
                                "Reunite user"}
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                              {user?.email || user?.phone || "Authenticated"}
                            </p>
                            {profile?.trustScore ? (
                              <div className="mt-3">
                                <TrustBadge
                                  score={profile.trustScore}
                                  size="sm"
                                />
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-3 space-y-1">
                            <Link
                              to="/wanted/profile"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <User className="h-4 w-4" />
                              Profile
                            </Link>
                            <Link
                              to="/volunteers"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <Users className="h-4 w-4" />
                              Volunteer response
                            </Link>
                            {canAccessAdmin ? (
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                              >
                                <Shield className="h-4 w-4" />
                                Command Center
                              </Link>
                            ) : null}

                            <Link
                              to="/settings"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <Settings className="h-4 w-4" />
                              Settings
                            </Link>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
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
                <div className="hidden items-center gap-3 sm:flex">
                  <Link
                    to="/auth/login"
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      isTransparent 
                        ? "border border-white/40 text-white hover:bg-white/10"
                        : "text-stone-700 hover:bg-stone-100" 
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                      isTransparent
                        ? "border border-white bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-charcoal"
                        : "bg-terracotta text-white hover:bg-clay shadow-sm"
                    }`}
                  >
                    Join Reunite
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className={`rounded-full p-2 transition md:hidden ${
                  isTransparent ? "text-white hover:bg-white/10" : "text-charcoal hover:bg-stone-100"
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[20rem] overflow-y-auto bg-white px-5 py-6 shadow-2xl">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Operations
                </p>
                {operationsLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive(link.path)
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {language === "am" ? link.label.am : link.label.en}
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Reconnect
                </p>
                {reconnectLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive(link.path)
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {language === "am" ? link.label.am : link.label.en}
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  General
                </p>
                {visiblePrimaryLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive(link.path)
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {language === "am" ? link.label.am : link.label.en}
                  </Link>
                ))}
                <Link
                  to="/ai"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive("/ai")
                      ? "bg-terracotta/10 text-terracotta"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {language === "am" ? "ዕርዳታ" : "Help"}
                </Link>
              </div>

              <div className="mt-6 rounded-3xl border border-stone-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">
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
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          language === item.code
                            ? "bg-terracotta text-white"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="mt-6 space-y-2">
                  <Link
                    to="/wanted/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await handleLogout();
                    }}
                    className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-700"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl bg-terracotta px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Join Reunite
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isHomePage && <div className="h-16 md:h-20" />}
    </>
  );
};
