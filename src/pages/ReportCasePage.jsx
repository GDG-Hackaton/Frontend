import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPin, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import api, { aiService } from "../services/api";
import { useLanguage } from "../lib/i18n";
import { parseCommaSeparated } from "../lib/caseFormatting";

const initialForm = {
  missingPersonName: "",
  age: "",
  gender: "unknown",
  clothing: "",
  description: "",
  lastSeenLocation: "",
  lastSeenDate: "",
  lastSeenCoordinates: "",
  reporterName: "",
  reporterPhone: "",
  reporterRelation: "",
  smsPhone: "",
};

export const ReportCasePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);

  const helperText = useMemo(
    () =>
      language === "am"
        ? "ይህ ቅጽ በቀጥታ ወደ backend report endpoint ይላካል።"
        : "This form posts directly into the backend missing-person report flow.",
    [language],
  );

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const captureCoordinates = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateField(
          "lastSeenCoordinates",
          `${position.coords.longitude}, ${position.coords.latitude}`,
        );
        toast.success("Coordinates added to the report.");
      },
      () => toast.error("Unable to capture location."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleAiExtract = async () => {
    if (!form.description.trim()) {
      toast.error("Add a description first so AI can extract details.");
      return;
    }

    setExtracting(true);
    try {
      const response = await aiService.extractInfo({
        text: form.description,
        language,
      });

      const extracted = response.data || response;
      setAiPreview(extracted);

      updateField(
        "missingPersonName",
        extracted.name || form.missingPersonName,
      );
      updateField("age", extracted.age ? String(extracted.age) : form.age);
      updateField(
        "lastSeenLocation",
        extracted.lastSeenLocation || form.lastSeenLocation,
      );
      updateField(
        "clothing",
        extracted.clothing?.length
          ? extracted.clothing.join(", ")
          : form.clothing,
      );
      updateField("gender", extracted.gender || form.gender);

      toast.success("AI details extracted into the report.");
    } catch (error) {
      toast.error("AI extraction failed.");
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.missingPersonName.trim() || !form.lastSeenLocation.trim()) {
      toast.error("Name and last seen location are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (photo) {
        payload.append("files", photo);
      }

      const response = await api.post("/cases/report", payload);
      const createdCase = response.data?.data;

      toast.success("Missing-person report submitted.");
      if (createdCase?.caseId) {
        navigate(`/cases/${createdCase.caseId}`);
      } else {
        navigate("/cases");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Unable to submit the report.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
            Missing Person Report
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-charcoal">
            Publish a case that the backend can immediately coordinate
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone">
            {helperText}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.missingPersonName}
                  onChange={(event) =>
                    updateField("missingPersonName", event.target.value)
                  }
                  placeholder="Missing person full name"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
                <input
                  value={form.age}
                  onChange={(event) => updateField("age", event.target.value)}
                  placeholder="Approximate age"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={form.gender}
                  onChange={(event) =>
                    updateField("gender", event.target.value)
                  }
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                >
                  <option value="unknown">Gender unknown</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input
                  value={form.clothing}
                  onChange={(event) =>
                    updateField("clothing", event.target.value)
                  }
                  placeholder="Clothing, comma separated"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
              </div>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={7}
                placeholder="Describe appearance, circumstances, urgency, and anything the search team should know."
                className="w-full rounded-3xl border border-stone-200 px-4 py-4 text-sm outline-none focus:border-terracotta"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAiExtract}
                  disabled={extracting}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta disabled:opacity-60"
                >
                  {extracting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  AI extract
                </button>

                <button
                  type="button"
                  onClick={captureCoordinates}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                >
                  <MapPin className="h-4 w-4" />
                  Use current coordinates
                </button>
              </div>

              {aiPreview ? (
                <div className="rounded-3xl border border-terracotta/20 bg-terracotta/5 p-5 text-sm text-stone-700">
                  <p className="font-semibold text-charcoal">AI extraction preview</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <p>Name: {aiPreview.name || "Not extracted"}</p>
                    <p>Age: {aiPreview.age || "Not extracted"}</p>
                    <p className="sm:col-span-2">
                      Last seen: {aiPreview.lastSeenLocation || "Not extracted"}
                    </p>
                    <p className="sm:col-span-2">
                      Clothing:{" "}
                      {aiPreview.clothing?.length
                        ? aiPreview.clothing.join(", ")
                        : "Not extracted"}
                    </p>
                    {aiPreview.urgencyIndicators?.length ? (
                      <p className="sm:col-span-2">
                        Urgency: {parseCommaSeparated(aiPreview.urgencyIndicators).join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <input
                value={form.lastSeenLocation}
                onChange={(event) =>
                  updateField("lastSeenLocation", event.target.value)
                }
                placeholder="Last seen address or landmark"
                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                value={form.lastSeenDate}
                onChange={(event) =>
                  updateField("lastSeenDate", event.target.value)
                }
                type="datetime-local"
                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                value={form.lastSeenCoordinates}
                onChange={(event) =>
                  updateField("lastSeenCoordinates", event.target.value)
                }
                placeholder="Longitude, Latitude"
                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />

              <div className="rounded-3xl border border-stone-200 p-5">
                <label className="block text-sm font-semibold text-charcoal">
                  Reporter and notification details
                </label>
                <div className="mt-4 space-y-3">
                  <input
                    value={form.reporterName}
                    onChange={(event) =>
                      updateField("reporterName", event.target.value)
                    }
                    placeholder="Reporter name"
                    className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                  />
                  <input
                    value={form.reporterPhone}
                    onChange={(event) =>
                      updateField("reporterPhone", event.target.value)
                    }
                    placeholder="Reporter phone"
                    className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                  />
                  <input
                    value={form.reporterRelation}
                    onChange={(event) =>
                      updateField("reporterRelation", event.target.value)
                    }
                    placeholder="Relationship to missing person"
                    className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                  />
                  <input
                    value={form.smsPhone}
                    onChange={(event) =>
                      updateField("smsPhone", event.target.value)
                    }
                    placeholder="SMS updates phone (optional)"
                    className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500 transition hover:border-terracotta/30 hover:text-terracotta">
                <Upload className="h-6 w-6" />
                <span>{photo ? photo.name : "Upload a recent photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setPhoto(event.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:bg-clay disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Submit report
          </button>
        </form>
      </section>
    </div>
  );
};

export default ReportCasePage;
