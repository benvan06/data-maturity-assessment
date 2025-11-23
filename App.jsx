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
    {
      category: "Strategy",
      question: "How does your organization currently make critical business decisions?",
      options: [
        { text: "Gut feeling and experience mostly.", points: 1 },
        { text: "We look at ad-hoc spreadsheets when needed.", points: 2 },
        { text: "We review standard dashboards weekly.", points: 3 },
        { text: "AI-driven insights guide our daily actions.", points: 4 }
      ]
    },
    {
      category: "Infrastructure",
      question: "Where is your customer data currently stored?",
      options: [
        { text: "Various Excel sheets on different computers.", points: 1 },
        { text: "In the CRM (Salesforce/HubSpot) only.", points: 2 },
        { text: "Centralized Data Warehouse (Snowflake/BigQuery).", points: 3 },
        { text: "Real-time Data Lakehouse with streaming.", points: 4 }
      ]
    },
    {
      category: "Governance",
      question: "What happens when someone finds an error in a report?",
      options: [
        { text: "Panic. We don't know where the data came from.", points: 1 },
        { text: "IT is emailed to fix it manually.", points: 2 },
        { text: "The data owner is notified via automated alert.", points: 3 },
        { text: "Self-healing pipelines correct anomalies automatically.", points: 4 }
      ]
    },
    {
      category: "Talent",
      question: "Who is responsible for data analysis in your team?",
      options: [
        { text: "Everyone does their own thing in Excel.", points: 1 },
        { text: "We have one 'Excel Guy' everyone asks.", points: 2 },
        { text: "Dedicated Data Analysts support the team.", points: 3 },
        { text: "Data Engineers and Data Scientists work together.", points: 4 }
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
            <button onClick={() => window.open('https://calendly.com', '_blank')} className="text-indigo-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
              Book a free 15-min Strategy Review <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;