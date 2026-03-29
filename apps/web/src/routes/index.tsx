import { Component, createSignal, Show } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { treaty } from "@elysiajs/eden";
import type { App } from "../server/api";
import OfficialNotice from "../components/OfficialNotice";
import type { NavigationReport } from "@lpna/shared";

// Eden Treaty client – connects to the same origin at runtime
const client = treaty<App>(
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
);

// ---------------------------------------------------------------------------
// Academic Analyzer Panel
// ---------------------------------------------------------------------------
const AcademicPanel: Component = () => {
  const [name, setName] = createSignal("張同學");
  const [target, setTarget] = createSignal("計算機科學");
  const [score, setScore] = createSignal(72);

  const mutation = createMutation(() => ({
    mutationFn: async () => {
      const { data, error } = await client.api["analyze-academic"].post({
        id: crypto.randomUUID(),
        name: name(),
        gradeHistory: [
          {
            year: 2024,
            academicYear: "F.6",
            subjects: [
              { name: "數學", score: score() },
              { name: "英語", score: score() - 5 },
              { name: "中文", score: score() + 3 },
            ],
          },
        ],
        targetDepartment: target(),
      });
      if (error) throw new Error(String(error));
      return data as NavigationReport;
    },
  }));

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>🎓 學術導航分析</h2>
      <div style={formRowStyle}>
        <label style={labelStyle}>學生姓名</label>
        <input
          style={inputStyle}
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
      </div>
      <div style={formRowStyle}>
        <label style={labelStyle}>目標學系</label>
        <input
          style={inputStyle}
          value={target()}
          onInput={(e) => setTarget(e.currentTarget.value)}
        />
      </div>
      <div style={formRowStyle}>
        <label style={labelStyle}>近期平均分 (0–100)</label>
        <input
          style={inputStyle}
          type="number"
          min="0"
          max="100"
          value={score()}
          onInput={(e) => setScore(Number(e.currentTarget.value))}
        />
      </div>
      <button
        style={buttonStyle}
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "分析中…" : "提交分析 →"}
      </button>

      <Show when={mutation.data}>
        {(report) => (
          <div style={resultStyle}>
            <p style={summaryStyle}>{report().summary}</p>
            <Show when={report().academicAnalysis}>
              {(a) => (
                <ul style={listStyle}>
                  <li>錄取機率：{(a().admissionProbability * 100).toFixed(1)}%</li>
                  <li>風險等級：{a().riskLevel}</li>
                  <Show when={a().subjectWeaknesses.length > 0}>
                    <li>薄弱學科：{a().subjectWeaknesses.join("、")}</li>
                  </Show>
                </ul>
              )}
            </Show>
            <OfficialNotice notices={report().officialNotices} />
          </div>
        )}
      </Show>
      <Show when={mutation.isError}>
        <p style={{ color: "#fc8181" }}>分析失敗：{String(mutation.error)}</p>
      </Show>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Career Analyzer Panel
// ---------------------------------------------------------------------------
const CareerPanel: Component = () => {
  const [name, setName] = createSignal("李職人");
  const [discipline, setDiscipline] = createSignal(65);

  const mutation = createMutation(() => ({
    mutationFn: async () => {
      const { data, error } = await client.api["analyze-career"].post({
        id: crypto.randomUUID(),
        name: name(),
        currentDiploma: "BACHELOR",
        disciplineScore: discipline(),
        trainingRecords: [
          {
            title: "Data Science Certificate",
            institution: "香港理工大學",
            completedYear: 2023,
            premiumMultiplier: 1.25,
          },
        ],
        yearsOfExperience: 3,
      });
      if (error) throw new Error(String(error));
      return data as NavigationReport;
    },
  }));

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>💼 職涯進化分析</h2>
      <div style={formRowStyle}>
        <label style={labelStyle}>姓名</label>
        <input
          style={inputStyle}
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
      </div>
      <div style={formRowStyle}>
        <label style={labelStyle}>職場紀律評分 (0–100)</label>
        <input
          style={inputStyle}
          type="number"
          min="0"
          max="100"
          value={discipline()}
          onInput={(e) => setDiscipline(Number(e.currentTarget.value))}
        />
      </div>
      <button
        style={buttonStyle}
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "分析中…" : "提交分析 →"}
      </button>

      <Show when={mutation.data}>
        {(report) => (
          <div style={resultStyle}>
            <p style={summaryStyle}>{report().summary}</p>
            <Show when={report().careerAnalysis}>
              {(c) => (
                <ul style={listStyle}>
                  <li>預計薪酬倍數：{c().projectedSalaryMultiplier}x</li>
                  <li>風險等級：{c().riskLevel}</li>
                  <li>建議：{c().switchRecommendations[0]}</li>
                </ul>
              )}
            </Show>
            <OfficialNotice notices={report().officialNotices} />
          </div>
        )}
      </Show>
      <Show when={mutation.isError}>
        <p style={{ color: "#fc8181" }}>分析失敗：{String(mutation.error)}</p>
      </Show>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Dashboard (default export)
// ---------------------------------------------------------------------------
const Dashboard: Component = () => {
  return (
    <main style={mainStyle}>
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <span style={{ "font-size": "1.5rem" }}>🧭</span>
          <div>
            <h1 style={titleStyle}>全方位生涯導航系統</h1>
            <p style={subtitleStyle}>Life-Path Navigator AI · 數據驅動決策，消滅資訊差</p>
          </div>
        </div>
        <div style={badgeStyle}>SYSTEM ONLINE</div>
      </header>

      <div style={gridStyle}>
        <AcademicPanel />
        <CareerPanel />
      </div>

      <footer style={footerStyle}>
        <OfficialNotice notices={["NAVIGATION_DISCLAIMER"]} />
      </footer>
    </main>
  );
};

export default Dashboard;

// ---------------------------------------------------------------------------
// Inline styles (冷淡公務機關風 × 科技未來感)
// ---------------------------------------------------------------------------

const mainStyle = {
  "min-height": "100vh",
  "background": "#0d1117",
  "color": "#e2e8f0",
  "font-family": "'Segoe UI', system-ui, sans-serif",
  "padding": "2rem",
};

const headerStyle = {
  "display": "flex",
  "align-items": "center",
  "justify-content": "space-between",
  "border-bottom": "1px solid #30363d",
  "padding-bottom": "1.5rem",
  "margin-bottom": "2rem",
};

const headerInnerStyle = {
  "display": "flex",
  "align-items": "center",
  "gap": "0.75rem",
};

const titleStyle = {
  "margin": "0",
  "font-size": "1.5rem",
  "font-weight": "700",
  "color": "#f0f6fc",
  "letter-spacing": "-0.02em",
};

const subtitleStyle = {
  "margin": "0.25rem 0 0",
  "font-size": "0.8rem",
  "color": "#8b949e",
  "letter-spacing": "0.05em",
};

const badgeStyle = {
  "background": "#0d4a1f",
  "color": "#3fb950",
  "padding": "0.25rem 0.75rem",
  "border-radius": "12px",
  "font-size": "0.7rem",
  "letter-spacing": "0.1em",
  "font-weight": "600",
  "border": "1px solid #238636",
};

const gridStyle = {
  "display": "grid",
  "grid-template-columns": "repeat(auto-fit, minmax(380px, 1fr))",
  "gap": "1.5rem",
  "margin-bottom": "2rem",
};

const sectionStyle = {
  "background": "#161b22",
  "border": "1px solid #30363d",
  "border-radius": "8px",
  "padding": "1.5rem",
};

const headingStyle = {
  "margin": "0 0 1.25rem",
  "font-size": "1.1rem",
  "color": "#58a6ff",
  "border-bottom": "1px solid #21262d",
  "padding-bottom": "0.75rem",
};

const formRowStyle = {
  "display": "flex",
  "flex-direction": "column" as const,
  "gap": "0.25rem",
  "margin-bottom": "0.75rem",
};

const labelStyle = {
  "font-size": "0.75rem",
  "color": "#8b949e",
  "letter-spacing": "0.05em",
  "text-transform": "uppercase" as const,
};

const inputStyle = {
  "background": "#0d1117",
  "border": "1px solid #30363d",
  "border-radius": "4px",
  "color": "#e2e8f0",
  "padding": "0.5rem 0.75rem",
  "font-size": "0.9rem",
  "outline": "none",
};

const buttonStyle = {
  "background": "#1f6feb",
  "color": "#fff",
  "border": "none",
  "border-radius": "4px",
  "padding": "0.6rem 1.25rem",
  "font-size": "0.875rem",
  "cursor": "pointer",
  "font-weight": "600",
  "margin-top": "0.5rem",
  "width": "100%",
  "letter-spacing": "0.025em",
};

const resultStyle = {
  "margin-top": "1.25rem",
  "padding-top": "1rem",
  "border-top": "1px solid #21262d",
};

const summaryStyle = {
  "font-size": "0.875rem",
  "color": "#3fb950",
  "margin": "0 0 0.75rem",
  "font-family": "'Courier New', monospace",
};

const listStyle = {
  "font-size": "0.875rem",
  "color": "#c9d1d9",
  "padding-left": "1.25rem",
  "margin": "0 0 1rem",
  "line-height": "1.8",
};

const footerStyle = {
  "border-top": "1px solid #21262d",
  "padding-top": "1.5rem",
};
