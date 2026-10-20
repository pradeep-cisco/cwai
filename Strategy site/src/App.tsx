import { useEffect, useRef, useState, type ReactNode } from "react"
import DecisionFlowchart from "./DecisionFlowchart"

const sections = [
  "Foundation",
  "Three modes",
  "Configure",
  "Operate",
  "Govern",
  "Event Correlation",
  "Decision tree",
  "Reference",
  "Closing",
  "Annexure · A",
  "Annexure · B",
]
const modelNames = ["Traditional UI", "Conversational / Agentic", "Hybrid"]
const toneClasses = ["text-sky-300", "text-teal-300", "text-violet-300"]

function ModeSymbol({ index }: { index: number }) {
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-current/20 bg-current/5 ${toneClasses[index]}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {index === 0 ? (
          <>
            <path d="M4 6h16M4 12h16M4 18h16" />
            <circle cx="9" cy="6" r="2" fill="#101b29" />
            <circle cx="15" cy="12" r="2" fill="#101b29" />
            <circle cx="10" cy="18" r="2" fill="#101b29" />
          </>
        ) : index === 1 ? (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M3 12h5l2-4 4 8 2-4h5" />
          </>
        ) : (
          <>
            <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6Z" />
            <path d="m8.5 12 2.5 2.5 4.5-5" />
          </>
        )}
      </svg>
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300/90">
      {children}
    </div>
  )
}
function Panel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-[#26374b] bg-gradient-to-br from-[#142235] to-[#0e1927] p-6 shadow-[0_8px_28px_-18px_#000] ${className}`}
    >
      {children}
    </div>
  )
}
function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <header className="mb-9 max-w-4xl">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-7 bg-sky-400" />
        <Label>{eyebrow}</Label>
      </div>
      <h1 className="mt-4 text-3xl font-semibold leading-[1.16] text-white md:text-[44px]">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-400">
        {description}
      </p>
    </header>
  )
}
function Principle({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 flex items-start gap-4 rounded-r-lg border-l-2 border-sky-400 bg-gradient-to-r from-sky-400/10 to-sky-400/[0.02] px-5 py-5 text-[15px] font-medium leading-7 text-slate-200">
      <span aria-hidden="true" className="text-lg text-sky-300">
        ↳
      </span>
      <div>{children}</div>
    </div>
  )
}

const modes = [
  {
    name: "Configure",
    purpose: "Establish precise, inspectable system state.",
    gravity: "Traditional UI with embedded agent assistance",
    trust: "Validation, permissions, repeatability",
    tasks: "Setup · configuration · management",
  },
  {
    name: "Operate",
    purpose: "Understand conditions and act safely.",
    gravity: "Agentic reasoning supported by structured evidence",
    trust: "Evidence, verification, safe execution",
    tasks: "Investigation · diagnosis · remediation",
  },
  {
    name: "Govern",
    purpose: "Set boundaries and make autonomy accountable.",
    gravity: "Structured UI with explainable agent traces",
    trust: "Policy, approval, audit, accountability",
    tasks: "Permissions · evaluation · oversight",
  },
]
const modeDetails = [
  {
    intro:
      "Known work deserves precision. Agent assistance enters when the task requires interpretation—not simply because AI is available.",
    rows: [
      [
        "Cluster setup, certificates, users, RBAC, MCP, LLM and DRA configuration",
        "Traditional UI",
        "Known inputs and outputs; precise fields, validation, comparison and repeatability.",
      ],
      [
        "Why are these three nodes still using the old certificate?",
        "Hybrid or Conversational",
        "Reasoning is required to explain an unexpected state.",
      ],
      [
        "Inspect and correct configuration after diagnosis",
        "Hybrid",
        "Reasoning connects to inspectable state and verified changes.",
      ],
    ],
    example: "Certificate management",
    quote: "Why are these three nodes still using the old certificate?",
    fields: [
      "Certificate",
      "CSR",
      "SAN",
      "Expiration",
      "Associated nodes",
      "Status",
      "Renewal",
    ],
    conclusion:
      "Creation / renewal → Traditional UI. Troubleshooting → Hybrid or Conversational.",
    rule: "Do not replace predictable structured tasks with conversation simply because AI is available.",
  },
  {
    intro:
      "Use conversation to express intent and reason across domains. Keep evidence visible, and move to structured controls when the work becomes consequential.",
    rows: [
      [
        "General Query Agent, incident explanation, open-ended and cross-domain investigation",
        "Conversational / Agentic",
        "Goal known, path unclear; synthesis, exploration and follow-up are central.",
      ],
      [
        "DNT, Event Correlation, Configuration Drift and Toxic Factor Detection",
        "Hybrid",
        "Evidence, topology, timelines and operational results need inspection.",
      ],
      [
        "Remediation and production changes",
        "Hybrid + structured controls",
        "Review scope, impact, proposed change, validation, approval and rollback.",
      ],
    ],
    example: "Cross-domain investigation",
    quote: "Why did connectivity to HYD-23 degrade after 14:00?",
    fields: [
      "Event Correlation",
      "DNT",
      "Topology",
      "Telemetry",
      "Configuration",
      "Historical information",
    ],
    conclusion:
      "Intent → reasoning across sources → evidence → validated action.",
    rule: "Conversational reasoning is not unrestricted execution. AI proposes; the user verifies and commits.",
  },
  {
    intro:
      "Keep policy and accountability structured. Use explainable reasoning to support review, without replacing the durable record of decisions and commitments.",
    rows: [
      [
        "Governance policies and agent permissions",
        "Traditional UI",
        "Explicit, persistent rules with inspectable scope and permission boundaries.",
      ],
      [
        "Agent Evaluation",
        "Hybrid",
        "AI assessment coexists with evidence, comparison and reviewable results.",
      ],
      [
        "Explain agent decisions; review traces and approve actions",
        "Contextual reasoning + structured UI",
        "Interpretation supports accountability; approvals remain explicit.",
      ],
    ],
    example: "Accountable review",
    quote:
      "What evidence supports this recommendation, and is it within the approved scope?",
    fields: [
      "Scope",
      "Impact",
      "Evidence",
      "Proposed change",
      "Validation",
      "Approval",
      "Rollback",
      "Audit",
    ],
    conclusion:
      "Policy → explainable trace → evidence review → explicit approval → audit record.",
    rule: "Make agent decisions explainable, permissions explicit and consequential actions reviewable.",
  },
]

function ModeSlide({ index }: { index: number }) {
  const mode = modes[index]
  const detail = modeDetails[index]
  return (
    <>
      <Heading
        eyebrow={`Experience mode 0${index + 1}`}
        title={mode.name}
        description={detail.intro}
      />
      <div className="mb-8 grid gap-6 rounded-lg border border-white/10 bg-[#0d1826] px-5 py-5 md:grid-cols-3">
        {[
          ["User purpose", mode.purpose],
          ["Interaction center of gravity", mode.gravity],
          ["Trust contract", mode.trust],
        ].map(([label, value]) => (
          <div key={label}>
            <Label>{label}</Label>
            <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-7 xl:grid-cols-[1.4fr_1fr]">
        <div>
          <Label>Task-level interaction choices</Label>
          <div className="mt-3 divide-y divide-white/10">
            {detail.rows.map(([task, model, reason]) => (
              <div key={task} className="py-5">
                <div className="text-[15px] font-semibold leading-6 text-slate-100">
                  {task}
                </div>
                <div className="mt-3 inline-flex rounded border border-sky-300/15 bg-sky-300/5 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                  {model}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Panel>
          <div className="flex items-center gap-4">
            <ModeSymbol index={index} />
            <Label>{detail.example}</Label>
          </div>
          <blockquote className="my-5 text-xl leading-8 text-white">
            “{detail.quote}”
          </blockquote>
          <div className="flex flex-wrap gap-2">
            {detail.fields.map((field) => (
              <span
                key={field}
                className="rounded-md border border-white/10 bg-[#080f19]/40 px-3 py-2 text-xs text-slate-300"
              >
                {field}
              </span>
            ))}
          </div>
          <p className="mt-6 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">
            {detail.conclusion}
          </p>
          {index === 1 && (
            <div className="mt-5 text-xs leading-7 text-slate-400">
              <span className="text-slate-200">Routing remediation:</span> 3
              devices · 12 services · low expected impact
              <br />
              Configuration diff → pre-checks → rollback available
              <br />
              <span className="text-sky-300">
                Modify → Simulate → Approve & Deploy
              </span>
            </div>
          )}
        </Panel>
      </div>
      <Principle>{detail.rule}</Principle>
    </>
  )
}

function DecisionTree() {
  return <DecisionFlowchart />
}
const characteristics = [
  [
    "Traditional UI",
    "User knows exactly what to do",
    "Inputs are predictable",
    "Task is repetitive",
    "Precision is more important than reasoning",
    "Bulk operations are common",
    "User needs to compare or scan many records",
  ],
  [
    "Conversational / Agentic",
    "User knows the goal but not the path",
    "Intent is difficult to express through filters",
    "Exploration is required",
    "Multiple domains must be synthesised",
    "Follow-up reasoning is expected",
  ],
  [
    "Hybrid",
    "AI reasoning + visible operational state",
    "AI produces evidence that must be inspected",
    "AI recommendation needs verification",
    "Results need filtering or manipulation",
    "AI result becomes persistent product state",
    "Workflow eventually changes the network → structured controls",
  ],
]
const patterns = [
  [
    "Conversational Entry → Structured Result",
    "“Show sites with packet loss since yesterday” → table / topology / incident list",
    "Query, search, discovery, reporting.",
    "Language finds. UI manipulates.",
  ],
  [
    "Structured Context → Conversational Reasoning",
    "Incident INC-20142 → “Why do you think BGP is the root cause?”",
    "Incident, device, topology, configuration and service views.",
    "Current context is supplied automatically.",
  ],
  [
    "AI Recommendation Embedded in Structured UI",
    "Configuration Drift: 17 differences → AI assessment: 3 are operationally significant.",
    "Drift, alarms, evaluation, capacity, security and operational assessment.",
    "Reasoning can be embedded—not a separate chat.",
  ],
  [
    "Guided AI Workflow",
    "Issue → Symptoms → Time range → Investigation",
    "Troubleshooting and progressive input collection.",
    "Progressively create a structured task definition.",
  ],
  [
    "AI Proposes → UI Verifies",
    "AI recommendation → Configuration diff → Impact → Simulation → Approval",
    "Remediation and production changes.",
    "Reasoning proposes. Structured controls commit.",
  ],
  [
    "Insight → Investigation",
    "Potential service degradation detected → Investigate",
    "Correlation, TFD, incidents, anomaly detection and service assurance.",
    "Structured insight opens deeper reasoning.",
  ],
  [
    "AI Operates → Progress Shown as State",
    "✓ Service checked · ✓ Transport checked · Routing analysing · Configuration comparison pending",
    "Long-running investigations and multi-step agentic workflows.",
    "Make operational progress visible.",
  ],
]

function Content({ slide }: { slide: number }) {
  if (slide >= 2 && slide <= 4) return <ModeSlide index={slide - 2} />
  if (slide === 6) return <DecisionTree />
  if (slide >= 9)
    return (
      <>
        <Heading
          eyebrow="Annexure A · Common Hybrid Patterns"
          title={
            slide === 9
              ? "Ways to enter and interpret."
              : "Ways to verify and act."
          }
          description="Hybrid is a family of reusable interaction patterns—not one fixed chat-and-canvas layout. Apply these patterns wherever the task requires them."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {patterns
            .slice(slide === 9 ? 0 : 4, slide === 9 ? 4 : 7)
            .map(([title, example, best, principle], index) => (
              <Panel key={title}>
                <Label>A{index + (slide === 9 ? 1 : 5)}</Label>
                <h2 className="mt-3 text-lg font-medium text-white">{title}</h2>
                <p className="my-4 text-sm leading-7 text-sky-200">{example}</p>
                <p className="text-sm leading-6 text-slate-400">
                  <span className="text-slate-200">Best for: </span>
                  {best}
                </p>
                <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-6 text-slate-400">
                  {principle}
                </p>
              </Panel>
            ))}
        </div>
      </>
    )
  if (slide === 0)
    return (
      <>
        <Heading
          eyebrow="Crosswork AI · Experience strategy"
          title="Three modes. Task-first interactions."
          description="An AI-native network controller designed around user intent, operational understanding, precision, trust and control."
        />
        <div className="my-4 grid gap-6 md:grid-cols-3">
          {modes.map((mode, index) => (
            <div
              key={mode.name}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-[#142235] to-[#0d1724] p-6"
            >
              <div className="flex items-center justify-between">
                <ModeSymbol index={index} />
                <span className="text-xs text-slate-500">0{index + 1}</span>
              </div>
              <h2 className="mt-4 text-3xl text-white">{mode.name}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                {mode.purpose}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Label>The question to start with</Label>
          <p className="mt-4 max-w-3xl text-2xl leading-[1.5] text-slate-100">
            What is the best way for the user to accomplish this task?
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Not every AI capability needs a conversational interface. The nature
            of the job determines the interaction.
          </p>
        </div>
        <Principle>
          Conversation for intent and reasoning. UI for state, control, review
          and commitment.
        </Principle>
      </>
    )
  if (slide === 1)
    return (
      <>
        <Heading
          eyebrow="The core experience framework"
          title="Modes organize the product. Tasks choose the interaction."
          description="Configure, Operate and Govern organize the experience around user purpose. Choose Traditional UI, Conversational / Agentic or Hybrid for each task."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {modes.map((mode, index) => (
            <Panel key={mode.name}>
              <div className="mb-5">
                <ModeSymbol index={index} />
              </div>
              <Label>
                0{index + 1} · {mode.name}
              </Label>
              <h2 className="mt-4 text-xl leading-8 text-white">
                {mode.purpose}
              </h2>
              <p className="mt-4 text-xs text-slate-400">{mode.tasks}</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <Label>Center of gravity</Label>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {mode.gravity}
                </p>
              </div>
              <p className="mt-5 text-xs leading-6 text-slate-400">
                Trust: {mode.trust}
              </p>
            </Panel>
          ))}
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <Label>Task-level interaction models</Label>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {modelNames.map((name, index) => (
              <div key={name}>
                <h3 className={`text-sm font-medium ${toneClasses[index]}`}>
                  {name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {
                    [
                      "Known + structured + predictable",
                      "Goal known + path unclear + reasoning-led",
                      "Reasoning + structured state + verification + control",
                    ][index]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
        <Principle>
          Experience mode → user task → appropriate interaction model. No mode
          is restricted to a single interaction model.
        </Principle>
      </>
    )
  if (slide === 5)
    return (
      <>
        <Heading
          eyebrow="Operate · Applied example"
          title="Event Correlation: design the job first."
          description="The agent architecture should not determine the interface. The user's work is to inspect correlated results, interpret relationships and review incidents."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <Label>Poor framing</Label>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              “We have an Event Correlation Agent. What should its chat
              experience look like?”
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Assumes a dedicated agent UI and conversation as the primary
              interaction.
            </p>
          </Panel>
          <Panel>
            <Label>Better framing</Label>
            <p className="mt-4 text-lg leading-8 text-white">
              “What interaction model best supports the user's Event Correlation
              job?”
            </p>
            <p className="mt-4 text-sm text-teal-300">Best suited: Hybrid</p>
          </Panel>
        </div>
        <div className="my-8 grid grid-cols-3 gap-4 rounded-xl border border-sky-300/15 bg-gradient-to-r from-[#132438] to-[#0d1a27] px-6 py-7">
          {[
            ["487", "raw events"],
            ["23", "correlated groups"],
            ["3", "incidents"],
          ].map(([number, label], index) => (
            <div key={label}>
              <div className="text-3xl font-semibold tabular-nums text-sky-200 md:text-4xl">
                {number}
                {index < 2 && (
                  <span className="ml-5 text-lg text-sky-300/50">→</span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Conversation when interpretation is needed</Label>
            <div className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
              <p>“Why were these events grouped?”</p>
              <p>“Which event occurred first?”</p>
              <p>“Could these represent two independent failures?”</p>
            </div>
          </div>
          <div>
            <Label>Natural interaction sequence</Label>
            <p className="mt-4 text-lg leading-8 text-slate-100">
              Structured correlated result
              <br />
              <span className="text-slate-500">↓</span> Conversational reasoning
              <br />
              <span className="text-slate-500">↓</span> Structured incident /
              evidence
            </p>
          </div>
        </div>
        <Principle>
          Design the user's job first, not the agent interface first.
        </Principle>
      </>
    )
  if (slide === 7)
    return (
      <>
        <Heading
          eyebrow="Task-level reference · Framework §4"
          title="Recognize the task characteristics."
          description="Use this guide inside Configure, Operate and Govern. The task—not the presence of AI—determines the recommended interaction model."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {characteristics.map(([name, ...items], index) => (
            <Panel key={name}>
              <h2 className={`mb-5 text-lg font-medium ${toneClasses[index]}`}>
                {name}
              </h2>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-white/10 pt-3 text-sm leading-6 text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
        <Principle>
          Known work → Traditional UI. Goal known, path unknown → Conversational
          / Agentic. Reasoning + operational state/control → Hybrid.
        </Principle>
      </>
    )
  return (
    <>
      <Heading
        eyebrow="Final position"
        title="Design for the task."
        description="Create an AI-native network controller where each task uses the interaction model that best supports intent, understanding, precision, trust and control."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {[
          [
            "Configure",
            "Preserve precision.",
            "Known, predictable work remains structured; assistance resolves uncertainty.",
          ],
          [
            "Operate",
            "Reason with evidence.",
            "Express intent naturally; inspect results and validate before consequential action.",
          ],
          [
            "Govern",
            "Make autonomy accountable.",
            "Keep boundaries explicit, reasoning explainable and commitments reviewable.",
          ],
        ].map(([name, title, copy]) => (
          <div key={name} className="border-t border-white/15 pt-5">
            <Label>{name}</Label>
            <h2 className="mt-4 text-2xl text-white">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">{copy}</p>
          </div>
        ))}
      </div>
      <Panel className="mt-9">
        <Label>Decision sequence</Label>
        <p className="mt-4 text-lg leading-8 text-slate-200">
          Task certainty → Reasoning need → Result structure → Action &
          consequence → Interaction model
        </p>
      </Panel>
      <Principle>
        Begin with “What is the nature of the user's task?”—not “What should the
        AI chat look like?”
      </Principle>
    </>
  )
}

export default function App() {
  const [slide, setSlide] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        (event.target.closest("button, input, textarea, select") ||
          event.target.isContentEditable)
      )
        return
      if (event.key === "ArrowRight") {
        event.preventDefault()
        setSlide((current) => Math.min(sections.length - 1, current + 1))
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        setSlide((current) => Math.max(0, current - 1))
      }
      if (event.key === "Home") {
        event.preventDefault()
        setSlide(0)
      }
      if (event.key === "End") {
        event.preventDefault()
        setSlide(sections.length - 1)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
  }, [slide])
  return (
    <div className="flex h-dvh min-h-[400px] flex-col bg-[radial-gradient(ellipse_at_90%_0%,#11263d_0%,#080f19_55%)] text-slate-100">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#080f19]/75 px-5 md:px-8">
        <div className="flex items-center gap-5">
          <span className="text-xl font-bold tracking-[-0.03em] text-sky-300">
            <svg
              aria-hidden="true"
              viewBox="0 0 50 20"
              className="mb-0.5 h-4 w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M4 12v5M10 7v10M16 3v14M22 8v9M28 8v9M34 3v14M40 7v10M46 12v5" />
            </svg>
            cisco
          </span>
          <span className="h-5 w-px bg-white/15" />
          <span className="text-sm font-medium">
            Crosswork AI{" "}
            <span className="ml-2 hidden font-normal text-slate-500 sm:inline">
              / Experience strategy
            </span>
          </span>
        </div>
        <span className="hidden text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:block">
          Design framework
        </span>
      </header>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <nav
          aria-label="Deck sections"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/10 bg-[#080f19]/65 p-2 md:w-[185px] md:flex-col md:overflow-y-auto md:border-b-0 md:border-r md:px-4 md:py-9"
        >
          {sections.map((name, index) => (
            <button
              key={name}
              onClick={() => setSlide(index)}
              aria-current={slide === index ? "page" : undefined}
              className={`whitespace-nowrap rounded px-3 py-3 text-left text-xs transition-colors ${
                slide === index
                  ? "bg-sky-300/10 text-white ring-1 ring-inset ring-sky-300/15"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
              } ${index === 9 ? "md:mt-7" : ""}`}
            >
              <span
                className={`mr-3 text-[10px] ${
                  slide === index ? "text-sky-300" : "text-slate-600"
                }`}
              >
                {index < 9
                  ? String(index + 1).padStart(2, "0")
                  : index === 9
                    ? "A1"
                    : "A2"}
              </span>
              {name}
            </button>
          ))}
        </nav>
        <main
          ref={contentRef}
          className={`min-h-0 min-w-0 flex-1 px-5 py-7 md:px-10 lg:px-14 lg:py-10 ${"overflow-auto"}`}
        >
          <article
            key={slide}
            className={`slide-enter mx-auto w-full max-w-[1200px] ${
              slide === 6 ? "min-w-[900px]" : ""
            }`}
            aria-label={sections[slide]}
          >
            <Content slide={slide} />
          </article>
        </main>
      </div>
      <footer className="flex h-14 shrink-0 items-center justify-between border-t border-white/10 px-5 md:px-8">
        <div className="text-[11px] text-slate-500">
          <span className="text-slate-200">
            {String(slide + 1).padStart(2, "0")}
          </span>{" "}
          / {sections.length}{" "}
          <span className="ml-5 hidden sm:inline">
            {slide < 9 ? "Main deck" : "Common Hybrid Patterns · Annexure"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="mr-3 hidden text-[10px] text-slate-600 sm:inline">
            ← → to navigate
          </span>
          <button
            aria-label="Previous slide"
            disabled={slide === 0}
            onClick={() => setSlide(slide - 1)}
            className="rounded border border-white/15 px-4 py-1.5 text-sm hover:bg-white/5 disabled:opacity-25"
          >
            ←
          </button>
          <button
            aria-label="Next slide"
            disabled={slide === sections.length - 1}
            onClick={() => setSlide(slide + 1)}
            className="rounded border border-white/15 px-4 py-1.5 text-sm hover:bg-white/5 disabled:opacity-25"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  )
}
