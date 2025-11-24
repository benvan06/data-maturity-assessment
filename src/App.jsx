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
      question: "How confident are you in the accuracy of your billing, invoicing, and revenue numbers across all systems?",
      options: [
        { text: "We frequently find discrepancies that require manual reconciliation and corrections", points: 1 },
        { text: "We catch most errors, but it requires weekly reconciliation meetings to align the numbers", points: 2 },
        { text: "Our numbers are usually accurate, with only occasional discrepancies that we can trace and fix", points: 3 },
        { text: "We have complete confidence—automated validation ensures 99%+ accuracy without manual checks", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "When two executives ask the same question (e.g., 'What were sales last month?'), what happens?",
      options: [
        { text: "They often get different answers depending on which spreadsheet or person they ask", points: 1 },
        { text: "They get the same answer eventually, but only after someone reconciles multiple sources", points: 2 },
        { text: "They usually get the same answer from our reporting system, with minor timing differences", points: 3 },
        { text: "They always get identical answers instantly from one authoritative system", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How is your critical business data (pricing, inventory, customer information) managed?",
      options: [
        { text: "Entered manually in multiple places—spreadsheets, databases, and systems that don't talk to each other", points: 1 },
        { text: "Mostly centralized, but key data still requires manual copying or imports between systems", points: 2 },
        { text: "Entered once with automated syncing, though some manual updates are still needed for exceptions", points: 3 },
        { text: "Entered once and automatically distributed across all systems with validation rules", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How quickly can an executive access the core business metrics they need?",
      options: [
        { text: "Usually requires asking IT, an analyst, or waiting for someone to build a report (several hours to days)", points: 1 },
        { text: "Can access within 30-60 minutes by navigating multiple systems or reports", points: 2 },
        { text: "Can access within 10-15 minutes through our dashboards or reporting tools", points: 3 },
        { text: "Instant access (under 2 minutes) through real-time dashboards on any device", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How do you discover data errors, duplicates, or inconsistencies?",
      options: [
        { text: "Usually when something goes wrong operationally or a customer complains", points: 1 },
        { text: "Through periodic manual audits and spot-checks by our team", points: 2 },
        { text: "Through scheduled automated reports that flag anomalies for review", points: 3 },
        { text: "Through real-time automated alerts that immediately flag issues before they impact decisions", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "What would happen if all Excel spreadsheets disappeared from your company tomorrow?",
      options: [
        { text: "Complete operational paralysis—we couldn't function", points: 1 },
        { text: "Major disruption for at least a week while we rebuild critical processes", points: 2 },
        { text: "Short-term inconvenience, but core operations would continue", points: 3 },
        { text: "Minimal impact—spreadsheets are only used for one-off analysis, not operations", points: 4 }
      ]
    },
    {
      category: "Data Foundation & Trust",
      question: "How do you feel walking into board meetings or investor presentations?",
      options: [
        { text: "Anxious that the numbers might be wrong and I'll be caught off guard", points: 1 },
        { text: "Somewhat confident, but I triple-check everything beforehand and bring backup", points: 2 },
        { text: "Mostly confident, with occasional concerns about edge cases or timing issues", points: 3 },
        { text: "Completely confident—the data is validated and I can defend every number", points: 4 }
      ]
    },

    // Section 2: Reporting & Visibility (Questions 8-13)
    {
      category: "Reporting & Visibility",
      question: "How much time does your team spend creating reports, dashboards, and presentations for leadership meetings?",
      options: [
        { text: "1-2 full days per week across multiple people (8+ hours)", points: 1 },
        { text: "Half a day per week (3-4 hours) pulling data and building decks", points: 2 },
        { text: "1-2 hours per week making minor updates to existing dashboards", points: 3 },
        { text: "Under 30 minutes per week—dashboards auto-update and we focus on analysis", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "How current is the business data you see when making decisions?",
      options: [
        { text: "Usually 1-2 weeks old; we see last week's or last month's numbers", points: 1 },
        { text: "2-3 days old; yesterday's numbers available by mid-morning", points: 2 },
        { text: "End-of-day prior; we see yesterday's complete results first thing this morning", points: 3 },
        { text: "Real-time or hourly; we see today's performance as it happens", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "When Sales, Finance, and Operations discuss performance, what happens?",
      options: [
        { text: "We often debate whose numbers are correct and why they differ", points: 1 },
        { text: "We use different systems but reconcile before important meetings", points: 2 },
        { text: "We mostly align, but sometimes need clarification on definitions or timing", points: 3 },
        { text: "Everyone uses the same dashboard—no debates, just strategic discussions", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "How well-defined and aligned are your key performance indicators across the organization?",
      options: [
        { text: "Every department tracks different metrics; there's no common scorecard", points: 1 },
        { text: "We have KPIs, but they're not consistently tracked or universally understood", points: 2 },
        { text: "We've identified our North Star Metrics, but not everyone references them regularly", points: 3 },
        { text: "5-7 North Star Metrics are tracked religiously by everyone, executive to frontline", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "How easily can you compare current performance to past periods?",
      options: [
        { text: "Requires manual data compilation from multiple sources; takes hours or days", points: 1 },
        { text: "Can be done with some effort by running reports and building comparisons (30-60 minutes)", points: 2 },
        { text: "Available through standard reports with period-over-period views (5-10 minutes)", points: 3 },
        { text: "Instant visual comparisons (month/quarter/year) built into every dashboard", points: 4 }
      ]
    },
    {
      category: "Reporting & Visibility",
      question: "When you identify a problem in the data, how quickly can you act?",
      options: [
        { text: "Days to weeks—need to verify, investigate, and coordinate response", points: 1 },
        { text: "2-3 days—need to confirm the issue and plan the response", points: 2 },
        { text: "Same day or next day—clear ownership and response protocols exist", points: 3 },
        { text: "Within hours—automated workflows trigger immediate responses or alerts", points: 4 }
      ]
    },

    // Section 3: Predictive Capability (Questions 14-19)
    {
      category: "Predictive Capability",
      question: "How do you identify at-risk customers or expansion opportunities?",
      options: [
        { text: "We find out when they cancel, stop buying, or explicitly tell us", points: 1 },
        { text: "Through manual review of usage patterns or sales rep intuition", points: 2 },
        { text: "Through periodic analysis of customer health scores or engagement metrics", points: 3 },
        { text: "Through predictive models that automatically flag risk/opportunity before behavior changes", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "How accurate are your sales and inventory forecasts?",
      options: [
        { text: "Frequently off by 30%+; we're constantly surprised by stockouts or excess inventory", points: 1 },
        { text: "Accurate within 20-30%; we get the direction right but magnitude wrong", points: 2 },
        { text: "Accurate within 10-20%; reliable enough for most planning purposes", points: 3 },
        { text: "Accurate within 10%; we confidently plan production, staffing, and cash flow", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "How do you anticipate market shifts, competitive threats, or opportunities?",
      options: [
        { text: "We react when customers or competitors make moves; we're always catching up", points: 1 },
        { text: "Through quarterly strategic reviews and occasional market research", points: 2 },
        { text: "Through monthly tracking of leading indicators and competitive intelligence", points: 3 },
        { text: "Through real-time monitoring of signals that predict changes 4-8 weeks ahead", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "How do you model 'what-if' scenarios (e.g., sales drop 20%, new region launch)?",
      options: [
        { text: "We don't—too time-consuming or we lack the tools", points: 1 },
        { text: "Manually in spreadsheets over several days; limited scenarios possible", points: 2 },
        { text: "Through financial models that take a few hours to update and run", points: 3 },
        { text: "Through dynamic tools that show impact across all metrics within minutes", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "What percentage of your strategic decisions are based on predictive insights vs. reactive responses?",
      options: [
        { text: "Under 25%—we're mostly firefighting and responding to what happened", points: 1 },
        { text: "25-50%—we try to be proactive but often get pulled into reactive mode", points: 2 },
        { text: "50-75%—we're increasingly proactive but still have reactive moments", points: 3 },
        { text: "Over 75%—we anticipate and shape outcomes rather than respond to them", points: 4 }
      ]
    },
    {
      category: "Predictive Capability",
      question: "In the last quarter, how often were you blindsided by events your data should have predicted?",
      options: [
        { text: "Multiple times per month (stockouts, cash issues, customer losses, competitor moves)", points: 1 },
        { text: "Once or twice per month—significant but manageable surprises", points: 2 },
        { text: "Once per quarter—rare but impactful surprises", points: 3 },
        { text: "Almost never—our leading indicators catch issues early", points: 4 }
      ]
    },

    // Section 4: Automation & Strategic Leverage (Questions 20-25)
    {
      category: "Automation & Strategic Leverage",
      question: "What percentage of routine business decisions happen automatically vs. requiring manual approval?",
      options: [
        { text: "Under 25%—nearly everything requires human review and approval", points: 1 },
        { text: "25-50%—some routine tasks automated but most decisions still manual", points: 2 },
        { text: "50-75%—majority of routine decisions automated with exception handling", points: 3 },
        { text: "Over 75%—pricing, inventory, outreach, allocation mostly automated", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "How is AI or machine learning deployed in your business operations?",
      options: [
        { text: "Not deployed; we're exploring or in pilot phase only", points: 1 },
        { text: "Limited deployment in 1-2 areas with modest impact", points: 2 },
        { text: "Active deployment in 3-5 areas showing measurable business value", points: 3 },
        { text: "Integrated across operations, customer experience, and strategy with proven ROI", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "How defensible is your competitive advantage based on proprietary data?",
      options: [
        { text: "We use the same data sources as our competitors; no unique advantage", points: 1 },
        { text: "We have some unique data but haven't leveraged it into competitive advantage", points: 2 },
        { text: "Our data insights give us edge in specific areas that competitors struggle to replicate", points: 3 },
        { text: "Our proprietary data and models create a moat that's nearly impossible to copy", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "If investors or acquirers conducted due diligence on your data infrastructure today, what would happen?",
      options: [
        { text: "Major red flags; would likely reduce valuation or kill deals", points: 1 },
        { text: "Concerns raised; would require remediation plan and extended timeline", points: 2 },
        { text: "Generally acceptable; minor improvements needed but wouldn't block deals", points: 3 },
        { text: "Competitive advantage; would increase valuation multiple due to data assets", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "What would happen if your top data analyst or IT person left tomorrow?",
      options: [
        { text: "Critical systems would fail; we'd scramble to keep operations running", points: 1 },
        { text: "Significant disruption for weeks; dependent on tribal knowledge", points: 2 },
        { text: "Short-term slowdown; documentation exists but transition would be bumpy", points: 3 },
        { text: "Minimal disruption; systems documented, automated, and team-operated", points: 4 }
      ]
    },
    {
      category: "Automation & Strategic Leverage",
      question: "What have you done with time and money saved through data automation?",
      options: [
        { text: "We haven't achieved automation savings yet", points: 1 },
        { text: "Savings were absorbed by other operational needs; no strategic reinvestment", points: 2 },
        { text: "Some reinvestment in growth, but not systematically allocated", points: 3 },
        { text: "Consistently reinvested in new products, markets, and talent—compounding growth", points: 4 }
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
  const handleAnswer = (points) => {
    const newAnswers = [...answers, points];
    setAnswers(newAnswers);
    setScore(score + points);

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

    const payload = {
      ...lead,
      score: score,
      maturityLevel: finalLevel.title,
      maturityId: finalLevel.id, // This is what n8n looks for!
      answers: answers,
      submittedAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firebase (Keep your memory)
      // await addDoc(collection(db, "leads"), payload); // Uncomment when using real Firebase

      // 2. Send to n8n (Trigger the email)
      // REPLACE 'YOUR_N8N_WEBHOOK_URL' WITH THE URL YOU COPIED IN STEP 1
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Data Maturity Assessment</h1>
            <p className="text-indigo-200 text-lg max-w-lg mx-auto">
              Discover where your organization stands on the curve from "Chaos" to "AI-Driven."
            </p>
          </div>
          <div className="p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
               <div className="flex flex-col items-center text-center">
                 <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><Shield size={24} /></div>
                 <h3 className="font-bold text-slate-800">Assess Risk</h3>
                 <p className="text-sm text-slate-500">Find governance gaps.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                 <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><TrendingUp size={24} /></div>
                 <h3 className="font-bold text-slate-800">Benchmark</h3>
                 <p className="text-sm text-slate-500">Compare to competitors.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                 <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><CheckCircle size={24} /></div>
                 <h3 className="font-bold text-slate-800">Action Plan</h3>
                 <p className="text-sm text-slate-500">Get a custom roadmap.</p>
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
                onClick={() => handleAnswer(option.points)}
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
