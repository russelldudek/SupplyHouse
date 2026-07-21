const scenarios = {
  service: {
    name: "Customer service knowledge assist",
    label: "Illustrative baseline",
    decision: "Commission a bounded pilot",
    outcome: "Reduce search and drafting effort while preserving agent judgment and escalation.",
    authority: "Service representative owns the customer answer; specialists own exceptions.",
    owner: "Customer Service leader with IT, Knowledge, Legal and frontline champions.",
    evidence: "Resolution time, answer quality review, escalation rate, adoption, confidence and customer feedback.",
    short: "Useful answer, named authority, measured confidence."
  },
  procurement: {
    name: "Procurement and category insight",
    label: "Illustrative scenario",
    decision: "Explore with a discovery sprint",
    outcome: "Surface supplier, assortment and cost signals without automating commercial judgment.",
    authority: "Category and procurement leaders retain sourcing, pricing and vendor decisions.",
    owner: "Procurement leader with Finance, Data and selected category champions.",
    evidence: "Analysis cycle time, recommendation acceptance, exception quality and avoided rework.",
    short: "Faster analysis, commercial authority retained."
  },
  operations: {
    name: "Operations exception triage",
    label: "Illustrative scenario",
    decision: "Commission a workflow pilot",
    outcome: "Turn cross-system exceptions into prioritized, explainable actions for operators.",
    authority: "Operations owns intervention; IT and Data own reliability and observability.",
    owner: "Operations leader with site champions, IT and continuous improvement.",
    evidence: "Time to triage, repeat exceptions, action completion, operator confidence and throughput impact.",
    short: "Exceptions become owned work, not another dashboard."
  },
  sales: {
    name: "Sales and account preparation",
    label: "Illustrative scenario",
    decision: "Pilot with controlled data access",
    outcome: "Prepare relevant account context and next-best actions without inventing customer facts.",
    authority: "Sales representative owns outreach, commitments and account strategy.",
    owner: "Sales leader with CRM, Legal, Data and a small ambassador cohort.",
    evidence: "Preparation time, usage depth, conversion-quality indicators and seller trust.",
    short: "More relevant preparation; no synthetic customer promises."
  },
  finance: {
    name: "Finance variance and close support",
    label: "Illustrative scenario",
    decision: "Explore after control review",
    outcome: "Accelerate evidence gathering and variance explanation while preserving financial controls.",
    authority: "Finance owns conclusions, approvals, postings and external reporting.",
    owner: "Finance leader with IT, Data, Legal and control owners.",
    evidence: "Cycle time, review corrections, audit trace completeness and analyst confidence.",
    short: "Faster evidence assembly, unchanged financial authority."
  }
};

function setScenario(key, replay=true) {
  const s = scenarios[key];
  if (!s) return;
  document.querySelectorAll('.scenario-button').forEach(btn => {
    const active = btn.dataset.scenario === key;
    btn.setAttribute('aria-pressed', String(active));
  });
  const map = {
    scenarioName: s.name,
    scenarioLabel: s.label,
    decisionChip: s.decision,
    outcomeReadout: s.outcome,
    authorityReadout: s.authority,
    ownerReadout: s.owner,
    evidenceReadout: s.evidence,
    boardVerdict: s.short
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
  const pipeline = document.getElementById('pipeline');
  if (pipeline) {
    pipeline.classList.remove('run');
    pipeline.querySelectorAll('.gate').forEach(g => g.classList.remove('is-active'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !replay) {
      pipeline.querySelectorAll('.gate').forEach(g => g.classList.add('is-active'));
    } else {
      void pipeline.offsetWidth;
      pipeline.classList.add('run');
      window.setTimeout(() => pipeline.querySelectorAll('.gate').forEach(g => g.classList.add('is-active')), 1880);
    }
  }
  const live = document.getElementById('scenarioLive');
  if (live) live.textContent = `${s.name}. ${s.decision}.`;
}

function replayHero() {
  const pulse = document.querySelector('.hero-pulse');
  if (!pulse || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  pulse.classList.remove('run');
  void pulse.getBoundingClientRect();
  pulse.classList.add('run');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scenario-button').forEach(btn => btn.addEventListener('click', () => setScenario(btn.dataset.scenario)));
  document.getElementById('replayPipeline')?.addEventListener('click', () => {
    const current = document.querySelector('.scenario-button[aria-pressed="true"]')?.dataset.scenario || 'service';
    setScenario(current, true);
  });
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded','false');
  }));
  setScenario('service', false);
  window.setTimeout(replayHero, 450);
});
