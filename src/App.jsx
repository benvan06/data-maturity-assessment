import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, BarChart2, CheckCircle, Shield, TrendingUp, ChevronRight, Loader2, Database, Eye, Target, Zap } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyDxM1IK9uXVtlZRtJPkqmcy0eMEAXfcbgc",
  authDomain: "data-maturity-funnel.firebaseapp.com",
  projectId: "data-maturity-funnel",
  storageBucket: "data-maturity-funnel.firebasestorage.app",
  messagingSenderId: "686472283312",
  appId: "1:686472283312:web:e04c3713c0bff158fbe775",
  measurementId: "G-V1MSZHX78K"
};

const categories = [
  { id: 'foundation', name: 'Data Foundation & Trust', icon: Database, count: 4 },
  { id: 'reporting', name: 'Reporting & Visibility', icon: Eye, count: 4 },
  { id: 'predictive', name: 'Predictive Capability', icon: Target, count: 4 },
  { id: 'automation', name: 'Automation & Leverage', icon: Zap, count: 3 }
];

const questions = [
  // Data Foundation & Trust (4 questions)
  {
    category: 'foundation',
    question: "How confident are you that every commission split and referral fee across all branches is calculated correctly?",
    options: [
      { text: "We regularly discover errors weeks later \u2014 agents complain and referral partners chase payments", points: 1 },
      { text: "We catch most errors at month-end, but it delays payroll and creates tension", points: 2 },
      { text: "Errors are rare and usually caught within days, though manual checking is still needed", points: 3 },
      { text: "Every commission and fee is validated automatically in real-time \u2014 zero disputes", points: 4 }
    ]
  },
  {
    category: 'foundation',
    question: "When you ask \u2018Which branch is performing best this month?\u2019 \u2014 what happens?",
    options: [
      { text: "Each branch gives different numbers from their own spreadsheets \u2014 hours spent reconciling", points: 1 },
      { text: "We get consistent numbers eventually, after ops spends half a day pulling reports", points: 2 },
      { text: "Our CRM gives mostly consistent data, though managers sometimes question figures", points: 3 },
      { text: "One dashboard shows real-time performance across every branch and agent instantly", points: 4 }
    ]
  },
  {
    category: 'foundation',
    question: "How quickly can you access pipeline value, conversion rates, or days-to-offer by branch?",
    options: [
      { text: "Hours or days \u2014 someone has to pull the data, and by then the moment\u2019s passed", points: 1 },
      { text: "Within 30\u201360 minutes by logging into multiple systems and exporting reports", points: 2 },
      { text: "Within 10\u201315 minutes through our CRM\u2019s reporting dashboard", points: 3 },
      { text: "Instant \u2014 live dashboards on my phone updating in real-time", points: 4 }
    ]
  },
  {
    category: 'foundation',
    question: "What would happen if all spreadsheets disappeared from your agency tomorrow?",
    options: [
      { text: "Total chaos \u2014 commission calculations, pipeline tracking, and reporting would stop", points: 1 },
      { text: "Major disruption for a week \u2014 key processes depend on individual spreadsheets", points: 2 },
      { text: "Short-term inconvenience \u2014 spreadsheets mostly used for one-off analysis", points: 3 },
      { text: "Minimal impact \u2014 everything runs through our integrated platform", points: 4 }
    ]
  },

  // Reporting & Visibility (4 questions)
  {
    category: 'reporting',
    question: "How much time does your team spend preparing branch performance reports each week?",
    options: [
      { text: "1\u20132 full days pulling data from CRM, spreadsheets, and portal accounts", points: 1 },
      { text: "Half a day manually consolidating reports across branches", points: 2 },
      { text: "1\u20132 hours updating templates and adding commentary", points: 3 },
      { text: "Under 30 minutes \u2014 automated dashboards update themselves", points: 4 }
    ]
  },
  {
    category: 'reporting',
    question: "How current is your view of viewing bookings, offer activity, and pipeline movement?",
    options: [
      { text: "Last week\u2019s or last month\u2019s numbers \u2014 by the time we know, it\u2019s too late", points: 1 },
      { text: "Yesterday\u2019s activity by mid-morning \u2014 enough to react but not prevent", points: 2 },
      { text: "End-of-previous-day complete \u2014 morning briefings are accurate but not live", points: 3 },
      { text: "Real-time \u2014 we see viewings, offers, and fallen-throughs as they happen", points: 4 }
    ]
  },
  {
    category: 'reporting',
    question: "How well-aligned are your KPIs across all branches?",
    options: [
      { text: "Every branch tracks different metrics \u2014 there\u2019s no common scorecard", points: 1 },
      { text: "We\u2019ve defined KPIs centrally, but branches interpret them differently", points: 2 },
      { text: "Network-wide KPIs that branches mostly follow, with some variation", points: 3 },
      { text: "5\u20137 North Star Metrics tracked identically across every branch", points: 4 }
    ]
  },
  {
    category: 'reporting',
    question: "When you spot a problem \u2014 conversion rate dropping, pipeline thinning \u2014 how quickly can you act?",
    options: [
      { text: "Days to weeks \u2014 by the time it\u2019s confirmed, we\u2019ve lost more instructions", points: 1 },
      { text: "2\u20133 days to investigate, verify the trend, and plan intervention", points: 2 },
      { text: "Same day \u2014 clear escalation paths and empowered branch managers", points: 3 },
      { text: "Within hours \u2014 automated alerts trigger action before it becomes a crisis", points: 4 }
    ]
  },

  // Predictive Capability (4 questions)
  {
    category: 'predictive',
    question: "How do you identify which vendors are about to reduce price, pull out, or switch to a competitor?",
    options: [
      { text: "When they call to terminate or the board goes up next door with a rival", points: 1 },
      { text: "Agent intuition and weekly pipeline reviews with anecdotal flags", points: 2 },
      { text: "Monthly analysis of engagement metrics \u2014 viewing requests, feedback patterns", points: 3 },
      { text: "Predictive scoring flags at-risk instructions 2\u20133 weeks early", points: 4 }
    ]
  },
  {
    category: 'predictive',
    question: "How accurately can you predict which property types and postcodes will be in demand next quarter?",
    options: [
      { text: "Completely reactive \u2014 we list what vendors give us and hope buyers appear", points: 1 },
      { text: "Based on agent \u2018feel\u2019 and basic trends \u2014 directionally right, specifics wrong", points: 2 },
      { text: "Using historical patterns and market reports \u2014 accurate within 20%", points: 3 },
      { text: "Predictive models combining our data and market indicators \u2014 within 10%", points: 4 }
    ]
  },
  {
    category: 'predictive',
    question: "What percentage of your decisions are strategic vs. firefighting yesterday\u2019s problems?",
    options: [
      { text: "Under 25% \u2014 constantly reacting to fallen-throughs, complaints, and surprises", points: 1 },
      { text: "25\u201350% \u2014 we try to be strategic but fires keep pulling us backward", points: 2 },
      { text: "50\u201375% \u2014 increasingly proactive, though still blindsided by shifts", points: 3 },
      { text: "Over 75% \u2014 we see opportunities and threats before competitors", points: 4 }
    ]
  },
  {
    category: 'predictive',
    question: "How often are you blindsided by something your data should have predicted?",
    options: [
      { text: "Multiple times per month \u2014 cash crunches, instruction losses, agent departures", points: 1 },
      { text: "Once or twice per month \u2014 significant surprises needing urgent response", points: 2 },
      { text: "Once per quarter \u2014 rare but impactful events", points: 3 },
      { text: "Almost never \u2014 leading indicators flag issues early enough to prevent them", points: 4 }
    ]
  },

  // Automation & Strategic Leverage (3 questions)
  {
    category: 'automation',
    question: "What percentage of routine operational decisions happen automatically vs. needing manual approval?",
    options: [
      { text: "Under 25% \u2014 we manually approve commissions, budgets, and priorities daily", points: 1 },
      { text: "25\u201350% \u2014 some workflows automated but most decisions need human approval", points: 2 },
      { text: "50\u201375% \u2014 routine operations automated with exception-only review", points: 3 },
      { text: "Over 75% \u2014 routine operations run automatically; we focus on strategy", points: 4 }
    ]
  },
  {
    category: 'automation',
    question: "If a buyer or investor conducted due diligence on your data and systems today, what would happen?",
    options: [
      { text: "Deal killer \u2014 inconsistent records, scattered data, no audit trail", points: 1 },
      { text: "Serious concerns \u2014 6+ months remediation needed, valuation hit", points: 2 },
      { text: "Acceptable with caveats \u2014 minor improvements needed, deal could proceed", points: 3 },
      { text: "Valuation enhancer \u2014 clean data and scalable systems command a premium", points: 4 }
    ]
  },
  {
    category: 'automation',
    question: "What would happen if your longest-serving branch or office manager left tomorrow?",
    options: [
      { text: "Catastrophic \u2014 they hold all the \u2018how things work\u2019 knowledge", points: 1 },
      { text: "Major disruption for weeks \u2014 heavy reliance on tribal knowledge", points: 2 },
      { text: "Short-term disruption \u2014 some documented processes but significant handover needed", points: 3 },
      { text: "Minimal impact \u2014 all processes systematized; new person productive within days", points: 4 }
    ]
  }
];

const getMaturityLevel = (finalScore) => {
  const avg = finalScore / questions.length;
  if (avg <= 1.5) return {
    id: 'novice',
    title: "Data Novice",
    color: "text-red-600",
    bg: "bg-red-50",
    barColor: "bg-red-500",
    description: "Your agency is operating with significant data blind spots. Critical information is scattered across spreadsheets, individual knowledge, and disconnected systems. The good news? Agencies at this stage typically see the fastest improvements \u2014 small changes deliver outsized results.",
    recommendations: [
      "Centralise critical data into one system of record",
      "Eliminate spreadsheet dependency for core operations",
      "Establish 5\u20137 consistent KPIs across all branches"
    ]
  };
  if (avg <= 2.5) return {
    id: 'reactive',
    title: "Data Reactive",
    color: "text-orange-600",
    bg: "bg-orange-50",
    barColor: "bg-orange-500",
    description: "Your agency has taken initial steps, but still relies heavily on manual processes and workarounds. You\u2019re spending too much time gathering data and not enough acting on it. Most multi-branch agencies are here \u2014 the gap to market leaders is very closeable.",
    recommendations: [
      "Automate reporting to reclaim 1\u20132 days per week",
      "Build early warning systems for at-risk instructions",
      "Standardise processes so knowledge isn\u2019t held by individuals"
    ]
  };
  if (avg <= 3.5) return {
    id: 'pro',
    title: "Data Pro",
    color: "text-blue-600",
    bg: "bg-blue-50",
    barColor: "bg-blue-500",
    description: "Your agency has solid foundations with room to optimise. You\u2019ve moved beyond spreadsheet chaos, but there\u2019s untapped potential in automation and predictive capabilities. You\u2019re well-positioned for the leap to data-driven market leadership.",
    recommendations: [
      "Implement predictive analytics for vendor and market behaviour",
      "Automate routine operational decisions",
      "Build your proprietary data moat for competitive advantage"
    ]
  };
  return {
    id: 'visionary',
    title: "Data Visionary",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    barColor: "bg-emerald-500",
    description: "Your agency is operating at a high level of data maturity. Your systems and insights put you ahead of most competitors. The focus now is maintaining this edge, leveraging AI, and turning your data advantage into accelerated market share growth.",
    recommendations: [
      "Leverage AI for valuation accuracy and lead conversion",
      "Ensure data infrastructure supports premium exit valuation",
      "Reinvest efficiency gains into strategic market expansion"
    ]
  };
};

const App = () => {
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [lead, setLead] = useState({ name: '', email: '', company: '', role: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryScores = () => {
    const catScores = {};
    let qIndex = 0;
    categories.forEach(cat => {
      let catTotal = 0;
      const catMax = cat.count * 4;
      for (let i = 0; i < cat.count; i++) {
        if (answers[qIndex + i] !== undefined) {
          catTotal += questions[qIndex + i].options[answers[qIndex + i]].points;
        }
      }
      catScores[cat.id] = {
        score: catTotal,
        max: catMax,
        percentage: Math.round((catTotal / catMax) * 100)
      };
      qIndex += cat.count;
    });
    return catScores;
  };

  const getCurrentCategoryIndex = () => {
    let qCount = 0;
    for (let i = 0; i < categories.length; i++) {
      if (currentQuestion < qCount + categories[i].count) return i;
      qCount += categories[i].count;
    }
    return 0;
  };

  const handleAnswer = (optionIndex) => {
    const selectedOption = questions[currentQuestion].options[optionIndex];
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    setScore(score + selectedOption.points);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('capture');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      const lastAnswer = answers[answers.length - 1];
      const lastPoints = questions[currentQuestion - 1].options[lastAnswer].points;
      setScore(score - lastPoints);
      setAnswers(answers.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalLevel = getMaturityLevel(score);
    const catScores = getCategoryScores();
    const detailedAnswers = questions.map((question, index) => ({
      category: categories.find(c => c.id === question.category)?.name || question.category,
      question: question.question,
      answer: question.options[answers[index]].text,
      points: question.options[answers[index]].points
    }));
    const payload = {
      ...lead,
      score,
      maxScore: questions.length * 4,
      maturityLevel: finalLevel.title,
      maturityId: finalLevel.id,
      categoryScores: catScores,
      detailedAnswers,
      submittedAt: new Date().toISOString()
    };
    try {
      await fetch('https://n8n.srv950234.hstgr.cloud/webhook/maturity-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // Track completion in GA4
      if (window.gtag) {
        window.gtag('event', 'assessment_completed', {
          event_category: 'Assessment',
          event_label: finalLevel.title,
          value: score
        });
      }
      setStep('results');
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const level = getMaturityLevel(score);
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentCatIndex = getCurrentCategoryIndex();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center p-4">

      {/* INTRO */}
      {step === 'intro' && (
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-900 p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <BarChart2 size={56} className="mx-auto mb-6 text-indigo-300" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Estate Agency Data Maturity Assessment</h1>
            <p className="text-indigo-200 text-lg max-w-lg mx-auto">
              Discover where your multi-branch agency stands on the journey from spreadsheet chaos to data-driven market leader.
            </p>
          </div>
          <div className="p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><Shield size={24} /></div>
                <h3 className="font-bold text-slate-800">Identify Risks</h3>
                <p className="text-sm text-slate-500">Commission errors, data gaps, key person dependency.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><TrendingUp size={24} /></div>
                <h3 className="font-bold text-slate-800">Benchmark Performance</h3>
                <p className="text-sm text-slate-500">See how you compare to data-mature agencies.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><CheckCircle size={24} /></div>
                <h3 className="font-bold text-slate-800">Get Recommendations</h3>
                <p className="text-sm text-slate-500">Tailored next steps for your agency's growth.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                5 minutes
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                15 questions
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Instant results
              </span>
            </div>
            <button
              onClick={() => {
                setStep('quiz');
                if (window.gtag) {
                  window.gtag('event', 'assessment_started', { event_category: 'Assessment' });
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              Start Assessment <ArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {step === 'quiz' && (
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 relative">
          {/* Category progress segments */}
          <div className="mb-6">
            <div className="flex gap-1 mb-3">
              {categories.map((cat, idx) => (
                <div key={cat.id} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx < currentCatIndex ? 'bg-indigo-600' :
                    idx === currentCatIndex ? 'bg-indigo-400' :
                    'bg-slate-200'
                  }`}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-600 font-bold text-sm uppercase tracking-wide">
                {categories.find(c => c.id === questions[currentQuestion].category)?.name}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-6 leading-snug">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group flex items-start gap-3"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 flex-shrink-0"></div>
                <span className="text-sm text-slate-700 font-medium group-hover:text-indigo-900">{option.text}</span>
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              className="mt-6 text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={14} /> Previous question
            </button>
          )}
        </div>
      )}

      {/* LEAD CAPTURE */}
      {step === 'capture' && (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Assessment Complete!</h2>
            <p className="text-slate-500 mt-2">Enter your details to see your personalised results and recommendations.</p>
          </div>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email *</label>
              <input
                required
                type="email"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="jane@company.com"
                value={lead.email}
                onChange={(e) => setLead({...lead, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
              <input
                required
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="ABC Estate Agents"
                value={lead.company}
                onChange={(e) => setLead({...lead, company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
              <input
                required
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Managing Director"
                value={lead.role}
                onChange={(e) => setLead({...lead, role: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="tel"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="+44 7700 900000"
                value={lead.phone}
                onChange={(e) => setLead({...lead, phone: e.target.value})}
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" /> Generating Results...</>
              ) : (
                <>See My Results <ArrowRight size={18} /></>
              )}
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">
              Your data is secure. We'll send a copy of your results to your inbox.
            </p>
          </form>
        </div>
      )}

      {/* RESULTS */}
      {step === 'results' && (() => {
        const catScores = getCategoryScores();
        return (
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`${level.bg} p-10 text-center border-b border-slate-100`}>
              <span className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-2 block">Your Data Maturity Level</span>
              <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 ${level.color}`}>{level.title}</h1>
              <p className="text-2xl font-bold text-slate-700 mb-4">{score} / {questions.length * 4} points</p>
              <p className="text-slate-600 max-w-lg mx-auto">{level.description}</p>
            </div>

            {/* Category Breakdown */}
            <div className="p-8 md:p-10">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                <BarChart2 size={20} className="text-indigo-600"/> Your Breakdown by Category
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {categories.map(cat => {
                  const catData = catScores[cat.id];
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className="text-indigo-600" />
                        <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-slate-500">{catData.score} / {catData.max}</span>
                        <span className="text-indigo-600 font-bold">{catData.percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full">
                        <div
                          className={`h-full ${level.barColor} rounded-full transition-all duration-700`}
                          style={{ width: `${catData.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
                <h3 className="font-bold text-lg text-indigo-900 mb-4">Your Top 3 Priorities</h3>
                <div className="space-y-3">
                  {level.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <span className="text-slate-700 font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="https://agi-automations.com/services.html#audit-request"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-center no-underline"
                >
                  Request Free Data Audit <ArrowRight size={18} />
                </a>
                <a
                  href="https://calendly.com/agiautomations/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-center no-underline"
                >
                  Book a Free 30-Min Review <ChevronRight size={18} />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
              <p className="text-slate-500 text-sm">
                We've sent a copy of your results to <strong>{lead.email}</strong>. Check your inbox (and spam folder).
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default App;
