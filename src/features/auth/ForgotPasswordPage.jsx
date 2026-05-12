import { useState } from "react";
import { Mail } from "lucide-react";
import axios from "../../lib/axios";
import { useLanguage } from "../../lib/i18n";
import { AuthShell } from "../../components/layout/AuthShell";

export const ForgotPasswordPage = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(
        response.data.message ||
          (language === "am"
            ? "የይለፍ ቃል መመለሻ መልእክት ተልኳል።"
            : "Password reset instructions have been sent."),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (language === "am" ? "ጥያቄውን ማስኬድ አልተሳካም።" : "Failed to submit reset request."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={language === "am" ? "የይለፍ ቃል መመለስ" : "Forgot password"}
      subtitle={
        language === "am"
          ? "የመመለሻ አገናኝ ለመቀበል ኢሜይልዎን ያስገቡ።"
          : "Enter your email and we will send reset instructions."
      }
      backTo="/auth/login"
      backLabel={language === "am" ? "ወደ መግቢያ ተመለስ" : "Back to login"}
    >

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              {language === "am" ? "ኢሜይል" : "Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {message ? <p className="text-sm text-hope-green">{message}</p> : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? language === "am" ? "በመላክ ላይ..." : "Sending..."
              : language === "am" ? "መመለሻ አገናኝ ላክ" : "Send Reset Link"}
          </button>
        </form>
    </AuthShell>
  );
};
