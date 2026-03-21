import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, BarChart2, CheckCircle, Shield, TrendingUp, ChevronRight, Loader2, Database, Eye, Target, Zap } from 'lucide-react';

const categories = [
  { id: 'data', name: 'Data & Systems', icon: Database, count: 3 },
  { id: 'governance', name: 'Governance & Ownership', icon: Shield, count: 4 },
  { id: 'decisions', name: 'Decision-Making & Process', icon: Target, count: 4 },
  { id: 'aireadiness', name: 'AI Readiness & Leverage', icon: Zap, count: 4 }
];

const questions = [
  // Data & Systems (3 questions)
  {
    category: 'data',
    question: "When you ask \u2018Which branch is performing best this month?\u2019 \u2014 what happens?",
    options: [
      { text: "Each branch gives different numbers from their own spreadsheets \u2014 hours spent reconciling", points: 1 },
      { text: "We get consistent numbers eventually, after ops spends half a day pulling reports", points: 2 },
      { text: "Our CRM gives mostly consistent data, though managers sometimes question figures", points: 3 },
      { text: "One dashboard shows real-time performance across every branch and agent instantly", points: 4 }
    ]
  },
  {
    category: 'data',
    question: "How quickly can you access pipeline value, conversion rates, or days-to-offer by branch?",
    options: [
      { text: "Hours or days \u2014 someone has to pull the data, and by then the moment\u2019s passed", points: 1 },
      { text: "Within 30\u201360 minutes by logging into multiple systems and exporting reports", points: 2 },
      { text: "Within 10\u201315 minutes through our CRM\u2019s reporting dashboard", points: 3 },
      { text: "Instant \u2014 live dashboards on my phone updating in real-time", points: 4 }
    ]
  },
  {
    category: 'data',
    question: "How much time does your team spend preparing branch performance reports each week?",
    options: [
      { text: "1\u20132 full days pulling data from CRM, spreadsheets, and portal accounts", points: 1 },
      { text: "Half a day manually consolidating reports across branches", points: 2 },
      { text: "1\u20132 hours updating templates and adding commentary", points: 3 },
      { text: "Under 30 minutes \u2014 automated dashboards update themselves", points: 4 }
    ]
  },

  // Governance & Ownership (4 questions)
  {
    category: 'governance',
    question: "Who is ultimately responsible for data quality across all your branches?",
    options: [
      { text: "Nobody \u2014 it\u2019s everyone\u2019s job, which means it\u2019s nobody\u2019s job", points: 1 },
      { text: "Branch managers handle their own data, with no central oversight", points: 2 },
      { text: "One person (ops director or similar) oversees it, but has no formal authority or KPIs", points: 3 },
      { text: "A named role with clear authority, KPIs, and escalation rights", points: 4 }
    ]
  },
  {
    category: 'governance',
    question: "When a branch manager consistently enters incomplete or inconsistent data, what happens?",
    options: [
      { text: "Nothing \u2014 we don\u2019t monitor individual data quality", points: 1 },
      { text: "Someone might mention it informally, but there\u2019s no consequence", points: 2 },
      { text: "It gets flagged in reviews, but data quality isn\u2019t tied to performance", points: 3 },
      { text: "It\u2019s measured, reported, and tied to their performance management", points: 4 }
    ]
  },
  {
    category: 'governance',
    question: "How are data standards (field naming, dropdown values, process steps) decided and enforced?",
    options: [
      { text: "There are no standards \u2014 each branch does it their own way", points: 1 },
      { text: "We\u2019ve written standards but nobody follows them consistently", points: 2 },
      { text: "Standards exist and are mostly followed, with occasional drift", points: 3 },
      { text: "Standards are centrally defined, automatically enforced where possible, and regularly audited", points: 4 }
    ]
  },
  {
    category: 'governance',
    question: "When there\u2019s a dispute about data between branches (e.g., who originated a lead, how a fee should split), how is it resolved?",
    options: [
      { text: "Whoever shouts loudest wins \u2014 no clear process", points: 1 },
      { text: "The MD or ops director makes a judgment call each time", points: 2 },
      { text: "There\u2019s a defined process but it\u2019s slow and inconsistent", points: 3 },
      { text: "Clear decision rights, documented rules, and fast resolution \u2014 under 24 hours", points: 4 }
    ]
  },

  // Decision-Making & Process (4 questions)
  {
    category: 'decisions',
    question: "How are strategic decisions (pricing, marketing spend, staffing) made across your branches?",
    options: [
      { text: "Each branch decides independently \u2014 the MD reviews results after the fact", points: 1 },
      { text: "The MD makes most decisions based on experience and gut feel", points: 2 },
      { text: "Decisions are informed by data, but the process varies by branch and topic", points: 3 },
      { text: "A consistent decision framework: data informs, branches propose, leadership approves", points: 4 }
    ]
  },
  {
    category: 'decisions',
    question: "What percentage of your leadership time is spent on strategic decisions vs firefighting?",
    options: [
      { text: "Under 25% strategic \u2014 constantly reacting to fallen-throughs, complaints, and surprises", points: 1 },
      { text: "25\u201350% \u2014 we try to be strategic but fires keep pulling us backward", points: 2 },
      { text: "50\u201375% \u2014 increasingly proactive, though still blindsided occasionally", points: 3 },
      { text: "Over 75% \u2014 we anticipate problems before they escalate", points: 4 }
    ]
  },
  {
    category: 'decisions',
    question: "How well-aligned are your KPIs and success metrics across all branches?",
    options: [
      { text: "Every branch tracks different metrics \u2014 there\u2019s no common scorecard", points: 1 },
      { text: "We\u2019ve defined KPIs centrally, but branches interpret them differently", points: 2 },
      { text: "Network-wide KPIs that branches mostly follow, with some variation", points: 3 },
      { text: "Identical metrics tracked the same way in every branch, reviewed weekly", points: 4 }
    ]
  },
  {
    category: 'decisions',
    question: "When you introduce a new process or tool, how quickly do all branches adopt it?",
    options: [
      { text: "Months, if ever \u2014 branches resist change and there\u2019s no enforcement", points: 1 },
      { text: "4\u20138 weeks with heavy chasing and inconsistent adoption", points: 2 },
      { text: "2\u20134 weeks with a structured rollout plan and training", points: 3 },
      { text: "Under 2 weeks \u2014 change management is built into how we operate", points: 4 }
    ]
  },

  // AI Readiness & Leverage (4 questions)
  {
    category: 'aireadiness',
    question: "How do you identify which vendors are about to reduce price, pull out, or switch to a competitor?",
    options: [
      { text: "When they call to terminate or the board goes up next door with a rival", points: 1 },
      { text: "Agent intuition and weekly pipeline reviews", points: 2 },
      { text: "Monthly analysis of engagement metrics \u2014 viewing requests, feedback patterns", points: 3 },
      { text: "Automated scoring flags at-risk instructions 2\u20133 weeks early", points: 4 }
    ]
  },
  {
    category: 'aireadiness',
    question: "What percentage of routine operational decisions happen automatically vs needing manual approval?",
    options: [
      { text: "Under 25% \u2014 nearly everything needs a human decision", points: 1 },
      { text: "25\u201350% \u2014 some workflows automated but most decisions need approval", points: 2 },
      { text: "50\u201375% \u2014 routine operations automated with exception-only review", points: 3 },
      { text: "Over 75% \u2014 routine operations run automatically; leadership focuses on strategy", points: 4 }
    ]
  },
  {
    category: 'aireadiness',
    question: "What would happen if your longest-serving branch manager left tomorrow?",
    options: [
      { text: "Catastrophic \u2014 they hold all the \u2018how things work\u2019 knowledge", points: 1 },
      { text: "Major disruption for weeks \u2014 heavy reliance on tribal knowledge", points: 2 },
      { text: "Short-term disruption \u2014 some documented processes but significant handover needed", points: 3 },
      { text: "Minimal impact \u2014 all processes systematised; new person productive within days", points: 4 }
    ]
  },
  {
    category: 'aireadiness',
    question: "If you deployed an AI tool tomorrow (lead scoring, automated valuations, predictive analytics), would your agency be ready to act on its outputs?",
    options: [
      { text: "No \u2014 we wouldn\u2019t trust it, wouldn\u2019t know who acts on it, and it would sit unused", points: 1 },
      { text: "Probably not \u2014 we\u2019d need to redesign processes and train people first", points: 2 },
      { text: "Partially \u2014 some teams could use it, but adoption would be patchy without a rollout plan", points: 3 },
      { text: "Yes \u2014 we have the data infrastructure, process discipline, and team readiness to adopt immediately", points: 4 }
    ]
  }
];

const getMaturityLevel = (finalScore) => {
  const avg = finalScore / questions.length;
  if (avg <= 1.5) return {
    id: 'novice',
    title: "Human-Driven",
    color: "text-red-600",
    bg: "bg-red-50",
    barColor: "bg-red-500",
    description: "Your agency operates almost entirely on manual processes and individual knowledge. Decisions are made on gut feel, each branch runs independently, and there's no shared view of performance. The good news? Agencies at this stage see the fastest improvements \u2014 small organisational changes deliver outsized results.",
    recommendations: [
      "Establish who owns data decisions across all branches",
      "Centralise critical data into one system of record",
      "Create a shared KPI framework that every branch reports against"
    ]
  };
  if (avg <= 2.5) return {
    id: 'reactive',
    title: "Data-Aware",
    color: "text-orange-600",
    bg: "bg-orange-50",
    barColor: "bg-orange-500",
    description: "You know data matters but your agency isn\u2019t yet structured to act on it. You\u2019re spending more time gathering data than making decisions. The gap to AI-ready agencies is very closeable \u2014 but it requires organisational change, not just better software.",
    recommendations: [
      "Define accountability for data quality at branch level",
      "Automate reporting to reclaim 1\u20132 days per week",
      "Standardise processes so knowledge isn\u2019t held by individuals"
    ]
  };
  if (avg <= 3.5) return {
    id: 'pro',
    title: "Data-Operational",
    color: "text-blue-600",
    bg: "bg-blue-50",
    barColor: "bg-blue-500",
    description: "Solid foundations, but your operating model hasn\u2019t caught up with your data capability. You have the infrastructure \u2014 now you need to redesign processes and decision-making to unlock AI\u2019s full potential. You\u2019re well-positioned for the leap to AI-ready operations.",
    recommendations: [
      "Redesign workflows to leverage unified data across branches",
      "Implement predictive analytics for vendor and market behaviour",
      "Build your proprietary data moat for competitive advantage"
    ]
  };
  return {
    id: 'visionary',
    title: "AI-Ready",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    barColor: "bg-emerald-500",
    description: "Your agency is positioned to lead the next market cycle. Your data foundations and operational maturity put you ahead of most competitors. The focus now is completing the organisational redesign so AI delivers compounding competitive advantage.",
    recommendations: [
      "Deploy AI agents for lead scoring, vendor churn, and compliance",
      "Ensure your operating model supports premium acquisition valuation",
      "Establish the data moat that makes your advantage unassailable"
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
    } catch (error) {
      console.error("Webhook error:", error);
      // Still show results — don't block the user experience
    }
    // Track completion in GA4
    if (window.gtag) {
      window.gtag('event', 'assessment_completed', {
        event_category: 'Assessment',
        event_label: finalLevel.title,
        value: score
      });
    }
    setStep('results');
    setIsSubmitting(false);
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Estate Agency AI-Readiness Assessment</h1>
            <p className="text-indigo-200 text-lg max-w-lg mx-auto">
              Discover how ready your multi-branch agency is to operate in an AI-driven market — across data, people, and processes.
            </p>
          </div>
          <div className="p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><Shield size={24} /></div>
                <h3 className="font-bold text-slate-800">See Your Blind Spots</h3>
                <p className="text-sm text-slate-500">Where your operating model blocks AI adoption.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><TrendingUp size={24} /></div>
                <h3 className="font-bold text-slate-800">Compare Your Readiness</h3>
                <p className="text-sm text-slate-500">How you stack up against agencies already redesigning.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mb-3"><CheckCircle size={24} /></div>
                <h3 className="font-bold text-slate-800">Get Your Roadmap</h3>
                <p className="text-sm text-slate-500">Tailored next steps for your agency's transformation.</p>
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
                  href="https://audit.agi-automations.com/"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-center no-underline"
                >
                  Request Free Data Audit <ArrowRight size={18} />
                </a>
                <a
                  href="https://strategy.agi-automations.com/#apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-center no-underline"
                >
                  Book a Free Strategy Call <ChevronRight size={18} />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
              <p className="text-slate-500 text-sm">
                Your results have been saved. We'll be in touch at <strong>{lead.email}</strong> with a personalised follow-up based on your score.
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default App;
