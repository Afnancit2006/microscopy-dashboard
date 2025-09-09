import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Info, History, Scan, Save, FileDown, FileText, AlertTriangle, TestTube2, BarChart3, MapPin, Thermometer, Clock } from 'lucide-react';

// --- SVG Logo Component ---
// Re-added self-contained SVG logo to resolve import issues.
const MicroscopeLogo = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    fill="none"
  >
    <circle cx="50" cy="50" r="48" strokeWidth="4"/>
    <path d="M30 30 Q 40 50, 30 70" strokeWidth="3" strokeLinecap="round"/>
    <path d="M70 30 Q 60 50, 70 70" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none"/>
    <circle cx="65" cy="65" r="5" fill="currentColor" stroke="none"/>
    <circle cx="35" cy="40" r="3" fill="currentColor" stroke="none"/>
  </svg>
);


// --- Animated Splash Screen Component ---
const SplashScreen = ({ onAnimationEnd }) => {
  const [stage, setStage] = useState('entering');

  useEffect(() => {
    const sequence = [
      setTimeout(() => setStage('pulsing'), 500),
      setTimeout(() => setStage('exiting'), 2500),
      setTimeout(() => onAnimationEnd(), 3500)
    ];
    return () => sequence.forEach(clearTimeout);
  }, [onAnimationEnd]);
  
  const getAnimationClass = () => {
    switch (stage) {
      case 'entering': return 'opacity-0 scale-90';
      case 'pulsing': return 'opacity-100 scale-100';
      case 'exiting': return 'opacity-0 scale-110 blur-md';
      default: return 'opacity-0';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 select-none">
      <div className={`transform transition-all duration-1000 ease-in-out ${getAnimationClass()}`}>
        <MicroscopeLogo className="w-28 h-28 text-cyan-400" />
        <h1 className="text-5xl font-bold text-white mt-4 tracking-wider">Microscopy</h1>
        <p className="text-slate-400 mt-2 text-center">AI-Powered Analysis</p>
      </div>
    </div>
  );
};


// --- Sidebar Navigation ---
const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const NavItem = ({ icon: Icon, text, page }) => (
    <button
      onClick={() => onNavigate(page)}
      className="flex items-center w-full text-left p-4 text-lg text-slate-300 hover:bg-cyan-500/20 hover:text-white rounded-lg transition-colors"
    >
      <Icon className="w-6 h-6 mr-4" />
      {text}
    </button>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <nav 
        className={`fixed top-0 left-0 h-full w-72 bg-slate-800/90 backdrop-blur-lg shadow-2xl p-6 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-10">
          <span className="text-2xl font-bold text-white">Menu</span>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <X className="w-6 h-6 text-slate-300"/>
          </button>
        </div>
        <div className="space-y-4">
          <NavItem icon={Home} text="Home" page="home" />
          <NavItem icon={Info} text="About" page="about" />
          <NavItem icon={History} text="History" page="history" />
        </div>
      </nav>
    </>
  );
};


// --- Reusable UI Components (Redesigned) ---
const Card = ({ children, className = '' }) => (
  <div className={`bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, icon: Icon }) => (
  <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
    {Icon && <Icon className="w-6 h-6 mr-3 text-cyan-400" />}
    {children}
  </h2>
);

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg flex items-center">
        <div className="p-3 bg-cyan-900/50 rounded-lg mr-4">
           <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Button = ({ children, onClick, icon: Icon, variant = 'primary' }) => {
    const baseClasses = "flex items-center justify-center px-5 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4";
    const variants = {
        primary: "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500/50",
        secondary: "bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-500/50",
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
            {Icon && <Icon className="w-5 h-5 mr-2" />}
            {children}
        </button>
    );
};

// --- Page Content Components ---
const HomePage = ({ data, onScan, onSave }) => {
  const [hasStarted, setHasStarted] = useState(false);

  // View 1: Initial "Get Started" screen
  if (!hasStarted) {
    return (
      <div className="text-center flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to the AI Microscope</h1>
        <p className="text-slate-400 text-lg max-w-xl mb-8">
          Analyze marine microorganisms in real-time. Click below to begin your first scan.
        </p>
        <Button onClick={() => setHasStarted(true)} icon={Scan}>Get Started</Button>
      </div>
    );
  }

  // View 2: "Ready for Analysis" card (before first scan)
  if (!data) {
    return (
      <div className="text-center p-10 bg-slate-800/50 rounded-2xl animate-fade-in">
          <Scan size={48} className="mx-auto text-slate-500 mb-4"/>
          <h2 className="text-2xl font-bold text-white mb-2">Ready for Analysis</h2>
          <p className="text-slate-400 mb-6">Connect your sample and click the "Scan Sample" button to begin.</p>
          <Button onClick={onScan} icon={Scan}>Scan Sample</Button>
      </div>
    );
  }

  // View 3: Full data dashboard (after a scan)
  const totalForPercentage = data.speciesDistribution.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <Card>
          <CardTitle icon={Scan}>Live Feed & Actions</CardTitle>
          <img src={data.image} alt="Microscope Feed" className="w-full rounded-lg border-2 border-slate-600 mb-4" />
          <div className="flex flex-wrap gap-4">
            <Button onClick={onScan} icon={Scan}>Scan Again</Button>
            <Button onClick={onSave} icon={Save} variant="secondary">Save Results</Button>
            <Button onClick={() => alert("PDF export would be generated here.")} icon={FileDown} variant="secondary">Export PDF</Button>
            <Button onClick={() => alert("Excel export would be generated here.")} icon={FileText} variant="secondary">Export Excel</Button>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="space-y-4">
            <StatCard title="Total Organisms Counted" value={data.totalOrganisms} icon={TestTube2} />
            <StatCard title="Unique Species Detected" value={data.uniqueSpecies} icon={BarChart3} />
        </Card>
        {data.highRiskAlerts.length > 0 && (
          <Card className="border-red-500/50">
            <CardTitle icon={AlertTriangle}>High-Risk Alerts</CardTitle>
            {data.highRiskAlerts.map(alert => (
              <div key={alert.name} className="bg-red-900/50 p-3 rounded-lg">
                <p className="font-bold text-red-300">{alert.name} ({alert.species})</p>
                <p>Count: {alert.count} | Risk Level: {alert.risk}</p>
              </div>
            ))}
          </Card>
        )}
        <Card>
            <CardTitle icon={MapPin}>Environmental Data</CardTitle>
            <div className="space-y-3 text-slate-300">
                <div className="flex items-center"><MapPin size={18} className="mr-3 text-slate-500"/><span>{data.environmental.location}</span></div>
                <div className="flex items-center"><Thermometer size={18} className="mr-3 text-slate-500"/><span>{data.environmental.temperature}</span></div>
                <div className="flex items-center"><Clock size={18} className="mr-3 text-slate-500"/><span>{new Date(data.environmental.timestamp).toLocaleString()}</span></div>
            </div>
        </Card>
        <Card>
            <CardTitle icon={BarChart3}>Species Distribution</CardTitle>
            <div className="space-y-3">
            {data.speciesDistribution.map(species => {
                const percentage = totalForPercentage > 0 ? Math.round((species.count / totalForPercentage) * 100) : 0;
                return (
                <div key={species.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-300">{species.name}</span>
                      <span className="text-sm font-bold text-white">{species.count} ({percentage}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-700 rounded-full">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
                );
            })}
            </div>
        </Card>
      </div>
    </div>
  );
};

const AboutPage = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <Card>
            <CardTitle icon={Info}>About the System</CardTitle>
            <p className="text-slate-300 leading-relaxed mb-6"> The Embedded Intelligent Microscopy System is a portable, AI-powered solution designed for real-time analysis of marine microorganisms. It addresses the critical need for rapid, accurate, and cost-effective biodiversity monitoring by automating the traditionally manual process of microscopic analysis. </p>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Core Features</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
                <li>On-site analysis using a compact Jetson Nano for edge AI computing.</li>
                <li>Advanced AI models (YOLOv5, Mask R-CNN) for detection, segmentation, and classification.</li>
                <li>Reduces analysis time from hours to minutes per sample.</li>
                <li>Minimizes human error and provides reliable, repeatable results.</li>
                <li>Real-time alerts for harmful algal blooms and other critical events.</li>
            </ul>
            <CardTitle icon={Info}>How to Use This Interface</CardTitle>
             <ol className="list-decimal list-inside text-slate-300 space-y-3 leading-relaxed">
                <li><b>Home Page:</b> This is your main dashboard. The microscope's video feed is displayed here.</li>
                <li><b>Scan Sample:</b> Click the "Scan Sample" button to trigger the AI analysis on the current frame. The results will populate the panels on the right.</li>
                <li><b>Save Results:</b> Click "Save" to store the current analysis. You will be prompted to enter a unique name or ID for the sample.</li>
                <li><b>History Page:</b> Navigate to the History page to view all your saved samples. Click on any saved sample name to reload its detailed analysis.</li>
            </ol>
        </Card>
    </div>
);

const HistoryPage = ({ history, onSelectHistory }) => {
    if (history.length === 0) return (
        <Card className="text-center animate-fade-in">
            <CardTitle icon={History}>Saved Samples</CardTitle>
            <p>No samples have been saved yet. Go to the Home page, perform a scan, and save the results.</p>
        </Card>
    );
    return (
        <Card className="animate-fade-in">
            <CardTitle icon={History}>Saved Samples</CardTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {history.map((item) => (
                    <button key={item.id} onClick={() => onSelectHistory(item.id)} className="p-4 bg-slate-700/50 hover:bg-cyan-900/50 rounded-lg text-left transition-colors">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-sm text-slate-400">{new Date(item.data.environmental.timestamp).toLocaleDateString()}</p>
                    </button>
                ))}
            </div>
        </Card>
    );
};

const SaveModal = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <Card className="w-full max-w-md">
                <CardTitle icon={Save}>Save Sample Analysis</CardTitle>
                <p className="text-slate-400 mb-4">Enter a unique name or ID for this sample.</p>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg mb-4 text-white" placeholder="e.g., Bay-Sample-001" autoFocus/>
                <div className="flex justify-end gap-4">
                    <Button onClick={onCancel} variant="secondary">Cancel</Button>
                    <Button onClick={() => name.trim() && onSave(name.trim())}>Save</Button>
                </div>
            </Card>
        </div>
    );
};


// --- Main App Component ---
function App() {
  const [appState, setAppState] = useState('loading'); // loading, ready
  const [page, setPage] = useState('home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentScanData, setCurrentScanData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Mock Data generation (same as before)
  const getMockScanData = () => ({
    id: `scan_${Date.now()}`,
    image: `https://placehold.co/600x400/1a202c/4a5568?text=Microscope+Feed`,
    totalOrganisms: Math.floor(Math.random() * 100) + 50,
    uniqueSpecies: Math.floor(Math.random() * 5) + 8,
    highRiskAlerts: Math.random() > 0.5 ? [{ name: 'Dinophysis', species: 'Dinoflagellate', count: Math.floor(Math.random() * 10) + 5, risk: 'High' }] : [],
    environmental: { location: '13.0827° N, 80.2707° E', temperature: `${(Math.random() * 2 + 27).toFixed(1)}°C`, timestamp: new Date().toISOString() },
    speciesDistribution: [ { name: 'Chaetoceros', count: Math.floor(Math.random() * 20) + 30 }, { name: 'Thalassiosira', count: Math.floor(Math.random() * 20) + 25 }, { name: 'Prorocentrum', count: Math.floor(Math.random() * 15) + 15 }, { name: 'Dinophysis', count: Math.floor(Math.random() * 10) + 5 }, { name: 'Other', count: Math.floor(Math.random() * 10) + 10 } ],
  });


  const handleNavigate = (targetPage) => {
    setPage(targetPage);
    setSidebarOpen(false);
  };
  
  const handleScan = () => setCurrentScanData(getMockScanData());
  const handleSaveRequest = () => currentScanData ? setIsSaving(true) : alert("Please perform a scan before saving.");

  const handleConfirmSave = (sampleName) => {
    setHistory([{ id: `history_${Date.now()}`, name: sampleName, data: currentScanData }, ...history]);
    setIsSaving(false);
    alert(`Sample "${sampleName}" saved!`);
  };

  const handleSelectHistory = (id) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setCurrentScanData(item.data);
      setPage('home');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'about': return <AboutPage />;
      case 'history': return <HistoryPage history={history} onSelectHistory={handleSelectHistory} />;
      case 'home':
      default:
        return <HomePage data={currentScanData} onScan={handleScan} onSave={handleSaveRequest} />;
    }
  };

  if (appState === 'loading') {
    return <SplashScreen onAnimationEnd={() => setAppState('ready')} />;
  }

  // NOTE: This version combines the mobile sidebar with a standard desktop navbar for the best of both worlds.
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleNavigate} />
      {isSaving && <SaveModal onSave={handleConfirmSave} onCancel={() => setIsSaving(false)} />}
      
      <header className="sticky top-0 z-30 bg-slate-900/70 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-full hover:bg-slate-700 md:hidden mr-2">
              <Menu className="w-6 h-6"/>
            </button>
            <div className="flex items-center">
              <MicroscopeLogo className="w-8 h-8 text-cyan-400 mr-3" />
              <span className="text-xl font-bold">Microscopy</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <button onClick={() => handleNavigate('home')} className={`px-4 py-2 rounded-md text-sm font-medium ${page === 'home' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>Home</button>
            <button onClick={() => handleNavigate('about')} className={`px-4 py-2 rounded-md text-sm font-medium ${page === 'about' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>About</button>
            <button onClick={() => handleNavigate('history')} className={`px-4 py-2 rounded-md text-sm font-medium ${page === 'history' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>History</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>
    </div>
  );
}


// Final export
export default App;

