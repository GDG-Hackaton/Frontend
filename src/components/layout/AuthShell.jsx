import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const AuthShell = ({
  title,
  subtitle,
  backTo = "/",
  backLabel = "Back",
  children,
}) => {
  return (
    <div className="mt-20 min-h-screen bg-stone-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link
          to={backTo}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="mb-5">
          <h1 className="text-3xl font-semibold text-charcoal">{title}</h1>
          <p className="mt-2 text-sm text-stone-600">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-stone-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure authentication session
        </p>
      </div>
    </div>
  );
};
