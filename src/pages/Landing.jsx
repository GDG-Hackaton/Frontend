import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "../lib/i18n";
const assetImages = import.meta.glob("../assets/images/*.{png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});
import { useImpactStats } from "../features/wanted/hooks/useImpactStats";
import { ImpactStats } from "../features/wanted/components/layout/ImpactStats";
import { ArrowRight, Shield, Users, MapPin, Clock, Share2 } from "lucide-react";

// ─── 1. HERO ────────────────────────────────────────────────────────────────

const OrgHeroSection = () => {
  const { language } = useLanguage();

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden text-white">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/vedio1.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {language === "am" ? (
              <>የጠፉትን ይፈልጉ የልቦትን ሰው ያግኙ</>
            ) : (
              <>
                Find the lost.
                <br className="hidden sm:block" /> Reconnect the heart.
              </>
            )}
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
            {language === "am"
              ? "ምንም እንኳ ረጅም ጊዜ ቢቆጠር፣ የቱንም ያህል ርቀት ቢኖር፣ ወይም የአድራሻቸው መረጃ ቢጎድልዎ፤ ድረ ገጻችን ይህንን ክፍተት እንድታገናኙ ታሳቢ ተደርጎ የተዘጋጀ ነው።"
              : "No matter how long it has been, how far away they are, or how little information you have our platform is designed to help you bridge that gap."}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/read-more">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-8 py-4 font-semibold shadow-lg shadow-red-500/30 transition-all duration-200 hover:bg-red-600"
              >
                {language === "am" ? "ዝርዝሩን ይመልከቱ" : "Read More"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent" />
    </section>
  );
};

// ─── 2. DUAL SYSTEM ─────────────────────────────────────────────────────────

const DualSystemSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.15 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative bg-white py-24 md:py-32 dark:bg-stone-950">
      {/* Top divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent dark:via-stone-700" />

      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="mx-auto mb-16 max-w-3xl space-y-5 text-center md:mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-charcoal md:text-5xl dark:text-white"
          >
            {language === "am"
              ? "ሪዩናይት ምን አገልግሎት ይሰጣል።"
              : "What Reunite Offers"}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-stone-600 md:text-lg dark:text-stone-400"
          >
            {language === "am"
              ? "ሪዩናይት ለእናንተ ሁለት ዋና ዋና መንገዶችን ያቀርባል፤ ፈጣን ምላሽ እና ዘላቂ ግንኙነት።"
              : "Reunite delivers a dual approach to reconnection, rapid response for urgent situations and a heart-centered path for long-lost connections."}
          </motion.p>

          <motion.h2
            variants={itemVariants}
            className="pt-6 text-3xl font-bold tracking-tight text-charcoal md:text-5xl dark:text-white"
          >
            {language === "am" ? "ሪዩናይትን እንዴት ልጠቀም።" : "How to Use Reunite"}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-stone-600 md:text-lg dark:text-stone-400"
          >
            {language === "am"
              ? "የምትወዱትን ሰው መፈለግ ጥንቃቄ የሚጠይቅ ሂደት ነው። ፍለጋዎን ለመጀመር፣ ከእርሶ ፍለጋ ጋር የሚስማማውን ሂደት ይምረጡ።"
              : "Finding a loved one is a sensitive process. Choose the path that best matches your current needs."}
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:gap-10"
        >
          {/* Missing Person Card */}
          <motion.div
            variants={itemVariants}
            className="group rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl md:p-10 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-red-800/50"
          >
            {/* Accent bar */}
            <div className="mb-6 h-1 w-12 rounded-full bg-red-500 transition-all duration-300 group-hover:w-20" />

            <h3 className="mb-3 text-xl font-semibold text-charcoal md:text-2xl dark:text-white">
              {language === "am" ? "የጠፉቦትን ሰው ይፈልጉ" : "Missing Person Search"}
            </h3>

            <p className="mb-6 leading-relaxed text-stone-600 dark:text-stone-400">
              {language === "am"
                ? "በቅርብ ጊዜም ሆነ ከረጅም ጊዜ በፊት በድንገት የጠፉ ሰዎችን ለመፈለግ ይህንን ይጠቀሙ።"
                : "Use this system if you are dealing with a sudden loss or an urgent situation where time is of the essence."}
            </p>

            <ul className="mb-8 space-y-3.5">
              {[
                {
                  icon: Clock,
                  text: language === "am" ? "መቼ ልጠቀም?" : "When to use:",
                  description:
                    language === "am"
                      ? "..."
                      : "Use this system for missing persons or emergency situations...",
                },
                {
                  icon: Users,
                  text: language === "am" ? "እንዴት ላመልክት?" : "How to use it",
                  description:
                    language === "am"
                      ? "..."
                      : "Click the Find Missing Person search below",
                },
                {
                  icon: MapPin,
                  text: language === "am" ? "እንዴት ልከታተል?" : "What to expect:",
                  description:
                    language === "am"
                      ? "..."
                      : "When you start a search, your report is prioritized...",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-400"
                >
                  <item.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <div>
                    <span className="font-medium text-charcoal dark:text-white">
                      {item.text}
                    </span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link to="/cases">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
              >
                {language === "am" ? "የጠፉቦትን ሰው ይፈልጉ" : "Find Missing Person"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Reconnect Card */}
          <motion.div
            variants={itemVariants}
            className="group rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl md:p-10 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-800/50"
          >
            {/* Accent bar */}
            <div className="mb-6 h-1 w-12 rounded-full bg-amber-500 transition-all duration-300 group-hover:w-20" />

            <h3 className="mb-3 text-xl font-semibold text-charcoal md:text-2xl dark:text-white">
              {language === "am" ? "የልቦትን ሰው ያግኙ" : "Reunite Memory"}
            </h3>

            <p className="mb-6 leading-relaxed text-stone-600 dark:text-stone-400">
              {language === "am"
                ? "በትዝታ እና በታሪኮች ላይ ተመስርቶ..."
                : "Reconnect with people from your past using shared memories and stories. Safe verification and private reconnection built in."}
            </p>

            <ul className="mb-8 space-y-3.5">
              {[
                {
                  icon: Clock,
                  text: language === "am" ? "መቼ ልጠቀም?" : "When to use:",
                  description:
                    language === "am"
                      ? "..."
                      : "Use this to reconnect with people from your past...",
                },
                {
                  icon: Users,
                  text: language === "am" ? "እንዴት ላመልክት?" : "How to use it",
                  description:
                    language === "am"
                      ? "..."
                      : "Click the Reconnect With Someone search below",
                },
                {
                  icon: MapPin,
                  text: language === "am" ? "እንዴት ልከታተል?" : "What to expect:",
                  description:
                    language === "am"
                      ? "..."
                      : "When you begin, share a memory...",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-400"
                >
                  <item.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  <div>
                    <span className="font-medium text-charcoal dark:text-white">
                      {item.text}
                    </span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow-md"
              >
                {language === "am"
                  ? "ከተራራቁት ሰዎች ጋር ይገናኙ"
                  : "Reconnect With Someone"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── 3. TWO TYPES OF LOSS ───────────────────────────────────────────────────

const LossUnderstandingSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  return (
    <section className="bg-gradient-to-b from-white to-stone-50 py-24 md:py-32 dark:from-stone-950 dark:to-stone-900">
      <div className="container max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-charcoal md:text-5xl dark:text-white">
            {language === "am"
              ? "ሰዎች በተለያየ መንገድ ይራራቃሉ"
              : "People Get Lost in Different Ways"}
          </h2>

          <p className="mx-auto mb-16 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg dark:text-stone-400">
            {language === "am"
              ? "ሰዎች በድንገት ይጠፋፋሉ፣ በጊዜ ሂደት ውስጥም ኑሮን ለማሸነፍ በሚያደርጉት ውጣ ውረድ ውስጥ አንዱ የአንዱ አንድራሳ በማጣት፣ ይራራቃሉ።"
              : "Understanding the nature of separation helps us build better tools for reconnection."}
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Sudden Loss */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={controls}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl border border-red-100 bg-white/80 p-8 shadow-md shadow-red-100/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-200/50 md:p-10 dark:border-red-900/30 dark:bg-stone-900/80"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-50/60 to-transparent pointer-events-none dark:from-red-950/20" />
              <div className="relative">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50">
                  <Clock className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-red-600 md:text-2xl dark:text-red-400">
                  {language === "am" ? "በድንገት መጥፋት" : "Sudden Loss"}
                </h3>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  {language === "am"
                    ? "በድንገት የጠፉ ሰዎች በፍጥነት መረጃን ማሰራጭት እና ፈጣን ምላሽ ያስፈልጋቸዋል።"
                    : "Missing persons, emergencies, urgent situations where every minute matters. Fast action required."}
                </p>
              </div>
            </motion.div>

            {/* Silent Loss */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={controls}
              transition={{ delay: 0.35 }}
              className="group relative overflow-hidden rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-md shadow-amber-100/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-200/50 md:p-10 dark:border-amber-900/30 dark:bg-stone-900/80"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-50/60 to-transparent pointer-events-none dark:from-amber-950/20" />
              <div className="relative">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/50">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-yellow-600 md:text-2xl dark:text-yellow-400">
                  {language === "am" ? "አድራሻቸውን በማጣት መራራቅ" : "Silent Loss"}
                </h3>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  {language === "am"
                    ? "የተጠፋፉ ጓደኛሞች፣ የተለያዩ ቤተሰቦች፣ በጊዜ ሂደት ግንኙነታቸው እየደበዘዘ ትዝታቸው እየጨመረ ናፍቆትን ያባብሳልና።"
                    : "Lost friends and separated families. As time passes, connections may fade, but memories linger deepening the longing. We provide the lasting solution."}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── 4. IMPACT STATS ────────────────────────────────────────────────────────

const ImpactSection = () => {
  const { language } = useLanguage();

  return (
    <section className="bg-charcoal py-20 text-white dark:bg-stone-900">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">
            {language === "am" ? "የእኛ ተጽዕኖ" : "Our Impact"}
          </h2>
          <p className="text-white/60">
            {language === "am"
              ? "በመላው ዓለም እና በኢትዮጵያ ውስጥ ኢትዮጵያዊያንን እንደገና ማገናኘት"
              : "Reconnecting Ethiopians worldwide and across Ethiopia."}
          </p>
        </div>
        <ImpactStats />
      </div>
    </section>
  );
};

// ─── 5. TRUST ───────────────────────────────────────────────────────────────

const TrustSection = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: language === "am" ? "ደህንነቱ የተረጋገጠ" : "Verified Safety",
      description:
        language === "am"
          ? "ሁሉም ግንኙነቶች ደህንነቱ በተረጋገጠ መንገድ ይከናወናሉ"
          : "All connections verified before proceeding",
    },
    {
      icon: Users,
      title: language === "am" ? "በማህበረሰቡ የተደገፈ" : "Community Powered",
      description:
        language === "am"
          ? "በሺዎች በሚቆጠሩ በጎ ፈቃደኞች የሚደገፍ"
          : "Thousands of volunteers helping reunite",
    },
    {
      icon: Share2,
      title: language === "am" ? "የግል ምስጢሮ የተጠበቀ" : "Privacy First",
      description:
        language === "am"
          ? "የእርስዎ መረጃ ደህንነቱ የተጠበቀ ነው"
          : "Your information stays protected",
    },
  ];

  return (
    <section className="bg-white py-20 dark:bg-stone-950">
      <div className="container max-w-4xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-charcoal md:text-4xl dark:text-white">
            {language === "am" ? "ለምን Reunite?" : "Why Reunite?"}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group rounded-2xl border border-stone-100 p-6 text-center transition-all duration-300 hover:border-stone-200 hover:shadow-md dark:border-stone-800 dark:hover:border-stone-700"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-charcoal transition-transform duration-300 group-hover:scale-110 dark:bg-stone-700">
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 font-semibold text-charcoal dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── 6. FINAL CTA ───────────────────────────────────────────────────────────

const FinalCTASection = () => {
  const { language } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-charcoal to-stone-900 py-24 text-white dark:from-stone-900 dark:to-stone-950">
      <div className="container max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-5 text-3xl font-bold md:text-5xl">
            {language === "am"
              ? "ፍለጋዎትን ለመጀመር ዝግጁ ነዎት?"
              : "Ready to Find Someone?"}
          </h2>
          <p className="mb-10 text-lg text-white/70">
            {language === "am"
              ? "ፍለጋዎን ለመጀመር፣ ከእርሶ ፍለጋ ጋር የሚስማማውን ሂደት ይምረጡ።"
              : "Choose your path we're here to help you reconnect."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth/register">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-4 font-semibold shadow-lg backdrop-blur transition-all duration-200 hover:bg-white/20"
              >
                {language === "am" ? "ይመዝገቡ" : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────

export const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-warm-white dark:bg-stone-950">
      <OrgHeroSection />
      <DualSystemSection />
      <LossUnderstandingSection />
      <TrustSection />
      <ImpactSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
