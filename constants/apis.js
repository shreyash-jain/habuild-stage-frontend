//DEV - Comment before pushing to delpoy
// export const API_BASE_URL = "http://localhost:4000";

//PROD - Uncomment before pushing to delpoy
export const API_BASE_URL = "https://api.habuild.in";

export const ProgramsApis = {
  GET_PROGRAMS: () => `${API_BASE_URL}/api/program/`,
};

export const BatchesApis = {
  GET_BATCH_FROM_PROGRAM: (programId) =>
    `${API_BASE_URL}/api/batch/program/${programId}`,
};

export const AttendanceQuotesApis = {
  GET_ATTENDANCE_QUOTES: () =>
    `${API_BASE_URL}/api/attendance_quote/all?limit=1000`,
  DELETE: (id) => `${API_BASE_URL}/api/attendance_quote/delete/${id}`,
  CREATE: () => `${API_BASE_URL}/api/attendance_quote/add`,
  UPDATE: (editQuoteId) =>
    `${API_BASE_URL}/api/attendance_quote/update/${editQuoteId}`,
};

export const DemoBatchesApis = {
  GET_DEMO_BATCHES: () => `${API_BASE_URL}/api/demobatches/`,
  DELETE: (demoBatchId) =>
    `${API_BASE_URL}/api/demobatches/delDemoBatch?id=${demoBatchId}`,
  CREATE: () => `${API_BASE_URL}/api/demobatches`,
};

export const DemoProgramsApis = {
  CREATE: () => `${API_BASE_URL}/api/demoprogram/createDemoProgram`,
  GET_DEMO_BATCHES_FROM_PROGRAM: (demoProgramId) =>
    `${API_BASE_URL}/api/demoprogram/demo_batches?id=${demoProgramId}`,
  GET_DEMO_PROGRAM_ADS: (demoProgramId) =>
    `${API_BASE_URL}/api/demoprogram/ads/all?id=${demoProgramId}`,
  CREATE_BATCH: (demoProgramId) =>
    `${API_BASE_URL}/api/demoprogram/addBatch?id=${demoProgramId}`,
  GET: () => `${API_BASE_URL}/api/demoprogram/?page=1&limit=10`,
  DELETE: (demoProgramId) =>
    `${API_BASE_URL}/api/demoprogram/deleteDemoProgram?id=${demoProgramId}`,
};

export const DailyQuotesApis = {
  GET: () => `${API_BASE_URL}/api/daily_quote/all_daily_quotes?limit=1000`,
  CREATE: () => `${API_BASE_URL}/api/daily_quote/add_daily_quotes`,
  UPDATE: (editQuoteId) =>
    `${API_BASE_URL}/api/daily_quote/update/${editQuoteId}`,
};

export const HealthCheckApis = {
  GET: () => `${API_BASE_URL}/api/health_check/`,
};

export const PaymentApis = {
  GET_OFFLINE_PAYMENTS: () => `${API_BASE_URL}/api/payment/offline_payments`,
  APPROVE_PAYMENT: () => `${API_BASE_URL}/api/payment/approve_payment`,
  DENY_PAYMENT: (memberId) =>
    `${API_BASE_URL}/api/payment/deny_payment?memberId=${memberId}`,
  GET_PAYMENTS: (pageNum) =>
    `${API_BASE_URL}/api/payment/?page=${pageNum}&limit=100`,
  CREATE: () => `${API_BASE_URL}/api/payment/`,
  CREATE_OFFLINE_PAYMENT: () =>
    `${API_BASE_URL}/api/payment/createScreenshotPayment`,
};

export const HabuildAdsApis = {
  DELETE: (demoAdId) =>
    `${API_BASE_URL}/api/habuild_ads/ads/del?id=${demoAdId}`,
  CREATE: () => `${API_BASE_URL}/api/habuild_ads/ads/add`,
};

export const LeadsApis = {
  GET: (pageNum) => `${API_BASE_URL}/api/lead/?page=${pageNum}&limit=100`,
  SEARCH: (searchTerm) => `${API_BASE_URL}/api/lead/find/${searchTerm}`,
  CREATE_COMM: () => `${API_BASE_URL}/api/lead/communication`,
  CREATE: () => `${API_BASE_URL}/api/lead?action_point=crm`,
  UPDATE_COMM_STATUS: () => `${API_BASE_URL}/api/lead/updateLeadCommStatus`,
};

export const MembersApis = {
  GET: (pageNum) => `${API_BASE_URL}/api/member/?page=${pageNum}&limit=100`,
  GET_COMM_LOGS: (memberId) =>
    `${API_BASE_URL}/api/member/getCommunicationLogs/${memberId}`,
  GET_ATTENDANCE: (params) =>
    `${API_BASE_URL}/api/member/attended/members?batch_id=${params.batchId}&day=${params.daysAttended}`,
  GIFT_MEMBERSHIP: () => `${API_BASE_URL}/api/member/gift_membership`,
  ACTIVATE_MEMBERSHIP: (memberId) =>
    `${API_BASE_URL}/api/member/activate_membership?memberId=${memberId}`,
  SEARCH: (searchTerm, searchFor) =>
    `${API_BASE_URL}/api/member/searchMember/${searchTerm}/${searchFor}`,
  PAUSE_MEMBERSHIP: (params) =>
    `${API_BASE_URL}/api/member/pause_membership?noOfDaysAsked=${params.numDays}&memberId=${params.memberId}&startDate=${params.pauseStartDate}`,
  STOP_MEMBERSHIP: (memberId) =>
    `${API_BASE_URL}/api/member/stop_membership/${memberId}`,
  UPDATE: (memberId) =>
    `${API_BASE_URL}/api/member/updateMemberDetails/${memberId}`,
  UPDATE_CHANNEL: (memberId) =>
    `${API_BASE_URL}/api/member/${memberId}/preferred_channel`,
  UPDATE_PREFFERED_BATCH: () =>
    `${API_BASE_URL}/api/member/updatePreferredBatch`,
};

export const WatiTemplatesApis = {
  GET: () => `${API_BASE_URL}/webhook/templates`,
  REFETCH: () => `${API_BASE_URL}/webhook/templates_from_wati`,
};

export const NotificationApis = {
  LEAD_SEND_TO_BATCH: () => `${API_BASE_URL}/api/notification/whatsapp/batch`,
  SEND_TO_LEADS: () => `${API_BASE_URL}/api/notification/whatsapp`,
  MEMBERS_SEND_TO_BATCH: () =>
    `${API_BASE_URL}/api/notification/whatsapp/members/batch`,
  SEND_TO_MEMBERS: () => `${API_BASE_URL}/api/notification/whatsapp/members`,
};

export const ShortenerApis = {
  GET_LONG_URL: () => `${API_BASE_URL}/api/shortener/getLongUrl`,
  UPDATE_LONG_URL: () => `${API_BASE_URL}/api/shortener/updateLongUrl`,
  GET_CURRENT_YT_LINK: () => `${API_BASE_URL}/api/shortener/getproxyUrl`,
  UPDATE_CURRENT_YT_LINK: () => `${API_BASE_URL}/api/shortener/updateProxyUrl`,
};

export const SchedulerApis = {
  GET: () => `${API_BASE_URL}/api/schedulerHandler/getSchedulerStatus`,
};

export const ReRegisterApis = {
  BATCH: () => `${API_BASE_URL}/api/member/registerBatchOnZoom`,
  MEMBER: () => `${API_BASE_URL}/api/member/registerMemberOnZoom`,
};

export const PlanApis = {
  GET: () => `${API_BASE_URL}/api/plan/`,
};
