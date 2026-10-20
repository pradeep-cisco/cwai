# Crosswork AI — Interaction Model Design Framework

## Purpose

This framework helps product and design teams decide **which interaction model should be used for a Crosswork AI workflow**.

The goal is not to make every capability conversational.

The core question is:

> **What is the best way for the user to accomplish this task?**

Crosswork AI should use three primary interaction models:

```text
Traditional UI  ─────  Hybrid  ─────  Conversational / Agentic
```

The interaction model should be selected based on the **nature of the user's job**, not simply because a capability uses AI.

A useful starting model:

```text
Known + predictable + structured
→ Traditional UI

Goal known + path unclear + reasoning-led
→ Conversational / Agentic

Reasoning + structured operational state
→ Hybrid
```

---

# 1. Interaction Models

Before designing a screen, agent, assistant, or workflow, determine which interaction model best fits the task.

The choice depends mainly on:

- how clearly the user knows what they want to do;
- whether inputs and outputs are predictable;
- how much reasoning is required;
- whether multiple sources or domains must be synthesised;
- how much structured state must remain visible;
- whether users need to compare, filter, select, or edit information;
- whether the result needs to persist;
- whether the task affects production;
- how much validation and control are required.

---

## 1.1 Traditional UI

Use Traditional UI when the task is known, structured, predictable, and precision matters more than reasoning.

### Best suited when

- the user already knows what they want to accomplish;
- inputs are known and predictable;
- fields or parameters must be precise;
- information must be scanned quickly;
- bulk operations are common;
- workflows need repeatability;
- users must compare records;
- configuration must remain inspectable;
- permissions and validation matter;
- mistakes may have significant consequences.

### Typical examples

- Cluster setup
- Certificate management
- User management
- RBAC
- MCP configuration
- LLM configuration
- DRA configuration
- Governance policies
- Agent permissions
- Infrastructure configuration

### Example — Certificate Management

The user works with predictable information:

```text
Certificate
CSR
SAN
Expiration
Associated nodes
Status
Renewal
```

A structured UI is better because the task requires precision, validation, comparison, repeatability, and clear state.

AI may still assist when reasoning is required:

> Why are these three nodes still using the old certificate?

Therefore:

```text
Certificate creation / renewal
→ Traditional UI

Certificate troubleshooting
→ Hybrid or Conversational
```

> **Guidance:** Do not replace predictable structured tasks with conversation simply because AI is available.

---

## 1.2 Conversational / Agentic

Use Conversational or Agentic interaction when natural language is a better way to express intent than navigation, filters, or forms.

### Best suited when

- user intent is ambiguous;
- the user knows the goal but not the path;
- the task involves exploration;
- reasoning across multiple domains is required;
- multiple data sources must be synthesised;
- follow-up questions are likely;
- users cannot easily express the query through filters;
- interpretation matters more than manipulation;
- the user may not know which product, agent, or data source owns the problem.

### Typical examples

- General Query Agent
- Open-ended network investigation
- Cross-domain troubleshooting
- Explaining incidents
- Explaining network behaviour
- Asking follow-up questions
- Understanding historical patterns
- Finding information across several network domains

### Example

Instead of navigating:

```text
Incidents
  ↓
Filter by service
  ↓
Filter by site
  ↓
Open device
  ↓
Review events
  ↓
Inspect routing
  ↓
Compare configuration
```

the user asks:

> Why did connectivity to HYD-23 degrade after 14:00?

Crosswork AI may internally use:

- Event Correlation
- DNT
- Topology
- Telemetry
- Configuration
- Historical information

The user expresses the goal instead of manually discovering the path.

> **Guidance:** Use conversation when the user knows the outcome they want, but not necessarily the path required to get there.

---

## 1.3 Hybrid

Use Hybrid when **AI reasoning and structured operational work need to coexist**.

Hybrid does **not** mean only:

> Chat + Canvas

That is one possible implementation pattern, not the definition.

### Definition

> **Hybrid combines AI reasoning with structured UI, allowing the interaction method to change as the task moves from intent and interpretation toward evidence, manipulation, validation, and action.**

Conversation may appear:

- at the beginning;
- during reasoning;
- when clarification is required;
- after the system produces a result;
- contextually inside an existing workflow;
- or not appear visually at all.

### Best suited when

- AI reasoning is required;
- significant structured state must remain visible;
- the user needs to inspect evidence;
- AI generates recommendations or conclusions;
- users need to compare, filter, select, or edit results;
- AI output must persist;
- the workflow moves between reasoning and control;
- users need to validate before taking action;
- actions may affect the production network;
- the result is better represented as a table, topology, timeline, diff, investigation, or another structured artifact.

### Typical examples

- Deep Network Troubleshooting
- Configuration Drift analysis
- Event Correlation
- Toxic Factor Detection
- Remediation
- Agent Evaluation
- Platform troubleshooting
- Incident investigation

### Example

The user asks:

> Fix this routing issue.

AI can interpret the problem and reason about remediation.

But the final action should become structured:

```text
Proposed Change

Devices affected       3
Services affected      12
Expected impact        Low

Configuration Diff

- Existing configuration
+ Proposed configuration

Pre-checks              ✓
Rollback available      ✓

[Modify]
[Simulate]
[Approve & Deploy]
```

> **Guidance:** Use AI for interpretation and reasoning; use structured UI for state, verification, manipulation, and action.

---

# 2. Example — Event Correlation

## Poor framing

> We have an Event Correlation Agent. What should its chat experience look like?

This assumes:

- the agent requires a dedicated UI;
- conversation should be the primary interaction;
- the user needs to understand the underlying agent architecture.

The technology begins to determine the UX.

## Better framing

Ask:

> **What interaction model best supports the user's Event Correlation job?**

Likely answer:

> **Hybrid**

The correlation itself can be represented structurally:

```text
487 raw events
      ↓
23 correlated groups
      ↓
3 incidents
```

The user primarily works with the resulting incidents and correlated groups.

Conversation becomes useful when interpretation is required:

> Why were these events grouped?

> Which event occurred first?

> Could these represent two independent failures?

The interaction naturally moves between:

```text
Structured correlated result
        ↓
Conversational reasoning
        ↓
Structured incident / evidence
```

> **Design the user's job first, not the agent interface first.**

---

# 3. Decision Framework

Use this framework at the **early stage of feature design** to determine whether the experience should primarily use:

- **Traditional UI**
- **Conversational / Agentic**
- **Hybrid**

The decision should be based on the **nature of the user task**, not on whether the capability happens to use AI.

```text
START
  │
  ▼
════════════════════════════════════════════════════
STAGE 1 — TASK CERTAINTY
How clearly is the task already defined?
════════════════════════════════════════════════════

Does the user already know exactly
what they want to accomplish?
  │
  ├── YES
  │    │
  │    ▼
  │  Are the inputs, actions, and expected
  │  outputs known and predictable?
  │    │
  │    ├── YES
  │    │    │
  │    │    ▼
  │    │  Does the task require meaningful
  │    │  reasoning or interpretation?
  │    │    │
  │    │    ├── NO
  │    │    │    ↓
  │    │    │  ★ TRADITIONAL UI
  │    │    │
  │    │    │  Examples:
  │    │    │  • Create / renew certificate
  │    │    │  • Configure MCP server
  │    │    │  • Add / manage users
  │    │    │  • Configure LLM endpoint
  │    │    │
  │    │    └── YES
  │    │         ↓
  │    │       Continue to Stage 2
  │    │
  │    │       Example:
  │    │       “Which configuration change
  │    │        caused this degradation?”
  │    │
  │    └── NO
  │         ↓
  │       Continue to Stage 2
  │
  └── NO
       │
       ▼
     Does the user know the desired outcome
     but not the path to achieve it?
       │
       ├── YES
       │    ↓
       │  Continue to Stage 2
       │
       │  Example:
       │  “Why is this service degraded?”
       │
       └── NO
            │
            ▼
          Is this primarily a known lookup,
          navigation, or structured task?
            │
            ├── YES
            │    ↓
            │  ★ TRADITIONAL UI
            │
            │  Examples:
            │  • Browse certificates
            │  • View users
            │  • Check cluster status
            │
            └── NO
                 ↓
               Reframe the task before
               choosing the interaction


════════════════════════════════════════════════════
STAGE 2 — REASONING NEED
How much interpretation should AI perform?
════════════════════════════════════════════════════

Does the task require exploration,
reasoning, synthesis, or explanation?
  │
  ├── NO
  │    ↓
  │  ★ TRADITIONAL UI
  │
  │  Examples:
  │  • Assign a role
  │  • Update a known configuration
  │  • Select devices and perform
  │    a predefined operation
  │
  └── YES
       │
       ▼
     Does the user know the goal
     but need the system to determine
     how to get there?
       │
       ├── YES
       │    ↓
       │  Strong indication for
       │  ★ CONVERSATIONAL / AGENTIC
       │
       │  Examples:
       │  • “Find the root cause of this incident.”
       │  • “Why is VPN-102 degraded?”
       │  • “What changed before the outage?”
       │
       └── NO
            │
            ▼
          Is interpretation still the
          primary user need?
            │
            ├── YES
            │    ↓
            │  ★ CONVERSATIONAL / AGENTIC
            │
            │  Examples:
            │  • “Explain this alarm.”
            │  • “Why were these events correlated?”
            │  • “Why is BGP the likely root cause?”
            │
            └── NO
                 ↓
               Continue to Stage 3

       │
       ▼
     Does the reasoning span multiple
     products, domains, or data sources?
       │
       ├── YES
       │    ↓
       │  Stronger indication for
       │  CONVERSATIONAL / AGENTIC
       │
       │  Example:
       │  “Why did this service fail after
       │   the maintenance window?”
       │
       │  Possible reasoning across:
       │  • Event Correlation
       │  • Configuration Drift
       │  • Topology
       │  • Telemetry
       │  • Routing
       │  • Historical state
       │
       └── NO
            ↓
          Continue based on the
          type of result required


════════════════════════════════════════════════════
STAGE 3 — RESULT STRUCTURE
What does the user need to do with the result?
════════════════════════════════════════════════════

Is the user mainly trying to:

A. Understand / ask / reason
B. Inspect / compare / manipulate / validate
  │
  ├── A
  │    ↓
  │  ★ CONVERSATIONAL / AGENTIC
  │
  │  Examples:
  │  • “Why is this alarm appearing?”
  │  • “Why were these events grouped?”
  │  • “What changed before the outage?”
  │
  └── B
       │
       ▼
     Does the result contain meaningful
     structured operational state?
       │
       │   Examples:
       │   • devices
       │   • services
       │   • incidents
       │   • hypotheses
       │   • evidence
       │   • topology
       │   • timelines
       │   • configuration differences
       │   • recommendations
       │   • validation results
       │
       ├── NO
       │    ↓
       │  CONVERSATIONAL / AGENTIC
       │  may remain sufficient
       │
       └── YES
            ↓
          ★ HYBRID

          Example:
          User asks:
          “Investigate packet loss at HYD-23.”

          The result contains:
          • affected services
          • hypotheses
          • evidence
          • validation
          • root cause

            │
            ▼
          Does the user need to:
          • compare
          • filter
          • select
          • edit
          • drill down
          • validate
          • approve
            │
            ├── YES
            │    ↓
            │  ★ HYBRID
            │
            │  Examples:
            │  • Compare config differences
            │  • Review hypotheses
            │  • Filter correlated events
            │  • Validate remediation
            │
            └── NO
                 ↓
               Lightweight HYBRID


════════════════════════════════════════════════════
STAGE 4 — ACTION & CONSEQUENCE
How much structure and control are required?
════════════════════════════════════════════════════

Does the workflow lead to a
network or platform action?
  │
  ├── NO
  │    ↓
  │  Keep the interaction model selected
  │  in the previous stages
  │
  └── YES
       │
       ▼
     What happens if the result
     or decision is wrong?
       │
       ├── LOW CONSEQUENCE
       │      ↓
       │   Conversational or
       │   lightweight Hybrid
       │
       │   Example:
       │   • Explanation
       │   • Informational recommendation
       │
       ├── MEDIUM CONSEQUENCE
       │      ↓
       │   ★ HYBRID
       │   + evidence
       │   + verification
       │
       │   Example:
       │   • Root-cause diagnosis
       │   • Remediation recommendation
       │
       └── HIGH CONSEQUENCE
              ↓
           ★ HYBRID +
             STRUCTURED CONTROLS

             Required visibility:
             • scope
             • impact
             • evidence
             • proposed change
             • validation
             • approval
             • rollback
             • audit

             Examples:
             • Production configuration change
             • Traffic rerouting
             • Policy deployment
             • Service-impacting remediation


════════════════════════════════════════════════════
FINAL INTERACTION MODEL
════════════════════════════════════════════════════

TRADITIONAL UI
Known task
+ predictable inputs
+ repeatable workflow
+ limited reasoning
+ precision / manipulation important

Examples:
• Certificate creation
• MCP setup
• User management
• Cluster configuration
• LLM configuration


CONVERSATIONAL / AGENTIC
Goal known
+ path unclear
+ reasoning / exploration central
+ interpretation more important than manipulation

Examples:
• Explain an incident
• Find likely root cause
• Understand network behaviour
• Ask a cross-domain operational question


HYBRID
Reasoning required
+ structured operational state
+ evidence needs inspection
+ results need manipulation / validation
+ user may need to take action

Examples:
• DNT investigation
• Event Correlation
• Configuration Drift analysis
• Remediation
• Agent Evaluation
```

> **Simple guidance:**  
> **Known work → Traditional UI**  
> **Goal known, path unknown → Conversational / Agentic**  
> **Reasoning + operational state/control → Hybrid**

---

# 4. Quick Characteristics Guide

| Characteristics of the task | Recommended Interaction Model |
|---|---|
| User knows exactly what to do | Traditional UI |
| Inputs are predictable | Traditional UI |
| Task is repetitive | Traditional UI |
| Precision is more important than reasoning | Traditional UI |
| Bulk operations are common | Traditional UI |
| User needs to compare or scan many records | Traditional UI |
| User knows the goal but not the path | Conversational / Agentic |
| Intent is difficult to express through filters | Conversational / Agentic |
| Exploration is required | Conversational / Agentic |
| Multiple domains must be synthesised | Conversational / Agentic |
| Follow-up reasoning is expected | Conversational / Agentic |
| AI reasoning + visible operational state | Hybrid |
| AI produces evidence that must be inspected | Hybrid |
| AI recommendation needs verification | Hybrid |
| Results need filtering or manipulation | Hybrid |
| AI result becomes persistent product state | Hybrid |
| Workflow eventually changes the network | Hybrid moving toward structured controls |

---

# 5. Core Principle

> **Use Traditional UI for known and predictable work, Conversational / Agentic interaction for reasoning-led work where the goal is clearer than the path, and Hybrid when reasoning must coexist with structured operational state, verification, or control.**

---

# Annexure A — Common Hybrid Patterns

Hybrid should be treated as a family of reusable interaction patterns rather than one fixed layout.

## A1. Conversational Entry → Structured Result

```text
“Show sites with packet loss since yesterday”
                 ↓
Structured table / topology / incident list
```

**Best for:** Query, search, discovery, reporting.

**Principle:** Language finds. UI manipulates.

---

## A2. Structured Context → Conversational Reasoning

```text
Incident INC-20142

“Why do you think BGP is the root cause?”
```

The AI receives the current incident context automatically.

**Best for:** Incident, device, topology, configuration, and service views.

---

## A3. AI Recommendation Embedded in Structured UI

```text
Configuration Drift

17 differences

AI Assessment
3 are operationally significant.
```

**Best for:** Drift, alarms, evaluation, capacity, security, and operational assessment.

---

## A4. Guided AI Workflow

```text
Issue
  ↓
Symptoms
  ↓
Time range
  ↓
Investigation
```

The interaction may feel conversational while progressively creating a structured task definition.

**Best for:** Troubleshooting and progressive input collection.

---

## A5. AI Proposes → UI Verifies

```text
AI Recommendation
       ↓
Configuration Diff
       ↓
Impact
       ↓
Simulation
       ↓
Approval
```

**Best for:** Remediation and production changes.

---

## A6. Insight → Investigation

```text
Potential service degradation detected

[Investigate]
```

The insight is represented structurally and deeper reasoning becomes available when needed.

**Best for:** Correlation, TFD, incidents, anomaly detection, and service assurance.

---

## A7. AI Operates → Progress Shown as State

```text
✓ Service checked
✓ Transport checked
● Routing analysing
○ Configuration comparison
```

**Best for:** Long-running investigations and multi-step agentic workflows.

---

# Final Position

Do not begin with:

> **What should the AI chat look like?**

Begin with:

> **What is the nature of the user's task, and which interaction model makes that task easiest, safest, and clearest?**

Use:

```text
TASK CERTAINTY
      ↓
REASONING NEED
      ↓
RESULT STRUCTURE
      ↓
ACTION & CONSEQUENCE
      ↓
INTERACTION MODEL
```

Which ultimately maps to:

```text
TRADITIONAL UI
Known + structured + predictable

CONVERSATIONAL / AGENTIC
Goal known + path unclear + reasoning-led

HYBRID
Reasoning + structured state + verification + control
```

The overall design objective is:

> **Create an AI-native network controller where each task uses the interaction model that best supports user intent, operational understanding, precision, trust, and control.**
