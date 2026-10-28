// Institutional Accreditation & Onboarding Service

export interface AccreditationRecord {
  id: string;
  code: string;
  targetRole: 'learner' | 'instructor';
  memberName: string;
  memberEmail: string;
  institutionId: string;
  institutionName: string;
  institutionLogo?: string;
  campusName: string;
  department: string;
  program: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'redeemed' | 'revoked';
  redeemedBy?: string;
  accreditationHash: string;
}

export interface CreateAccreditationInput {
  memberName: string;
  memberEmail: string;
  targetRole: 'learner' | 'instructor';
  department: string;
  campusName: string;
  program?: string;
  institutionId?: string;
  institutionName?: string;
  institutionLogo?: string;
  validMonths?: number;
}

const STORAGE_KEY = 'cognisacra_accreditation_roster';

// Default pre-populated accreditation codes for demonstration & testing
const DEFAULT_RECORDS: AccreditationRecord[] = [
  {
    id: 'acc-1',
    code: 'COG-STU-2026-9F4B',
    targetRole: 'learner',
    memberName: 'Kofi Mensah',
    memberEmail: 'k.mensah@cognisacra.edu',
    institutionId: 'inst-cognisacra',
    institutionName: 'CogniSacra Sovereign University',
    institutionLogo: 'https://picsum.photos/seed/cognilogo/100/100',
    campusName: 'Main Campus (Nairobi)',
    department: 'School of AI & Neural Computing',
    program: 'B.Sc Sustainable Microgrids & AI',
    issuedAt: '2026-06-15',
    expiresAt: '2027-06-15',
    status: 'active',
    accreditationHash: '0x8F9B2C4D...7A1E'
  },
  {
    id: 'acc-2',
    code: 'COG-LEC-2026-7A1C',
    targetRole: 'instructor',
    memberName: 'Dr. Sarah Mwangi',
    memberEmail: 's.mwangi@cognisacra.edu',
    institutionId: 'inst-cognisacra',
    institutionName: 'CogniSacra Sovereign University',
    institutionLogo: 'https://picsum.photos/seed/cognilogo/100/100',
    campusName: 'Main Campus (Nairobi)',
    department: 'Department of Decentralized Agronomy',
    program: 'Senior Lecturer & AI Curriculum Lead',
    issuedAt: '2026-06-10',
    expiresAt: '2028-06-10',
    status: 'active',
    accreditationHash: '0x4D1A9F7C...3B8E'
  },
  {
    id: 'acc-3',
    code: 'OXF-AI-2026-4412',
    targetRole: 'learner',
    memberName: 'Amara Okafor',
    memberEmail: 'amara.okafor@oxford.edu',
    institutionId: 'inst-oxford',
    institutionName: 'Oxford Institute of Advanced Intelligence',
    institutionLogo: 'https://picsum.photos/seed/oxfordlogo/100/100',
    campusName: 'Europe Satellite (UK)',
    department: 'Cognitive Computing & Robotics',
    program: 'M.Sc Neural Architectures',
    issuedAt: '2026-06-01',
    expiresAt: '2027-06-01',
    status: 'active',
    accreditationHash: '0x7C3B8E4D...9F1A'
  },
  {
    id: 'acc-4',
    code: 'MIT-FAC-2026-1092',
    targetRole: 'instructor',
    memberName: 'Prof. David Nkosi',
    memberEmail: 'd.nkosi@mit.edu',
    institutionId: 'inst-mit',
    institutionName: 'MIT Decentralized Computing Node',
    institutionLogo: 'https://picsum.photos/seed/mitlogo/100/100',
    campusName: 'Cape Town Research Station',
    department: 'Distributed Systems & Ledger Protocols',
    program: 'Lead Research Fellow',
    issuedAt: '2026-05-20',
    expiresAt: '2028-05-20',
    status: 'active',
    accreditationHash: '0x1A9F7C3B...8E4D'
  }
];

class AccreditationService {
  private getStorage(): AccreditationRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading accreditation storage:', e);
    }
    // Initialize with defaults if empty
    this.saveStorage(DEFAULT_RECORDS);
    return DEFAULT_RECORDS;
  }

  private saveStorage(records: AccreditationRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cognisacra_accreditation_update'));
      }
    } catch (e) {
      console.warn('Error saving accreditation storage:', e);
    }
  }

  // Subscribe to updates
  public subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener('cognisacra_accreditation_update', handler);
    return () => window.removeEventListener('cognisacra_accreditation_update', handler);
  }

  // Retrieve statistics
  public getStats() {
    const records = this.getStorage();
    const learners = records.filter(r => r.targetRole === 'learner').length;
    const instructors = records.filter(r => r.targetRole === 'instructor').length;
    const active = records.filter(r => r.status === 'active').length;
    const redeemed = records.filter(r => r.status === 'redeemed').length;
    const revoked = records.filter(r => r.status === 'revoked').length;
    return { total: records.length, learners, instructors, active, redeemed, revoked };
  }

  // Retrieve all records
  public getAllRecords(): AccreditationRecord[] {
    return this.getStorage();
  }

  // Verify an entered code (case-insensitive & trimmed)
  public verifyCode(inputCode: string): AccreditationRecord | null {
    if (!inputCode) return null;
    const cleanCode = inputCode.trim().toUpperCase();
    const records = this.getStorage();
    const match = records.find(r => r.code.toUpperCase() === cleanCode);
    return match || null;
  }

  // Generate a new accreditation code for a student or lecturer
  public generateAccreditation(input: CreateAccreditationInput): AccreditationRecord {
    const records = this.getStorage();
    
    // Prefix based on role and institution
    const prefix = input.institutionName?.toUpperCase().includes('OXFORD') 
      ? 'OXF' 
      : input.institutionName?.toUpperCase().includes('MIT')
        ? 'MIT'
        : 'COG';
    
    const roleCode = input.targetRole === 'instructor' ? 'LEC' : 'STU';
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const code = `${prefix}-${roleCode}-${year}-${randomHex}`;

    const now = new Date();
    const validMonths = input.validMonths || 12;
    const expiryDate = new Date(now.setMonth(now.getMonth() + validMonths));

    const newRecord: AccreditationRecord = {
      id: `acc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code,
      targetRole: input.targetRole,
      memberName: input.memberName,
      memberEmail: input.memberEmail,
      institutionId: input.institutionId || 'inst-cognisacra',
      institutionName: input.institutionName || 'CogniSacra Sovereign University',
      institutionLogo: input.institutionLogo || 'https://picsum.photos/seed/cognilogo/100/100',
      campusName: input.campusName || 'Main Campus (Nairobi)',
      department: input.department || 'School of Advanced AI & Computing',
      program: input.program || (input.targetRole === 'instructor' ? 'Certified Faculty Lecturer' : 'Accredited Academic Scholar'),
      issuedAt: new Date().toISOString().split('T')[0],
      expiresAt: expiryDate.toISOString().split('T')[0],
      status: 'active',
      accreditationHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}...${randomHex}`
    };

    const updated = [newRecord, ...records];
    this.saveStorage(updated);
    return newRecord;
  }

  // Mark code as redeemed upon successful onboarding
  public redeemCode(code: string, userId?: string): boolean {
    const records = this.getStorage();
    const cleanCode = code.trim().toUpperCase();
    let found = false;

    const updated = records.map(r => {
      if (r.code.toUpperCase() === cleanCode) {
        found = true;
        return {
          ...r,
          status: 'redeemed' as const,
          redeemedBy: userId || 'active-user'
        };
      }
      return r;
    });

    if (found) {
      this.saveStorage(updated);
    }
    return found;
  }

  // Revoke an accreditation record
  public revokeAccreditation(id: string): boolean {
    const records = this.getStorage();
    const updated = records.map(r => {
      if (r.id === id) {
        return { ...r, status: 'revoked' as const };
      }
      return r;
    });
    this.saveStorage(updated);
    return true;
  }
}

export const accreditationService = new AccreditationService();
