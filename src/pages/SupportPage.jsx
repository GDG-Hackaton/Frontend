import { useEffect, useMemo, useState } from "react";
import { HeartHandshake, Building2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import fundingService from "../services/fundingService";
import integrationService from "../services/integrationService";
import { useAuth } from "../hooks/useAuth";
import { isAdminRole, normalizeRole } from "../lib/authRoles";
import { PageSurface } from "../components/layout/PageSurface";

const initialDonation = {
  donorType: "individual",
  donorName: "",
  donorEmail: "",
  amount: "",
  paymentProvider: "chapa",
  note: "",
};

const initialKyc = {
  organizationName: "",
  organizationType: "school",
  contactEmail: "",
  contactPhone: "",
  registrationId: "",
};
const initialCollab = {
  organizationName: "",
  organizationType: "ngo",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  region: "",
  proposal: "",
};
const initialSupportRequest = {
  organizationName: "",
  organizationType: "ngo",
  requestType: "volunteers",
  urgencyLevel: "medium",
  title: "",
  details: "",
  location: "",
};
const initialSchoolNetwork = {
  name: "",
  region: "",
  organizationType: "school",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  safeguardingPolicyAccepted: false,
  kycVerified: false,
  incidentResponseLead: "",
  availableResources: "",
};

export default function SupportPage() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const canManageOrganizationOps = isAdminRole(role);
  const [overview, setOverview] = useState(null);
  const [orgDashboard, setOrgDashboard] = useState(null);
  const [schoolStats, setSchoolStats] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [paymentProviders, setPaymentProviders] = useState(null);
  const [donationForm, setDonationForm] = useState(initialDonation);
  const [kycForm, setKycForm] = useState(initialKyc);
  const [submittingDonation, setSubmittingDonation] = useState(false);
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [collaborationForm, setCollaborationForm] = useState(initialCollab);
  const [supportRequestForm, setSupportRequestForm] = useState(initialSupportRequest);
  const [schoolNetworkForm, setSchoolNetworkForm] = useState(initialSchoolNetwork);
  const [mySupportRequests, setMySupportRequests] = useState([]);
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [allSupportRequests, setAllSupportRequests] = useState([]);
  const [activeView, setActiveView] = useState("partner");
  const [submittingCollab, setSubmittingCollab] = useState(false);
  const [submittingSupportRequest, setSubmittingSupportRequest] = useState(false);
  const [submittingSchoolNetwork, setSubmittingSchoolNetwork] = useState(false);

  const loadData = async () => {
    const requests = [
      fundingService.getOverview(),
      fundingService.getOrganizationDashboard(),
      integrationService.getSchoolNetworkStats(),
      fundingService.getMyKYC(),
      fundingService.getPaymentProviders(),
      fundingService.getSupportRequests(),
    ];
    if (canManageOrganizationOps) {
      requests.push(fundingService.getCollaborationRequests());
      requests.push(fundingService.getSupportRequests());
    }
    const [overviewRes, orgRes, schoolRes, kycRes, providerRes, supportRes, collabRes, allSupportRes] =
      await Promise.allSettled(requests);

    if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);
    if (orgRes.status === "fulfilled") setOrgDashboard(orgRes.value);
    if (schoolRes.status === "fulfilled") setSchoolStats(schoolRes.value?.data || null);
    if (kycRes.status === "fulfilled") setKycStatus(kycRes.value);
    if (providerRes.status === "fulfilled") setPaymentProviders(providerRes.value);
    if (supportRes.status === "fulfilled") setMySupportRequests(supportRes.value || []);
    if (canManageOrganizationOps && collabRes?.status === "fulfilled") {
      setCollaborationRequests(collabRes.value || []);
    }
    if (canManageOrganizationOps && allSupportRes?.status === "fulfilled") {
      setAllSupportRequests(allSupportRes.value || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [canManageOrganizationOps]);

  const visibleViews = useMemo(() => {
    const base = [
      { id: "partner", label: "Partner onboarding" },
      { id: "operations", label: "Support requests" },
      { id: "network", label: "School/NGO network" },
    ];
    if (canManageOrganizationOps) {
      base.push({ id: "oversight", label: "Org oversight" });
    }
    return base;
  }, [canManageOrganizationOps]);

  const handleDonation = async (event) => {
    event.preventDefault();
    setSubmittingDonation(true);
    try {
      const payload = {
        ...donationForm,
        amount: Number(donationForm.amount),
      };
      const result = await fundingService.createDonationIntent(payload);
      if (result.paymentUrl) {
        window.open(result.paymentUrl, "_blank", "noopener,noreferrer");
      }
      toast.success("Donation intent created. Continue payment in the opened page.");
      setDonationForm(initialDonation);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to start donation.");
    } finally {
      setSubmittingDonation(false);
    }
  };

  const handleKyc = async (event) => {
    event.preventDefault();
    setSubmittingKyc(true);
    try {
      await fundingService.submitKYC(kycForm);
      toast.success("KYC submitted. Our team will review it soon.");
      setKycForm(initialKyc);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to submit KYC.");
    } finally {
      setSubmittingKyc(false);
    }
  };

  const handleCollaborationRequest = async (event) => {
    event.preventDefault();
    setSubmittingCollab(true);
    try {
      await fundingService.createCollaborationRequest(collaborationForm);
      toast.success("Collaboration request submitted.");
      setCollaborationForm(initialCollab);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to submit collaboration request.");
    } finally {
      setSubmittingCollab(false);
    }
  };

  const handleSupportRequest = async (event) => {
    event.preventDefault();
    setSubmittingSupportRequest(true);
    try {
      await fundingService.createSupportRequest(supportRequestForm);
      toast.success("Support request submitted.");
      setSupportRequestForm(initialSupportRequest);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to submit support request.");
    } finally {
      setSubmittingSupportRequest(false);
    }
  };

  const handleRegisterSchoolNetwork = async (event) => {
    event.preventDefault();
    setSubmittingSchoolNetwork(true);
    try {
      await fundingService.registerSchoolNetwork({
        name: schoolNetworkForm.name,
        region: schoolNetworkForm.region,
        organizationType: schoolNetworkForm.organizationType,
        contact: {
          name: schoolNetworkForm.contactName,
          phone: schoolNetworkForm.contactPhone,
          email: schoolNetworkForm.contactEmail,
        },
        security: {
          safeguardingPolicyAccepted: schoolNetworkForm.safeguardingPolicyAccepted,
          kycVerified: schoolNetworkForm.kycVerified,
        },
        operations: {
          incidentResponseLead: schoolNetworkForm.incidentResponseLead,
          availableResources: schoolNetworkForm.availableResources
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      });
      toast.success("School/organization network registered.");
      setSchoolNetworkForm(initialSchoolNetwork);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to register network.");
    } finally {
      setSubmittingSchoolNetwork(false);
    }
  };

  const handleReviewCollaboration = async (id, decision) => {
    try {
      await fundingService.reviewCollaborationRequest(id, { decision });
      toast.success(`Collaboration request ${decision}.`);
      await loadData();
    } catch {
      toast.error("Unable to review collaboration request.");
    }
  };

  const handleUpdateSupportStatus = async (id, status) => {
    try {
      await fundingService.updateSupportRequest(id, { status });
      toast.success(`Support request moved to ${status}.`);
      await loadData();
    } catch {
      toast.error("Unable to update support request.");
    }
  };

  return (
    <PageSurface
      eyebrow="Support Reunite"
      title="Partner operations, contribution workflows, and institutional readiness"
      description="Manage donations, KYC, organization collaboration, and support requests in a safer, clearer workflow."
    >

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          { label: "Total raised", value: `${overview?.totalRaised || 0} ETB` },
          { label: "Verified organizations", value: overview?.verifiedOrganizations || 0 },
          { label: "School networks", value: schoolStats?.totalNetworks || 0 },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-stone-200 bg-white p-6">
            <p className="text-sm text-stone-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-2">
          {visibleViews.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeView === view.id
                  ? "bg-charcoal text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </section>

      {activeView === "partner" ? (
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-terracotta" />
            <h2 className="text-xl font-semibold text-charcoal">Donate to support search operations</h2>
          </div>
          <form onSubmit={handleDonation} className="grid gap-3">
            <select
              value={donationForm.donorType}
              onChange={(e) => setDonationForm((s) => ({ ...s, donorType: e.target.value }))}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            >
              <option value="individual">Individual</option>
              <option value="school">School</option>
              <option value="organization">Organization</option>
            </select>
            <input
              value={donationForm.donorName}
              onChange={(e) => setDonationForm((s) => ({ ...s, donorName: e.target.value }))}
              placeholder="Donor name"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <input
              type="email"
              value={donationForm.donorEmail}
              onChange={(e) => setDonationForm((s) => ({ ...s, donorEmail: e.target.value }))}
              placeholder="Donor email"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <input
              type="number"
              min="1"
              value={donationForm.amount}
              onChange={(e) => setDonationForm((s) => ({ ...s, amount: e.target.value }))}
              placeholder="Amount in ETB"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              required
            />
            <select
              value={donationForm.paymentProvider}
              onChange={(e) =>
                setDonationForm((s) => ({ ...s, paymentProvider: e.target.value }))
              }
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            >
              <option value="chapa">
                Chapa {paymentProviders?.chapa?.configured ? "" : "(setup needed)"}
              </option>
              <option value="telebirr">
                Telebirr {paymentProviders?.telebirr?.configured ? "" : "(setup needed)"}
              </option>
            </select>
            {!paymentProviders?.[donationForm.paymentProvider]?.configured ? (
              <p className="text-xs text-amber-700">
                Provider is not configured yet. Donation request will be saved safely and can
                be activated later without data loss.
              </p>
            ) : null}
            <textarea
              rows={3}
              value={donationForm.note}
              onChange={(e) => setDonationForm((s) => ({ ...s, note: e.target.value }))}
              placeholder="Optional note"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <button
              type="submit"
              disabled={submittingDonation}
              className="rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay disabled:opacity-60"
            >
              {submittingDonation ? "Starting payment..." : "Donate now"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-success" />
              <h2 className="text-xl font-semibold text-charcoal">KYC for partner security</h2>
            </div>
            <p className="mb-4 text-sm text-stone-600">
              KYC helps us protect families and keep partner operations trustworthy.
            </p>
            <p className="mb-4 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-700">
              Current status: <span className="font-semibold">{kycStatus?.status || "not submitted"}</span>
            </p>
            <form onSubmit={handleKyc} className="grid gap-3">
              <input
                value={kycForm.organizationName}
                onChange={(e) => setKycForm((s) => ({ ...s, organizationName: e.target.value }))}
                placeholder="Organization name"
                required
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <select
                value={kycForm.organizationType}
                onChange={(e) => setKycForm((s) => ({ ...s, organizationType: e.target.value }))}
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              >
                <option value="school">School</option>
                <option value="ngo">NGO</option>
                <option value="company">Company</option>
                <option value="community">Community</option>
                <option value="other">Other</option>
              </select>
              <input
                type="email"
                value={kycForm.contactEmail}
                onChange={(e) => setKycForm((s) => ({ ...s, contactEmail: e.target.value }))}
                placeholder="Contact email"
                required
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                value={kycForm.contactPhone}
                onChange={(e) => setKycForm((s) => ({ ...s, contactPhone: e.target.value }))}
                placeholder="Contact phone"
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                value={kycForm.registrationId}
                onChange={(e) => setKycForm((s) => ({ ...s, registrationId: e.target.value }))}
                placeholder="Registration ID"
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <button
                type="submit"
                disabled={submittingKyc}
                className="rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60"
              >
                {submittingKyc ? "Submitting..." : "Submit KYC"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sahara" />
              <h3 className="text-lg font-semibold text-charcoal">Organization contribution dashboard</h3>
            </div>
            <p className="text-sm text-stone-600">
              Pending KYC: {orgDashboard?.kycPending || 0} | Approved KYC: {orgDashboard?.kycApproved || 0}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Recent donation records: {orgDashboard?.recentDonations?.length || 0}
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-terracotta" />
              <h3 className="text-lg font-semibold text-charcoal">Partner collaboration request</h3>
            </div>
            <form onSubmit={handleCollaborationRequest} className="grid gap-3">
              <input
                value={collaborationForm.organizationName}
                onChange={(e) => setCollaborationForm((s) => ({ ...s, organizationName: e.target.value }))}
                placeholder="Organization name"
                required
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <select
                value={collaborationForm.organizationType}
                onChange={(e) => setCollaborationForm((s) => ({ ...s, organizationType: e.target.value }))}
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              >
                <option value="ngo">NGO</option>
                <option value="school">School</option>
                <option value="humanitarian">Humanitarian organization</option>
                <option value="government">Government</option>
                <option value="community">Community</option>
                <option value="other">Other</option>
              </select>
              <input
                value={collaborationForm.contactName}
                onChange={(e) => setCollaborationForm((s) => ({ ...s, contactName: e.target.value }))}
                placeholder="Contact person"
                required
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                type="email"
                value={collaborationForm.contactEmail}
                onChange={(e) => setCollaborationForm((s) => ({ ...s, contactEmail: e.target.value }))}
                placeholder="Contact email"
                required
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                value={collaborationForm.contactPhone}
                onChange={(e) => setCollaborationForm((s) => ({ ...s, contactPhone: e.target.value }))}
                placeholder="Contact phone"
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                value={collaborationForm.region}
                onChange={(e) => setCollaborationForm((s) => ({ ...s, region: e.target.value }))}
                placeholder="Region / operating area"
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <textarea
                rows={3}
                value={collaborationForm.proposal}
                onChange={(e) => setCollaborationForm((s) => ({ ...s, proposal: e.target.value }))}
                placeholder="How do you want to collaborate?"
                required
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <button
                type="submit"
                disabled={submittingCollab}
                className="rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60"
              >
                {submittingCollab ? "Submitting..." : "Submit collaboration request"}
              </button>
            </form>
          </div>
        </div>
      </section>
      ) : null}

      {activeView === "operations" ? (
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-charcoal">Operational support request</h3>
          <p className="mt-1 text-sm text-stone-600">
            Request coordinated support from partner organizations and school networks.
          </p>
          <form onSubmit={handleSupportRequest} className="mt-4 grid gap-3">
            <input
              value={supportRequestForm.organizationName}
              onChange={(e) => setSupportRequestForm((s) => ({ ...s, organizationName: e.target.value }))}
              placeholder="Requester organization"
              required
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <select
              value={supportRequestForm.requestType}
              onChange={(e) => setSupportRequestForm((s) => ({ ...s, requestType: e.target.value }))}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            >
              <option value="volunteers">Volunteers</option>
              <option value="transport">Transport</option>
              <option value="medical">Medical assistance</option>
              <option value="shelter">Shelter</option>
              <option value="communications">Communications</option>
              <option value="funding">Funding</option>
              <option value="other">Other</option>
            </select>
            <select
              value={supportRequestForm.urgencyLevel}
              onChange={(e) => setSupportRequestForm((s) => ({ ...s, urgencyLevel: e.target.value }))}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <input
              value={supportRequestForm.title}
              onChange={(e) => setSupportRequestForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="Request title"
              required
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <textarea
              rows={3}
              value={supportRequestForm.details}
              onChange={(e) => setSupportRequestForm((s) => ({ ...s, details: e.target.value }))}
              placeholder="Operational details"
              required
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <input
              value={supportRequestForm.location}
              onChange={(e) => setSupportRequestForm((s) => ({ ...s, location: e.target.value }))}
              placeholder="Location"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <button
              type="submit"
              disabled={submittingSupportRequest}
              className="rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay disabled:opacity-60"
            >
              {submittingSupportRequest ? "Submitting..." : "Submit support request"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-charcoal">My support requests</h3>
            <div className="mt-3 space-y-3">
              {mySupportRequests.length === 0 ? (
                <p className="text-sm text-stone-500">No support requests yet.</p>
              ) : (
                mySupportRequests.slice(0, 8).map((item) => (
                  <div key={item._id} className="rounded-2xl border border-stone-200 p-3">
                    <p className="font-semibold text-charcoal">{item.title}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {item.requestType} | {item.urgencyLevel} | {item.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {activeView === "network" ? (
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-charcoal">Register school/NGO network</h3>
          <p className="mt-1 text-sm text-stone-600">
            Register with security and operational readiness details.
          </p>
          <form onSubmit={handleRegisterSchoolNetwork} className="mt-4 grid gap-3">
            <input value={schoolNetworkForm.name} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, name: e.target.value }))} placeholder="Network name" required className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta" />
            <input value={schoolNetworkForm.region} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, region: e.target.value }))} placeholder="Region" required className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta" />
            <select value={schoolNetworkForm.organizationType} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, organizationType: e.target.value }))} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta">
              <option value="school">School</option>
              <option value="ngo">NGO</option>
              <option value="humanitarian">Humanitarian organization</option>
              <option value="community">Community</option>
              <option value="other">Other</option>
            </select>
            <input value={schoolNetworkForm.contactName} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, contactName: e.target.value }))} placeholder="Contact name" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta" />
            <input value={schoolNetworkForm.contactPhone} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, contactPhone: e.target.value }))} placeholder="Contact phone" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta" />
            <input type="email" value={schoolNetworkForm.contactEmail} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, contactEmail: e.target.value }))} placeholder="Contact email" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta" />
            <input value={schoolNetworkForm.incidentResponseLead} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, incidentResponseLead: e.target.value }))} placeholder="Incident response lead" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta" />
            <input value={schoolNetworkForm.availableResources} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, availableResources: e.target.value }))} placeholder="Available resources (comma separated)" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta" />
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={schoolNetworkForm.safeguardingPolicyAccepted} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, safeguardingPolicyAccepted: e.target.checked }))} />
              Safeguarding policy accepted
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={schoolNetworkForm.kycVerified} onChange={(e) => setSchoolNetworkForm((s) => ({ ...s, kycVerified: e.target.checked }))} />
              KYC already verified
            </label>
            <button type="submit" disabled={submittingSchoolNetwork} className="rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60">
              {submittingSchoolNetwork ? "Registering..." : "Register network"}
            </button>
          </form>
        </div>
      </section>
      ) : null}

      {activeView === "oversight" && canManageOrganizationOps ? (
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-charcoal">Collaboration review queue</h3>
          <div className="mt-3 space-y-3">
            {collaborationRequests.length === 0 ? (
              <p className="text-sm text-stone-500">No collaboration requests.</p>
            ) : (
              collaborationRequests.slice(0, 10).map((item) => (
                <div key={item._id} className="rounded-2xl border border-stone-200 p-4">
                  <p className="font-semibold text-charcoal">{item.organizationName} ({item.organizationType})</p>
                  <p className="mt-1 text-xs text-stone-500">{item.contactEmail} | {item.status}</p>
                  <p className="mt-1 text-sm text-stone-600">{item.proposal}</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => handleReviewCollaboration(item._id, "approved")} className="rounded-full bg-success px-4 py-2 text-xs font-semibold text-white">Approve</button>
                    <button type="button" onClick={() => handleReviewCollaboration(item._id, "on_hold")} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white">Hold</button>
                    <button type="button" onClick={() => handleReviewCollaboration(item._id, "rejected")} className="rounded-full bg-error px-4 py-2 text-xs font-semibold text-white">Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-charcoal">Support request operations</h3>
          <div className="mt-3 space-y-3">
            {allSupportRequests.length === 0 ? (
              <p className="text-sm text-stone-500">No support requests.</p>
            ) : (
              allSupportRequests.slice(0, 12).map((item) => (
                <div key={item._id} className="rounded-2xl border border-stone-200 p-4">
                  <p className="font-semibold text-charcoal">{item.title}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {item.organizationName} | {item.requestType} | {item.urgencyLevel} | {item.status}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => handleUpdateSupportStatus(item._id, "in_progress")} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white">In Progress</button>
                    <button type="button" onClick={() => handleUpdateSupportStatus(item._id, "resolved")} className="rounded-full bg-success px-4 py-2 text-xs font-semibold text-white">Resolve</button>
                    <button type="button" onClick={() => handleUpdateSupportStatus(item._id, "cancelled")} className="rounded-full bg-error px-4 py-2 text-xs font-semibold text-white">Cancel</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      ) : null}
    </PageSurface>
  );
}
