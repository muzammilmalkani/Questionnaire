// ============================================================
// Inspeq Discovery — In-Browser Database (localStorage)
// Production: replace DB.* calls with fetch() to your REST API
// ============================================================

const DB = (() => {

  const KEYS = {
    QUESTIONNAIRES: 'inspeq_questionnaires',
    QUESTIONS:      'inspeq_questions',
    SUBMISSIONS:    'inspeq_submissions',
    ANSWERS:        'inspeq_answers',
    UPLOADS:        'inspeq_uploads',
    ADMIN:          'inspeq_admin_session',
  };

  const uid  = () => 'id_' + Math.random().toString(36).slice(2,11) + Date.now().toString(36);
  const now  = () => new Date().toISOString();
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  const read    = k => { try { return JSON.parse(localStorage.getItem(k)||'[]'); } catch { return []; } };
  const write   = (k,d) => localStorage.setItem(k, JSON.stringify(d));
  const readOne = k => { try { return JSON.parse(localStorage.getItem(k)||'null'); } catch { return null; } };
  const writeOne= (k,d) => localStorage.setItem(k, JSON.stringify(d));

  // ─── Seed ────────────────────────────────────────────────
  function seed() {
    if (localStorage.getItem('inspeq_seeded_v3')) return;
    // clear old seeds
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));

    const questionnaires = [
      // ── FEATURED: Customer Discovery ─────────────────────
      {
        id: 'qCD', title: 'Customer Discovery',
        description: 'Help us understand your business, how your customers currently run inspections, and where the biggest friction sits — so we can show you exactly how Inspeq solves it.',
        category: 'General', slug: 'customer-discovery',
        is_active: true, featured: true,
        created_at: now(), updated_at: now()
      },
      // ── Others ───────────────────────────────────────────
      {
        id: 'q1', title: 'Manufacturing & Safety Operations',
        description: 'Help us understand your current inspection workflows, safety protocols, and maintenance challenges so we can tailor Inspeq to your factory floor needs.',
        category: 'Manufacturing', slug: 'manufacturing-safety-operations',
        is_active: true, created_at: now(), updated_at: now()
      },
      {
        id: 'q2', title: 'Field Service & Technician Workflows',
        description: 'Tell us about how your field teams manage job assignments, reporting, and client communication. We\'ll show you how to cut admin time in half.',
        category: 'Field Operations', slug: 'field-service-technician-workflows',
        is_active: true, created_at: now(), updated_at: now()
      },
      {
        id: 'q3', title: 'Construction Site Inspection Discovery',
        description: 'Walk us through your site safety checks, snag reporting, and contractor management. We\'ll map out a tailored Inspeq workflow for your projects.',
        category: 'Construction', slug: 'construction-site-inspection-discovery',
        is_active: true, created_at: now(), updated_at: now()
      },
      {
        id: 'q4', title: 'Facility Management Assessment',
        description: 'Share your current approach to planned maintenance, compliance tracking, and vendor coordination across your facilities.',
        category: 'Facility Management', slug: 'facility-management-assessment',
        is_active: true, created_at: now(), updated_at: now()
      },
      {
        id: 'q5', title: 'Energy & Utilities Operations Review',
        description: 'Describe your asset monitoring, regulatory compliance workflows, and field crew coordination to help us configure the right inspection templates.',
        category: 'Energy & Utilities', slug: 'energy-utilities-operations-review',
        is_active: true, created_at: now(), updated_at: now()
      },
      {
        id: 'q6', title: 'Insurance Inspection & Claims Discovery',
        description: 'Help us understand your assessment cycles, documentation standards, and claims reporting to streamline your adjusters\' field work.',
        category: 'Insurance', slug: 'insurance-inspection-claims-discovery',
        is_active: true, created_at: now(), updated_at: now()
      },
    ];

    // ── Questions for Customer Discovery ──────────────────
    const cdQuestions = [
      // Section 1 — Their business & customer base
      { id:'cd1',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base',
        label:'Can you walk me through what your business does and how inspections fit into what you deliver for your customers?',
        field_type:'textarea', is_required:true,  options_json:null, sort_order:1  },
      { id:'cd2',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base',
        label:'How many end-customers do you currently manage, and does that number fluctuate throughout the year?',
        field_type:'text',     is_required:true,  options_json:null, sort_order:2  },
      { id:'cd3',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base',
        label:'What types of equipment or assets are your customers typically inspecting?',
        field_type:'textarea', is_required:true,  options_json:null, sort_order:3  },
      { id:'cd4',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base',
        label:'Are your customers businesses themselves, or individual operators / end users?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['Businesses (B2B)','Individual operators / end users','Mix of both']),
        sort_order:4 },

      // Section 2 — Current inspection process
      { id:'cd5',  questionnaire_id:'qCD', section:'2. Current Inspection Process',
        label:'How do your customers currently submit inspection reports to you?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Paper forms','Spreadsheets (Excel / Google Sheets)','Photos on WhatsApp / messaging','Email attachments','A dedicated software or app','No formal process yet','Other']),
        sort_order:5 },
      { id:'cd6',  questionnaire_id:'qCD', section:'2. Current Inspection Process',
        label:'Who typically carries out the inspection on your customer\'s side?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['A dedicated inspector / technician','Whoever is available at the time','The customer themselves','A third-party contractor','Varies significantly by customer']),
        sort_order:6 },
      { id:'cd7',  questionnaire_id:'qCD', section:'2. Current Inspection Process',
        label:'How often does each customer typically submit an inspection?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['Daily','Weekly','Monthly','Quarterly','Only when something breaks','It varies widely between customers']),
        sort_order:7 },
      { id:'cd8',  questionnaire_id:'qCD', section:'2. Current Inspection Process',
        label:'Once a customer submits an inspection, what happens next on your end? Who reviews it and what actions follow?',
        field_type:'textarea', is_required:true,  options_json:null, sort_order:8  },
      { id:'cd9',  questionnaire_id:'qCD', section:'2. Current Inspection Process',
        label:'Do all your customers follow the same inspection process, or does it vary significantly between them?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['Same process across all customers','Slightly different per customer','Very different — each customer has their own process','We don\'t have a defined process yet']),
        sort_order:9 },

      // Section 3 — Pain points & frustrations
      { id:'cd10', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations',
        label:'What\'s the most frustrating part of getting inspection data from your customers right now?',
        field_type:'textarea', is_required:true,  options_json:null, sort_order:10 },
      { id:'cd11', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations',
        label:'How often do customers submit incomplete, inconsistent, or hard-to-read reports? What happens when they do?',
        field_type:'textarea', is_required:false, options_json:null, sort_order:11 },
      { id:'cd12', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations',
        label:'Have you ever lost visibility on a machine\'s condition because a customer was slow or inconsistent with reporting? What was the impact?',
        field_type:'textarea', is_required:false, options_json:null, sort_order:12 },
      { id:'cd13', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations',
        label:'How much time does your team spend chasing customers for inspection reports or cleaning up what they\'ve submitted?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['Less than 1 hour per week','1–3 hours per week','4–8 hours per week','More than a full day per week','It\'s a significant operational burden']),
        sort_order:13 },

      // Section 4 — Technology & adoption
      { id:'cd14', questionnaire_id:'qCD', section:'4. Technology & Adoption',
        label:'Have you ever tried giving your customers access to a tool or platform before? How did that go — did they actually use it?',
        field_type:'textarea', is_required:false, options_json:null, sort_order:14 },
      { id:'cd15', questionnaire_id:'qCD', section:'4. Technology & Adoption',
        label:'How tech-savvy are your customers on average?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['Very comfortable — they use apps daily','Moderately comfortable — can learn with some guidance','Low tech comfort — need something extremely simple','Varies hugely between customers']),
        sort_order:15 },
      { id:'cd16', questionnaire_id:'qCD', section:'4. Technology & Adoption',
        label:'Are your customers\' inspectors typically in the field on mobile, or office-based?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['Primarily field-based (mobile)','Primarily office-based (desktop)','Mix of both']),
        sort_order:16 },
      { id:'cd17', questionnaire_id:'qCD', section:'4. Technology & Adoption',
        label:'If a customer had a login to submit inspections, would they manage it themselves, or would you need to handle it on their behalf?',
        field_type:'radio',    is_required:false,
        options_json:JSON.stringify(['They\'d manage it themselves','We\'d need to manage it on their behalf','Depends on the customer','Unsure']),
        sort_order:17 },

      // Section 5 — Commercial & buying
      { id:'cd18', questionnaire_id:'qCD', section:'5. Commercial & Buying',
        label:'Is inspection reporting something you currently charge your customers for, or is it absorbed as overhead?',
        field_type:'radio',    is_required:true,
        options_json:JSON.stringify(['We charge for it as part of our service','It\'s absorbed as internal overhead','It\'s not currently a defined cost at all']),
        sort_order:18 },
      { id:'cd19', questionnaire_id:'qCD', section:'5. Commercial & Buying',
        label:'If there was a per-customer cost for digital inspection access, would that come from your budget or be passed on to customers?',
        field_type:'radio',    is_required:false,
        options_json:JSON.stringify(['From our budget','Passed on to our customers','Shared / negotiated case by case','We\'d need to assess this']),
        sort_order:19 },
      { id:'cd20', questionnaire_id:'qCD', section:'5. Commercial & Buying',
        label:'What would make this a clear no-brainer — what problem would it have to solve to justify the cost without hesitation?',
        field_type:'textarea', is_required:true,  options_json:null, sort_order:20 },
      { id:'cd21', questionnaire_id:'qCD', section:'5. Commercial & Buying',
        label:'Are there any constraints on your side — legal, IT, data residency — that a tool like this would need to accommodate?',
        field_type:'textarea', is_required:false, options_json:null, sort_order:21 },

      // Section 6 — Ideal outcome
      { id:'cd22', questionnaire_id:'qCD', section:'6. Ideal Outcome',
        label:'If your customers were submitting inspections perfectly every time, what would that unlock for your business that you can\'t do today?',
        field_type:'textarea', is_required:true,  options_json:null, sort_order:22 },
      { id:'cd23', questionnaire_id:'qCD', section:'6. Ideal Outcome',
        label:'In an ideal world, how much of the inspection process would you want to happen without your team needing to be involved at all?',
        field_type:'radio',    is_required:false,
        options_json:JSON.stringify(['Fully automated — zero involvement','Most of it — we just review exceptions','About half — we still want oversight','Not much — we prefer to stay hands-on']),
        sort_order:23 },
      { id:'cd24', questionnaire_id:'qCD', section:'6. Ideal Outcome',
        label:'Is there anything about the way you work with your customers that a tool like this absolutely must not disrupt or change?',
        field_type:'textarea', is_required:false, options_json:null, sort_order:24 },
    ];

    // ── Questions for Manufacturing ────────────────────────
    const q1Questions = [
      { id:'q1_1', questionnaire_id:'q1', section:'', label:'What type of manufacturing do you operate?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Discrete Manufacturing','Process Manufacturing','Repetitive Manufacturing','Job Shop','Other']), sort_order:1 },
      { id:'q1_2', questionnaire_id:'q1', section:'', label:'How many production sites do you manage?', field_type:'radio', is_required:true, options_json:JSON.stringify(['1 site','2–5 sites','6–15 sites','15+ sites']), sort_order:2 },
      { id:'q1_3', questionnaire_id:'q1', section:'', label:'What inspection types do you currently run?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Safety inspections','Quality control','Equipment maintenance','Environmental compliance','ISO/regulatory audits','None currently']), sort_order:3 },
      { id:'q1_4', questionnaire_id:'q1', section:'', label:'How are inspections currently documented?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Paper forms','Excel / Google Sheets','Legacy software','Other digital tools','No standard process']), sort_order:4 },
      { id:'q1_5', questionnaire_id:'q1', section:'', label:'How many inspectors / technicians are in your team?', field_type:'dropdown', is_required:true, options_json:JSON.stringify(['1–5','6–15','16–50','51–200','200+']), sort_order:5 },
      { id:'q1_6', questionnaire_id:'q1', section:'', label:'What is your biggest operational pain point today?', field_type:'textarea', is_required:true, options_json:null, sort_order:6 },
      { id:'q1_7', questionnaire_id:'q1', section:'', label:'What is your target go-live timeline?', field_type:'radio', is_required:false, options_json:JSON.stringify(['Immediately','Within 1 month','1–3 months','3–6 months','Just exploring']), sort_order:7 },
    ];

    const allQuestions = [
      ...cdQuestions,
      ...q1Questions,
      // Field Ops
      { id:'q2_1', questionnaire_id:'q2', section:'', label:'What industry does your field service operate in?', field_type:'dropdown', is_required:true, options_json:JSON.stringify(['HVAC / Plumbing','Electrical','Telecoms','Pest Control','Security Systems','Medical Equipment','Other']), sort_order:1 },
      { id:'q2_2', questionnaire_id:'q2', section:'', label:'How many field technicians do you dispatch daily?', field_type:'radio', is_required:true, options_json:JSON.stringify(['1–10','11–30','31–100','100+']), sort_order:2 },
      { id:'q2_3', questionnaire_id:'q2', section:'', label:'How do you currently assign and track jobs?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Phone / WhatsApp','Excel / Spreadsheets','Field service software','ERP system','No formal system']), sort_order:3 },
      { id:'q2_4', questionnaire_id:'q2', section:'', label:'What are the biggest bottlenecks in your current process?', field_type:'checkbox', is_required:false, options_json:JSON.stringify(['Job scheduling conflicts','Lack of real-time visibility','Manual reporting','Customer communication','Parts & inventory tracking','Billing delays']), sort_order:4 },
      { id:'q2_5', questionnaire_id:'q2', section:'', label:'Describe your ideal end-to-end job workflow', field_type:'textarea', is_required:false, options_json:null, sort_order:5 },
      // Construction
      { id:'q3_1', questionnaire_id:'q3', section:'', label:'What type of construction projects do you manage?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Residential','Commercial','Industrial','Infrastructure / Civil','Oil & Gas','Fit-out & Renovation']), sort_order:1 },
      { id:'q3_2', questionnaire_id:'q3', section:'', label:'How many active projects run simultaneously?', field_type:'radio', is_required:true, options_json:JSON.stringify(['1–3','4–10','11–30','30+']), sort_order:2 },
      { id:'q3_3', questionnaire_id:'q3', section:'', label:'How do you currently manage site safety inspections?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Paper-based checklists','Excel templates','Dedicated safety app','Integrated PM software','No formal process']), sort_order:3 },
      { id:'q3_4', questionnaire_id:'q3', section:'', label:'What challenges are you looking to solve with Inspeq?', field_type:'textarea', is_required:true, options_json:null, sort_order:4 },
      // Facility
      { id:'q4_1', questionnaire_id:'q4', section:'', label:'What type of facilities do you manage?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Commercial offices','Shopping malls / Retail','Hospitals / Healthcare','Educational campuses','Industrial plants','Government buildings']), sort_order:1 },
      { id:'q4_2', questionnaire_id:'q4', section:'', label:'How is planned preventive maintenance currently tracked?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Paper / Manual','Spreadsheets','CMMS software','Integrated CAFM','No PPM in place']), sort_order:2 },
      { id:'q4_3', questionnaire_id:'q4', section:'', label:'Describe your biggest facility management challenge', field_type:'textarea', is_required:true, options_json:null, sort_order:3 },
      // Energy
      { id:'q5_1', questionnaire_id:'q5', section:'', label:'What sector do you operate in?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Oil & Gas','Electricity Generation','Water & Wastewater','Renewables','Transmission & Distribution','Mining']), sort_order:1 },
      { id:'q5_2', questionnaire_id:'q5', section:'', label:'Current inspection frequency for critical assets', field_type:'dropdown', is_required:true, options_json:JSON.stringify(['Daily','Weekly','Monthly','Quarterly','As-needed']), sort_order:2 },
      { id:'q5_3', questionnaire_id:'q5', section:'', label:'Describe your key inspection and maintenance challenges', field_type:'textarea', is_required:true, options_json:null, sort_order:3 },
      // Insurance
      { id:'q6_1', questionnaire_id:'q6', section:'', label:'What type of insurance inspections do you conduct?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Property assessments','Vehicle inspections','Claims assessments','Pre-policy surveys','Loss control visits','Catastrophe response']), sort_order:1 },
      { id:'q6_2', questionnaire_id:'q6', section:'', label:'Current average time from inspection to report delivery', field_type:'radio', is_required:true, options_json:JSON.stringify(['Same day','1–2 days','3–5 days','Over a week']), sort_order:2 },
      { id:'q6_3', questionnaire_id:'q6', section:'', label:'What would success look like for your team after 3 months with Inspeq?', field_type:'textarea', is_required:true, options_json:null, sort_order:3 },
    ];

    write(KEYS.QUESTIONNAIRES, questionnaires);
    write(KEYS.QUESTIONS, allQuestions.map(q => ({ ...q, created_at: now(), updated_at: now() })));
    write(KEYS.SUBMISSIONS, []);
    write(KEYS.ANSWERS, []);
    write(KEYS.UPLOADS, []);
    localStorage.setItem('inspeq_seeded_v3', '1');
  }

  // ─── Questionnaires ──────────────────────────────────────
  function getQuestionnaires() { seed(); return read(KEYS.QUESTIONNAIRES); }
  function getQuestionnaire(id) { return getQuestionnaires().find(q => q.id === id) || null; }

  function saveQuestionnaire(data) {
    const qs = getQuestionnaires();
    if (data.id) {
      const idx = qs.findIndex(q => q.id === data.id);
      if (idx >= 0) qs[idx] = { ...qs[idx], ...data, updated_at: now() };
      else           qs.push({ ...data, updated_at: now() });
    } else {
      const newId = uid();
      qs.push({ ...data, id: newId,
        slug: data.slug || slug(data.title),
        created_at: now(), updated_at: now() });
      data.id = newId;
    }
    write(KEYS.QUESTIONNAIRES, qs);
    return qs.find(q => q.id === data.id);
  }

  function deleteQuestionnaire(id) {
    write(KEYS.QUESTIONNAIRES, read(KEYS.QUESTIONNAIRES).filter(q => q.id !== id));
    write(KEYS.QUESTIONS,      read(KEYS.QUESTIONS).filter(q => q.questionnaire_id !== id));
  }

  function toggleQuestionnaire(id) {
    const qs = getQuestionnaires();
    const idx = qs.findIndex(q => q.id === id);
    if (idx >= 0) { qs[idx].is_active = !qs[idx].is_active; qs[idx].updated_at = now(); }
    write(KEYS.QUESTIONNAIRES, qs);
    return qs[idx];
  }

  // ─── Questions ───────────────────────────────────────────
  function getQuestions(questionnaireId) {
    seed();
    return read(KEYS.QUESTIONS)
      .filter(q => q.questionnaire_id === questionnaireId)
      .sort((a,b) => a.sort_order - b.sort_order);
  }

  function saveQuestions(questionnaireId, questions) {
    const all = read(KEYS.QUESTIONS).filter(q => q.questionnaire_id !== questionnaireId);
    const newQs = questions.map((q,i) => ({
      ...q, id: q.id || uid(), questionnaire_id: questionnaireId,
      sort_order: i+1, created_at: q.created_at || now(), updated_at: now(),
    }));
    write(KEYS.QUESTIONS, [...all, ...newQs]);
  }

  // ─── Submissions ─────────────────────────────────────────
  function getSubmissions() { seed(); return read(KEYS.SUBMISSIONS).sort((a,b) => b.submitted_at.localeCompare(a.submitted_at)); }
  function getSubmission(id) { return read(KEYS.SUBMISSIONS).find(s => s.id === id) || null; }

  function saveSubmission(data) {
    const subs = read(KEYS.SUBMISSIONS);
    const id = uid();
    subs.push({ ...data, id, submitted_at: now(), created_at: now() });
    write(KEYS.SUBMISSIONS, subs);
    return id;
  }

  // ─── Answers ─────────────────────────────────────────────
  function getAnswers(submissionId) { return read(KEYS.ANSWERS).filter(a => a.submission_id === submissionId); }
  function saveAnswers(submissionId, answers) {
    const all = read(KEYS.ANSWERS);
    answers.forEach(a => all.push({ ...a, id: uid(), submission_id: submissionId, created_at: now() }));
    write(KEYS.ANSWERS, all);
  }

  // ─── Uploads ─────────────────────────────────────────────
  function getUploads(submissionId) { return read(KEYS.UPLOADS).filter(u => u.submission_id === submissionId); }
  function saveUpload(upload) {
    const all = read(KEYS.UPLOADS);
    all.push({ ...upload, id: uid(), created_at: now() });
    write(KEYS.UPLOADS, all);
  }

  // ─── Admin Auth ───────────────────────────────────────────
  const ADMIN_CREDS = { username:'admin', password:'inspeq2025!' };
  function adminLogin(u,p) {
    if (u===ADMIN_CREDS.username && p===ADMIN_CREDS.password) {
      const token = 'tok_' + uid();
      writeOne(KEYS.ADMIN, { token, expires: Date.now() + 8*60*60*1000 });
      return token;
    }
    return null;
  }
  function adminLogout() { localStorage.removeItem(KEYS.ADMIN); }
  function isAdminLoggedIn() { const s = readOne(KEYS.ADMIN); return s && s.expires > Date.now(); }

  // ─── Public API ──────────────────────────────────────────
  return {
    getQuestionnaires, getQuestionnaire,
    saveQuestionnaire, deleteQuestionnaire, toggleQuestionnaire,
    getQuestions, saveQuestions,
    getSubmissions, getSubmission, saveSubmission,
    getAnswers, saveAnswers,
    getUploads, saveUpload,
    adminLogin, adminLogout, isAdminLoggedIn,
    uid, now,
  };
})();
