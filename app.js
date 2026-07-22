const scenarios = {
  service: {
    name: "Customer service response preparation",
    purpose: "Help a representative gather product, order and policy context before composing a customer response—without transferring answer ownership to the model.",
    decision: "Commission a bounded assist pilot",
    reason: "The workflow has a clear human owner, a narrow AI role and evidence that can be observed quickly.",
    owner: "Customer Service leadership",
    enablement: "Practice with real cases + office hours",
    scale: "Sustained quality, use and confidence",
    rows: {
      job: ["Repeated context gathering", "High-frequency preparation work with visible handoffs and rework.", 88],
      context: ["Curated source set", "Product, order and approved policy context with source visibility.", 72],
      ai: ["Prepare and draft", "Retrieve, summarize and propose; do not send or commit.", 76],
      authority: ["Representative owns the answer", "Named specialist escalation for exceptions and uncertainty.", 92],
      proof: ["Quality, time and confidence", "Compare preparation time, correction rate, escalation and user confidence.", 80]
    }
  },
  procurement: {
    name: "Procurement and category brief",
    purpose: "Assemble supplier, assortment and cost signals into a reviewable brief so category leaders can see changes faster while retaining commercial judgment.",
    decision: "Run a discovery sprint before pilot",
    reason: "The value hypothesis is credible, but source consistency, data ownership and decision boundaries must be verified first.",
    owner: "Procurement / Category leadership",
    enablement: "Analyst co-design + source literacy",
    scale: "Trusted data + repeatable decision use",
    rows: {
      job: ["Fragmented decision preparation", "Signals may span systems, documents and supplier communication.", 82],
      context: ["Data alignment required", "Source definitions, freshness and ownership need discovery.", 48],
      ai: ["Analyze and brief", "Surface patterns and alternatives; never negotiate or approve.", 66],
      authority: ["Category leader owns the call", "Finance and legal review where thresholds or terms require it.", 86],
      proof: ["Decision latency and completeness", "Measure preparation cycle, missing context and analyst confidence.", 62]
    }
  },
  fulfillment: {
    name: "Fulfillment exception triage",
    purpose: "Prioritize exceptions and assemble operational context for human dispatch, while preserving local authority over customer and safety consequences.",
    decision: "Commission a tightly bounded pilot",
    reason: "The work can support rapid learning, but exception classes, fallback and real-time data reliability must be explicit.",
    owner: "Fulfillment Operations leadership",
    enablement: "Shift huddles + exception playbook",
    scale: "Reliable routing + fewer recurring exceptions",
    rows: {
      job: ["Time-sensitive exception queue", "Repeated triage competes with customer and operating attention.", 92],
      context: ["Operational data path", "Availability, order, carrier and exception signals need verified freshness.", 64],
      ai: ["Classify and prepare", "Rank, explain and recommend; a human dispatches or escalates.", 72],
      authority: ["Operations owns disposition", "Explicit override, rollback and safety/customer escalation.", 94],
      proof: ["Time, repeat rate and service", "Measure queue age, rework, recurrence and customer consequence.", 76]
    }
  },
  finance: {
    name: "Finance discrepancy review",
    purpose: "Assemble supporting records and explain likely discrepancy patterns so finance professionals can investigate faster without automating approval or posting.",
    decision: "Hold for control and data mapping",
    reason: "The potential value is clear, but auditability, source-of-record rules and approval boundaries must be proven before a pilot.",
    owner: "Finance leadership",
    enablement: "Control-owner review + audit examples",
    scale: "Traceable evidence + lower investigation effort",
    rows: {
      job: ["Repeated reconciliation effort", "Manual evidence gathering can delay investigation and close work.", 78],
      context: ["Controlled source-of-record map", "Reconciliation lineage and access rules require explicit validation.", 42],
      ai: ["Assemble and explain", "Identify patterns and supporting records; never approve or post.", 58],
      authority: ["Finance owns disposition", "Named approver, audit trail and escalation for material exceptions.", 96],
      proof: ["Completeness, traceability and time", "Measure investigation effort, missing evidence and correction rate.", 55]
    }
  }
};

const rowMap = {
  job: ["jobTitle", "jobText", "trackJob"],
  context: ["contextTitle", "contextText", "trackContext"],
  ai: ["aiTitle", "aiText", "trackAi"],
  authority: ["authorityTitle", "authorityText", "trackAuthority"],
  proof: ["proofTitle", "proofText", "trackProof"]
};

let activeScenario = "service";
let updateToken = 0;

function setScenario(key, announce = true) {
  if (!scenarios[key]) return;
  activeScenario = key;
  const token = ++updateToken;
  const scenario = scenarios[key];

  document.querySelectorAll(".scenario-tab").forEach((button) => {
    const selected = button.dataset.scenario === key;
    button.setAttribute("aria-pressed", String(selected));
  });

  const pairs = {
    scenarioName: scenario.name,
    scenarioPurpose: scenario.purpose,
    scenarioDecision: scenario.decision,
    scenarioReason: scenario.reason,
    scenarioOwner: scenario.owner,
    scenarioEnablement: scenario.enablement,
    scenarioScale: scenario.scale
  };

  Object.entries(pairs).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  });

  Object.entries(scenario.rows).forEach(([rowKey, values]) => {
    const [titleId, textId, trackId] = rowMap[rowKey];
    document.getElementById(titleId).textContent = values[0];
    document.getElementById(textId).textContent = values[1];
    const track = document.getElementById(trackId);
    track.style.setProperty("--level", "0%");
    requestAnimationFrame(() => {
      if (token === updateToken) track.style.setProperty("--level", `${values[2]}%`);
    });
  });

  if (announce) {
    const liveRegion = document.querySelector(".fit-map");
    liveRegion.setAttribute("aria-label", `${scenario.name}. Decision: ${scenario.decision}.`);
  }
}

function initialize() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("siteNav");
  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }));

  const tabs = [...document.querySelectorAll(".scenario-tab")];
  tabs.forEach((button, index) => {
    button.addEventListener("click", () => setScenario(button.dataset.scenario));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      setScenario(tabs[nextIndex].dataset.scenario);
    });
  });

  document.getElementById("resetScenario")?.addEventListener("click", () => setScenario("service"));
  setScenario(activeScenario, false);
  const assembly = document.getElementById("heroAssembly");
  window.setTimeout(() => assembly?.classList.add("is-settled"), 1450);
}

document.addEventListener("DOMContentLoaded", initialize);
