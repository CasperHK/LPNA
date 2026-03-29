import { type } from "arktype";

// ---------------------------------------------------------------------------
// 🚨 官方警示文案枚舉 (Official Warning Notices)
// ---------------------------------------------------------------------------

export const OfficialWarning = type(
  "'NAVIGATION_DISCLAIMER' | 'SUBJECT_SELECTION_WARNING' | 'CAREER_ENTRY_NOTICE' | 'DISCIPLINE_ALERT' | 'DIPLOMA_REMINDER'"
);

export type OfficialWarning = typeof OfficialWarning.infer;

export const OFFICIAL_WARNING_MESSAGES: Record<OfficialWarning, string> = {
  NAVIGATION_DISCLAIMER:
    "【關於人生導航的免責聲明】本系統僅負責為你導航至終點，不負責在路途中幫你搬運名為『懶惰』的行李。若導航與現實不符，請先確認你是否還待在原地。",
  SUBJECT_SELECTION_WARNING:
    "【溫馨提示：關於選科】請注意：選擇你『熱愛』的學系前，請先確認你的成績也同樣『熱愛』它。本系統提供的建議，旨在防止你與夢想之間發生嚴重的追撞事故。",
  CAREER_ENTRY_NOTICE:
    "【職業指南：入職須知】本指引不保證你能升職加薪，但能確保你在走錯路、進錯行時，AI 會比你的老闆更早發現你的懷才不遇。",
  DISCIPLINE_ALERT:
    "【職場紀律警示】警告：系統偵測到你的上班紀律與你的晉升期望呈『反比』關係。建議立即更新你的『勤奮』驅動程式，或降低你的『換樓』預算。",
  DIPLOMA_REMINDER:
    "【關於進修與文憑】溫馨提示：文憑不是通往成功的門票，而是你在被現實掃地出門時，用來擋門的磚塊。請根據 AI 建議選擇最厚實的那一塊。",
};

// ---------------------------------------------------------------------------
// 📊 成績軌跡 (Yearly Grade Record)
// ---------------------------------------------------------------------------

export const YearlyGrade = type({
  year: "number.integer",
  "academicYear?": "string",
  subjects: type({ name: "string", score: "number >= 0 & number <= 100" }).array(),
  "overallGpa?": "number >= 0 & number <= 4",
  "dseLevel?": "number.integer >= 1 & number.integer <= 7",
});

export type YearlyGrade = typeof YearlyGrade.infer;

// ---------------------------------------------------------------------------
// 🎓 學生檔案 (Student Profile)
// ---------------------------------------------------------------------------

export const StudentProfile = type({
  id: "string",
  name: "string",
  gradeHistory: YearlyGrade.array().atLeastLength(1),
  targetDepartment: "string",
  "targetUniversity?": "string",
  "preferenceList?": "string[]",
});

export type StudentProfile = typeof StudentProfile.infer;

// ---------------------------------------------------------------------------
// 💼 職涯路徑 (Career Path)
// ---------------------------------------------------------------------------

export const DiplomaLevel = type(
  "'HIGH_SCHOOL' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE' | 'PROFESSIONAL_CERT'"
);
export type DiplomaLevel = typeof DiplomaLevel.infer;

export const TrainingRecord = type({
  title: "string",
  institution: "string",
  completedYear: "number.integer",
  "credentialId?": "string",
  "premiumMultiplier?": "number >= 1",
});
export type TrainingRecord = typeof TrainingRecord.infer;

export const CareerPath = type({
  id: "string",
  name: "string",
  currentDiploma: DiplomaLevel,
  "currentRole?": "string",
  "industry?": "string",
  disciplineScore: "number >= 0 & number <= 100",
  trainingRecords: TrainingRecord.array(),
  "yearsOfExperience?": "number >= 0",
});

export type CareerPath = typeof CareerPath.infer;

// ---------------------------------------------------------------------------
// 📋 導航報告 (Navigation Report)
// ---------------------------------------------------------------------------

export const RiskLevel = type("'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'");
export type RiskLevel = typeof RiskLevel.infer;

export const AcademicAnalysis = type({
  admissionProbability: "number >= 0 & number <= 1",
  riskLevel: RiskLevel,
  riskWarnings: "string[]",
  subjectWeaknesses: "string[]",
  recommendedActions: "string[]",
  officialNotices: OfficialWarning.array(),
});
export type AcademicAnalysis = typeof AcademicAnalysis.infer;

export const CareerAnalysis = type({
  switchRecommendations: "string[]",
  trainingPremiumAnalysis: "string[]",
  projectedSalaryMultiplier: "number >= 1",
  riskLevel: RiskLevel,
  officialNotices: OfficialWarning.array(),
});
export type CareerAnalysis = typeof CareerAnalysis.infer;

export const NavigationReport = type({
  reportId: "string",
  generatedAt: "string",
  subjectType: "'ACADEMIC' | 'CAREER'",
  summary: "string",
  "academicAnalysis?": AcademicAnalysis,
  "careerAnalysis?": CareerAnalysis,
  officialNotices: OfficialWarning.array(),
  aiReasoningNotes: "string[]",
});

export type NavigationReport = typeof NavigationReport.infer;
