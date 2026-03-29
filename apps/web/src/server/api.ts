import { Elysia, t } from "elysia";
import { ArkErrors } from "arktype";
import {
  type StudentProfile,
  type CareerPath,
  type AcademicAnalysis,
  type CareerAnalysis,
  type NavigationReport,
  StudentProfile as StudentProfileSchema,
  CareerPath as CareerPathSchema,
} from "@lpna/shared";

// ---------------------------------------------------------------------------
// Helper: generate a mock academic analysis
// ---------------------------------------------------------------------------
function analyzeAcademic(profile: StudentProfile): AcademicAnalysis {
  const recentGrades = profile.gradeHistory.slice(-2);
  const avgScore =
    recentGrades.flatMap((y) => y.subjects.map((s) => s.score)).reduce((a, b) => a + b, 0) /
    Math.max(
      recentGrades.flatMap((y) => y.subjects).length,
      1
    );

  const admissionProbability = Math.min(Math.max(avgScore / 100, 0), 1);
  const riskLevel =
    admissionProbability >= 0.75
      ? "LOW"
      : admissionProbability >= 0.5
        ? "MEDIUM"
        : admissionProbability >= 0.3
          ? "HIGH"
          : "CRITICAL";

  const weakSubjects = recentGrades
    .flatMap((y) => y.subjects)
    .filter((s) => s.score < 60)
    .map((s) => s.name);

  return {
    admissionProbability,
    riskLevel,
    riskWarnings:
      riskLevel === "CRITICAL" || riskLevel === "HIGH"
        ? [`目標學系「${profile.targetDepartment}」錄取機率偏低，建議調整志願或加強補習。`]
        : [],
    subjectWeaknesses: [...new Set(weakSubjects)],
    recommendedActions: [
      "定期追蹤成績趨勢，識別薄弱學科。",
      `專注加強進入「${profile.targetDepartment}」所需的核心科目。`,
    ],
    officialNotices: ["SUBJECT_SELECTION_WARNING", "NAVIGATION_DISCLAIMER"],
  };
}

// ---------------------------------------------------------------------------
// Helper: generate a mock career analysis
// ---------------------------------------------------------------------------
function analyzeCareer(path: CareerPath): CareerAnalysis {
  const certCount = path.trainingRecords.length;
  const premiumMultiplier = 1 + certCount * 0.15 + path.disciplineScore / 200;

  const riskLevel: CareerAnalysis["riskLevel"] =
    path.disciplineScore >= 80 ? "LOW" : path.disciplineScore >= 60 ? "MEDIUM" : "HIGH";

  return {
    switchRecommendations:
      certCount > 0
        ? [
            `你持有 ${certCount} 項進修記錄，建議向高溢價崗位進發。`,
            "結合原有專業背景與最新資歷，可考慮跨領域轉型。",
          ]
        : ["建議先取得相關認證，以提升市場競爭力。"],
    trainingPremiumAnalysis: path.trainingRecords.map(
      (r) =>
        `「${r.title}」(${r.institution}, ${r.completedYear}) 預計薪酬溢價 ${((r.premiumMultiplier ?? 1.1) - 1) * 100}%。`
    ),
    projectedSalaryMultiplier: parseFloat(premiumMultiplier.toFixed(2)),
    riskLevel,
    officialNotices:
      path.disciplineScore < 60
        ? ["DISCIPLINE_ALERT", "CAREER_ENTRY_NOTICE"]
        : ["CAREER_ENTRY_NOTICE", "DIPLOMA_REMINDER"],
  };
}

// ---------------------------------------------------------------------------
// Elysia app & routes
// ---------------------------------------------------------------------------

export const app = new Elysia({ prefix: "/api" })
  .post(
    "/analyze-academic",
    ({ body }): NavigationReport => {
      const parsed = StudentProfileSchema(body);
      if (parsed instanceof ArkErrors) {
        throw new Error(parsed.summary);
      }
      const analysis = analyzeAcademic(parsed);
      return {
        reportId: crypto.randomUUID(),
        generatedAt: new Date().toISOString(),
        subjectType: "ACADEMIC",
        summary: `針對「${parsed.name}」目標學系「${parsed.targetDepartment}」的學術分析報告已生成。`,
        academicAnalysis: analysis,
        careerAnalysis: undefined,
        officialNotices: analysis.officialNotices,
        aiReasoningNotes: [
          "使用時序成績模型分析歷年軌跡。",
          "對比全港院校收生數據計算錄取機率。",
        ],
      };
    },
    {
      body: t.Object({
        id: t.String(),
        name: t.String(),
        gradeHistory: t.Array(
          t.Object({
            year: t.Number(),
            academicYear: t.Optional(t.String()),
            subjects: t.Array(t.Object({ name: t.String(), score: t.Number() })),
            overallGpa: t.Optional(t.Number()),
            dseLevel: t.Optional(t.Number()),
          }),
          { minItems: 1 }
        ),
        targetDepartment: t.String(),
        targetUniversity: t.Optional(t.String()),
        preferenceList: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .post(
    "/analyze-career",
    ({ body }): NavigationReport => {
      const parsed = CareerPathSchema(body);
      if (parsed instanceof ArkErrors) {
        throw new Error(parsed.summary);
      }
      const analysis = analyzeCareer(parsed);
      return {
        reportId: crypto.randomUUID(),
        generatedAt: new Date().toISOString(),
        subjectType: "CAREER",
        summary: `針對「${parsed.name}」的職涯分析報告已生成，預計薪酬倍數：${analysis.projectedSalaryMultiplier}x。`,
        academicAnalysis: undefined,
        careerAnalysis: analysis,
        officialNotices: analysis.officialNotices,
        aiReasoningNotes: [
          "整合職場紀律評分與進修記錄計算溢價。",
          "掃描市場需求識別最高溢價轉行路徑。",
        ],
      };
    },
    {
      body: t.Object({
        id: t.String(),
        name: t.String(),
        currentDiploma: t.Union([
          t.Literal("HIGH_SCHOOL"),
          t.Literal("ASSOCIATE"),
          t.Literal("BACHELOR"),
          t.Literal("MASTER"),
          t.Literal("DOCTORATE"),
          t.Literal("PROFESSIONAL_CERT"),
        ]),
        currentRole: t.Optional(t.String()),
        industry: t.Optional(t.String()),
        disciplineScore: t.Number({ minimum: 0, maximum: 100 }),
        trainingRecords: t.Array(
          t.Object({
            title: t.String(),
            institution: t.String(),
            completedYear: t.Number(),
            credentialId: t.Optional(t.String()),
            premiumMultiplier: t.Optional(t.Number()),
          })
        ),
        yearsOfExperience: t.Optional(t.Number()),
      }),
    }
  );

export type App = typeof app;
