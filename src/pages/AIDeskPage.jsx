import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Loader2,
  Sparkles,
  Send,
  User,
  Image as ImageIcon,
  MessageSquare,
  Brain,
  Fingerprint,
  ChevronDown,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { aiService, normalizeAssistantResponse } from "../services/api";
import { useLanguage } from "../lib/i18n";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const AIDeskPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text:
        language === "am"
          ? "ሪፖርት፣ ማስተባበር ወይም ፍለጋ ያለ ጥያቄ ይጠይቁ።"
          : "Ask for reporting guidance, case triage, volunteer direction, or search support.",
    },
  ]);
  const [assistantLoading, setAssistantLoading] = useState(false);

  const [extractInput, setExtractInput] = useState("");
  const [extractResult, setExtractResult] = useState(null);
  const [extractLoading, setExtractLoading] = useState(false);

  const [verifyFiles, setVerifyFiles] = useState({ file1: null, file2: null });
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("assistant");
  const canVerifyFaces = Boolean(user);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [assistantMessages]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Assistant
  const handleAssistant = async () => {
    const message = assistantInput.trim();
    if (!message) return;

    setAssistantMessages((c) => [...c, { role: "user", text: message }]);
    setAssistantInput("");
    setAssistantLoading(true);

    try {
      const res = await aiService.assistant({ message, language, context: { page: "ai-desk" } });
      const payload = normalizeAssistantResponse(res);
      setAssistantMessages((c) => [...c, { role: "assistant", text: payload.text }]);
    } catch {
      toast.error(language === "am" ? "AI አልተሳካም" : "AI failed");
    } finally {
      setAssistantLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAssistant();
    }
  };

  // Extraction
  const handleExtract = async () => {
    if (!extractInput.trim()) {
      toast.error(language === "am" ? "ጽሁፍ ያክሉ" : "Add text first");
      return;
    }

    setExtractLoading(true);
    try {
      const res = await aiService.extractInfo({ text: extractInput, language });
      setExtractResult(res.data || res);
    } catch {
      toast.error(language === "am" ? "ማውጣት አልተሳካም" : "Extraction failed");
    } finally {
      setExtractLoading(false);
    }
  };

  const sendToReport = () => {
    if (!extractResult) return;
    const reportData = {
      missingPersonName: extractResult.name || "",
      age: extractResult.age || "",
      gender: extractResult.gender || "unknown",
      clothing: extractResult.clothing?.join(", ") || "",
      lastSeenLocation: extractResult.lastSeenLocation || "",
      description: extractInput || "",
    };
    sessionStorage.setItem("prefillReport", JSON.stringify(reportData));
    toast.success(language === "am" ? "ወደ ሪፖርት ቅጽ ተልኳል!" : " Sent to report form!");
    navigate("/report");
  };

  // Verification
  const handleVerify = async () => {
    if (!verifyFiles.file1 || !verifyFiles.file2) {
      toast.error(language === "am" ? "ሁለቱንም ምስሎች ያክሉ" : "Add both images");
      return;
    }

    setVerifyLoading(true);
    try {
      const [img1, img2] = await Promise.all([
        readFileAsBase64(verifyFiles.file1),
        readFileAsBase64(verifyFiles.file2),
      ]);
      const res = await aiService.verifyFaces({ imageData1: img1, imageData2: img2 });
      setVerifyResult(res.data || res);
    } catch {
      toast.error(language === "am" ? "ማረጋገጫ አልተሳካም" : "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  const tabs = [
    { id: "assistant", label: language === "am" ? "አሲስታንት" : "Assistant", icon: MessageSquare },
    { id: "extract", label: language === "am" ? "ማውጣት" : "Extraction", icon: Brain },
    { id: "verify", label: language === "am" ? "ማረጋገጫ" : "Verification", icon: Fingerprint },
  ];

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-b from-stone-50 to-white dark:from-stone-900 dark:to-stone-950 transition-colors">
      {/* HEADER */}
      <section className="border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400">
              {language === "am" ? "የእርዳታ ዴስክ" : " Help Desk"}
            </p>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            {language === "am" ? "AI ድጋፍ" : "AI support for reporting, extraction, and verification"}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            {language === "am"
              ? "AI ረዳት፣ መረጃ ማውጫ እና የፊት ማረጋገጫ"
              : "AI assistant, extraction, and verification tools"}
          </p>
        </div>
      </section>

      {/* MOBILE TABS */}
      <div className="lg:hidden sticky top-0 z-20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-700">
        <div className="flex gap-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-stone-900 dark:bg-orange-500 text-white shadow-lg"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
        {/* === CHAT === */}
        <div className={`${activeTab === "assistant" ? "block" : "hidden lg:block"}`}>
          <div className="flex flex-col h-[650px] rounded-3xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-200 dark:border-stone-700">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {language === "am" ? "AI ረዳት" : "AI Assistant"}
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  {language === "am" ? "ሁልጊዜ ንቁ" : "Always active"}
                </p>
              </div>
              <div className="ml-auto text-xs text-stone-400">
                {assistantMessages.length} {language === "am" ? "መልዕክቶች" : "msgs"}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-stone-50 dark:bg-stone-800/50">
              {assistantMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                        : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {m.role === "assistant" ? (
                        <Bot className="w-3 h-3 text-orange-500" />
                      ) : (
                        <User className="w-3 h-3 text-white/70" />
                      )}
                      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                        {m.role === "assistant" ? "AI" : language === "am" ? "እርስዎ" : "You"}
                      </span>
                    </div>
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {assistantLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      <span className="text-sm text-stone-500">{language === "am" ? "እያሰብኩ ነው..." : "Thinking..."}</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  placeholder={language === "am" ? "ጥያቄዎን ይጻፉ... (Enter ይጫኑ)" : "Type... (Enter to send)"}
                  className="flex-1 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                />
                <button
                  onClick={handleAssistant}
                  disabled={assistantLoading || !assistantInput.trim()}
                  className="self-end px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-semibold text-sm hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-stone-400 flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[10px] font-semibold">Enter</span>
                {language === "am" ? "ለመላክ" : "to send"}
                <span className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[10px] font-semibold ml-2">Shift + Enter</span>
                {language === "am" ? "አዲስ መስመር" : "new line"}
              </p>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="space-y-6">
          {/* EXTRACTION */}
          <div className={`${activeTab === "extract" ? "block" : "hidden lg:block"}`}>
            <div className="rounded-3xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {language === "am" ? "መረጃ ማውጣት" : "Structured Extraction"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {language === "am" ? "AI ከጽሁፍ መረጃ ያወጣል" : "AI extracts details from text"}
                  </p>
                </div>
              </div>

              <textarea
                value={extractInput}
                onChange={(e) => setExtractInput(e.target.value)}
                rows={6}
                placeholder={language === "am" ? "ጽሁፍ ይለጥፉ..." : "Paste text..."}
                className="w-full rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none"
              />

              <button
                onClick={handleExtract}
                disabled={extractLoading}
                className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-amber-600 text-white rounded-2xl text-sm font-semibold hover:from-amber-700 hover:to-pink-700 disabled:opacity-50 transition-all "
              >
                {extractLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {language === "am" ? "መረጃ አውጣ" : "Extract Details"}
              </button>

              {/* Extraction Results */}
              {extractResult && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-5">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {language === "am" ? "AI ያወጣቸው መረጃዎች" : "AI Extracted Details"}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-stone-800 rounded-xl p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                          {language === "am" ? "ስም" : "Name"}
                        </p>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {extractResult.name || <span className="text-stone-400 italic font-normal">{language === "am" ? "አልተገኘም" : "Not found"}</span>}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-stone-800 rounded-xl p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                          {language === "am" ? "ዕድሜ" : "Age"}
                        </p>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {extractResult.age || <span className="text-stone-400 italic font-normal">{language === "am" ? "አልተገኘም" : "Not found"}</span>}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-stone-800 rounded-xl p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                          {language === "am" ? "ጾታ" : "Gender"}
                        </p>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 capitalize">
                          {extractResult.gender || <span className="text-stone-400 italic font-normal">{language === "am" ? "አልተገኘም" : "Not found"}</span>}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-stone-800 rounded-xl p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                          {language === "am" ? "አለባበስ" : "Clothing"}
                        </p>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {extractResult.clothing?.length > 0 ? extractResult.clothing.join(", ") : <span className="text-stone-400 italic font-normal">{language === "am" ? "አልተገኘም" : "Not found"}</span>}
                        </p>
                      </div>
                      <div className="sm:col-span-2 bg-white dark:bg-stone-800 rounded-xl p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">
                          {language === "am" ? "የታዩበት ቦታ" : "Last Seen Location"}
                        </p>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {extractResult.lastSeenLocation || <span className="text-stone-400 italic font-normal">{language === "am" ? "አልተገኘም" : "Not found"}</span>}
                        </p>
                      </div>
                    </div>

                    {extractResult.extractionMetadata && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                          extractResult.extractionMetadata.confidenceLevel === 'HIGH' ? 'bg-emerald-100 text-emerald-700'
                          : extractResult.extractionMetadata.confidenceLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                        }`}>
                          {language === "am" ? "እምነት" : "Confidence"}: {extractResult.extractionMetadata.confidenceLevel}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Send to Report */}
                  <button
                    onClick={sendToReport}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Send className="w-4 h-4" />
                    {language === "am" ? "ወደ ሪፖርት ቅጽ ላክ" : "Send to Report Form"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Raw JSON */}
                  <details className="group">
                    <summary className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer hover:text-stone-600 transition-colors">
                      <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                      {language === "am" ? "ጥሬ ውጤት አሳይ" : "Show raw response"}
                    </summary>
                    <pre className="mt-2 rounded-xl bg-stone-100 dark:bg-stone-800 p-3 text-xs text-stone-600 dark:text-stone-400 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                      {JSON.stringify(extractResult, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>

          {/* VERIFICATION */}
          <div className={`${activeTab === "verify" ? "block" : "hidden lg:block"}`}>
            <div className="rounded-3xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {language === "am" ? "የፊት ማረጋገጫ" : "Face Verification"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {language === "am" ? "ሁለት ምስሎችን ያወዳድሩ" : "Compare two images"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 transition-all group">
                  <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 rounded-xl flex items-center justify-center transition-colors">
                    <ImageIcon className="w-6 h-6 text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <span className="text-xs text-stone-600 dark:text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors text-center">
                    {verifyFiles.file1 ? verifyFiles.file1.name : language === "am" ? "የመጀመሪያ ምስል" : "Original Image"}
                  </span>
                  <input type="file" accept="image/*" capture="user" className="hidden"
                    onChange={(e) => setVerifyFiles((c) => ({ ...c, file1: e.target.files?.[0] || null }))} />
                </label>
                <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 transition-all group">
                  <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 rounded-xl flex items-center justify-center transition-colors">
                    <ImageIcon className="w-6 h-6 text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <span className="text-xs text-stone-600 dark:text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors text-center">
                    {verifyFiles.file2 ? verifyFiles.file2.name : language === "am" ? "ሁለተኛ ምስል" : "Comparison Image"}
                  </span>
                  <input type="file" accept="image/*" capture="user" className="hidden"
                    onChange={(e) => setVerifyFiles((c) => ({ ...c, file2: e.target.files?.[0] || null }))} />
                </label>
              </div>

              <button
                onClick={handleVerify}
                disabled={verifyLoading || !canVerifyFaces}
                className="mt-4 w-full px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all"
              >
                {verifyLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === "am" ? "እያረጋገጥኩ ነው..." : "Verifying..."}
                  </span>
                ) : (
                  language === "am" ? "የፊት ማረጋገጫ አሂድ" : "Run Face Verification"
                )}
              </button>

              {!canVerifyFaces && (
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {language === "am" ? "እባክዎ ይግቡ" : "Please sign in to verify"}
                </p>
              )}

              {/* Verification Result */}
              {verifyResult && (
                <div className="mt-4 space-y-3">
                  <div className={`rounded-2xl border-2 p-4 ${
                    verifyResult.verified
                      ? "border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                  }`}>
                    <div className="flex items-center gap-3">
                      {verifyResult.verified ? (
                        <>
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                              {language === "am" ? "✅ ሁለቱም ፎቶዎች አንድ አይነት ሰው ናቸው" : "✅ Both photos are the same person"}
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                              {language === "am" ? "የፊት ማረጋገጫ ተሳክቷል - ፎቶዎቹ ይዛመዳሉ" : "Face verification successful - Photos match"}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            <X className="w-5 h-5 text-red-600 dark:text-red-300" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                              {language === "am" ? "❌ ሁለቱ ፎቶዎች የተለያዩ ሰዎች ናቸው" : "❌ The two photos are different people"}
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                              {language === "am" ? "የፊት ማረጋገጫ አልተሳካም - ፎቶዎቹ አይዛመዱም" : "Face verification failed - Photos don't match"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Technical Details */}
                  <details className="group">
                    <summary className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                      <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                      {language === "am" ? "ተጨማሪ ቴክኒካል መረጃ" : "Technical details"}
                    </summary>
                    <div className="mt-2 rounded-xl bg-stone-50 dark:bg-stone-800 p-3 text-xs text-stone-600 dark:text-stone-400 space-y-1.5">
                      <div className="flex justify-between">
                        <span>{language === "am" ? "ሞዴል" : "Model"}:</span>
                        <span className="font-mono text-stone-700 dark:text-stone-300">{verifyResult.model || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === "am" ? "ርቀት" : "Distance"}:</span>
                        <span className="font-mono text-stone-700 dark:text-stone-300">{verifyResult.distance?.toFixed(4) || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === "am" ? "ገደብ" : "Threshold"}:</span>
                        <span className="font-mono text-stone-700 dark:text-stone-300">{verifyResult.threshold || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === "am" ? "እምነት" : "Confidence"}:</span>
                        <span className={`font-mono font-semibold ${verifyResult.verified ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                          {verifyResult.distance !== undefined 
                            ? `${Math.max(0, Math.min(100, ((1 - verifyResult.distance) * 100))).toFixed(1)}%`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIDeskPage;
