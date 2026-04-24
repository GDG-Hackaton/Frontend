import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from '../lib/i18n';
const assetImages = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg}', { 
  eager: true, 
  import: 'default' 
});
import {useImpactStats} from "../features/wanted/hooks/useImpactStats"
import { ImpactStats } from '../features/wanted/components/layout/ImpactStats';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  MapPin, 
  Clock, 
  Heart,
  Search,
  MessageCircle,
  Share2,
  Sparkles
} from "lucide-react";



// ============================================
// 1. ORGANIZATIONAL HERO
// ============================================
const OrgHeroSection = () => {
  const { language } = useLanguage();


  const getAsset = (name) => assetImages[`../assets/images/${name}.png`] || '';

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-charcoal to-charcoal/95 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container relative py-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            {language === "am" ? (
              <>ሰዎችን ማግኘት —<br />በአስቸኳይነት እና በጊዜ ውስጥ</>
            ) : (
              <>Finding People —<br />In Crisis and Across Time</>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {language === "am"
              ? "Reunite የጠፉ ሰዎችን በፍጥነት ለማግኘት እና በጊዜ የተለዩ ግንኙነቶችን እንደገና ለማገናኘት የተገነባ መድረክ ነው።"
              : "Reunite is a dual-impact platform helping families find missing loved ones in real time, and reconnecting people separated by years, distance, or silence."}
          </p>

          {/* CTA Split */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold shadow-lg shadow-red-500/25 transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {language === "am" ? "የጠፋ ሰው ፈልግ" : "Find Missing Person"}
              </motion.button>
            </Link>

            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                {language === "am" ? "ከድሮ ሰዎች ጋር ተገናኝ" : "Reconnect With Someone"}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// 2. DUAL SYSTEM SECTION
// ============================================
const DualSystemSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-warm-white to-white">
      <div className="container">
        <motion.div
          ref={ref}
          initial=""
          animate={controls}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            variants={cardVariants}
            className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4"
          >
            {language === "am"
              ? "አንድ ተልዕኮ። ሁለት ስርዓቶች።"
              : "One Mission. Two Systems."}
          </motion.h2>
          <motion.p 
            variants={cardVariants}
            className="text-lg text-stone/70"
          >
            {language === "am"
              ? "ለተለያዩ የመጥፋት አይነቶች የተለያዩ መፍትሄዎች"
              : "Different tools for different ways people become separated"}
          </motion.p>
        </motion.div>

        <motion.div 
          initial=""
          animate={controls}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Emergency System */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-3xl p-8 border-2 border-red-100 hover:border-red-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-charcoal">
              🚨 Reunite AI
            </h3>

            <p className="text-stone/70 mb-6 leading-relaxed">
              {language === "am"
                ? "የጠፉ ሰዎችን በፍጥነት ለማግኘት የAI የተደገፈ ስርዓት። ማንቂያዎችን፣ የማህበረሰብ ቅንጅትን እና ፈጣን ምላሽ መሳሪያዎችን ያካትታል።"
                : "AI-powered real-time response system for finding missing persons. Includes alerts, community coordination, and rapid response tools."}
            </p>

            <ul className="space-y-3 mb-8">
              {[
                { icon: Clock, text: language === "am" ? "የእውነተኛ ጊዜ ማንቂያዎች" : "Real-time alerts" },
                { icon: Users, text: language === "am" ? "የማህበረሰብ ቅንጅት" : "Community coordination" },
                { icon: MapPin, text: language === "am" ? "በቦታ ላይ የተመሰረተ ፍለጋ" : "Location-based search" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-stone/80">
                  <item.icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2"
              >
                {language === "am" ? "አሁን ጀምር" : "Start Emergency Search"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Reconnection System */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-3xl p-8 border-2 border-amber-100 hover:border-amber-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-charcoal">
              💛 Reunite Memory
            </h3>

            <p className="text-stone/70 mb-6 leading-relaxed">
              {language === "am"
                ? "በትዝታ እና በታሪኮች ላይ ተመስርቶ የተለዩ ሰዎችን እንደገና የሚያገናኝ ስርዓት። ደህንነቱ የተጠበቀ ማረጋገጫ እና የግል ግንኙነት ያቀርባል።"
                : "Reconnect with people from your past using shared memories and stories. Safe verification and private reconnection built in."}
            </p>

            <ul className="space-y-3 mb-8">
              {[
                { icon: MessageCircle, text: language === "am" ? "በትዝታ ላይ የተመሰረተ ፍለጋ" : "Memory-based search" },
                { icon: Shield, text: language === "am" ? "ደህንነቱ የተጠበቀ ማረጋገጫ" : "Safe verification" },
                { icon: Heart, text: language === "am" ? "የግል ዳግም ግንኙነት" : "Private reconnection" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-stone/80">
                  <item.icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <Link to="/reconnect">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2"
              >
                {language === "am" ? "ግንኙነት ጀምር" : "Start Reconnecting"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// 3. TWO TYPES OF LOSS SECTION
// ============================================
const LossUnderstandingSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream/50">
      <div className="container max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-charcoal">
            {language === "am" 
              ? "ሰዎች በተለያየ መንገድ ይጠፋሉ"
              : "People Get Lost in Different Ways"}
          </h2>
          <p className="text-lg text-stone/70 mb-16 max-w-2xl mx-auto">
            {language === "am"
              ? "አንዳንድ ጊዜ በድንገት፣ አንዳንድ ጊዜ በጊዜ ሂደት። ለሁለቱም መፍትሄ አለን።"
              : "Understanding the nature of separation helps us build better tools for reconnection."}
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Sudden Loss */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={controls}
              transition={{ delay: 0.2 }}
              className="relative p-8 bg-white rounded-2xl shadow-sm border border-red-100"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-3">
                🚨 {language === "am" ? "ድንገተኛ መጥፋት" : "Sudden Loss"}
              </h3>
              <p className="text-stone/70">
                {language === "am"
                  ? "የጠፉ ሰዎች፣ ድንገተኛ አደጋዎች፣ እያንዳንዱ ደቂቃ አስፈላጊ በሆነባቸው ሁኔታዎች። ፈጣን እርምጃ ያስፈልጋል።"
                  : "Missing persons, emergencies, urgent situations where every minute matters. Fast action required."}
              </p>
            </motion.div>

            {/* Silent Loss */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={controls}
              transition={{ delay: 0.4 }}
              className="relative p-8 bg-white rounded-2xl shadow-sm border border-amber-100"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-amber-600 mb-3">
                💛 {language === "am" ? "ዝምተኛ መለያየት" : "Silent Loss"}
              </h3>
              <p className="text-stone/70">
                {language === "am"
                  ? "የጠፉ ጓደኞች፣ የተለዩ ቤተሰቦች፣ በጊዜ ሂደት የደበዘዙ ግንኙነቶች። ስሜታዊ መፍትሄ ያስፈልጋል።"
                  : "Lost friends, separated families, connections faded over time. Emotional resolution needed."}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// 4. IMPACT STATS
// ============================================
const ImpactSection = () => {
  const { language } = useLanguage();

  const stats = [
    { number: "1,200+", label: language === "am" ? "የተመለሱ ሰዎች" : "People Reunited", color: "text-red-500" },
    { number: "15min", label: language === "am" ? "አማካይ ምላሽ ጊዜ" : "Avg Response Time", color: "text-amber-500" },
    { number: "45+", label: language === "am" ? "ንቁ ማህበረሰቦች" : "Active Communities", color: "text-green-500" },
    { number: "98%", label: language === "am" ? "የስኬት መጠን" : "Success Rate", color: "text-blue-500" }
  ];

  return (
    <section className="py-20 bg-charcoal text-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {language === "am" ? "የእኛ ተጽዕኖ" : "Our Impact"}
          </h2>
          <p className="text-white/60">
            {language === "am" 
              ? "በመላው ኢትዮጵያ ህይወቶችን እንደገና ማገናኘት"
              : "Reconnecting lives across Ethiopia and beyond"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                {stat.number}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 5. TRUST SECTION
// ============================================
const TrustSection = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: language === "am" ? "የተረጋገጠ ደህንነት" : "Verified Safety",
      description: language === "am" 
        ? "ሁሉም ግንኙነቶች ከመፈጸማቸው በፊት ይረጋገጣሉ"
        : "All connections verified before proceeding"
    },
    {
      icon: Users,
      title: language === "am" ? "በማህበረሰብ የተደገፈ" : "Community Powered",
      description: language === "am"
        ? "በሺዎች የሚቆጠሩ በጎ ፈቃደኞች ይረዳሉ"
        : "Thousands of volunteers helping reunite"
    },
    {
      icon: Share2,
      title: language === "am" ? "ግላዊነት የተጠበቀ" : "Privacy First",
      description: language === "am"
        ? "የእርስዎ መረጃ ደህንነቱ የተጠበቀ ነው"
        : "Your information stays protected"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal mb-4">
            {language === "am" ? "ለምን Reunite?" : "Why Reunite?"}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">{feature.title}</h3>
              <p className="text-sm text-stone/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 6. FINAL CTA
// ============================================
const FinalCTASection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-charcoal to-stone-900 text-white">
      <div className="container text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === "am" 
              ? "አንድ ሰው ለማግኘት ዝግጁ ነዎት?"
              : "Ready to Find Someone?"}
          </h2>
          <p className="text-white/70 mb-10 text-lg">
            {language === "am"
              ? "የትኛውንም መንገድ ይምረጡ — እኛ ለመርዳት እዚህ ነን።"
              : "Choose your path — we're here to help you reconnect."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-full font-semibold shadow-lg"
              >
                🚨 {language === "am" ? "የጠፋ ሰው ፈልግ" : "Find Missing Person"}
              </motion.button>
            </Link>

            <Link to="/reconnect">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold shadow-lg"
              >
                💛 {language === "am" ? "ከድሮ ሰዎች ጋር ተገናኝ" : "Reconnect"}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// MAIN LANDING PAGE COMPONENT
// ============================================
export const LandingPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-warm-white">
      <OrgHeroSection />
      <DualSystemSection />
      <LossUnderstandingSection />
      <ImpactSection />
      <TrustSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
