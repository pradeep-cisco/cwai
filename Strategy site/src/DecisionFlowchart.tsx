import { useId } from "react"

type FlowNode = {
  title: string
  kind?: "decision" | "ui" | "agent" | "hybrid" | "continue" | "stop"
  detail?: string
  examples?: string[]
  items?: string[]
  target?: number
  branches?: {
    label: string
    node: FlowNode
  }[]
  after?: FlowNode
}
const ui = (examples: string[]): FlowNode => ({
  title: "Traditional UI",
  kind: "ui",
  examples,
})
const go = (target: number, examples?: string[]): FlowNode => ({
  title: `Continue to Stage ${target}`,
  kind: "continue",
  target,
  examples,
})
const agent = (detail: string, examples: string[]): FlowNode => ({
  title: "Conversational / Agentic",
  kind: "agent",
  detail,
  examples,
})
const branch = (label: string, node: FlowNode) => ({ label, node })
const question = (
  title: string,
  branches: FlowNode["branches"],
  items?: string[],
): FlowNode => ({ title, branches, items })

const stages: {
  name: string
  subtitle: string
  root: FlowNode
}[] = [
  {
    name: "Task certainty",
    subtitle: "How clearly is the task already defined?",
    root: question(
      "Does the user already know exactly what they want to accomplish?",
      [
        branch(
          "YES",
          question(
            "Are the inputs, actions, and expected outputs known and predictable?",
            [
              branch(
                "YES",
                question(
                  "Does the task require meaningful reasoning or interpretation?",
                  [
                    branch(
                      "NO",
                      ui([
                        "Create / renew certificate",
                        "Configure MCP server",
                        "Add / manage users",
                        "Configure LLM endpoint",
                      ]),
                    ),
                    branch(
                      "YES",
                      go(2, [
                        "Which configuration change caused this degradation?",
                      ]),
                    ),
                  ],
                ),
              ),
              branch("NO", go(2)),
            ],
          ),
        ),
        branch(
          "NO",
          question(
            "Does the user know the desired outcome but not the path to achieve it?",
            [
              branch("YES", go(2, ["Why is this service degraded?"])),
              branch(
                "NO",
                question(
                  "Is this primarily a known lookup, navigation, or structured task?",
                  [
                    branch(
                      "YES",
                      ui([
                        "Browse certificates",
                        "View users",
                        "Check cluster status",
                      ]),
                    ),
                    branch("NO", {
                      title: "Reframe the task before choosing the interaction",
                      kind: "stop",
                    }),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  },
  {
    name: "Reasoning need",
    subtitle: "How much interpretation should AI perform?",
    root: question(
      "Does the task require exploration, reasoning, synthesis, or explanation?",
      [
        branch(
          "NO",
          ui([
            "Assign a role",
            "Update a known configuration",
            "Select devices and perform a predefined operation",
          ]),
        ),
        branch("YES", {
          ...question(
            "Does the user know the goal but need the system to determine how to get there?",
            [
              branch(
                "YES",
                agent("Strong indication", [
                  "Find the root cause of this incident.",
                  "Why is VPN-102 degraded?",
                  "What changed before the outage?",
                ]),
              ),
              branch(
                "NO",
                question("Is interpretation still the primary user need?", [
                  branch(
                    "YES",
                    agent("Interpretation is the primary need", [
                      "Explain this alarm.",
                      "Why were these events correlated?",
                      "Why is BGP the likely root cause?",
                    ]),
                  ),
                  branch("NO", go(3)),
                ]),
              ),
            ],
          ),
          after: question(
            "Does the reasoning span multiple products, domains, or data sources?",
            [
              branch("YES", {
                ...agent("Stronger indication", [
                  "Why did this service fail after the maintenance window?",
                ]),
                items: [
                  "Event Correlation",
                  "Configuration Drift",
                  "Topology",
                  "Telemetry",
                  "Routing",
                  "Historical state",
                ],
                after: go(3),
              }),
              branch("NO", {
                ...go(3),
                title: "Continue based on the type of result required",
              }),
            ],
          ),
        }),
      ],
    ),
  },
  {
    name: "Result structure",
    subtitle: "What does the user need to do with the result?",
    root: question(
      "Is the user mainly trying to understand—or inspect and manipulate?",
      [
        branch(
          "A · UNDERSTAND / ASK / REASON",
          agent("Understanding and reasoning", [
            "Why is this alarm appearing?",
            "Why were these events grouped?",
            "What changed before the outage?",
          ]),
        ),
        branch(
          "B · INSPECT / COMPARE / MANIPULATE / VALIDATE",
          question(
            "Does the result contain meaningful structured operational state?",
            [
              branch("NO", {
                title: "Conversational / Agentic may remain sufficient",
                kind: "agent",
              }),
              branch("YES", {
                title: "Hybrid",
                kind: "hybrid",
                examples: ["Investigate packet loss at HYD-23."],
                items: [
                  "Affected services",
                  "Hypotheses",
                  "Evidence",
                  "Validation",
                  "Root cause",
                ],
                after: question(
                  "Does the user need to compare, filter, select, edit, drill down, validate, or approve?",
                  [
                    branch("YES", {
                      title: "Hybrid",
                      kind: "hybrid",
                      examples: [
                        "Compare config differences",
                        "Review hypotheses",
                        "Filter correlated events",
                        "Validate remediation",
                      ],
                    }),
                    branch("NO", {
                      title: "Lightweight Hybrid",
                      kind: "hybrid",
                    }),
                  ],
                ),
              }),
            ],
            [
              "Devices",
              "Services",
              "Incidents",
              "Hypotheses",
              "Evidence",
              "Topology",
              "Timelines",
              "Configuration differences",
              "Recommendations",
              "Validation results",
            ],
          ),
        ),
      ],
    ),
  },
  {
    name: "Action & consequence",
    subtitle: "How much structure and control are required?",
    root: question("Does the workflow lead to a network or platform action?", [
      branch("NO", {
        title: "Keep the interaction model selected in the previous stages",
        kind: "continue",
      }),
      branch(
        "YES",
        question("What happens if the result or decision is wrong?", [
          branch("LOW CONSEQUENCE", {
            title: "Conversational or lightweight Hybrid",
            kind: "agent",
            examples: ["Explanation", "Informational recommendation"],
          }),
          branch("MEDIUM CONSEQUENCE", {
            title: "Hybrid",
            kind: "hybrid",
            detail: "Evidence + verification",
            examples: ["Root-cause diagnosis", "Remediation recommendation"],
          }),
          branch("HIGH CONSEQUENCE", {
            title: "Hybrid + structured controls",
            kind: "hybrid",
            detail: "Required visibility",
            items: [
              "Scope",
              "Impact",
              "Evidence",
              "Proposed change",
              "Validation",
              "Approval",
              "Rollback",
              "Audit",
            ],
            examples: [
              "Production configuration change",
              "Traffic rerouting",
              "Policy deployment",
              "Service-impacting remediation",
            ],
          }),
        ]),
      ),
    ]),
  },
]

const outcomes: FlowNode[] = [
  {
    title: "Traditional UI",
    kind: "ui",
    items: [
      "Known task",
      "Predictable inputs",
      "Repeatable workflow",
      "Limited reasoning",
      "Precision / manipulation important",
    ],
    examples: [
      "Certificate creation",
      "MCP setup",
      "User management",
      "Cluster configuration",
      "LLM configuration",
    ],
  },
  {
    title: "Conversational / Agentic",
    kind: "agent",
    items: [
      "Goal known",
      "Path unclear",
      "Reasoning / exploration central",
      "Interpretation more important than manipulation",
    ],
    examples: [
      "Explain an incident",
      "Find likely root cause",
      "Understand network behaviour",
      "Ask a cross-domain operational question",
    ],
  },
  {
    title: "Hybrid",
    kind: "hybrid",
    items: [
      "Reasoning required",
      "Structured operational state",
      "Evidence needs inspection",
      "Results need manipulation / validation",
      "User may need to take action",
    ],
    examples: [
      "DNT investigation",
      "Event Correlation",
      "Configuration Drift analysis",
      "Remediation",
      "Agent Evaluation",
    ],
  },
]

function width(node: FlowNode): number {
  const children =
    node.branches?.reduce((total, child) => total + width(child.node), 0) ?? 320
  return Math.max(children, node.after ? width(node.after) : 320)
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="relative mx-auto flex h-16 w-80 items-center justify-center">
      <svg
        aria-hidden="true"
        width="20"
        height="64"
        viewBox="0 0 20 64"
        className="text-slate-500"
      >
        <path
          d="M10 0v55m-5-5 5 5 5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {label && (
        <span className="absolute left-[175px] whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
      )}
    </div>
  )
}

function NodeCard({ node }: { node: FlowNode }) {
  const kind = node.kind ?? "decision"
  const palette = {
    decision: "border-[#3d536d] bg-[#15263a] text-slate-100",
    ui: "border-sky-400/40 bg-[#10263a] text-sky-200",
    agent: "border-teal-400/35 bg-[#102a2b] text-teal-200",
    hybrid: "border-violet-400/40 bg-[#211f36] text-violet-200",
    continue: "border-dashed border-slate-500/50 bg-[#111c29] text-slate-300",
    stop: "border-amber-400/30 bg-[#292317] text-amber-200",
  }
  const card = (
    <div
      className={`mx-auto w-[280px] rounded-xl border p-5 shadow-[0_4px_16px_#0002] ${palette[kind]}`}
    >
      <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] opacity-70">
        {kind === "decision" ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
          >
            <path d="m6 1 5 5-5 5-5-5Z" />
          </svg>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {kind === "decision"
          ? "Decision"
          : kind === "continue"
            ? "Stage reference"
            : kind === "stop"
              ? "Reframe"
              : "Interaction model"}
      </div>
      <h3 className="text-[14px] font-semibold leading-[1.6]">{node.title}</h3>
      {node.detail && (
        <p className="mt-2 text-[12px] leading-5 opacity-80">{node.detail}</p>
      )}
      {node.items && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {node.items.map((item) => (
            <li
              key={item}
              className="rounded border border-white/10 bg-black/10 px-2 py-1 text-[10px] leading-4 text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
      {node.examples && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="mb-2 text-[9px] uppercase tracking-wider text-slate-500">
            Examples
          </div>
          <ul className="space-y-1.5 text-[12px] leading-5 text-slate-400">
            {node.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </div>
      )}
      {node.target && (
        <div className="mt-3 text-xs text-sky-300">
          Go to stage {node.target} ↓
        </div>
      )}
    </div>
  )
  return node.target ? (
    <a
      className="block rounded-xl outline-offset-4 hover:brightness-125"
      href={`#flow-stage-${node.target}`}
    >
      {card}
    </a>
  ) : (
    card
  )
}

function FlowBranch({ node }: { node: FlowNode }) {
  const markerId = useId().replace(/:/g, "")
  const total = width(node)
  const children = node.branches ?? []
  const childrenWidth = children.reduce(
    (sum, child) => sum + width(child.node),
    0,
  )
  let offset = (total - childrenWidth) / 2
  const positions = children.map((child) => {
    const childWidth = width(child.node)
    const center = offset + childWidth / 2
    offset += childWidth
    return { child, childWidth, center }
  })
  return (
    <div className="shrink-0" style={{ width: total }}>
      <NodeCard node={node} />
      {children.length > 0 && (
        <>
          <div className="relative h-[82px]">
            <svg
              aria-hidden="true"
              width={total}
              height="82"
              className="absolute inset-0 overflow-visible"
            >
              <defs>
                <marker
                  id={markerId}
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0 0 6 3 0 6"
                    fill="none"
                    stroke="#647f9b"
                    strokeWidth="1.2"
                  />
                </marker>
              </defs>
              <path
                d={`M${total / 2} 0V28`}
                stroke="#647f9b"
                strokeWidth="1.5"
                fill="none"
              />
              {positions.map(({ center }, index) => (
                <path
                  key={index}
                  d={`M${total / 2} 28H${center}V77`}
                  stroke="#647f9b"
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd={`url(#${markerId})`}
                />
              ))}
            </svg>
            {positions.map(({ child, center }) => (
              <span
                key={child.label}
                style={{ left: center }}
                className="absolute top-[39px] -translate-x-1/2 whitespace-nowrap rounded border border-slate-600/50 bg-[#0b1420] px-2 py-1 text-[9px] font-semibold tracking-wider text-slate-300"
              >
                {child.label}
              </span>
            ))}
          </div>
          <div className="flex justify-center">
            {positions.map(({ child }) => (
              <FlowBranch key={child.label} node={child.node} />
            ))}
          </div>
        </>
      )}
      {node.after && (
        <>
          <Arrow label="Continue assessment" />
          <div className="flex justify-center">
            <FlowBranch node={node.after} />
          </div>
        </>
      )}
    </div>
  )
}

export default function DecisionFlowchart() {
  const canvasWidth = Math.max(...stages.map((stage) => width(stage.root))) + 96
  return (
    <div className="w-max pb-8">
      <header className="mb-8 max-w-[850px]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300">
          Task-level selection · within every experience mode
        </div>
        <h1 className="mt-4 text-[44px] font-semibold leading-[1.16] text-white">
          Follow the task. Choose the interaction.
        </h1>
        <p className="mt-5 text-[15px] leading-7 text-slate-400">
          Assess task certainty, reasoning need, result structure and action
          consequences to choose the interaction model.
        </p>
        <a
          href={`${import.meta.env.BASE_URL}downloads/crosswork-ai-decision-tree.pdf`}
          download="crosswork-ai-decision-tree.pdf"
          className="mt-5 inline-flex items-center gap-2 rounded border border-white/15 px-4 py-2 text-sm text-sky-300 transition-colors hover:bg-white/5"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5" />
          </svg>
          Download PDF
        </a>
      </header>
      <div
        className="rounded-2xl border border-white/10 bg-[#0b1420] px-12 py-10"
        style={{ width: canvasWidth }}
        role="region"
        aria-label="Four-stage interaction-model decision flowchart"
      >
        <div className="mx-auto w-fit rounded-full border border-sky-400/40 bg-sky-400/10 px-7 py-2.5 text-xs font-semibold tracking-wider text-sky-200">
          START
        </div>
        <Arrow />
        {stages.map((stage, index) => (
          <section
            key={stage.name}
            id={`flow-stage-${index + 1}`}
            className="scroll-mt-8"
          >
            <div className="mx-auto mb-7 flex w-[560px] items-center gap-4 rounded-xl border border-white/10 bg-[#111e2e] px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-300/10 text-sm font-semibold text-sky-300">
                0{index + 1}
              </span>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {stage.name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">{stage.subtitle}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <FlowBranch node={stage.root} />
            </div>
            <Arrow
              label={
                index === 3
                  ? "Final interaction model"
                  : `Continue assessment · Stage ${index + 2}`
              }
            />
          </section>
        ))}
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
          Final interaction model
        </h2>
        <div className="flex justify-center gap-10">
          {outcomes.map((node) => (
            <NodeCard key={node.title} node={node} />
          ))}
        </div>
      </div>
      <p className="mt-4 text-[11px] text-slate-500">
        Source: Crosswork AI — Interaction Model Design Framework, §3.
      </p>
    </div>
  )
}
