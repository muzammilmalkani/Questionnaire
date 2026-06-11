// ================================================================
// Inspeq Discovery — Database Layer (localStorage)
// To migrate to a real backend: swap each DB.* call for fetch()
// ================================================================
const DB = (() => {

  const SEED_KEY = 'inspeq_seed_v6';

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
  const slug = s  => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  const read     = k => { try { return JSON.parse(localStorage.getItem(k) || '[]');   } catch { return []; }   };
  const write    = (k,d) => localStorage.setItem(k, JSON.stringify(d));
  const readOne  = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
  const writeOne = (k,d) => localStorage.setItem(k, JSON.stringify(d));

  function seed() {
    if (localStorage.getItem(SEED_KEY)) return;
    [KEYS.QUESTIONNAIRES, KEYS.QUESTIONS, KEYS.SUBMISSIONS, KEYS.ANSWERS, KEYS.UPLOADS]
      .forEach(k => localStorage.removeItem(k));

    // ── QUESTIONNAIRES ────────────────────────────────────────
    const qs = [
      {
        id:'qCD', title:'Customer Discovery',
        description:'Help us understand your business, how your customers currently run inspections, and where the biggest friction sits — so we can show you exactly how Inspeq solves it.',
        category:'General', slug:'customer-discovery',
        is_active:true, featured:true, created_at:now(), updated_at:now()
      },
      {
        id:'qRN', title:'Repair Network Discovery',
        description:'Help us understand how your independent repair shop network operates today — from job workflow and parts procurement through to network oversight and technology requirements — so we can show you exactly how Inspeq fits.',
        category:'Field Operations', slug:'repair-network-discovery',
        is_active:true, created_at:now(), updated_at:now()
      },
      {
        id:'q1', title:'Manufacturing & Safety Operations',
        description:'Help us understand your current inspection workflows, safety protocols, and maintenance challenges so we can tailor Inspeq to your factory floor needs.',
        category:'Manufacturing', slug:'manufacturing-safety-operations',
        is_active:true, created_at:now(), updated_at:now()
      },
      {
        id:'q2', title:'Field Service & Technician Workflows',
        description:'Tell us about how your field teams manage job assignments, reporting, and client communication.',
        category:'Field Operations', slug:'field-service-technician-workflows',
        is_active:true, created_at:now(), updated_at:now()
      },
      {
        id:'q3', title:'Construction Site Inspection Discovery',
        description:'Walk us through your site safety checks, snag reporting, and contractor management.',
        category:'Construction', slug:'construction-site-inspection-discovery',
        is_active:true, created_at:now(), updated_at:now()
      },
      {
        id:'q4', title:'Facility Management Assessment',
        description:'Share your current approach to planned maintenance, compliance tracking, and vendor coordination.',
        category:'Facility Management', slug:'facility-management-assessment',
        is_active:true, created_at:now(), updated_at:now()
      },
      {
        id:'q5', title:'Energy & Utilities Operations Review',
        description:'Describe your asset monitoring, regulatory compliance workflows, and field crew coordination.',
        category:'Energy & Utilities', slug:'energy-utilities-operations-review',
        is_active:true, created_at:now(), updated_at:now()
      },
      {
        id:'q6', title:'Insurance Inspection & Claims Discovery',
        description:'Help us understand your assessment cycles, documentation standards, and claims reporting.',
        category:'Insurance', slug:'insurance-inspection-claims-discovery',
        is_active:true, created_at:now(), updated_at:now()
      },
    ];

    // ── REPAIR NETWORK questions ──────────────────────────────
    const rnQ = [
      // Section 1 — Business & Network Structure
      { id:'rn01', questionnaire_id:'qRN', section:'1. Business & Network Structure', sort_order:1,
        label:'How many independent repair shops are you envisioning in this network, and in what geographic area (regional, national)?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'rn02', questionnaire_id:'qRN', section:'1. Business & Network Structure', sort_order:2,
        label:'Are these shops already operating independently, or are you building this network from scratch?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Shops are already operating independently','Building the network from scratch','Mix — some existing, some new']) },
      { id:'rn03', questionnaire_id:'qRN', section:'1. Business & Network Structure', sort_order:3,
        label:'What equipment categories will these shops service?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Agricultural (Ag)','Construction','Turf / Grounds care','HVAC / Mechanical','Industrial','A mix of the above','Other']) },
      { id:'rn04', questionnaire_id:'qRN', section:'1. Business & Network Structure', sort_order:4,
        label:'Will shops be branded under a common network identity, or remain independently branded?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Common network brand across all shops','Each shop retains its own brand','Hybrid — shared identity with local branding','Not yet decided']) },
      { id:'rn05', questionnaire_id:'qRN', section:'1. Business & Network Structure', sort_order:5,
        label:'Who owns the customer relationship — the network / franchisor, or the individual shop?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['The network / franchisor owns it','The individual shop owns it','Shared — depends on how the customer came in','Not yet defined']) },
      { id:'rn06', questionnaire_id:'qRN', section:'1. Business & Network Structure', sort_order:6,
        label:'What is the business model for the network?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Franchise','Licensing','Revenue share','Cooperative / buying group','Investor-owned group','Something else — please describe below']) },
      { id:'rn06b', questionnaire_id:'qRN', section:'1. Business & Network Structure', sort_order:7,
        label:'If your business model is not listed above, please describe it.',
        field_type:'textarea', is_required:false, options_json:null },

      // Section 2 — Shop Operations & Workflow
      { id:'rn07', questionnaire_id:'qRN', section:'2. Shop Operations & Workflow', sort_order:8,
        label:'Walk me through a typical repair job today: how does it start, get assigned, get completed, and get invoiced?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'rn08', questionnaire_id:'qRN', section:'2. Shop Operations & Workflow', sort_order:9,
        label:'How do technicians currently document their work?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Paper job cards','Spreadsheets','Existing shop management system (DMS)','Photos / WhatsApp','No formal documentation','Other']) },
      { id:'rn09', questionnaire_id:'qRN', section:'2. Shop Operations & Workflow', sort_order:10,
        label:'How are repair jobs currently prioritized and scheduled across a shop?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Shop manager decides manually','First-come, first-served','Customer urgency / SLA-driven','Technician availability-based','No formal process']) },
      { id:'rn10', questionnaire_id:'qRN', section:'2. Shop Operations & Workflow', sort_order:11,
        label:'How is technician time tracked, and is labor billing a requirement?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'rn11', questionnaire_id:'qRN', section:'2. Shop Operations & Workflow', sort_order:12,
        label:'Is there a QC or approval step before a job is closed out?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Yes — a supervisor or foreman must sign off','Yes — customer approval required before close','No formal QC step','Varies by shop']) },
      { id:'rn12', questionnaire_id:'qRN', section:'2. Shop Operations & Workflow', sort_order:13,
        label:'How do shops handle warranty repairs vs. customer-pay repairs vs. fleet account repairs?',
        field_type:'textarea', is_required:true, options_json:null },

      // Section 3 — Parts & Procurement
      { id:'rn13', questionnaire_id:'qRN', section:'3. Parts & Procurement', sort_order:14,
        label:'How do shops currently source parts?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Direct OEM relationships','Aftermarket distributors','Central network procurement','Mixed — each shop decides independently','Other']) },
      { id:'rn14', questionnaire_id:'qRN', section:'3. Parts & Procurement', sort_order:15,
        label:'Is there a preferred supplier or parts catalog that shops are expected to use across the network?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Yes — a single preferred supplier network-wide','Yes — approved list but shops can choose','No — each shop sources independently','Not yet decided']) },
      { id:'rn15', questionnaire_id:'qRN', section:'3. Parts & Procurement', sort_order:16,
        label:'How critical is real-time parts availability and pricing at the point of diagnosis?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Critical — technicians must see live pricing before quoting','Important but not real-time','Nice to have','Not a current priority']) },
      { id:'rn16', questionnaire_id:'qRN', section:'3. Parts & Procurement', sort_order:17,
        label:'Do shops need to manage their own parts inventory, or will parts be centrally procured?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Each shop manages its own inventory','Central procurement for the whole network','Hybrid model','Not yet defined']) },
      { id:'rn17', questionnaire_id:'qRN', section:'3. Parts & Procurement', sort_order:18,
        label:'Is there a need to integrate with specific OEM parts systems (e.g. John Deere, CNH, AGCO)?',
        field_type:'checkbox', is_required:false,
        options_json:JSON.stringify(['John Deere (Parts Advisor / Operations Center)','CNH (Case / New Holland)','AGCO (Fendt, Massey Ferguson)','Kubota','Caterpillar','Komatsu','No OEM integration needed','Not yet decided']) },

      // Section 4 — Customer & Equipment Owner Experience
      { id:'rn18', questionnaire_id:'qRN', section:'4. Customer & Equipment Owner Experience', sort_order:19,
        label:'Who are the end customers your shops will serve?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Individual farmers / owner-operators','Large farming operations / agribusiness','Fleet operators','Equipment rental companies','Government / municipal','Dealerships sending overflow work','Other']) },
      { id:'rn19', questionnaire_id:'qRN', section:'4. Customer & Equipment Owner Experience', sort_order:20,
        label:'How do customers currently submit repair requests or report breakdowns?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Phone call to the shop','Walk-in','Email','WhatsApp / messaging app','Online booking form','Through a dealer or OEM','No formal process']) },
      { id:'rn20', questionnaire_id:'qRN', section:'4. Customer & Equipment Owner Experience', sort_order:21,
        label:'Do customers need real-time visibility into job status and progress?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Yes — this is a key requirement','Would be nice but not critical','No — customers are fine calling in','Not sure yet']) },
      { id:'rn21', questionnaire_id:'qRN', section:'4. Customer & Equipment Owner Experience', sort_order:22,
        label:'Is customer authorization for additional repair costs (supplementary work approvals) a requirement?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Yes — customers must approve before additional work proceeds','Yes — for amounts above a threshold only','No — shop has authority to proceed','Varies by customer type']) },
      { id:'rn22', questionnaire_id:'qRN', section:'4. Customer & Equipment Owner Experience', sort_order:23,
        label:'How is invoicing handled?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Per job — immediate payment on collection','On account — monthly billing','Integrated with external financing / leasing','Mixed depending on customer','Other']) },

      // Section 5 — Network Oversight & Control
      { id:'rn23', questionnaire_id:'qRN', section:'5. Network Oversight & Control', sort_order:24,
        label:'Who sits above the individual shops in your structure?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['A franchisor / franchisor team','A central operations team','The investor / owner directly','A management company','Shops are fully autonomous — no central oversight']) },
      { id:'rn24', questionnaire_id:'qRN', section:'5. Network Oversight & Control', sort_order:25,
        label:'What visibility does the network operator need across all shops?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Live job status across all locations','Revenue and invoicing by shop','Technician utilization and productivity','Parts spend and procurement','Compliance and quality scores','Customer satisfaction data','KPI dashboards for all of the above']) },
      { id:'rn25', questionnaire_id:'qRN', section:'5. Network Oversight & Control', sort_order:26,
        label:'Will there be centralized pricing or labor rate standards across the network?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Yes — fixed rates set centrally','Yes — rate bands, shops operate within them','No — each shop sets its own rates','Not yet decided']) },
      { id:'rn26', questionnaire_id:'qRN', section:'5. Network Oversight & Control', sort_order:27,
        label:'How will compliance and quality standards be enforced across independent shops?',
        field_type:'textarea', is_required:false, options_json:null },
      { id:'rn27', questionnaire_id:'qRN', section:'5. Network Oversight & Control', sort_order:28,
        label:'Is there a need for benchmarking — comparing shop performance against each other?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Yes — league tables / rankings are important','Yes — but for internal improvement only, not ranking','No — each shop is evaluated independently','Not a priority right now']) },

      // Section 6 — Technology & Integration
      { id:'rn28', questionnaire_id:'qRN', section:'6. Technology & Integration', sort_order:29,
        label:'What systems are the shops currently running, if any?',
        field_type:'checkbox', is_required:false,
        options_json:JSON.stringify(['A dealer management system (DMS)','Accounting software (QuickBooks, Xero, etc.)','Spreadsheets only','Equipment telematics platform','No formal systems','Other']) },
      { id:'rn29', questionnaire_id:'qRN', section:'6. Technology & Integration', sort_order:30,
        label:'Is there an expectation to integrate with equipment telematics platforms?',
        field_type:'checkbox', is_required:false,
        options_json:JSON.stringify(['John Deere Operations Center','Case AFS Connect','AGCO Connect','Kubota DCN','Trimble / Precision Ag','No telematics integration needed','Not sure yet']) },
      { id:'rn30', questionnaire_id:'qRN', section:'6. Technology & Integration', sort_order:31,
        label:'What accounting or ERP systems need to connect?',
        field_type:'checkbox', is_required:false,
        options_json:JSON.stringify(['QuickBooks Online','QuickBooks Desktop','Xero','Sage','SAP','Microsoft Dynamics','No integration needed','Other']) },
      { id:'rn31', questionnaire_id:'qRN', section:'6. Technology & Integration', sort_order:32,
        label:'Does your team have a preferred technology stack or cloud infrastructure preference (e.g. AWS, Azure, Google Cloud)?',
        field_type:'textarea', is_required:false, options_json:null },
      { id:'rn32', questionnaire_id:'qRN', section:'6. Technology & Integration', sort_order:33,
        label:'What are the non-negotiables from a technology standpoint?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Mobile-first (technicians work on phones/tablets)','Offline capability (poor connectivity in rural areas)','API access for custom integrations','Single sign-on (SSO)','Role-based access control','White-labelling / custom branding','Data residency / sovereignty requirements']) },

      // Section 7 — Economics & Commercial
      { id:'rn33', questionnaire_id:'qRN', section:'7. Economics & Commercial', sort_order:34,
        label:'What is the expected revenue model per shop for the technology platform?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Fixed monthly subscription per shop','Per-job or transaction fee','Percentage of revenue processed through the platform','Central network pays — shops get it free','A combination of the above','Not yet decided']) },
      { id:'rn34', questionnaire_id:'qRN', section:'7. Economics & Commercial', sort_order:35,
        label:'What would a shop owner consider an acceptable monthly technology cost?',
        field_type:'radio', is_required:false,
        options_json:JSON.stringify(['Under $100 / month','$100 – $250 / month','$250 – $500 / month','$500 – $1,000 / month','Over $1,000 / month if the ROI is clear','Not applicable — central entity pays']) },
      { id:'rn35', questionnaire_id:'qRN', section:'7. Economics & Commercial', sort_order:36,
        label:'Is there a central entity funding the technology rollout, or does each shop pay individually?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Central entity funds everything','Each shop pays individually','Shared cost — network subsidises part of it','Not yet decided']) },
      { id:'rn36', questionnaire_id:'qRN', section:'7. Economics & Commercial', sort_order:37,
        label:'What is the timeline for launching the first pilot shops?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Within 1 month','1 – 3 months','3 – 6 months','6 – 12 months','Beyond 12 months','Just exploring for now']) },
    ];

    // ── CUSTOMER DISCOVERY questions ──────────────────────────
    const cdQ = [
      { id:'cd1',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base', sort_order:1,
        label:'Can you walk me through what your business does and how inspections fit into what you deliver for your customers?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'cd2',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base', sort_order:2,
        label:'How many end-customers do you currently manage, and does that number fluctuate throughout the year?',
        field_type:'text', is_required:true, options_json:null },
      { id:'cd3',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base', sort_order:3,
        label:'What types of equipment or assets are your customers typically inspecting?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'cd4',  questionnaire_id:'qCD', section:'1. Their Business & Customer Base', sort_order:4,
        label:'Are your customers businesses themselves, or individual operators / end users?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Businesses (B2B)','Individual operators / end users','Mix of both']) },
      { id:'cd5',  questionnaire_id:'qCD', section:'2. Current Inspection Process', sort_order:5,
        label:'How do your customers currently submit inspection reports to you?',
        field_type:'checkbox', is_required:true,
        options_json:JSON.stringify(['Paper forms','Spreadsheets (Excel / Google Sheets)','Photos on WhatsApp / messaging','Email attachments','A dedicated software or app','No formal process yet','Other']) },
      { id:'cd6',  questionnaire_id:'qCD', section:'2. Current Inspection Process', sort_order:6,
        label:'Who typically carries out the inspection on your customer\'s side?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['A dedicated inspector / technician','Whoever is available at the time','The customer themselves','A third-party contractor','Varies significantly by customer']) },
      { id:'cd7',  questionnaire_id:'qCD', section:'2. Current Inspection Process', sort_order:7,
        label:'How often does each customer typically submit an inspection?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Daily','Weekly','Monthly','Quarterly','Only when something breaks','It varies widely between customers']) },
      { id:'cd8',  questionnaire_id:'qCD', section:'2. Current Inspection Process', sort_order:8,
        label:'Once a customer submits an inspection, what happens next on your end? Who reviews it and what actions follow?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'cd9',  questionnaire_id:'qCD', section:'2. Current Inspection Process', sort_order:9,
        label:'Do all your customers follow the same inspection process, or does it vary significantly between them?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Same process across all customers','Slightly different per customer','Very different — each customer has their own process','We don\'t have a defined process yet']) },
      { id:'cd10', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations', sort_order:10,
        label:'What\'s the most frustrating part of getting inspection data from your customers right now?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'cd11', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations', sort_order:11,
        label:'How often do customers submit incomplete, inconsistent, or hard-to-read reports? What happens when they do?',
        field_type:'textarea', is_required:false, options_json:null },
      { id:'cd12', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations', sort_order:12,
        label:'Have you ever lost visibility on a machine\'s condition because a customer was slow or inconsistent with reporting? What was the impact?',
        field_type:'textarea', is_required:false, options_json:null },
      { id:'cd13', questionnaire_id:'qCD', section:'3. Pain Points & Current Frustrations', sort_order:13,
        label:'How much time does your team spend chasing customers for inspection reports or cleaning up what they\'ve submitted?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Less than 1 hour per week','1–3 hours per week','4–8 hours per week','More than a full day per week','It\'s a significant operational burden']) },
      { id:'cd14', questionnaire_id:'qCD', section:'4. Technology & Adoption', sort_order:14,
        label:'Have you ever tried giving your customers access to a tool or platform before? How did that go — did they actually use it?',
        field_type:'textarea', is_required:false, options_json:null },
      { id:'cd15', questionnaire_id:'qCD', section:'4. Technology & Adoption', sort_order:15,
        label:'How tech-savvy are your customers on average?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Very comfortable — they use apps daily','Moderately comfortable — can learn with some guidance','Low tech comfort — need something extremely simple','Varies hugely between customers']) },
      { id:'cd16', questionnaire_id:'qCD', section:'4. Technology & Adoption', sort_order:16,
        label:'Are your customers\' inspectors typically in the field on mobile, or office-based?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['Primarily field-based (mobile)','Primarily office-based (desktop)','Mix of both']) },
      { id:'cd17', questionnaire_id:'qCD', section:'4. Technology & Adoption', sort_order:17,
        label:'If a customer had a login to submit inspections, would they manage it themselves, or would you need to handle it on their behalf?',
        field_type:'radio', is_required:false,
        options_json:JSON.stringify(['They\'d manage it themselves','We\'d need to manage it on their behalf','Depends on the customer','Unsure']) },
      { id:'cd18', questionnaire_id:'qCD', section:'5. Commercial & Buying', sort_order:18,
        label:'Is inspection reporting something you currently charge your customers for, or is it absorbed as overhead?',
        field_type:'radio', is_required:true,
        options_json:JSON.stringify(['We charge for it as part of our service','It\'s absorbed as internal overhead','It\'s not currently a defined cost at all']) },
      { id:'cd19', questionnaire_id:'qCD', section:'5. Commercial & Buying', sort_order:19,
        label:'If there was a per-customer cost for digital inspection access, would that come from your budget or be passed on to customers?',
        field_type:'radio', is_required:false,
        options_json:JSON.stringify(['From our budget','Passed on to our customers','Shared / negotiated case by case','We\'d need to assess this']) },
      { id:'cd20', questionnaire_id:'qCD', section:'5. Commercial & Buying', sort_order:20,
        label:'What would make this a clear no-brainer — what problem would it have to solve to justify the cost without hesitation?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'cd21', questionnaire_id:'qCD', section:'5. Commercial & Buying', sort_order:21,
        label:'Are there any constraints on your side — legal, IT, data residency — that a tool like this would need to accommodate?',
        field_type:'textarea', is_required:false, options_json:null },
      { id:'cd22', questionnaire_id:'qCD', section:'6. Ideal Outcome', sort_order:22,
        label:'If your customers were submitting inspections perfectly every time, what would that unlock for your business that you can\'t do today?',
        field_type:'textarea', is_required:true, options_json:null },
      { id:'cd23', questionnaire_id:'qCD', section:'6. Ideal Outcome', sort_order:23,
        label:'In an ideal world, how much of the inspection process would you want to happen without your team needing to be involved at all?',
        field_type:'radio', is_required:false,
        options_json:JSON.stringify(['Fully automated — zero involvement','Most of it — we just review exceptions','About half — we still want oversight','Not much — we prefer to stay hands-on']) },
      { id:'cd24', questionnaire_id:'qCD', section:'6. Ideal Outcome', sort_order:24,
        label:'Is there anything about the way you work with your customers that a tool like this absolutely must not disrupt or change?',
        field_type:'textarea', is_required:false, options_json:null },
    ];

    // ── OTHER questionnaire questions ─────────────────────────
    const otherQ = [
      { id:'q1_1', questionnaire_id:'q1', section:'', sort_order:1, label:'What type of manufacturing do you operate?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Discrete','Process','Repetitive','Job Shop','Other']) },
      { id:'q1_2', questionnaire_id:'q1', section:'', sort_order:2, label:'How many production sites do you manage?', field_type:'radio', is_required:true, options_json:JSON.stringify(['1 site','2–5 sites','6–15 sites','15+ sites']) },
      { id:'q1_3', questionnaire_id:'q1', section:'', sort_order:3, label:'What inspection types do you currently run?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Safety inspections','Quality control','Equipment maintenance','Environmental compliance','ISO/regulatory audits','None currently']) },
      { id:'q1_4', questionnaire_id:'q1', section:'', sort_order:4, label:'How are inspections currently documented?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Paper forms','Excel / Google Sheets','Legacy software','Other digital tools','No standard process']) },
      { id:'q1_5', questionnaire_id:'q1', section:'', sort_order:5, label:'How many inspectors / technicians are in your team?', field_type:'dropdown', is_required:true, options_json:JSON.stringify(['1–5','6–15','16–50','51–200','200+']) },
      { id:'q1_6', questionnaire_id:'q1', section:'', sort_order:6, label:'What is your biggest operational pain point today?', field_type:'textarea', is_required:true, options_json:null },
      { id:'q1_7', questionnaire_id:'q1', section:'', sort_order:7, label:'What is your target go-live timeline?', field_type:'radio', is_required:false, options_json:JSON.stringify(['Immediately','Within 1 month','1–3 months','3–6 months','Just exploring']) },
      { id:'q2_1', questionnaire_id:'q2', section:'', sort_order:1, label:'What industry does your field service operate in?', field_type:'dropdown', is_required:true, options_json:JSON.stringify(['HVAC / Plumbing','Electrical','Telecoms','Pest Control','Security Systems','Medical Equipment','Other']) },
      { id:'q2_2', questionnaire_id:'q2', section:'', sort_order:2, label:'How many field technicians do you dispatch daily?', field_type:'radio', is_required:true, options_json:JSON.stringify(['1–10','11–30','31–100','100+']) },
      { id:'q2_3', questionnaire_id:'q2', section:'', sort_order:3, label:'How do you currently assign and track jobs?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Phone / WhatsApp','Excel / Spreadsheets','Field service software','ERP system','No formal system']) },
      { id:'q2_4', questionnaire_id:'q2', section:'', sort_order:4, label:'What are the biggest bottlenecks in your current process?', field_type:'checkbox', is_required:false, options_json:JSON.stringify(['Job scheduling conflicts','Lack of real-time visibility','Manual reporting','Customer communication','Parts & inventory tracking','Billing delays']) },
      { id:'q2_5', questionnaire_id:'q2', section:'', sort_order:5, label:'Describe your ideal end-to-end job workflow', field_type:'textarea', is_required:false, options_json:null },
      { id:'q3_1', questionnaire_id:'q3', section:'', sort_order:1, label:'What type of construction projects do you manage?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Residential','Commercial','Industrial','Infrastructure / Civil','Oil & Gas','Fit-out & Renovation']) },
      { id:'q3_2', questionnaire_id:'q3', section:'', sort_order:2, label:'How many active projects run simultaneously?', field_type:'radio', is_required:true, options_json:JSON.stringify(['1–3','4–10','11–30','30+']) },
      { id:'q3_3', questionnaire_id:'q3', section:'', sort_order:3, label:'How do you currently manage site safety inspections?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Paper-based checklists','Excel templates','Dedicated safety app','Integrated PM software','No formal process']) },
      { id:'q3_4', questionnaire_id:'q3', section:'', sort_order:4, label:'What challenges are you looking to solve with Inspeq?', field_type:'textarea', is_required:true, options_json:null },
      { id:'q4_1', questionnaire_id:'q4', section:'', sort_order:1, label:'What type of facilities do you manage?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Commercial offices','Shopping malls / Retail','Hospitals / Healthcare','Educational campuses','Industrial plants','Government buildings']) },
      { id:'q4_2', questionnaire_id:'q4', section:'', sort_order:2, label:'How is planned preventive maintenance currently tracked?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Paper / Manual','Spreadsheets','CMMS software','Integrated CAFM','No PPM in place']) },
      { id:'q4_3', questionnaire_id:'q4', section:'', sort_order:3, label:'Describe your biggest facility management challenge', field_type:'textarea', is_required:true, options_json:null },
      { id:'q5_1', questionnaire_id:'q5', section:'', sort_order:1, label:'What sector do you operate in?', field_type:'radio', is_required:true, options_json:JSON.stringify(['Oil & Gas','Electricity Generation','Water & Wastewater','Renewables','Transmission & Distribution','Mining']) },
      { id:'q5_2', questionnaire_id:'q5', section:'', sort_order:2, label:'Current inspection frequency for critical assets', field_type:'dropdown', is_required:true, options_json:JSON.stringify(['Daily','Weekly','Monthly','Quarterly','As-needed']) },
      { id:'q5_3', questionnaire_id:'q5', section:'', sort_order:3, label:'Describe your key inspection and maintenance challenges', field_type:'textarea', is_required:true, options_json:null },
      { id:'q6_1', questionnaire_id:'q6', section:'', sort_order:1, label:'What type of insurance inspections do you conduct?', field_type:'checkbox', is_required:true, options_json:JSON.stringify(['Property assessments','Vehicle inspections','Claims assessments','Pre-policy surveys','Loss control visits','Catastrophe response']) },
      { id:'q6_2', questionnaire_id:'q6', section:'', sort_order:2, label:'Current average time from inspection to report delivery', field_type:'radio', is_required:true, options_json:JSON.stringify(['Same day','1–2 days','3–5 days','Over a week']) },
      { id:'q6_3', questionnaire_id:'q6', section:'', sort_order:3, label:'What would success look like for your team after 3 months with Inspeq?', field_type:'textarea', is_required:true, options_json:null },
    ];

    const allQ = [...rnQ, ...cdQ, ...otherQ].map(q => ({ ...q, created_at:now(), updated_at:now() }));

    write(KEYS.QUESTIONNAIRES, qs);
    write(KEYS.QUESTIONS,      allQ);
    write(KEYS.SUBMISSIONS,    []);
    write(KEYS.ANSWERS,        []);
    write(KEYS.UPLOADS,        []);
    localStorage.setItem(SEED_KEY, '1');
  }

  // ── questionnaires ──────────────────────────────────────
  function getQuestionnaires() { seed(); return read(KEYS.QUESTIONNAIRES); }
  function getQuestionnaire(id) { return getQuestionnaires().find(q => q.id === id) || null; }

  function saveQuestionnaire(data) {
    const list = getQuestionnaires();
    if (data.id) {
      const idx = list.findIndex(q => q.id === data.id);
      if (idx >= 0) list[idx] = { ...list[idx], ...data, updated_at: now() };
      else          list.push({ ...data, updated_at: now() });
      write(KEYS.QUESTIONNAIRES, list);
      return list.find(q => q.id === data.id);
    } else {
      const newId = uid();
      const rec   = { ...data, id:newId, slug:slug(data.title), created_at:now(), updated_at:now() };
      list.push(rec);
      write(KEYS.QUESTIONNAIRES, list);
      return rec;
    }
  }

  function deleteQuestionnaire(id) {
    write(KEYS.QUESTIONNAIRES, read(KEYS.QUESTIONNAIRES).filter(q => q.id !== id));
    write(KEYS.QUESTIONS,      read(KEYS.QUESTIONS).filter(q => q.questionnaire_id !== id));
  }

  function toggleQuestionnaire(id) {
    const list = getQuestionnaires();
    const idx  = list.findIndex(q => q.id === id);
    if (idx >= 0) { list[idx].is_active = !list[idx].is_active; list[idx].updated_at = now(); }
    write(KEYS.QUESTIONNAIRES, list);
    return list[idx];
  }

  // ── questions ───────────────────────────────────────────
  function getQuestions(questionnaireId) {
    seed();
    return read(KEYS.QUESTIONS)
      .filter(q => q.questionnaire_id === questionnaireId)
      .sort((a,b) => (a.sort_order||0) - (b.sort_order||0));
  }

  function saveQuestions(questionnaireId, questions) {
    const others = read(KEYS.QUESTIONS).filter(q => q.questionnaire_id !== questionnaireId);
    const fresh  = questions.map((q,i) => ({
      ...q, id: q.id||uid(), questionnaire_id:questionnaireId,
      sort_order:i+1, created_at:q.created_at||now(), updated_at:now(),
    }));
    write(KEYS.QUESTIONS, [...others, ...fresh]);
  }

  // ── submissions ─────────────────────────────────────────
  function getSubmissions() { seed(); return read(KEYS.SUBMISSIONS).sort((a,b)=>b.submitted_at.localeCompare(a.submitted_at)); }
  function getSubmission(id) { return read(KEYS.SUBMISSIONS).find(s=>s.id===id)||null; }
  function saveSubmission(data) {
    const list = read(KEYS.SUBMISSIONS), id = uid();
    list.push({...data, id, submitted_at:now(), created_at:now()});
    write(KEYS.SUBMISSIONS, list); return id;
  }

  // ── answers ─────────────────────────────────────────────
  function getAnswers(submissionId) { return read(KEYS.ANSWERS).filter(a=>a.submission_id===submissionId); }
  function saveAnswers(submissionId, answers) {
    const list = read(KEYS.ANSWERS);
    answers.forEach(a=>list.push({...a, id:uid(), submission_id:submissionId, created_at:now()}));
    write(KEYS.ANSWERS, list);
  }

  // ── uploads ─────────────────────────────────────────────
  function getUploads(submissionId) { return read(KEYS.UPLOADS).filter(u=>u.submission_id===submissionId); }
  function saveUpload(upload) {
    const list = read(KEYS.UPLOADS);
    list.push({...upload, id:uid(), created_at:now()});
    write(KEYS.UPLOADS, list);
  }

  // ── admin auth ───────────────────────────────────────────
  const ADMIN_CREDS = { username:'admin', password:'inspeq2025!' };
  function adminLogin(u,p) {
    if (u.trim()===ADMIN_CREDS.username && p===ADMIN_CREDS.password) {
      const session = {token:uid(), expires:Date.now()+8*60*60*1000};
      writeOne(KEYS.ADMIN, session); return session.token;
    }
    return null;
  }
  function adminLogout()    { localStorage.removeItem(KEYS.ADMIN); }
  function isAdminLoggedIn(){ const s=readOne(KEYS.ADMIN); return !!(s&&s.expires>Date.now()); }

  return {
    getQuestionnaires, getQuestionnaire, saveQuestionnaire, deleteQuestionnaire, toggleQuestionnaire,
    getQuestions, saveQuestions,
    getSubmissions, getSubmission, saveSubmission,
    getAnswers, saveAnswers,
    getUploads, saveUpload,
    adminLogin, adminLogout, isAdminLoggedIn,
    uid, now,
  };
})();
