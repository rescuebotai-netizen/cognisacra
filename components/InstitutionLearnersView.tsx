import React, { useState, useMemo, useRef } from 'react';
import { FullInstitutionData, InstitutionAdmin, RolePermissions, ManagedLearner } from '../types';
import { 
  Users, Shield, Settings, Server, TrendingUp, AlertTriangle, CheckCircle, XCircle, 
  Search, Upload, Plus, Trash2, ArrowRight, Activity, Database, Globe, Network, 
  Brain, FileText, Download, Building, DollarSign, Calendar, RefreshCw, 
  ChevronRight, Eye, Sparkles, Filter, Lock, Unlock, HelpCircle, FileSpreadsheet, 
  BookOpen, Layers, Milestone, ShieldAlert, BadgeCheck, ClipboardCheck, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InstitutionAccreditationView } from './InstitutionAccreditationView';

interface InstitutionLearnersViewProps {
    institutionData: FullInstitutionData;
    setInstitutionData: React.Dispatch<React.SetStateAction<FullInstitutionData>>;
}

interface GovernanceRole {
  id: string;
  name: string;
  accessLevel: 'Unlimited' | 'Executive Control' | 'Operations Management' | 'Academic Operations' | 'Faculty Management' | 'Department Management' | 'Program Management' | 'Curriculum Governance' | 'Course Management' | 'Research Environment' | 'Library Management' | 'Student Services' | 'Financial Operations' | 'Technical Operations' | 'Compliance Monitoring' | 'Learning Environment' | 'Graduate Network' | 'Public Access';
  responsibilities: string[];
  permissions: { label: string; allowed: boolean }[];
  category: 'Administration' | 'Faculty & Academic' | 'Technical & Support' | 'Learners & Public';
}

interface CampusDetails {
  id: string;
  name: string;
  location: string;
  deanName: string;
  studentCount: number;
  assetsCount: number;
  revenue: string;
  status: 'Online' | 'Maintenance';
}

interface PendingMaterial {
  id: string;
  title: string;
  lecturerName: string;
  department: string;
  uploadedDate: string;
  currentStep: 'upload' | 'review' | 'hod' | 'library' | 'published';
  status: 'Pending' | 'Active' | 'Approved' | 'Flagged';
  notes: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionType: 'Upload' | 'Download' | 'Edit' | 'Deletion' | 'Curriculum' | 'User Activity' | 'Financial';
  campus: string;
  details: string;
  status: 'Success' | 'Warn' | 'Blocked';
}

interface SecurityAlert {
  id: string;
  timestamp: string;
  category: 'Access Violation' | 'Suspicious Download' | 'Data Leakage Risk';
  message: string;
  severity: 'Critical' | 'Medium' | 'Low';
  actor: string;
  resolved: boolean;
}

interface NodeProps {
  label: string;
  id: string;
  roles: GovernanceRole[];
  selectedRoleName: string;
  setSelectedRoleName: (name: string) => void;
  isLeaf?: boolean;
  children?: React.ReactNode;
}

const GovernanceTreeNode: React.FC<NodeProps> = ({ label, id, roles, selectedRoleName, setSelectedRoleName, isLeaf = false, children }) => {
  const role = roles.find(r => r.id === id || r.name.toLowerCase().includes(label.toLowerCase()) || label.toLowerCase().includes(r.name.toLowerCase()));
  const actualName = role ? role.name : label;
  const isSelected = selectedRoleName === actualName;
  
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setSelectedRoleName(actualName)}
        className={`w-full text-left p-2 rounded-xl transition-all duration-150 flex items-center justify-between border ${
          isSelected
            ? 'bg-gradient-to-r from-rose-500 to-crimson text-white border-transparent shadow-[0_0_8px_rgba(225,29,72,0.3)]'
            : 'bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300 pointer-events-auto'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[10px] opacity-75">{isLeaf ? '•' : '📂'}</span>
          <span className="font-bold truncate text-[11px]">{label}</span>
        </div>
        {!isLeaf && <span className="text-[9px] opacity-60">↳</span>}
      </button>
      {children && (
        <div className="pl-3.5 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-1 ml-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default function InstitutionLearnersView({ institutionData, setInstitutionData }: InstitutionLearnersViewProps) {
  // Tabs: governance / workEngine / auditing / multisite / aiplatform / accreditation
  const [activeTab, setActiveTab] = useState<'governance' | 'workEngine' | 'auditing' | 'multisite' | 'aiplatform' | 'accreditation'>('governance');
  const [governanceViewMode, setGovernanceViewMode] = useState<'list' | 'tree'>('tree');
  
  // Multicampus Setup state
  const [campuses, setCampuses] = useState<CampusDetails[]>([
    { id: 'camp-main', name: 'Main Campus', location: 'Nairobi, Kenya', deanName: 'Prof. Maryam Al-Mansoor', studentCount: 24500, assetsCount: 1420, revenue: 'KES 4,850,000', status: 'Online' },
    { id: 'camp-ct', name: 'Cape Town Campus', location: 'Cape Town, South Africa', deanName: 'Prof. David Nkosi', studentCount: 11200, assetsCount: 850, revenue: 'ZAR 1,210,000', status: 'Online' },
    { id: 'camp-jhb', name: 'Johannesburg Campus', location: 'Johannesburg, South Africa', deanName: 'Dr. Sarah Ndlovu', studentCount: 8400, assetsCount: 520, revenue: 'ZAR 890,000', status: 'Online' },
    { id: 'camp-dbn', name: 'Durban Campus', location: 'Durban, South Africa', deanName: 'Prof. Helen Naidoo', studentCount: 5100, assetsCount: 310, revenue: 'ZAR 420,000', status: 'Online' }
  ]);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('camp-main');
  const activeCampus = useMemo(() => campuses.find(c => c.id === selectedCampusId) || campuses[0], [campuses, selectedCampusId]);

  // Establish campus modal / form states
  const [isAddingCampus, setIsAddingCampus] = useState(false);
  const [newCampus, setNewCampus] = useState({
    name: '',
    location: '',
    deanName: '',
    studentCount: 1200,
    assetsCount: 300,
    revenue: 'KES 1,200,000'
  });

  // Role details search & select
  const [selectedRoleName, setSelectedRoleName] = useState<string>('Super Admin (CogniSacra)');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  // Manage Role addition & members addition state
  const [newMember, setNewMember] = useState({
     name: '',
     email: '',
     role: 'Lecturer / Instructor',
     campus: 'Main Campus',
     department: 'STEM & Renewable Energy'
  });
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Enterprise Workflow Engine states
  const [pendingMaterials, setPendingMaterials] = useState<PendingMaterial[]>([
    { id: 'mat-1', title: 'Decentralized Bio-chemical Kinetic Systems Manual', lecturerName: 'Dr. Sarah Mwangi', department: 'Sustainable Agronomy', uploadedDate: '2026-06-19 14:10', currentStep: 'upload', status: 'Pending', notes: ['Material successfully submitted for ingestion. Initial virus scans passed.'] },
    { id: 'mat-2', title: 'Localized Solar Microgrid Load-bearing Parameters v2.4', lecturerName: 'Eng. Fatoumata Diallo', department: 'Engineering', uploadedDate: '2026-06-19 09:30', currentStep: 'review', status: 'Pending', notes: ['Vetted by Program Coordinator. Formatting and curriculum index parsed.'] },
    { id: 'mat-3', title: 'Solid Metal Scrap Recycle Transact Log Accras', lecturerName: 'Prof. Maryam Al-Mansoor', department: 'Environmental Studies', uploadedDate: '2026-06-18 16:45', currentStep: 'hod', status: 'Pending', notes: ['Approved by Department Head. Validated local dataset dimensions.'] },
    { id: 'mat-4', title: 'Thermodynamics Final Year Exam Papers Archive (2025)', lecturerName: 'Dr. James Kinyua', department: 'Mechanical Sciences', uploadedDate: '2026-06-18 11:20', currentStep: 'library', status: 'Pending', notes: ['Quality check approved. Metadata catalog indexing generated by Librarian.'] }
  ]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-1');
  const activeMaterial = useMemo(() => pendingMaterials.find(m => m.id === selectedMaterialId) || pendingMaterials[0], [pendingMaterials, selectedMaterialId]);

  // System Logs Audit Trail states
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'log-1', timestamp: '2026-06-20 09:24:11', actorName: 'Director James Adebayo', actorRole: 'Institution Administrator', actionType: 'Curriculum', campus: 'Main Campus', details: 'Upgraded bio-processing learning path standards to v1.4', status: 'Success' },
    { id: 'log-2', timestamp: '2026-06-20 08:14:02', actorName: 'Librarian Sarah Mwangi', actorRole: 'Librarian', actionType: 'Upload', campus: 'Main Campus', details: 'Added 4 decentralized microgrid PDF references to core assets list', status: 'Success' },
    { id: 'log-3', timestamp: '2026-06-20 08:02:45', actorName: 'Anonymous Client', actorRole: 'External User', actionType: 'Download', campus: 'Cape Town Campus', details: 'Attempted batch download of internal test answers (BIO-101)', status: 'Blocked' },
    { id: 'log-4', timestamp: '2026-06-19 17:34:50', actorName: 'Director James Adebayo', actorRole: 'Institution Administrator', actionType: 'User Activity', campus: 'Johannesburg Campus', details: 'Linked Azure SSO with South Africa Active Directory server parameters', status: 'Success' },
    { id: 'log-5', timestamp: '2026-06-19 15:40:22', actorName: 'Prof. John Adebayo', actorRole: 'Lecturer / Instructor', actionType: 'Edit', campus: 'Main Campus', details: 'Modified class outline grading scale rules on Renewable Soil models', status: 'Success' },
    { id: 'log-6', timestamp: '2026-06-19 14:15:10', actorName: 'Dr. David Nkosi', actorRole: 'Dean', actionType: 'Financial', campus: 'Cape Town Campus', details: 'Exported MTN Mobile Money transaction lists for regional financial audit', status: 'Success' },
    { id: 'log-7', timestamp: '2026-06-19 09:12:00', actorName: 'Student Jackline Korir', actorRole: 'Student', actionType: 'Download', campus: 'Main Campus', details: 'Downloaded Circular Economy systems notes successfully', status: 'Success' },
  ]);
  const [logFilterType, setLogFilterType] = useState<string>('All');
  const [searchLogTerm, setSearchLogTerm] = useState<string>('');

  // AI Security Layer States
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    { id: 'alert-1', timestamp: '2026-06-20 09:15:00', category: 'Access Violation', message: 'HOD of STEM attempted accessing global checkout financial ledgers.', severity: 'Critical', actor: 'HOD STEM', resolved: false },
    { id: 'alert-2', timestamp: '2026-06-20 08:31:12', category: 'Suspicious Download', message: 'User downloaded 14 research datasets in 6 seconds.', severity: 'Medium', actor: 'Librarian-992', resolved: false },
    { id: 'alert-3', timestamp: '2026-06-19 16:45:00', category: 'Data Leakage Risk', message: 'Unpublished Bio-Chemistry exam draft BIO-101 detected in public folder share.', severity: 'Critical', actor: 'Lecturer Kinyua', resolved: false }
  ]);
  const [complianceScore, setComplianceScore] = useState(94);
  const [generationLogs, setGenerationLogs] = useState<string>('');
  const [isAuditingLive, setIsAuditingLive] = useState(false);

  // THE 18 ROLES DEFINE
  const roles: GovernanceRole[] = [
    {
      id: 'super-admin',
      name: 'Super Admin (CogniSacra)',
      accessLevel: 'Unlimited',
      category: 'Administration',
      responsibilities: [
        'Manage all education institutions dynamically',
        'Vibe and verify newly registered institutions',
        'Approve sovereign educational licensing plans',
        'Deploy and provision AI training clusters & resources',
        'Administer global payments/mobile money Gateways',
        'Manage ultimate core platform state and configurations'
      ],
      permissions: [
        { label: 'Create Institutions', allowed: true },
        { label: 'Suspend Institutions', allowed: true },
        { label: 'Access Global Analytics', allowed: true },
        { label: 'View Comprehensive Audit Logs', allowed: true },
        { label: 'Autonomously Upgrade Code versions', allowed: true }
      ]
    },
    {
      id: 'owner',
      name: 'Institution Owner / Chancellor',
      accessLevel: 'Executive Control',
      category: 'Administration',
      responsibilities: [
        'Overall strategic alignment and institutional oversight',
        'Sovereign chancellery decision signatures',
        'Approve major syllabus and academic alignments',
         'Monitor regional performance index across multi-campuses'
      ],
      permissions: [
        { label: 'Full Campus Access', allowed: true },
        { label: 'Approve Curriculum Changes', allowed: true },
        { label: 'View Comprehensive Financial metrics', allowed: true },
        { label: 'Manage executive leadership roles', allowed: true },
        { label: 'Access Peer-Institutions databases', allowed: false }
      ]
    },
    {
      id: 'inst-admin',
      name: 'Institution Administrator',
      accessLevel: 'Operations Management',
      category: 'Administration',
      responsibilities: [
        'Day-to-day operations and logistics coordinator',
        'User onboarding, suspension, and role allocations',
        'Review cross-campus performance reports',
        'Maintain local database integrations and settings'
      ],
      permissions: [
        { label: 'Create Faculties & Departments', allowed: true },
        { label: 'Assign Academic Staff', allowed: true },
        { label: 'Alter SIS credentials', allowed: true },
        { label: 'Publish Central assets', allowed: true },
        { label: 'Direct platform system files control', allowed: false }
      ]
    },
    {
      id: 'academic',
      name: 'Academic Affairs',
      accessLevel: 'Academic Operations',
      category: 'Faculty & Academic',
      responsibilities: [
        'Safeguard high-quality academic standards',
        'Set parameters for course accreditations',
        'Manage joint-university program calendars'
      ],
      permissions: [
        { label: 'Create Programs & Badges', allowed: true },
        { label: 'Approve Course Outline structures', allowed: true },
        { label: 'Draft accreditation compliance sheets', allowed: true },
        { label: 'Alter financial variables', allowed: false }
      ]
    },
    {
      id: 'dean',
      name: 'Dean (Faculty Level)',
      accessLevel: 'Faculty Management',
      category: 'Faculty & Academic',
      responsibilities: [
        'Coordinate faculty academic clusters (e.g. STEM, Agronomy)',
        'Sign-off on active research grants',
        'Lead recruitment and tenure assessments within Faculty'
      ],
      permissions: [
        { label: 'View Academic Faculty Databases', allowed: true },
        { label: 'Approve Faculty journals & books', allowed: true },
        { label: 'Assign Lecturers to courses', allowed: true },
        { label: 'Control other Department domains', allowed: false }
      ]
    },
    {
      id: 'hod',
      name: 'Head of Department (HOD)',
      accessLevel: 'Department Management',
      category: 'Faculty & Academic',
      responsibilities: [
        'Administer departmental courses & syllabi',
        'Hold final authority on local syllabus adjustments',
        'Vett examination papers prior to certification boards'
      ],
      permissions: [
        { label: 'Approve Lecturer research uploads', allowed: true },
        { label: 'Assign Lecturers specific workloads', allowed: true },
        { label: 'Configure department evaluation parameters', allowed: true },
        { label: 'Delete Student credentials', allowed: false }
      ]
    },
    {
      id: 'coordinator',
      name: 'Program Coordinator',
      accessLevel: 'Program Management',
      category: 'Faculty & Academic',
      responsibilities: [
        'Coordinate student progression milestones',
        'Vette learning materials for language standards',
        'Handle micro-credential allocations'
      ],
      permissions: [
        { label: 'Control dynamic lesson outline structures', allowed: true },
        { label: 'Review and flag lecture notes drafts', allowed: true },
        { label: 'Access student grade progressions metrics', allowed: true },
        { label: 'Approve final institutional library assets', allowed: false }
      ]
    },
    {
      id: 'curriculum',
      name: 'Curriculum Manager',
      accessLevel: 'Curriculum Governance',
      category: 'Faculty & Academic',
      responsibilities: [
        'Maintain version control over university syllabus packages',
        'Map learning outcomes with international certifications',
        'Manage curriculum drift flags dynamically'
      ],
      permissions: [
        { label: 'Upload master curriculum specifications', allowed: true },
        { label: 'Create curriculum versions (e.g. v2.4, v2.5)', allowed: true },
        { label: 'Map lessons with accreditation matrices', allowed: true },
        { label: 'Publish resources into active markets', allowed: false }
      ]
    },
    {
      id: 'lecturer',
      name: 'Lecturer / Instructor',
      accessLevel: 'Course Management',
      category: 'Faculty & Academic',
      responsibilities: [
        'Create and deliver live and virtual course contents',
        'Grade student projects, quizzes, and exams',
        'Leverage AI for class outline generation structures'
      ],
      permissions: [
        { label: 'Upload core course lectures & slides', allowed: true },
        { label: 'Create course assessments & tests', allowed: true },
        { label: 'Grade assignments on-chain', allowed: true },
        { label: 'Approve institution-wide materials library', allowed: false }
      ]
    },
    {
      id: 'researcher',
      name: 'Researchers',
      accessLevel: 'Research Environment',
      category: 'Faculty & Academic',
      responsibilities: [
        'Execute intensive lab and field research protocols',
        'Publish peer-reviewed academic materials',
        'Collate big data training matrices and datasets'
      ],
      permissions: [
        { label: 'Upload papers and publications', allowed: true },
        { label: 'Provision collaborative research nodes', allowed: true },
        { label: 'Track citations and global DOI links', allowed: true },
        { label: 'Approve financial transactions audit logs', allowed: false }
      ]
    },
    {
      id: 'librarian',
      name: 'Librarians',
      accessLevel: 'Library Management',
      category: 'Technical & Support',
      responsibilities: [
        'Vette metadata index structures of files',
        'Ensure proper digital archiving protocols',
        'Manage sovereign physical & cloud library storage'
      ],
      permissions: [
        { label: 'Upload & catalogue resource indexes', allowed: true },
        { label: 'Perform digital file preservation routines', allowed: true },
        { label: 'Flag missing copyright compliance tags', allowed: true },
        { label: 'Formulate accreditation curriculum rules', allowed: false }
      ]
    },
    {
      id: 'student-affairs',
      name: 'Student Affairs',
      accessLevel: 'Student Services',
      category: 'Technical & Support',
      responsibilities: [
        'Onboard and verify registered active class rosters',
        'Process student identity credentials and SIS rosters',
        'Issue sovereign academic status certificates'
      ],
      permissions: [
        { label: 'Verify Student Identity tags', allowed: true },
        { label: 'Lock/Unlock access based on payments', allowed: true },
        { label: 'Audit cohort logs', allowed: true },
        { label: 'Modify exam questions and syllabus', allowed: false }
      ]
    },
    {
      id: 'finance',
      name: 'Finance Department',
      accessLevel: 'Financial Operations',
      category: 'Technical & Support',
      responsibilities: [
        'Monitor regional mobile money (M-Pesa, MTN) flows',
        'Apportion sales shares between lecturers & department boards',
        'Assess scholarship budgets'
      ],
      permissions: [
        { label: 'Access checkout analytics lists', allowed: true },
        { label: 'Resolve processing transaction disputes', allowed: true },
        { label: 'Re-distribute internal funds allocations', allowed: true },
        { label: 'Alter live course academic syllabus', allowed: false }
      ]
    },
    {
      id: 'ict',
      name: 'ICT Department',
      accessLevel: 'Technical Operations',
      category: 'Technical & Support',
      responsibilities: [
        'Ensure uptime for regional and sovereign cloud links',
        'Administer single-sign-on (SSO) gateways and integrations',
        'Oversee API endpoints health'
      ],
      permissions: [
        { label: 'Configure SSO & Azure linkages', allowed: true },
        { label: 'Monitor full database access logs', allowed: true },
        { label: 'Rotate system-wide security keys', allowed: true },
        { label: 'Alter academic lesson contents', allowed: false }
      ]
    },
    {
      id: 'quality-assurance',
      name: 'Quality Assurance',
      accessLevel: 'Compliance Monitoring',
      category: 'Technical & Support',
      responsibilities: [
        'Conduct routine syllabus inspections',
        'Analyze students engagement drop-off indexes',
        'Formulate accreditation compliance charts'
      ],
      permissions: [
        { label: 'Audit core lesson contents & slides', allowed: true },
        { label: 'Audit curriculum version compliance lists', allowed: true },
        { label: 'Issue system-wide quality flags', allowed: true },
        { label: 'Abolish campus satellite licenses', allowed: false }
      ]
    },
    {
      id: 'student',
      name: 'Students',
      accessLevel: 'Learning Environment',
      category: 'Learners & Public',
      responsibilities: [
        'Learn and progress through verified pathways',
        'Submit class assignments and take quizzes',
        'Purchase and download approved library slides'
      ],
      permissions: [
        { label: 'Access enrolled modules', allowed: true },
        { label: 'Download authorized course references', allowed: true },
        { label: 'Apply verified student SIS discount tags', allowed: true },
        { label: 'Modify course structures or curriculum', allowed: false }
      ]
    },
    {
      id: 'alumni',
      name: 'Alumni',
      accessLevel: 'Graduate Network',
      category: 'Learners & Public',
      responsibilities: [
        'Sustain institutional mentor relationships',
        'Purchase premium professional assets',
        'Access graduate job networks'
      ],
      permissions: [
        { label: 'Access dedicated alumni archives', allowed: true },
        { label: 'Rent professional laboratory materials', allowed: true },
        { label: 'View digital transcript hashes on-chain', allowed: true },
        { label: 'Upload raw academic syllabus files', allowed: false }
      ]
    },
    {
      id: 'external',
      name: 'External Users / Public',
      accessLevel: 'Public Access',
      category: 'Learners & Public',
      responsibilities: [
        'Audit open-access research sheets',
        'Purchase public sovereign learning modules',
        'Enroll in cross-border professional badges'
      ],
      permissions: [
        { label: 'Browse public course catalogues', allowed: true },
        { label: 'Purchase open library PDFs', allowed: true },
        { label: 'Edit or remove catalog content', allowed: false }
      ]
    }
  ];

  // Memo filters
  const filteredRoles = useMemo(() => {
    return roles.filter(r => 
      r.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) || 
      r.accessLevel.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(roleSearchTerm.toLowerCase())
    );
  }, [roleSearchTerm]);

  const activeRole = useMemo(() => {
    return roles.find(r => r.name === selectedRoleName) || roles[0];
  }, [selectedRoleName]);

  // Combine default admins with newly simulation-added team members
  const [governanceMembers, setGovernanceMembers] = useState<any[]>([
    { id: 'mem-1', name: 'Chancellor Maryam Al-Mansoor', email: 'chancellor@cognisacra.edu', role: 'Institution Owner / Chancellor', campus: 'Main Campus', department: 'Executive Management', lastLogin: '2026-06-20 06:12' },
    { id: 'mem-2', name: 'Director James Adebayo', email: 'j.adebayo@cognisacra.edu', role: 'Institution Administrator', campus: 'Main Campus', department: 'Operations', lastLogin: '2026-06-20 08:34' },
    { id: 'mem-3', name: 'Dr. Sarah Mwangi', email: 's.mwangi@cognisacra.edu', role: 'Lecturer / Instructor', campus: 'Main Campus', department: 'Sustainable Agronomy', lastLogin: '2026-06-20 09:12' },
    { id: 'mem-4', name: 'Eng. Fatoumata Diallo', email: 'f.diallo@cognisacra.edu', role: 'Lecturer / Instructor', campus: 'Cape Town Campus', department: 'Engineering', lastLogin: '2026-06-19 14:10' },
    { id: 'mem-5', name: 'Auditor Charles Kamau', email: 'c.kamau@cognisacra.edu', role: 'Quality Assurance Officer', campus: 'Main Campus', department: 'Compliance and Registry', lastLogin: '2026-06-20 05:44' },
    { id: 'mem-6', name: 'Librarian Joseph Kiprop', email: 'j.kiprop@cognisacra.edu', role: 'Librarians', campus: 'Durban Campus', department: 'Media Library hub', lastLogin: '2026-06-18 10:30' },
    { id: 'mem-7', name: 'Student Jackline Korir', email: 'j.korir@student.ug', role: 'Students', campus: 'Johannesburg Campus', department: 'Computer Science', lastLogin: '2026-06-20 09:21' }
  ]);

  const filteredMembers = useMemo(() => {
    return governanceMembers.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) || m.email.toLowerCase().includes(memberSearchTerm.toLowerCase());
      const matchCampus = activeCampus ? (m.campus === activeCampus.name) : true;
      return matchSearch && matchCampus;
    });
  }, [governanceMembers, memberSearchTerm, activeCampus]);

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const added = {
      id: `mem-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      campus: newMember.campus,
      department: newMember.department,
      lastLogin: 'Pending verification'
    };

    setGovernanceMembers([added, ...governanceMembers]);
    
    // Add to audit trail log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Director James Adebayo',
      actorRole: 'Institution Administrator',
      actionType: 'User Activity',
      campus: newMember.campus,
      details: `Dispatched system verification invite to: ${added.name} (${added.role}) for ${added.department}`,
      status: 'Success'
    };
    setAuditLogs([newLog, ...auditLogs]);

    // Clear form and show visual confirmation
    setNewMember({
      name: '',
      email: '',
      role: 'Lecturer / Instructor',
      campus: activeCampus.name,
      department: 'STEM & Renewable Energy'
    });
    setSuccessToast(`Successfully dispatched credential invitation link to ${added.email}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    setGovernanceMembers(prev => prev.filter(m => m.id !== memberId));
    
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Director James Adebayo',
      actorRole: 'Institution Administrator',
      actionType: 'Deletion',
      campus: activeCampus.name,
      details: `Revoked full platform SSO credentials for: ${memberName}`,
      status: 'Success'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // ADVANCE WORKFLOW SIMULATOR ENGINE
  const handleWorkflowAdvance = (materialId: string, action: 'approve' | 'flag') => {
    setPendingMaterials(prev => prev.map(m => {
      if (m.id === materialId) {
        let nextStep = m.currentStep;
        let finalStatus = m.status;
        let notesList = [...m.notes];

        const timestampStr = new Date().toLocaleTimeString();

        if (action === 'flag') {
          return {
            ...m,
            status: 'Flagged',
            notes: [...notesList, `[${timestampStr}] Flagged by standard audit module for credential re-verification.`]
          };
        }

        if (m.currentStep === 'upload') {
          nextStep = 'review';
          notesList.push(`[${timestampStr}] Vetted by Program Coordinator. Standard structures alignment greenlit.`);
        } else if (m.currentStep === 'review') {
          nextStep = 'hod';
          notesList.push(`[${timestampStr}] HOD sign-off secured. Verified local dataset dimensions and equations.`);
        } else if (m.currentStep === 'hod') {
          nextStep = 'library';
          notesList.push(`[${timestampStr}] Material metadata cross-referenced by Librarian Joseph Kiprop.`);
        } else if (m.currentStep === 'library') {
          nextStep = 'published';
          finalStatus = 'Approved';
          notesList.push(`[${timestampStr}] Published! sovereign encryption keys initialized. Available in Student Library.`);
        }

        // Generate dynamic audit log for this state transition
        const log: AuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actorName: m.lecturerName,
          actorRole: 'Workflow Engine',
          actionType: 'Upload',
          campus: activeCampus.name,
          details: `Advanced publishing stage of "${m.title}" to [${nextStep.toUpperCase()}]`,
          status: 'Success'
        };
        setTimeout(() => setAuditLogs(prevLogs => [log, ...prevLogs]), 50);

        return {
          ...m,
          currentStep: nextStep,
          status: finalStatus,
          notes: notesList
        };
      }
      return m;
    }));
  };

  // ESTABLISH NEW CAMPUS
  const handleEstablishCampus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampus.name || !newCampus.location) return;

    const target: CampusDetails = {
      id: `camp-${Date.now()}`,
      name: newCampus.name,
      location: newCampus.location,
      deanName: newCampus.deanName || 'Interim Administrator',
      studentCount: Number(newCampus.studentCount) || 1000,
      assetsCount: Number(newCampus.assetsCount) || 200,
      revenue: newCampus.revenue || 'KES 0',
      status: 'Online'
    };

    setCampuses([...campuses, target]);
    setSelectedCampusId(target.id);
    setIsAddingCampus(false);

    // Audit Trail
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Chancellor Maryam Al-Mansoor',
      actorRole: 'Institution Owner / Chancellor',
      actionType: 'Curriculum',
      campus: target.name,
      details: `Established satellite campus deployment: ${target.name} in ${target.location}`,
      status: 'Success'
    };
    setAuditLogs([log, ...auditLogs]);

    setNewCampus({ name: '', location: '', deanName: '', studentCount: 1200, assetsCount: 300, revenue: 'KES 1,200,000' });
  };

  // AI PERMISSION SECURITY AUDITOR COMPLIANCE GENERATOR
  const runLiveComplianceAudit = () => {
    setIsAuditingLive(true);
    setGenerationLogs('Scanning user permission mappings against Afro-accreditation frameworks...\n');
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (counter === 1) {
        setGenerationLogs(prev => prev + '✓ Checking SSO token parameters for active coordinators...\n');
      } else if (counter === 2) {
        setGenerationLogs(prev => prev + '⚠ 1 Critical Risk: Exam BIO-101 draft detected in public directory. Automated defensive containment sequence initiated.\n');
      } else if (counter === 3) {
        setGenerationLogs(prev => prev + '✓ Analyzed student activity patterns across Main, Durban, Johannesburg, and Cape Town satellites...\n');
      } else if (counter === 4) {
        setGenerationLogs(prev => prev + '✓ Compliance health evaluation validated at 98% security uptime status score!\n');
        setComplianceScore(98);
        clearInterval(interval);
        setIsAuditingLive(false);

        // Append compliance improvement into reports:
        setAuditLogs(prev => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actorName: 'AI Security Shield',
            actorRole: 'Compliance Auditor',
            actionType: 'Curriculum',
            campus: activeCampus.name,
            details: 'Executed system-wide compliance assessment. Self-corrected 1 directory file threat leaks.',
            status: 'Success'
          },
          ...prev
        ]);
      }
    }, 700);
  };

  // Dismiss incidents simulation action
  const handleResolveAlert = (alertId: string, alertMsg: string) => {
    setSecurityAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    
    // Add record log
    const confirmLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Director James Adebayo',
      actorRole: 'Institution Administrator',
      actionType: 'User Activity',
      campus: activeCampus.name,
      details: `Dismissed security trigger alert: "${alertMsg.substring(0, 32)}..." after confirming with relevant department head.`,
      status: 'Success'
    };
    setAuditLogs(prev => [confirmLog, ...prev]);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Dynamic Master Top Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute right-3.5 top-3.5 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-2xl text-rose-600 dark:text-rose-400">
            <Users size={18} />
          </div>
          <span className="text-[9.5px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 block">Active Campus Site</span>
          <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1">{activeCampus.name}</h4>
          <p className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-1">
            {activeCampus.studentCount.toLocaleString()} <span className="text-xs text-slate-450 dark:text-slate-500 font-sans font-medium">Verified ID Students</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute right-3.5 top-3.5 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <BookOpen size={18} />
          </div>
          <span className="text-[9.5px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 block">Sovereign Library Library Docs</span>
          <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1">{activeCampus.location}</h4>
          <p className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-1">
            {activeCampus.assetsCount.toLocaleString()} <span className="text-xs text-slate-450 dark:text-slate-500 font-sans font-medium">Institutional Resources</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute right-3.5 top-3.5 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-2xl text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={18} />
          </div>
          <span className="text-[9.5px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 block">Sovereign Financial Pools</span>
          <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1">Revenue Stream Cashout</h4>
          <p className="text-xl font-bold font-serif text-emerald-650 dark:text-emerald-400 mt-1">
            {activeCampus.revenue}
          </p>
        </div>

        <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden">
          <div className="absolute right-3.5 top-3.5 bg-rose-600 p-2.5 rounded-2xl shadow">
            <Brain size={18} />
          </div>
          <span className="text-[9.5px] uppercase tracking-widest font-black text-slate-300 block">CogniShield Compliance Dial</span>
          <h4 className="text-xs font-black text-rose-300 mt-1">AI Permission scanning active</h4>
          <p className="text-xl font-bold font-serif mt-1 text-white flex items-center gap-1">
            <span>{complianceScore}%</span>
            <span className="text-[10px] bg-emerald-550/20 text-emerald-400 font-sans px-1.5 py-0.5 rounded border border-emerald-500/30">Stable</span>
          </p>
        </div>

      </div>

      {subTabsMenu()}

      {/* RENDER MASTER NAVIGATION SECTIONS */}
      <div>
        <AnimatePresence mode="wait">
          {activeTab === 'governance' && (
            <motion.div
              key="governance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* GOVERNANCE ROLE TREE & MEMBER MANAGE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual Roles list (Left col) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-4">
                  <div className="border-b pb-3 space-y-2">
                    <h3 className="font-serif font-black text-slate-900 dark:text-white text-base">Sovereign Hierarchy</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-550">Explore or search the institutional governance structure</p>
                    
                    {/* View mode toggle */}
                    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-[10.5px] font-bold">
                      <button 
                        type="button" 
                        onClick={() => setGovernanceViewMode('tree')} 
                        className={`flex-1 text-center py-1.5 px-2 rounded-lg transition-all duration-150 ${governanceViewMode === 'tree' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Visual Tree
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setGovernanceViewMode('list')} 
                        className={`flex-1 text-center py-1.5 px-2 rounded-lg transition-all duration-150 ${governanceViewMode === 'list' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        Search List
                      </button>
                    </div>

                    {governanceViewMode === 'list' && (
                      <div className="relative mt-2">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search roles (e.g. Dean, Curriculum)"
                          value={roleSearchTerm}
                          onChange={(e) => setRoleSearchTerm(e.target.value)}
                          className="w-full text-xs pl-8 pr-3.5 py-2 border rounded-xl border-slate-150 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-505"
                        />
                      </div>
                    )}
                  </div>

                  {governanceViewMode === 'tree' ? (
                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      <div className="space-y-2">
                        <GovernanceTreeNode label="Super Admin (CogniSacra)" id="super-admin" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName}>
                          <GovernanceTreeNode label="Institution Owner / Chancellor" id="owner" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName}>
                            <GovernanceTreeNode label="Institution Administrator" id="inst-admin" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName}>
                              <div className="ml-2 border-l border-rose-300 dark:border-rose-950 pl-2.5 py-1 space-y-1">
                                <GovernanceTreeNode label="Academic Affairs" id="academic" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="Finance Department" id="finance" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="Librarians" id="librarian" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="Researchers" id="researcher" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="Student Affairs" id="student-affairs" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="ICT Department" id="ict" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="Quality Assurance" id="quality-assurance" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                              </div>
                            </GovernanceTreeNode>

                            <GovernanceTreeNode label="Dean (Faculty Level)" id="dean" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName}>
                              <div className="ml-2 border-l border-rose-300 dark:border-rose-950 pl-2.5 py-1 space-y-1">
                                <GovernanceTreeNode label="Head of Department (HOD)" id="hod" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="Program Coordinator" id="coordinator" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                                <GovernanceTreeNode label="Curriculum Manager" id="curriculum" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                              </div>
                            </GovernanceTreeNode>

                            <GovernanceTreeNode label="Lecturer / Instructor" id="lecturer" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                          </GovernanceTreeNode>
                        </GovernanceTreeNode>

                        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-1.5">
                          <GovernanceTreeNode label="Students" id="student" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                          <GovernanceTreeNode label="Alumni" id="alumni" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                          <GovernanceTreeNode label="External Users / Public" id="external" roles={roles} selectedRoleName={selectedRoleName} setSelectedRoleName={setSelectedRoleName} isLeaf />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {filteredRoles.map(role => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRoleName(role.name)}
                          className={`w-full text-left p-3 rounded-2xl border text-xs transition duration-150 flex items-center justify-between ${
                            selectedRoleName === role.name
                              ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-transparent'
                              : 'bg-slate-50/50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-355'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold leading-none">{role.name}</h4>
                            <div className="flex gap-1 items-center">
                              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                selectedRoleName === role.name 
                                  ? 'bg-white/10 text-rose-200' 
                                  : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500'
                              }`}>
                                {role.category}
                              </span>
                              <span className="text-[9.5px] opacity-70">Level: {role.accessLevel}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="opacity-60 shrink-0 ml-1.5" />
                        </button>
                      ))}
                      {filteredRoles.length === 0 && (
                        <p className="text-center text-xs text-slate-450 py-10">No governance roles match your filter.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Role specifications details & Assign member (Middle & Right columns) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Detailed specs table */}
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 blur-sm pointer-events-none">
                      <Shield size={180} />
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      <span className="bg-indigo-50 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-300 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded">
                        Access Specification: {activeRole.accessLevel}
                      </span>
                      <h4 className="font-serif font-black text-slate-900 dark:text-white text-xl flex items-center gap-2">
                        <BadgeCheck className="text-rose-600" size={22} />
                        <span>{activeRole.name}</span>
                      </h4>

                      {/* Responsibilities list */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Functional System Responsibilities</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {activeRole.responsibilities.map((r, i) => (
                            <div key={i} className="p-3 border rounded-2xl border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                              • {r}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Explicit Permissions Toggles represent block exactly */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider font-sans">Explicit Enterprise Permission Matrix</span>
                        <div className="flex flex-wrap gap-2">
                          {activeRole.permissions.map((p, i) => (
                            <span 
                              key={i}
                              className={`text-xs px-3.5 py-2 rounded-2xl font-bold flex items-center gap-1.5 border transition ${
                                p.allowed 
                                  ? 'bg-green-50/70 border-green-150 text-green-700 dark:bg-green-950/20 dark:border-green-900 text-green-300' 
                                  : 'bg-red-50/70 border-red-150 text-red-750 dark:bg-red-955/15 dark:border-red-950 text-red-300'
                              }`}
                            >
                              {p.allowed ? <CheckCircle size={13} /> : <XCircle size={13} />}
                              <span>{p.label}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Assign & Database Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Member Add Form */}
                    <div className="md:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm flex flex-col justify-between">
                      <form onSubmit={handleAddNewMember} className="space-y-4">
                        <div className="border-b pb-2 flex justify-between items-center">
                          <h4 className="font-serif font-black text-sm text-slate-905 dark:text-white">Credentials Dispatcher</h4>
                          <span className="text-[9px] uppercase font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">SIS Server</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-404">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Kwame Nkrumah"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            className="w-full text-xs px-3 py-2 border rounded-xl border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-505"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-404">Institutional Email</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. nkrumah@cognisacra.edu"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            className="w-full text-xs px-3 py-2 border rounded-xl border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-505"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-404">Assign Role Hierarchy</label>
                          <select
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2 border rounded-xl border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none"
                          >
                            {roles.map(r => (
                              <option key={r.id} value={r.name} className="dark:bg-slate-900">{r.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-404">Assign Campus</label>
                            <select
                              value={newMember.campus}
                              onChange={(e) => setNewMember({ ...newMember, campus: e.target.value })}
                              className="w-full text-xs font-semibold px-3 py-2 border rounded-xl border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none"
                            >
                              {campuses.map(c => (
                                <option key={c.id} value={c.name} className="dark:bg-slate-900">{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-404">Department</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Life Sciences"
                              value={newMember.department}
                              onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                              className="w-full text-xs px-3 py-2 border rounded-xl border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-505"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex justify-center items-center gap-1">
                          <Plus size={14} />
                          <span>Dispatch Invites</span>
                        </button>
                      </form>

                      {successToast && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 text-xs font-bold rounded-xl border border-green-150 mt-3 text-center">
                          {successToast}
                        </div>
                      )}
                    </div>

                    {/* Member Directory lists and filters */}
                    <div className="md:col-span-7 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="border-b pb-2.5 flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <h4 className="font-serif font-black text-sm text-slate-905 dark:text-white">Active staff on {activeCampus.name}</h4>
                            <p className="text-[11px] text-slate-404">Dynamic directory linked with central registry database</p>
                          </div>
                          <div className="relative">
                            <Search size={12} className="absolute left-2 top-2.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search directory..."
                              value={memberSearchTerm}
                              onChange={(e) => setMemberSearchTerm(e.target.value)}
                              className="text-[11px] pl-7 pr-3 py-1.5 border rounded-xl border-slate-150 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
                          {filteredMembers.map(m => (
                            <div key={m.id} className="p-3 border rounded-2xl border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center transition hover:shadow-xs">
                              <div className="space-y-1">
                                <div className="flex gap-2 items-center flex-wrap">
                                  <span className="font-black text-slate-900 dark:text-white text-xs">{m.name}</span>
                                  <span className="bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[8.5px] uppercase font-bold px-1.5 py-0.2 rounded font-sans border border-rose-100 dark:border-rose-900/30">
                                    {m.role}
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-404 font-sans leading-none">{m.email} — {m.department}</p>
                                <p className="text-[9.5px] text-slate-400 font-mono">Last Ingest: {m.lastLogin}</p>
                              </div>

                              <button
                                onClick={() => handleDeleteMember(m.id, m.name)}
                                className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition"
                                title="Revoke access"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                          {filteredMembers.length === 0 && (
                            <p className="text-center text-xs text-slate-450 py-10 font-sans">No staff elements registered for this active Campus.</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t text-[10px] text-slate-400 text-center font-semibold">
                        Directory feeds synced dynamically. All terminations are recorded in systemic audit indexes.
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'workEngine' && (
            <motion.div
              key="workEngine"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* APPROVAL WORKFLOW ENGINE BLOCK */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
                <div className="absolute right-[-40px] top-[-40px] opacity-10 blur-sm pointer-events-none">
                  <Milestone size={240} className="text-rose-600" />
                </div>
                
                <div className="space-y-4 max-w-4xl relative z-10">
                  <span className="bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 text-rose-750 dark:text-rose-300 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded">
                    Sovereign Academic Gatekeeping Engine™
                  </span>
                  <h3 className="font-serif font-black text-rose-905 dark:text-white text-xl">Double-Vetted Publications Workflow Engine</h3>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                    Simulate administrative verification sequences of academic publications before they enter the sovereign student indices. Every approval triggers step-by-step state changes, and records actions sequentially in the audit trails system.
                  </p>
                </div>
              </div>

              {/* Dynamic Workflow Stage nodes visual bar */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  
                  {/* Connector lines on desktop */}
                  <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-600 z-0 opacity-40" />

                  {[
                    { key: 'upload', order: 1, label: '1. Lecturer Upload', desc: 'Material is uploaded by authorized Faculty', role: 'Lecturer / Instructor' },
                    { key: 'review', order: 2, label: '2. Review & Align', desc: 'Syllabus and layout checked against templates', role: 'Program Coordinator' },
                    { key: 'hod', order: 3, label: '3. HOD Approval', desc: 'Final departmental validity check and grading rules', role: 'Head of Department (HOD)' },
                    { key: 'library', order: 4, label: '4. Library Index', desc: 'Verify copyrights, DOI, and catalog metadata', role: 'Librarians' },
                    { key: 'published', order: 5, label: '5. Sovereign Publish', desc: 'Encrypted, signed and made active globally', role: 'Institution Owner / Admin' }
                  ].map(step => {
                    const steps = ['upload', 'review', 'hod', 'library', 'published'];
                    const activeIndex = steps.indexOf(activeMaterial.currentStep);
                    const stepIndex = steps.indexOf(step.key);
                    const isCompleted = stepIndex < activeIndex;
                    const isActive = stepIndex === activeIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative z-10">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition ${
                          isCompleted
                            ? 'bg-emerald-555 border-emerald-505 text-white shadow shadow-emerald-500/20'
                            : isActive
                              ? 'bg-gradient-to-tr from-rose-600 to-crimson border-rose-505 text-white shadow-xl animate-pulse ring-4 ring-rose-500/20'
                              : 'bg-slate-800/80 border-slate-700 text-slate-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle size={22} />
                          ) : isActive ? (
                            <Activity size={22} className="animate-spin" />
                          ) : (
                            <FileText size={20} />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className={`text-xs font-black ${isActive ? 'text-rose-455 font-serif' : 'text-slate-205'}`}>{step.label}</h4>
                          <p className="text-[10px] text-slate-410 leading-snug font-semibold">{step.desc}</p>
                          <span className="inline-block text-[8px] bg-slate-800/60 text-slate-300 px-1.5 py-0.2 rounded font-sans border border-slate-705">
                            Role: {step.role}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* List of Pending assets & active inspector control */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Pending assets left bank */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-4">
                  <div className="border-b pb-2.5">
                    <h3 className="font-serif font-black text-sm text-slate-905 dark:text-white">Verification Queue Ingestion</h3>
                    <p className="text-[11px] text-slate-404">Select any manuscript to audit and advance its stage</p>
                  </div>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {pendingMaterials.map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setSelectedMaterialId(mat.id)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs transition duration-150 flex justify-between items-center ${
                          selectedMaterialId === mat.id
                            ? 'bg-slate-50 dark:bg-slate-900 border-rose-505 shadow-sm'
                            : 'bg-slate-50/50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-708'
                        }`}
                      >
                        <div className="space-y-1.5 max-w-[80%]">
                          <h4 className="font-black text-slate-905 dark:text-white truncate leading-relaxed">{mat.title}</h4>
                          <div className="flex gap-1.5 flex-wrap items-center">
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-305">
                              {mat.department}
                            </span>
                            <span className="text-[9px] text-slate-450 dark:text-slate-500">By: {mat.lecturerName}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded leading-none ${
                            mat.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : mat.status === 'Flagged'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-750 animate-pulse'
                          }`}>
                            {mat.currentStep.toUpperCase()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Workflow Active Inspector Action Pane (Right col) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-5">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-black text-rose-600 block">Active Auditor Inspector Panel</span>
                      <h3 className="font-serif font-black text-slate-900 dark:text-white text-base truncate">{activeMaterial.title}</h3>
                    </div>
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 p-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                      ID: {activeMaterial.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-3 border rounded-2xl border-slate-100 dark:border-slate-850 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Uploaded Lecturer / Instructor</span>
                      <p className="font-black text-slate-800 dark:text-slate-100">{activeMaterial.lecturerName}</p>
                    </div>

                    <div className="p-3 border rounded-2xl border-slate-100 dark:border-slate-850 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Receipt Date timestamp</span>
                      <p className="font-black text-slate-800 dark:text-slate-100 font-mono">{activeMaterial.uploadedDate}</p>
                    </div>
                  </div>

                  {/* Active logs inside this document */}
                  <div className="p-4 rounded-3xl bg-slate-900 text-slate-205 border border-slate-800 font-mono text-[11px] space-y-2 max-h-[160px] overflow-y-auto">
                    <span className="text-[10px] text-rose-455 font-black uppercase tracking-wider block border-b border-slate-800 pb-1.5">
                      Manuscript Action Trail Records
                    </span>
                    {activeMaterial.notes.map((note, index) => (
                      <p key={index} className="leading-relaxed">{note}</p>
                    ))}
                  </div>

                  {/* Interactive Action Controllers */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="space-y-0.5 self-start sm:self-auto">
                      <span className="text-[9.5px] uppercase tracking-widest font-black text-slate-400 block font-sans">Required Next Action Role</span>
                      <p className="text-xs font-black text-rose-600">
                        {activeMaterial.currentStep === 'upload' && 'Program Coordinator review approval signature'}
                        {activeMaterial.currentStep === 'review' && 'Head of Department HOD final validation'}
                        {activeMaterial.currentStep === 'hod' && 'Librarian index classification vetting'}
                        {activeMaterial.currentStep === 'library' && 'Institution Executive chancellor publish on-chain'}
                        {activeMaterial.currentStep === 'published' && 'All checks passed. Material integrated into student indexes.'}
                      </p>
                    </div>

                    {activeMaterial.currentStep !== 'published' ? (
                      <div className="flex gap-2.5 w-full sm:w-auto shrink-0 justify-end">
                        <button
                          onClick={() => handleWorkflowAdvance(activeMaterial.id, 'flag')}
                          className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100/50 rounded-xl text-xs font-black uppercase tracking-wider transition duration-150"
                        >
                          Flag/Defer
                        </button>
                        <button
                          onClick={() => handleWorkflowAdvance(activeMaterial.id, 'approve')}
                          className="px-4 py-2 bg-slate-905 text-white hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-wider transition duration-150 flex items-center gap-1.5 shadow"
                        >
                          <span>Approve & Sign-off</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 border border-emerald-150">
                        <CheckCircle size={14} />
                        <span>Sovereign Published</span>
                      </span>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'auditing' && (
            <motion.div
              key="auditing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* AUDIT LOG TRAIL IN JETBRAINS MONO TERMINAL STYLE */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm">
                
                <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-4 mb-4">
                  <div className="space-y-1">
                    <h3 className="font-serif font-black text-slate-905 dark:text-white text-base">Institutional Audit Trail System</h3>
                    <p className="text-xs text-slate-404">Unalterable logging recording uploads, downloads, edits, and financial events across satellite campuses.</p>
                  </div>

                  {/* Filter configurations */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <div className="relative">
                      <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Actor..."
                        value={searchLogTerm}
                        onChange={(e) => setSearchLogTerm(e.target.value)}
                        className="pl-7 pr-3 py-1.5 border rounded-xl border-slate-150 dark:border-slate-850 text-xs font-semibold"
                      />
                    </div>

                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-905 p-1 rounded-xl border border-slate-150 dark:border-slate-855">
                      {['All', 'Upload', 'Download', 'Curriculum', 'User Activity', 'Financial'].map(type => (
                        <button
                          key={type}
                          onClick={() => setLogFilterType(type)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                            type === logFilterType
                              ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white'
                              : 'text-slate-450 hover:text-slate-900'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Audit Grid lists */}
                <div className="bg-slate-900 text-slate-205 rounded-3xl p-5 border border-slate-800 font-mono text-xs overflow-x-auto space-y-3.5 max-h-[460px] overflow-y-auto">
                  
                  {/* Ledger Header columns */}
                  <div className="grid grid-cols-12 gap-4 text-rose-455 font-black uppercase text-[10px] tracking-wider border-b border-slate-800 pb-2">
                    <span className="col-span-2">TIMESTAMP UTC</span>
                    <span className="col-span-3">ACTOR (ROLE)</span>
                    <span className="col-span-2 text-center font-sans uppercase">CATEGORY ACTION</span>
                    <span className="col-span-1 border-r border-slate-800">CAMPUS</span>
                    <span className="col-span-3">SATELLITE DETAILS PAYLOAD</span>
                    <span className="col-span-1 text-right">LEDGER STATE</span>
                  </div>

                  {/* Render logs list */}
                  {auditLogs.filter(log => {
                    const matchSearch = log.actorName.toLowerCase().includes(searchLogTerm.toLowerCase()) || log.details.toLowerCase().includes(searchLogTerm.toLowerCase());
                    const matchType = logFilterType === 'All' || log.actionType === logFilterType;
                    return matchSearch && matchType;
                  }).map(log => (
                    <div key={log.id} className="grid grid-cols-12 gap-3 pb-2.5 border-b border-slate-800/50 hover:bg-slate-850/20 p-1.5 rounded-xl transition duration-75 text-[11px] leading-relaxed">
                      <span className="col-span-2 text-slate-420 font-bold">{log.timestamp}</span>
                      
                      <div className="col-span-3 space-y-0.5">
                        <p className="font-extrabold text-white leading-none">{log.actorName}</p>
                        <p className="text-[10px] text-slate-450 italic leading-none">{log.actorRole}</p>
                      </div>

                      <div className="col-span-2 text-center self-center">
                        <span className={`text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded ${
                          log.actionType === 'Financial'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30 font-sans'
                            : log.actionType === 'Curriculum'
                              ? 'bg-indigo-950 text-indigo-405 border border-indigo-900/30 font-sans'
                              : log.actionType === 'Deletion'
                                ? 'bg-red-955/20 text-red-400 border border-red-900/40 font-sans'
                                : 'bg-slate-800 text-slate-310 border border-slate-705 font-sans'
                        }`}>
                          {log.actionType}
                        </span>
                      </div>

                      <span className="col-span-1 text-slate-310 font-bold self-center text-[10px] truncate">{log.campus}</span>

                      <span className="col-span-3 text-slate-108 font-semibold self-center leading-normal truncate" title={log.details}>
                        {log.details}
                      </span>

                      <div className="col-span-1 text-right self-center">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          log.status === 'Success'
                            ? 'text-emerald-400'
                            : log.status === 'Warn'
                              ? 'text-amber-505'
                              : 'text-red-500 animate-pulse'
                        }`}>
                          ● {log.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {auditLogs.length === 0 && (
                    <p className="text-center py-20 text-slate-401 font-sans">No unalterable logs documented in current session.</p>
                  )}

                </div>

                <div className="pt-4 border-t mt-4 flex justify-between items-center text-xs text-slate-404">
                  <span className="font-mono">Security Status: MASTER LOCK SEQUENCE ACTIVE</span>
                  <button 
                    onClick={() => {
                      setLogFilterType('All');
                      setSearchLogTerm('');
                    }}
                    className="text-indigo-600 hover:underline font-bold"
                  >
                    Reset filters & reload ledger assets
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'multisite' && (
            <motion.div
              key="multisite"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* MULTICAMPUS SATELLITES INTERACTIVE LISTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Satellites Toggle & List left panel */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-serif font-black text-sm text-slate-900 dark:text-white">Active Campus Satellites</h3>
                      <p className="text-[11px] text-slate-404">Select satellite to load decentralized admin settings</p>
                    </div>
                    <button
                      onClick={() => setIsAddingCampus(true)}
                      className="p-1.5 bg-rose-50 dark:bg-rose-950/45 text-rose-600 rounded-xl hover:bg-rose-100 transition"
                      title="Sovereign Deployment Provisioner"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-3.5 pr-1 max-h-[460px] overflow-y-auto">
                    {campuses.map(campus => (
                      <button
                        key={campus.id}
                        onClick={() => setSelectedCampusId(campus.id)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs transition duration-150 flex justify-between items-center ${
                          selectedCampusId === campus.id
                            ? 'bg-slate-50 dark:bg-slate-900 border-rose-505 shadow-sm'
                            : 'bg-slate-50/50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-705'
                        }`}
                      >
                        <div className="space-y-1.5 max-w-[80%]">
                          <h4 className="font-black text-slate-905 dark:text-white leading-none">{campus.name}</h4>
                          <p className="text-[10px] text-slate-450 leading-none">{campus.location}</p>
                          <div className="flex gap-2">
                            <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono px-1 py-0.2 rounded">
                              Assets ID: {campus.assetsCount}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-bold">
                          <span className="text-rose-600 block text-[11px]">{campus.studentCount.toLocaleString()}</span>
                          <span className="text-[8px] bg-green-50 text-green-700 px-1 py-0.2 rounded uppercase">
                            {campus.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Satellite detailed admin metrics panel (Right) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {isAddingCampus ? (
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-rose-150 dark:border-rose-900/30 shadow-md">
                      <h3 className="font-serif font-black text-slate-900 dark:text-white text-base pb-3 border-b mb-4">
                        Provision Satellite Campus Satellite Deployment
                      </h3>
                      
                      <form onSubmit={handleEstablishCampus} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-404">Campus Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Durban Tech Hub"
                              value={newCampus.name}
                              onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })}
                              className="w-full text-xs px-3 py-2 border rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-404">Geographic Location</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Durban, South Africa"
                              value={newCampus.location}
                              onChange={(e) => setNewCampus({ ...newCampus, location: e.target.value })}
                              className="w-full text-xs px-3 py-2 border rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-404">Satellite Dean Chancellery</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Prof. Helen Naidoo"
                              value={newCampus.deanName}
                              onChange={(e) => setNewCampus({ ...newCampus, deanName: e.target.value })}
                              className="w-full text-xs px-3 py-2 border rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-404">Initial Student License Cap</label>
                            <input
                              type="number"
                              value={newCampus.studentCount}
                              onChange={(e) => setNewCampus({ ...newCampus, studentCount: Number(e.target.value) })}
                              className="w-full text-xs px-3 py-2 border rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingCampus(false)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold rounded-xl"
                          >
                            Cancel Project
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-slate-905 hover:bg-slate-800 text-white font-black uppercase rounded-xl flex items-center gap-1.5"
                          >
                            <Building size={14} />
                            <span>Initialize Deployment</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-5">
                      <div className="border-b pb-3 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[9px] bg-rose-50 dark:bg-rose-950/45 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                            Authorized Satellite Portal
                          </span>
                          <h3 className="font-serif font-black text-slate-900 dark:text-white text-xl">{activeCampus.name}</h3>
                        </div>
                        <span className="text-xs p-1 px-3.5 bg-green-50 text-green-700 rounded-3xl border border-emerald-150 font-black flex items-center gap-1">
                          <CheckCircle size={12} className="text-green-600" />
                          <span>Status Online</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-3xl border-slate-100 dark:border-slate-850 bg-slate-50/20 text-xs space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Campus Director Dean</span>
                          <p className="font-black text-slate-800 dark:text-slate-100 text-sm">{activeCampus.deanName}</p>
                        </div>

                        <div className="p-4 border rounded-3xl border-slate-100 dark:border-slate-850 bg-slate-50/20 text-xs space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Allocated SIS Licenses</span>
                          <p className="font-black text-slate-800 dark:text-slate-100 text-sm font-serif">
                            {activeCampus.studentCount.toLocaleString()} student IDs
                          </p>
                        </div>

                        <div className="p-4 border rounded-3xl border-slate-100 dark:border-slate-850 bg-slate-50/20 text-xs space-y-1 bg-gradient-to-tr from-white to-green-50/30">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Operational budget (Accumulated)</span>
                          <p className="font-black text-emerald-650 dark:text-emerald-400 text-sm font-serif">{activeCampus.revenue}</p>
                        </div>
                      </div>

                      {/* Explicit satellite governance statement */}
                      <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                        <h4 className="font-serif font-black text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                          <Lock size={13} className="text-indigo-600" />
                          <span>Active Satellite Isolation Governance Model</span>
                        </h4>
                        "In compliance with Afro-Sovereign data policies, user profiles, download quotas, and transactions processed in {activeCampus.name} are encapsulated within isolated regional storage containers. Only the Super Admins (CogniSacra) and the central Chancellor Maryam Al-Mansoor hold ultimate master clearance credentials."
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'aiplatform' && (
            <motion.div
              key="aiplatform"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* COGNISHIELD AI-POWERED PERMISSION LAYER PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Visual Security Alerts Console / Left block */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="border-b pb-3 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="bg-rose-50 dark:bg-rose-950/45 text-rose-750 dark:text-rose-300 text-[9.5px] uppercase tracking-widest font-black px-2.5 py-1 rounded">
                          CogniShield™ Core Security Monitor
                        </span>
                        <h3 className="font-serif font-black text-slate-900 dark:text-white text-lg">AI Intrusion & Leakage Prevention Suite</h3>
                      </div>
                      
                      <button
                        onClick={runLiveComplianceAudit}
                        disabled={isAuditingLive}
                        className="px-4 py-2 bg-slate-905 hover:bg-slate-800 disabled:opacity-40 text-white font-black text-xs uppercase rounded-xl flex items-center gap-2 transition"
                      >
                        <RefreshCw size={13} className={isAuditingLive ? 'animate-spin' : ''} />
                        <span>{isAuditingLive ? 'Auditing...' : 'Run Diagnostics'}</span>
                      </button>
                    </div>

                    {/* Incident entries list */}
                    <div className="space-y-3.5">
                      {securityAlerts.map(alert => (
                        <div 
                          key={alert.id}
                          className={`p-4 border rounded-3xl flex justify-between items-center transition ${
                            alert.resolved 
                              ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-150 opacity-60' 
                              : 'bg-red-50/40 dark:bg-red-955/10 border-red-155 dark:border-red-950/60'
                          }`}
                        >
                          <div className="space-y-1 max-w-[70%]">
                            <div className="flex gap-2 items-center flex-wrap">
                              <span className={`text-[8.5px] uppercase font-black tracking-widest px-1.5 py-0.2 rounded font-mono ${
                                alert.severity === 'Critical' 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {alert.severity}: {alert.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                            </div>
                            <p className="font-extrabold text-xs text-slate-900 dark:text-white leading-relaxed">{alert.message}</p>
                            <p className="text-[10px] text-slate-450">Threat Source Scope: ID {alert.actor}</p>
                          </div>

                          <div className="shrink-0 text-right">
                            {alert.resolved ? (
                              <span className="text-[10.5px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-150">
                                Resolved / Safe
                              </span>
                            ) : (
                              <button
                                onClick={() => handleResolveAlert(alert.id, alert.message)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-750 text-white font-black text-[10px] uppercase rounded-xl transition"
                              >
                                Fix & Quarantine
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {generationLogs && (
                    <div className="p-4 bg-slate-900 text-slate-205 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed max-h-[140px] overflow-y-auto">
                      <span className="text-rose-455 font-black block border-b border-rose-950 pb-1.5 mb-2">Live AI Diagnostics Console</span>
                      <pre className="whitespace-pre-wrap">{generationLogs}</pre>
                    </div>
                  )}

                  <div className="pt-3 border-t text-[10.5px] text-slate-400 text-center font-semibold">
                    Core defensive scans run autonomously every 4 seconds. Suspicious traffic quarantined instantly.
                  </div>
                </div>

                {/* AI Permission Adjustment Suggestions block / Right */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="border-b pb-2.5 flex items-center gap-2">
                      <Brain size={18} className="text-rose-600 animate-pulse" />
                      <div>
                        <h4 className="font-serif font-black text-sm text-slate-905 dark:text-white">CogniShield Advisory</h4>
                        <p className="text-[10.5px] text-slate-404">AI-driven adjustment proposals for administrators approval</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-xs font-sans">
                      {[
                        { id: 'sug-1', rule: 'Quotas Alignment', desc: 'Alumni SARAH-884 accessed 6 consecutive past papers on the Cape Town index. Suggest restricting to Paid Subscriber tier access rules.', icon: <Lock size={14} /> },
                        { id: 'sug-2', rule: 'SSO Revocation Rec', desc: 'Librarian Joseph Kiprop hasn\'t initialized his directory credentials for Cape Town in 52 days. Recommend locking single-sign-on access.', icon: <CheckCircle size={14} /> },
                        { id: 'sug-3', rule: 'Financial Shield update', desc: 'Finance Officer David Ndlovu requested access to STEM research drafts. Suggest enforcing "Zero Trust Academic Content isolation".', icon: <XCircle size={14} /> }
                      ].map(sug => (
                        <div key={sug.id} className="p-3 border rounded-2xl border-slate-150 dark:border-slate-855 bg-slate-50/40 dark:bg-slate-900 text-slate-650 dark:text-slate-350 space-y-2 leading-relaxed">
                          <div className="flex gap-1.5 items-center font-black">
                            {sug.icon}
                            <span className="text-[10px] text-rose-600 uppercase block">{sug.rule}</span>
                          </div>
                          <p className="font-semibold text-slate-805 dark:text-slate-305 leading-normal">{sug.desc}</p>
                          <button
                            onClick={() => {
                              alert(`Simulated Action Override: Autonomously updated permissions rules. Logged sequence ID: ${sug.id}`);
                              
                              // Add to systems trail
                              setAuditLogs(prev => [
                                {
                                  id: `log-${Date.now()}`,
                                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                  actorName: 'AI Governance Layer',
                                  actorRole: 'Intrusion Engine',
                                  actionType: 'Curriculum',
                                  campus: activeCampus.name,
                                  details: `Executed autonomous AI policy upgrade: "${sug.rule}" action override override`,
                                  status: 'Success'
                                },
                                ...prev
                              ]);
                            }}
                            className="w-full text-center py-1.5 bg-slate-900 border border-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition hover:bg-slate-800"
                          >
                            Apply Adjustments Autonomously
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-rose-50/30 text-[10px] text-rose-700 dark:bg-rose-955/10 dark:text-rose-300 font-bold rounded-xl leading-relaxed text-center">
                    💡 All recommendation signatures align with standard compliance rules.
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'accreditation' && (
            <motion.div
              key="accreditation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <InstitutionAccreditationView institutionData={institutionData} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );

  function subTabsMenu() {
    return (
      <div className="bg-white dark:bg-slate-950 rounded-2xl p-2.5 border border-slate-150 dark:border-slate-850 shadow-sm flex flex-wrap gap-2 text-xs font-bold justify-between items-center">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'governance', label: '18 Governance Roles', icon: <Users size={14} /> },
            { id: 'accreditation', label: 'Student & Lecturer Onboarding', icon: <Award size={14} /> },
            { id: 'workEngine', label: 'Double-Vetted Workflow Engine', icon: <Milestone size={14} /> },
            { id: 'auditing', label: 'Unalterable Audit Trail Logs', icon: <FileSpreadsheet size={14} /> },
            { id: 'multisite', label: 'Multi-Campus Satellites', icon: <Building size={14} /> },
            { id: 'aiplatform', label: 'CogniShield AI Permission Layer', icon: <ShieldAlert size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-sm'
                  : 'text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-905 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Global Multi-campus Selector */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-2.5 md:pt-0 shrink-0">
          <span className="text-[10px] text-slate-450 uppercase font-black tracking-widest flex items-center gap-1">
            <Globe size={11} className="text-rose-505" />
            <span>Campus Select:</span>
          </span>
          <select
            value={selectedCampusId}
            onChange={(e) => setSelectedCampusId(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold"
          >
            {campuses.map(campus => (
              <option key={campus.id} value={campus.id}>{campus.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
