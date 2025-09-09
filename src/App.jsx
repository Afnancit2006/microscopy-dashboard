import React, { useState, useEffect } from 'react';
import { Home, Info, History, Scan, Save, FileDown, FileText, AlertTriangle, TestTube2, BarChart3, MapPin, Thermometer, Clock } from 'lucide-react';

// --- New Logo Component ---
// An SVG logo designed for this project. It's scalable and styles with CSS.
const MicroscopeLogo = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="12" y1="22" x2="12" y2="18" />
    <line x1="22" y1="12" x2="18" y2="12" />
  </svg>
);


// --- New Animated Splash Screen Component ---
const SplashScreen = ({ isVisible }) => (
  <div 
    className={`fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
  >
    <MicroscopeLogo className="w-24 h-24 text-cyan-400 animate-pulse" />
    <h1 className="text-4xl font-bold text-white mt-4 tracking-wider">Microscopy</h1>
    <p className="text-gray-400 mt-2">AI-Powered Marine Analysis</p>
  </div>
);

// --- Mock Data ---
const getMockScanData = () => ({
  id: `scan_${Date.now()}`,
  image: `https://placehold.co/600x400/1f2937/a0aec0?text=Microscope+Feed+${Math.floor(Math.random() * 100)}`,
  totalOrganisms: Math.floor(Math.random() * 100) + 50,
  uniqueSpecies: Math.floor(Math.random() * 5) + 8,
  highRiskAlerts: [
    { name: 'Dinophysis', species: 'Dinoflagellate', count: Math.floor(Math.random() * 10) + 5, risk: 'High' }
  ],
  environmental: {
    location: '13.0827° N, 80.2707° E',
    temperature: `${(Math.random() * 2 + 27).toFixed(1)}°C`,
    timestamp: new Date().toISOString(),
  },
  speciesDistribution: [
    { name: 'Chaetoceros', count: Math.floor(Math.random() * 20) + 30 },
    { name: 'Thalassiosira', count: Math.floor(Math.random() * 20) + 25 },
    { name: 'Prorocentrum', count: Math.floor(Math.random() * 15) + 15 },
    { name: 'Dinophysis', count: Math.floor(Math.random() * 10) + 5 },
    { name: 'Other', count: Math.floor(Math.random() * 10) + 10 },
  ],
});


// --- Reusable UI Components ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, icon: Icon }) => (
  <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
    {Icon && <Icon className="w-6 h-6 mr-3 text-cyan-400" />}
    {children}
  </h2>
);

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
        <div className="p-3 bg-cyan-900/50 rounded-lg mr-4">
           <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Button = ({ children, onClick, icon: Icon, variant = 'primary' }) => {
    const baseClasses = "flex items-center justify-center px-4 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105";
    const variants = {
        primary: "bg-cyan-500 hover:bg-cyan-600 text-white",
        secondary: "bg-gray-600 hover:bg-gray-500 text-white",
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
            {Icon && <Icon className="w-5 h-5 mr-2" />}
            {children}
        </button>
    );
};


// --- Page Components ---

const HomePage = ({ data, onScan, onSave }) => {
  if (!data) return (
      <div className="text-center p-10 bg-gray-800 rounded-2xl">
          <Scan size={48} className="mx-auto text-gray-500 mb-4"/>
          <h2 className="text-2xl font-bold text-white mb-2">Ready for Analysis</h2>
          <p className="text-gray-400 mb-6">Click the "Scan Sample" button to begin.</p>
          <Button onClick={onScan} icon={Scan}>Scan Sample</Button>
      </div>
  );

  const totalForPercentage = data.speciesDistribution.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <Card>
          <CardTitle icon={Scan}>Live Feed & Actions</CardTitle>
          <img src={data.image} alt="Microscope Feed" className="w-full rounded-lg border-2 border-gray-600 mb-4" />
          <div className="flex flex-wrap gap-4">
            <Button onClick={onScan} icon={Scan}>Scan Again</Button>
            <Button onClick={onSave} icon={Save} variant="secondary">Save Results</Button>
            <Button onClick={() => alert("PDF export functionality would be implemented here.")} icon={FileDown} variant="secondary">Export as PDF</Button>
            <Button onClick={() => alert("Excel export functionality would be implemented here.")} icon={FileText} variant="secondary">Export as Excel</Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
            <div className="space-y-4">
                <StatCard title="Total Organisms Counted" value={data.totalOrganisms} icon={TestTube2} />
                <StatCard title="Unique Species Detected" value={data.uniqueSpecies} icon={BarChart3} />
            </div>
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
            <div className="space-y-3 text-gray-300">
                <div className="flex items-center"><MapPin size={18} className="mr-3 text-gray-500"/><span>{data.environmental.location}</span></div>
                <div className="flex items-center"><Thermometer size={18} className="mr-3 text-gray-500"/><span>{data.environmental.temperature}</span></div>
                <div className="flex items-center"><Clock size={18} className="mr-3 text-gray-500"/><span>{new Date(data.environmental.timestamp).toLocaleString()}</span></div>
            </div>
        </Card>

        <Card>
            <CardTitle icon={BarChart3}>Species Distribution</CardTitle>
            <div className="space-y-3">
            {data.speciesDistribution.map(species => {
                const percentage = Math.round((species.count / totalForPercentage) * 100);
                return (
                <div key={species.name}>
                    <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-300">{species.name}</span>
                    <span className="text-sm font-bold text-white">{species.count} ({percentage}%)</span>
                    </div>
                    <div className="h-4 w-full bg-gray-700 rounded-full">
                    <div className="bg-cyan-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
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
            <p className="text-gray-300 leading-relaxed mb-6">
                The Embedded Intelligent Microscopy System is a portable, AI-powered solution designed for real-time analysis of marine microorganisms. It addresses the critical need for rapid, accurate, and cost-effective biodiversity monitoring by automating the traditionally manual process of microscopic analysis.
            </p>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Core Features</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>On-site analysis using a compact Jetson Nano for edge AI computing.</li>
                <li>Advanced AI models (YOLOv5, Mask R-CNN) for detection, segmentation, and classification.</li>
                <li>Reduces analysis time from hours to minutes per sample.</li>
                <li>Minimizes human error and provides reliable, repeatable results.</li>
                <li>Real-time alerts for harmful algal blooms and other critical events.</li>
            </ul>

            <CardTitle icon={Info}>How to Use This Interface</CardTitle>
             <ol className="list-decimal list-inside text-gray-300 space-y-3 leading-relaxed">
                <li><b>Home Page:</b> This is your main dashboard. The microscope's video feed is displayed here.</li>
                <li><b>Scan Sample:</b> Click the "Scan Sample" button to trigger the AI analysis on the current frame. The results will populate the panels on the right.</li>
                <li><b>Review Data:</b> Examine the total counts, species distribution, environmental data, and any high-risk alerts.</li>
                <li><b>Save Results:</b> Click "Save" to store the current analysis. You will be prompted to enter a unique name or ID for the sample (e.g., "Dock-A-Slide-05").</li>
                <li><b>History Page:</b> Navigate to the History page to view all your saved samples. Click on any saved sample name to reload its detailed analysis.</li>
                <li><b>Export:</b> Use the "Export as PDF" or "Export as Excel" buttons on the Home page to generate reports of the current scan.</li>
            </ol>
        </Card>
    </div>
);


const HistoryPage = ({ history, onSelectHistory }) => {
    if (history.length === 0) {
        return (
            <Card className="text-center animate-fade-in">
                <CardTitle icon={History}>Saved Samples</CardTitle>
                <p>No samples have been saved yet. Go to the Home page to perform a scan and save the results.</p>
            </Card>
        );
    }

    return (
        <Card className="animate-fade-in">
            <CardTitle icon={History}>Saved Samples</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {history.map((item) => (
                    <button key={item.id} onClick={() => onSelectHistory(item.id)}
                        className="p-4 bg-gray-700 hover:bg-cyan-900/50 rounded-lg text-left transition-colors">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-sm text-gray-400">{new Date(item.data.environmental.timestamp).toLocaleDateString()}</p>
                    </button>
                ))}
            </div>
        </Card>
    );
};

const SaveModal = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <Card className="w-full max-w-md">
                <CardTitle icon={Save}>Save Sample</CardTitle>
                <p className="text-gray-400 mb-4">Enter a unique name or ID for this sample slide.</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 text-white"
                    placeholder="e.g., Bay-Sample-001"
                    autoFocus
                />
                <div className="flex justify-end gap-4">
                    <Button onClick={onCancel} variant="secondary">Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </Card>
        </div>
    );
};


// --- Main App Component ---
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState('home');
  const [currentScanData, setCurrentScanData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  const handleScan = () => {
    setCurrentScanData(getMockScanData());
  };

  const handleSaveRequest = () => {
      if(currentScanData) {
          setIsSaving(true);
      } else {
          alert("Please perform a scan before saving.")
      }
  }

  const handleConfirmSave = (sampleName) => {
    const newHistoryItem = {
      id: `history_${Date.now()}`,
      name: sampleName,
      data: currentScanData,
    };
    setHistory([newHistoryItem, ...history]);
    setIsSaving(false);
    alert(`Sample "${sampleName}" saved successfully!`);
  };

  const handleSelectHistory = (id) => {
      const selectedItem = history.find(item => item.id === id);
      if (selectedItem) {
          setCurrentScanData(selectedItem.data);
          setPage('home');
      }
  }

  const NavLink = ({ pageName, icon: Icon, children }) => (
    <button
      onClick={() => setPage(pageName)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${page === pageName ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </button>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <SplashScreen isVisible={showSplash} />
      
      {!showSplash && (
        <>
          {isSaving && <SaveModal onSave={handleConfirmSave} onCancel={() => setIsSaving(false)} />}
          
          <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <div className="flex items-center">
                <MicroscopeLogo className="w-8 h-8 text-cyan-400 mr-3"/>
                <span className="text-xl font-bold text-white">Microscopy</span>
              </div>
              <div className="ml-10 flex space-x-4">
                <NavLink pageName="home" icon={Home}>Home</NavLink>
                <NavLink pageName="about" icon={Info}>About</NavLink>
                <NavLink pageName="history" icon={History}>History</NavLink>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {page === 'home' && <HomePage data={currentScanData} onScan={handleScan} onSave={handleSaveRequest} />}
            {page === 'about' && <AboutPage />}
            {page === 'history' && <HistoryPage history={history} onSelectHistory={handleSelectHistory}/>}
          </main>
        </>
      )}
    </div>
  );
}

export default App;