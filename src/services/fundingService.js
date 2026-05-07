import api from "./api";

export const fundingService = {
  getOverview: () => api.get("/funding/overview").then((res) => res.data.data),
  getOrganizationDashboard: () =>
    api.get("/funding/organizations/dashboard").then((res) => res.data.data),
  getPaymentProviders: () =>
    api.get("/funding/payments/providers").then((res) => res.data.data),
  createDonationIntent: (payload) =>
    api.post("/funding/donations/intent", payload).then((res) => res.data.data),
  submitKYC: (payload) =>
    api.post("/funding/kyc/submit", payload).then((res) => res.data.data),
  getMyKYC: () => api.get("/funding/kyc/me").then((res) => res.data.data),
  getPendingKYC: () => api.get("/funding/kyc/pending").then((res) => res.data.data),
  reviewKYC: (id, payload) =>
    api.patch(`/funding/kyc/${id}/review`, payload).then((res) => res.data.data),
  createCollaborationRequest: (payload) =>
    api
      .post("/funding/organizations/collaboration-requests", payload)
      .then((res) => res.data.data),
  getCollaborationRequests: () =>
    api.get("/funding/organizations/collaboration-requests").then((res) => res.data.data),
  reviewCollaborationRequest: (id, payload) =>
    api
      .patch(`/funding/organizations/collaboration-requests/${id}/review`, payload)
      .then((res) => res.data.data),
  createSupportRequest: (payload) =>
    api.post("/funding/organizations/support-requests", payload).then((res) => res.data.data),
  getSupportRequests: () =>
    api.get("/funding/organizations/support-requests").then((res) => res.data.data),
  updateSupportRequest: (id, payload) =>
    api.patch(`/funding/organizations/support-requests/${id}`, payload).then((res) => res.data.data),
  registerSchoolNetwork: (payload) =>
    api.post("/funding/organizations/school-networks", payload).then((res) => res.data.data),
};

export default fundingService;
