import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart2, CheckCircle, Database, Shield, TrendingUp, ChevronRight, Mail, Loader2, Lock } from 'lucide-react';

// --- FIREBASE SETUP INSTRUCTIONS ---
// 1. Run: npm install firebase
// 2. Import these functions (Uncomment the lines below when running locally)
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// 3. Paste your config here
const firebaseConfig = {
  apiKey: "AIzaSyDxM1IK9uXVtlZRtJPkqmcy0eMEAXfcbgc",
  authDomain: "data-maturity-funnel.firebaseapp.com",
  projectId: "data-maturity-funnel",
  storageBucket: "data-maturity-funnel.firebasestorage.app",
  messagingSenderId: "686472283312",
  appId: "1:686472283312:web:e04c3713c0bff158fbe775",
  measurementId: "G-V1MSZHX78K"
};


// --- MOCK DATABASE FUNCTION (For Demo Purposes) ---
// In production, delete this and use real Firebase calls
const mockSaveToDatabase = async (data) => {
  console.log("Saving to Firestore...", data);
  return new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
};

const App = () => {
  // State Management
  const [step, setStep] = useState('intro'); // intro, quiz, capture, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [lead, setLead] = useState({ name: '', email: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CONFIGURATION: THE QUESTIONS ---
  const questions = [
    // Section 1: Data Foundation & Trust (Questions 1-7)
    {
      category: "Data Foundation & Trust",
      question: "How confident are you that every commission split, referral fee, and invoice across all branches is calculated correctly?",
      options: [
        { text: "We regularly discover discrepancies weeks after completion—agents complain, referral partners chase payments, and we're constantly firefighting commission disputes", points: 1 },
        { text: "We catch most errors during month-end reconciliation, but it creates tension with agents and delays payroll by days", points: 2 },
        { text: "Errors are rare and usually caught within a few days, though manual checking is still required", points: 3 },
        { text: "Every commission, split, and fee is automatically validated in real-time—zero disputes, instant payroll confidence", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "When you ask 'Which branch is performing best this month?' or 'Which agents are hitting target?', what happens?",
      options: [
        { text: "Each branch manager gives you different numbers from their own spreadsheets—you spend hours reconciling and still aren't sure who's right", points: 1 },
        { text: "You get consistent numbers eventually, but only after your ops team spends half a day pulling reports from multiple systems and calling branches", points: 2 },
        { text: "Your CRM gives you mostly consistent data, though branch managers sometimes question the figures", points: 3 },
        { text: "One dashboard shows real-time performance across every branch, agent, and property—everyone sees the same truth instantly", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How is your critical property data (valuations, measurements, EPC ratings, viewing feedback) managed across branches?",
      options: [
        { text: "Every branch has their own way—Excel spreadsheets, paper files, memory—and when an agent leaves, their data leaves with them", points: 1 },
        { text: "Mostly in your CRM, but agents still keep 'their own' spreadsheets because they don't trust the system, creating duplicate versions of truth", points: 2 },
        { text: "Centralized in one system, though agents sometimes bypass it for speed, and data quality varies by branch", points: 3 },
        { text: "One authoritative system with mandatory fields and validation—every property detail captured once, accessible everywhere, audit-ready", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How quickly can you access critical metrics like pipeline value, conversion rates, or average days-to-offer by branch?",
      options: [
        { text: "You have to ask someone to pull the data, which takes hours or days, and by then the moment has passed", points: 1 },
        { text: "You can get it within 30-60 minutes by logging into multiple systems and exporting reports", points: 2 },
        { text: "You can access it within 10-15 minutes through your CRM's reporting dashboard", points: 3 },
        { text: "Instant access on your phone—live pipeline value, conversion funnel, and branch league tables updating in real-time", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How do you discover missing property details, duplicate listings, or incorrect valuation data?",
      options: [
        { text: "When a buyer complains, a portal rejects the listing, or you lose an instruction because the valuation was based on wrong square footage", points: 1 },
        { text: "Through weekly manual audits where you spot-check listings and chase branch managers for corrections", points: 2 },
        { text: "Through automated reports that flag incomplete listings or anomalies for branch review", points: 3 },
        { text: "Through real-time validation that prevents incomplete data entry—listings can't go live until all fields are complete and verified", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "What would happen to your operations if all Excel spreadsheets disappeared from your agency tomorrow?",
      options: [
        { text: "Total chaos—commission calculations, pipeline tracking, and branch performance reporting would stop dead", points: 1 },
        { text: "Major disruption for a week minimum—key processes depend on individual spreadsheets passed around by email", points: 2 },
        { text: "Short-term inconvenience but core operations would continue—spreadsheets mostly used for one-off analysis", points: 3 },
        { text: "Minimal impact—everything runs through your integrated platform; spreadsheets are decorative, not operational", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How do you feel presenting your multi-branch performance to your board, investors, or franchise network?",
      options: [
        { text: "Anxious—you've been caught out before when branch figures didn't reconcile, and you know there are probably errors you haven't found yet", points: 1 },
        { text: "Nervous—you've triple-checked everything and brought backup spreadsheets, but you're still waiting for someone to question a figure", points: 2 },
        { text: "Mostly confident, though you occasionally have to caveat data from certain branches or time periods", points: 3 },
        { text: "Complete confidence—every figure is validated, auditable, and you can drill down into any branch or agent on the spot", points: 4 }
      ]
    },

    // Section 2: Reporting & Visibility (Questions 8-13)
    {
      category: "Reporting & Visibility",
      question: "How much time does your team spend preparing branch performance reports, commission statements, and management presentations?",
      options: [
        { text: "Someone spends 1-2 full days every week pulling data from your CRM, spreadsheets, and portal accounts just to tell you what happened last week", points: 1 },
        { text: "Half a day per week manually consolidating reports across branches and creating PowerPoint decks", points: 2 },
        { text: "1-2 hours per week making minor updates to templates and adding commentary", points: 3 },
        { text: "Under 30 minutes—automated dashboards update themselves; your team focuses on strategy, not data entry", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "How current is your view of market activity, viewing bookings, offer activity, and pipeline movement?",
      options: [
        { text: "You see last week's or last month's numbers—by the time you know an instruction is at risk, it's too late to save it", points: 1 },
        { text: "You see yesterday's activity by mid-morning—enough to react but not prevent issues", points: 2 },
        { text: "You see end-of-previous-day complete—morning briefings are accurate but not live", points: 3 },
        { text: "Real-time—you can see viewing bookings, offer submissions, and fallen-throughs as they happen across all branches", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "When your branch managers discuss performance in network meetings, what happens?",
      options: [
        { text: "Arguments erupt—'My figures show I'm top performer,' 'No, my spreadsheet says we are'—you spend 20 minutes reconciling before you can start strategizing", points: 1 },
        { text: "You reconcile the data before meetings to avoid embarrassment, but managers still question the methodology behind the figures", points: 2 },
        { text: "Mostly aligned on the numbers, though occasional debates about how things are categorized or timed", points: 3 },
        { text: "Zero debate—everyone's looking at the same live dashboard; meetings focus on 'why' and 'what next', not 'what happened'", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "How well-aligned are your key performance indicators across all branches?",
      options: [
        { text: "Every branch tracks different metrics; some focus on valuations, others on completions, others on revenue—there's no common scorecard", points: 1 },
        { text: "You've defined KPIs centrally, but branches interpret and track them differently; comparison is difficult", points: 2 },
        { text: "You have network-wide KPIs that branches mostly follow, though some create their own additional metrics", points: 3 },
        { text: "5-7 North Star Metrics (e.g., market share, valuation-to-instruction %, completion rate) tracked identically across every branch—clear accountability", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "How easily can you compare this month's performance to last month, same time last year, or pre-pandemic levels?",
      options: [
        { text: "Requires manually pulling data from archived spreadsheets and old CRM exports—takes half a day and accuracy is questionable", points: 1 },
        { text: "Possible with effort by running separate reports and manually building comparison tables (30-60 minutes)", points: 2 },
        { text: "Available through standard reports with month-on-month and year-on-year views (5-10 minutes)", points: 3 },
        { text: "Instant visual trends—every metric shows you daily/weekly/monthly/annual comparisons with one click", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "When you spot a problem—conversion rate dropping, pipeline thinning, competitor winning market share in a territory—how quickly can you act?",
      options: [
        { text: "Days to weeks—by the time you've confirmed it's real and coordinated a response, you've lost three more instructions", points: 1 },
        { text: "2-3 days—need to investigate with branch managers, verify the trend, then plan intervention", points: 2 },
        { text: "Same day or next—clear escalation paths and branch managers empowered to respond quickly", points: 3 },
        { text: "Within hours—automated alerts trigger immediate branch actions; area managers notified before the trend becomes a crisis", points: 4 }
      ]
    },

    // Section 3: Predictive Capability (Questions 14-19)
    {
      category: "Predictive Capability",
      question: "How do you identify which vendors are about to reduce their asking price, pull out, or switch to a competitor?",
      options: [
        { text: "You find out when they call to terminate the instruction or when the board goes up next door with a rival agent", points: 1 },
        { text: "Through agent intuition and weekly pipeline reviews where they flag 'concerns' anecdotally", points: 2 },
        { text: "Through monthly analysis of engagement metrics—viewing requests, portal interest, feedback patterns", points: 3 },
        { text: "Through predictive scoring that automatically flags at-risk instructions 2-3 weeks before vendors make decisions—time to intervene", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "How accurately can you predict which property types, price bands, and postcodes will be in demand next quarter?",
      options: [
        { text: "Completely reactive—you list what vendors give you and hope buyers materialize; frequently caught with wrong stock mix", points: 1 },
        { text: "Based on 'feel' from experienced agents and basic trend observation—directionally right but specifics wrong", points: 2 },
        { text: "Using historical seasonal patterns and current market reports—accurate within 20% for planning purposes", points: 3 },
        { text: "Using predictive models combining your transaction data, portal search trends, and economic indicators—accurate within 10%, informing valuation strategy and marketing spend", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "How do you know when a competitor is aggressively targeting your territory, poaching your agents, or winning market share?",
      options: [
        { text: "When you lose three instructions in a row to the same competitor, or an agent hands in notice and you had no idea they were being courted", points: 1 },
        { text: "Through quarterly market share reports and gossip at industry events—always playing catch-up", points: 2 },
        { text: "Through monthly competitive analysis tracking instruction wins/losses and portal presence by postcode", points: 3 },
        { text: "Through real-time monitoring of competitor pricing, instruction wins, agent LinkedIn activity, and search volume shifts—4-8 weeks early warning", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "How do you model 'what-if' scenarios like 'What if we open a new branch?', 'What if interest rates rise 1%?', or 'What if we lose our top-performing branch manager?'",
      options: [
        { text: "You don't—too complex, so you make gut decisions and hope for the best", points: 1 },
        { text: "Manually in spreadsheets over several days with lots of assumptions—can only run one or two scenarios before exhaustion sets in", points: 2 },
        { text: "Through financial models that take a few hours to update—can test 3-4 scenarios per strategic planning session", points: 3 },
        { text: "Through dynamic tools that show impact on revenue, cash flow, and market position across all branches within minutes—test 10+ scenarios per session", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "What percentage of your strategic decisions are based on predictive insights vs. firefighting yesterday's problems?",
      options: [
        { text: "Under 25%—you're constantly reacting to fallen-throughs, agent complaints, lost instructions, and cash flow surprises", points: 1 },
        { text: "25-50%—you try to be strategic but market urgency and operational fires keep pulling you backward", points: 2 },
        { text: "50-75%—increasingly proactive with planning cycles, though still get blindsided by market shifts", points: 3 },
        { text: "Over 75%—you're setting the pace in your market because you see opportunities and threats before competitors", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "How many times in the last quarter were you blindsided by something your data should have predicted?",
      options: [
        { text: "Multiple times per month—sudden cash crunches, unexpected instruction losses, agent departures, or completion rate drops that killed your forecast", points: 1 },
        { text: "Once or twice per month—significant surprises that required urgent responses and Board explanations", points: 2 },
        { text: "Once per quarter—rare but impactful events that caught you off guard", points: 3 },
        { text: "Almost never—your leading indicators flag issues early enough to mitigate or prevent them", points: 4 }
      ]
    },

    // Section 4: Automation & Strategic Leverage (Questions 20-25)
    {
      category: "Automation & Strategic Leverage",
      question: "What percentage of routine operational decisions happen automatically vs. requiring your manual approval or intervention?",
      options: [
        { text: "Under 25%—you or your ops team manually approve commission splits, marketing budgets, viewing priorities, and vendor communications daily", points: 1 },
        { text: "25-50%—some workflows automated (portal feeds, email triggers) but most decisions still need human approval", points: 2 },
        { text: "50-75%—majority of routine operations automated with exception-only human review", points: 3 },
        { text: "Over 75%—commission calculations, vendor updates, viewing scheduling, portal optimization happen automatically; you focus on growth strategy", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "How is AI or machine learning actively improving your valuation accuracy, lead conversion, or client retention?",
      options: [
        { text: "Not deployed—you're still relying on agent experience and manual processes for everything", points: 1 },
        { text: "Experimenting with AI valuation tools or chatbots but minimal business impact yet", points: 2 },
        { text: "Active deployment in 2-3 areas (e.g., automated valuation models, lead scoring) showing measurable improvement", points: 3 },
        { text: "Integrated AI across valuations, vendor communications, buyer matching, and pricing strategy—proven ROI and competitive edge", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "How defensible is your competitive advantage based on your proprietary market data and insights?",
      options: [
        { text: "You use the same portals, Land Registry data, and market reports as every other agent—zero unique advantage", points: 1 },
        { text: "You've accumulated years of local data but haven't structured it or leveraged it strategically", points: 2 },
        { text: "Your transaction history and market insights give you edge in pricing and vendor trust that competitors can't easily match", points: 3 },
        { text: "Your proprietary micro-market data, predictive models, and automated insights create a moat—vendors and buyers can't get this intelligence anywhere else", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "If a consolidator, PE firm, or franchise buyer conducted due diligence on your data and systems today, what would happen?",
      options: [
        { text: "Deal killer—inconsistent records, data scattered across systems, no audit trail; they'd walk away or slash valuation by 30%+", points: 1 },
        { text: "Serious concerns—would require 6-month remediation plan and escrow holdback; would definitely hurt valuation multiple", points: 2 },
        { text: "Acceptable with caveats—minor improvements needed, slight valuation discount, but deal could proceed", points: 3 },
        { text: "Valuation enhancer—clean data, automated operations, scalable systems would command premium multiple; acquirers would compete for you", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "What would happen to your data operations if your longest-serving branch manager or office manager left tomorrow?",
      options: [
        { text: "Catastrophic—they hold all the 'how things work' knowledge; commission calculations, client relationships, and local market intelligence would walk out the door", points: 1 },
        { text: "Major disruption for weeks—heavy reliance on tribal knowledge and personal spreadsheets; would take months to fully recover", points: 2 },
        { text: "Short-term disruption—some documented processes but significant handover period needed", points: 3 },
        { text: "Minimal disruption—all processes documented and systematized; new person could step in within days with full capability", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "What have you done with time and money saved through operational efficiency and automation?",
      options: [
        { text: "No efficiency gains yet—still manually intensive and fighting to keep heads above water", points: 1 },
        { text: "Any savings immediately absorbed by other operational pressures; no strategic reinvestment possible", points: 2 },
        { text: "Some reinvestment in technology or marketing, but ad-hoc rather than systematic growth strategy", points: 3 },
        { text: "Systematically reinvested in new branches, premium marketing, agent recruitment, and client experience—compounding market share growth", points: 4 }
      ]
    }
  ];

  // --- LOGIC: SCORING & LEVELING ---
  const getMaturityLevel = (finalScore) => {
    const avg = finalScore / questions.length;
    if (avg <= 1.5) return { id: 'novice', title: "Data Novice", color: "text-red-600", bg: "bg-red-50" };
    if (avg <= 2.5) return { id: 'reactive', title: "Data Reactive", color: "text-orange-600", bg: "bg-orange-50" };
    if (avg <= 3.5) return { id: 'pro', title: "Data Pro", color: "text-blue-600", bg: "bg-blue-50" };
    return { id: 'visionary', title: "Data Visionary", color: "text-emerald-600", bg: "bg-emerald-50" };
  };

  // --- HANDLERS ---
  const handleAnswer = (optionIndex) => {
    const selectedOption = questions[currentQuestion].options[optionIndex];
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    setScore(score + selectedOption.points);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('capture'); // Move to email capture before showing results
    }
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalLevel = getMaturityLevel(score);

    // Create detailed answers with full question and answer text
    const detailedAnswers = questions.map((question, index) => ({
      category: question.category,
      question: question.question,
      answer: question.options[answers[index]].text,
      points: question.options[answers[index]].points
    }));

    const payload = {
      ...lead,
      score: score,
      maxScore: questions.length * 4,
      maturityLevel: finalLevel.title,
      maturityId: finalLevel.id, // This is what n8n looks for!
      detailedAnswers: detailedAnswers, // Detailed answers with full text
      submittedAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firebase (Keep your memory)
      // await addDoc(collection(db, "leads"), payload); // Uncomment when using real Firebase

      // 2. Send to n8n (Trigger the email)
      await fetch('https://n8n.srv950234.hstgr.cloud/webhook-test/maturity-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setStep('results');
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER HELPERS ---
  const level = getMaturityLevel(score);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center p-4">

      {/* STEP 1: LANDING PAGE / INTRO */}
      {step === 'intro' && (
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-500">
          <div className="bg-indigo-900 p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <BarChart2 size={56} className="mx-auto mb-6 text-indigo-300" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Estate Agency Data Maturity Assessment</h1>
            <p className="text-indigo-200 text-lg max-w-lg mx-auto">
              Discover where your multi-branch agency stands on the journey from "Spreadsheet Chaos" to "AI-Driven Market Leader."
            </p>
          </div>
          <div className="p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
               <div className="flex flex-col items-center text-center">
                 <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><Shield size={24} /></div>
                 <h3 className="font-bold text-slate-800">Identify Risks</h3>
                 <p className="text-sm text-slate-500">Commission errors, data gaps, compliance issues.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                 <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><TrendingUp size={24} /></div>
                 <h3 className="font-bold text-slate-800">Benchmark Performance</h3>
                 <p className="text-sm text-slate-500">See where you stand vs. market leaders.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                 <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><CheckCircle size={24} /></div>
                 <h3 className="font-bold text-slate-800">Get Your Roadmap</h3>
                 <p className="text-sm text-slate-500">Tailored plan for your agency's growth.</p>
               </div>
            </div>
            <button
              onClick={() => setStep('quiz')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              Start Assessment <ArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: THE QUIZ */}
      {step === 'quiz' && (
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 relative animate-in slide-in-from-right duration-300">
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <span className="text-indigo-600 font-bold text-sm uppercase tracking-wide mb-2 block">
            {questions[currentQuestion].category}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-5 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group flex items-start gap-4"
              >
                <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 flex-shrink-0"></div>
                <span className="text-slate-700 font-medium group-hover:text-indigo-900">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: LEAD CAPTURE (The "Gate") */}
      {step === 'capture' && (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
            <p className="text-slate-500">Where should we send your full Maturity Report?</p>
          </div>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Jane Doe"
                value={lead.name}
                onChange={(e) => setLead({...lead, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <input
                required
                type="email"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="jane@company.com"
                value={lead.email}
                onChange={(e) => setLead({...lead, email: e.target.value})}
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Generating Report...
                </>
              ) : (
                <>
                  Reveal My Score <Lock size={16} />
                </>
              )}
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">
              Your data is secure. We never sell your info.
            </p>
          </form>
        </div>
      )}

      {/* STEP 4: RESULTS DASHBOARD */}
      {step === 'results' && (
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-500">
          <div className={`${level.bg} p-10 text-center border-b border-slate-100`}>
            <span className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-2 block">Your Data Maturity Level</span>
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${level.color}`}>{level.title}</h1>
            <p className="text-slate-600 max-w-lg mx-auto">
              You've taken the first step. Based on your answers, your organization has strong potential but specific bottlenecks in infrastructure.
            </p>
          </div>

          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <BarChart2 size={20} className="text-indigo-600"/> Your Detailed Breakdown
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Strategy & Culture</span>
                    <span className="text-indigo-600">6/10</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full"><div className="h-full bg-indigo-600 w-[60%] rounded-full"></div></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Tech Infrastructure</span>
                    <span className="text-indigo-600">4/10</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full"><div className="h-full bg-indigo-600 w-[40%] rounded-full"></div></div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900 rounded-xl p-6 text-white flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Check your inbox!</h3>
                <p className="text-indigo-200 text-sm mb-4">
                  We just sent a custom 12-page PDF report tailored specifically for <strong>{level.title}</strong> organizations.
                </p>
              </div>
              <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-sm">
                <Mail size={16} /> Resend Report
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
            <p className="text-slate-500 text-sm mb-3">Need to interpret these results with an expert?</p>
            <button onClick={() => window.open('https://calendly.com/agiautomations/30min', '_blank')} className="text-indigo-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
              Book a free 15-min Strategy Review <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
