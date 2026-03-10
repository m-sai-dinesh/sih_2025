import React, { useState } from 'react';
import { DisasterPlan } from '../types';
import Card from './shared/Card';
import Button from './shared/Button';

// --- Mock Data ---
const disasterPlansData: DisasterPlan[] = [
  {
    id: 'plan-1',
    title: 'Family Evacuation Plan',
    category: 'Family',
    content: `# Earthquake Evacuation Plan
# Version: 1.2
# Last Updated: 2024-07-15

# [MEETING_POINTS]
PRIMARY_LOCATION: "Nehru Park, main gate"
SECONDARY_LOCATION: "Community Hall, Sector 5"

# [CONTACTS]
EMERGENCY_CONTACT: "Aunt Priya - 98XXXXXX01"
OUT_OF_STATE_CONTACT: "Uncle Ramesh - 99XXXXXX02"

# [ACTIONS]
ACTION: "DROP, COVER, HOLD ON during shaking."
ACTION: "After shaking, count to 60."
ACTION: "Check for injuries, grab GO-BAGS."
ACTION: "Turn off gas and main water valve if safe."
ACTION: "Exit building via stairs, NOT elevator."
ACTION: "Proceed to PRIMARY_LOCATION."

# [SUPPLIES]
GO_BAG_LOCATION: "Closet near main door"
KIT_CONTENTS: ["Water (3L/person)", "First-aid kit", "Flashlight", "Whistle", "Medications", "Important documents"]
`,
    annotations: [
      { user: 'Mr. Kumar', text: 'We should update the water supply in the go-bags.' },
      { user: 'Mrs. Desai', text: 'Ensure all students know the primary location.' },
    ],
  },
   {
    id: 'plan-2',
    title: 'School Lockdown Protocol',
    category: 'School',
    content: `# Intruder Lockdown Protocol
# Policy: 404-B

# [TRIGGER]
TRIGGER_CONDITION: "Alert via PA system: 'Code Red'"
TRIGGER_CONDITION: "Continuous short rings of school bell"

# [STAFF_ACTIONS]
ACTION: "Check hallway, clear any students into nearest classroom."
ACTION: "LOCK classroom door."
ACTION: "COVER windows/door glass."
ACTION: "Turn OFF lights."
ACTION: "Move all students to a corner away from sightlines."
ACTION: "Take attendance silently."
ACTION: "AWAIT 'All Clear' from authorities. DO NOT open door."

# [STUDENT_ACTIONS]
ACTION: "Follow teacher instructions immediately."
ACTION: "Remain absolutely silent."
ACTION: "Silence mobile phones."
`,
    annotations: [
        { user: 'Mrs. Desai', text: 'To be reviewed in the next staff meeting on Aug 1st.' },
    ],
  },
];

// --- Syntax Highlighting Renderer ---
const SyntaxHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const highlighted = code.split('\n').map((line, i) => {
    let content = line;
    let className = 'text-dark-200';

    if (line.trim().startsWith('#')) {
      className = 'text-green-400 italic';
    } else if (line.includes(':')) {
      const parts = line.split(':');
      const key = parts[0];
      const value = parts.slice(1).join(':');
      return (
        <div key={i}>
          <span className="text-secondary">{key}:</span>
          <span className="text-amber-300">{value}</span>
        </div>
      );
    }

    return <span key={i} className={className}>{content}</span>;
  }).reduce((acc, elem, i) => {
    return acc === null ? [elem] : [...acc, <br key={`br-${i}`} />, elem]
  }, null as React.ReactNode[] | null);

  return <pre className="font-mono bg-dark-900/50 p-4 rounded-lg text-sm whitespace-pre-wrap">{highlighted}</pre>;
};

// --- Main Component ---
const DisasterPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<DisasterPlan>(disasterPlansData[0]);
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'annotations'>('view');
  const [editedContent, setEditedContent] = useState(selectedPlan.content);

  const handleSelectPlan = (plan: DisasterPlan) => {
    setSelectedPlan(plan);
    setEditedContent(plan.content);
    setActiveTab('view');
  };
  
  const TabButton: React.FC<{tab: 'view' | 'edit' | 'annotations', label: string}> = ({ tab, label }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 font-mono rounded-t-lg transition-colors ${activeTab === tab ? 'bg-dark-800 border-dark-700 border-b-0 text-secondary' : 'bg-dark-900 text-dark-300 hover:bg-dark-800/50'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full animate-fade-in-up">
      {/* Plan List */}
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl font-bold text-light font-mono mb-6">&gt; Disaster Plans</h1>
        <Card>
            <div className="space-y-3">
                {disasterPlansData.map(plan => (
                    <button 
                        key={plan.id}
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${selectedPlan.id === plan.id ? 'bg-primary/20' : 'bg-dark-800 hover:bg-dark-700'}`}
                    >
                        <p className="font-bold font-mono text-light">{plan.title}</p>
                        <p className="text-xs font-mono text-secondary">{plan.category}</p>
                    </button>
                ))}
            </div>
        </Card>
      </div>

      {/* Plan Viewer/Editor */}
      <div className="w-full md:w-2/3">
         <div className="flex border-b border-dark-700">
            <TabButton tab="view" label="View" />
            <TabButton tab="edit" label="Edit" />
            <TabButton tab="annotations" label="Annotations" />
         </div>
         <Card className="rounded-t-none !border-t-0 min-h-[500px]">
            {activeTab === 'view' && <SyntaxHighlighter code={editedContent} />}
            {activeTab === 'edit' && (
                <div>
                    <textarea 
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-[400px] bg-dark-900 text-dark-200 font-mono p-4 rounded-lg border border-dark-700 focus:ring-primary focus:outline-none hover:border-primary transition-colors"
                    />
                    <div className="mt-4 flex justify-end gap-4">
                        <Button variant="secondary" onClick={() => setEditedContent(selectedPlan.content)}>Reset</Button>
                        <Button variant="accent">Save Changes</Button>
                    </div>
                </div>
            )}
            {activeTab === 'annotations' && (
                <div className="space-y-4">
                    {selectedPlan.annotations.map((note, index) => (
                        <div key={index} className="bg-dark-900/50 p-3 rounded-lg border border-dark-700">
                            <p className="text-sm text-dark-200">{note.text}</p>
                            <p className="text-xs text-right text-secondary font-mono mt-2">- {note.user}</p>
                        </div>
                    ))}
                     <div className="mt-6">
                        <textarea className="w-full bg-dark-900 text-dark-200 font-mono p-3 rounded-lg border border-dark-700 focus:ring-primary focus:outline-none hover:border-primary transition-colors" rows={3}></textarea>
                        <div className="text-right mt-2">
                           <Button variant="primary">Submit</Button>
                        </div>
                    </div>
                </div>
            )}
         </Card>
      </div>
    </div>
  );
};

export default DisasterPlans;