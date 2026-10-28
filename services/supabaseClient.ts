import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL as string) || 'https://qsdsnateojrloyzvlrqn.supabase.co';
const supabaseKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZHNuYXRlb2pybG95enZscnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzg2NDMsImV4cCI6MjA5Nzg1NDY0M30.WgadmuLPIv9o3qIxVXIYKGo_t8mzicbRTou3J_hlteI';

// Safe instantiation of real client
let realSupabase: any = null;
try {
  realSupabase = createClient(supabaseUrl, supabaseKey);
} catch (e) {
  console.warn("Could not instantiate real Supabase client:", e);
}

// Global flag to track connection status
let isOffline = false;

const isFetchError = (err: any): boolean => {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("unreachable") ||
    msg.includes("cors")
  );
};

// --- Local Storage Database Setup ---
const defaultMockUserId = 'alex-turner-uuid-1234';
const defaultInstructorId = 'instructor-uuid-1234';
const defaultInstitutionId = 'institution-uuid-1234';

const initMockDatabase = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('supabase_mock_initialized')) {
    // Auth Users
    const users = [
      { id: defaultMockUserId, email: 'alex.turner@example.com', fullName: 'Alex Turner', role: 'learner' },
      { id: defaultInstructorId, email: 'instructor@example.com', fullName: 'Jane Doe', role: 'instructor' },
      { id: defaultInstitutionId, email: 'institution@example.com', fullName: 'CogniSacra Tech', role: 'institution' }
    ];
    localStorage.setItem('supabase_mock_users', JSON.stringify(users));

    // Profiles
    const profiles = {
      [defaultMockUserId]: { id: defaultMockUserId, email: 'alex.turner@example.com', role: 'learner', full_name: 'Alex Turner', avatar_url: 'https://i.pravatar.cc/150?u=alexturner' },
      [defaultInstructorId]: { id: defaultInstructorId, email: 'instructor@example.com', role: 'instructor', full_name: 'Jane Doe', avatar_url: 'https://i.pravatar.cc/150?u=janedoe' },
      [defaultInstitutionId]: { id: defaultInstitutionId, email: 'institution@example.com', role: 'institution', full_name: 'CogniSacra Tech', avatar_url: 'https://i.pravatar.cc/150?u=techu' }
    };
    localStorage.setItem('supabase_mock_profiles', JSON.stringify(profiles));

    // Learners Data
    const learners = {
      [defaultMockUserId]: {
        id: defaultMockUserId,
        username: 'alex_turner',
        display_name: 'Alex T.',
        bio: 'Passionate lifelong learner exploring the intersection of technology and design.',
        title: 'Lifelong Learner & Frontend Developer',
        cover_image_url: 'https://picsum.photos/seed/profile-banner/1200/300',
        location_city: 'San Francisco',
        location_country: 'USA',
        skills: ['React', 'TypeScript', 'UX/UI Design', 'State Management', 'Figma', 'Generative AI'],
        learning_goals: ['Master React State Management', 'Build a full-stack MERN application'],
        mentorship_status: 'offering',
        target_career: 'Frontend Developer'
      }
    };
    localStorage.setItem('supabase_mock_learners_data', JSON.stringify(learners));

    // Instructors Data
    const instructors = {
      [defaultInstructorId]: {
        id: defaultInstructorId,
        display_name: 'Jane Doe',
        bio: 'Experienced full stack educator and course creator.',
        payout_settings: { method: 'paypal', stripeConnected: false },
        notification_settings: { studentJoins: true, courseReviews: true, newEnrollments: true }
      }
    };
    localStorage.setItem('supabase_mock_instructors_data', JSON.stringify(instructors));

    // Institutions Data
    const institutions = {
      [defaultInstitutionId]: {
        id: defaultInstitutionId,
        name: 'CogniSacra Tech',
        tagline: 'Leading empowerment through tech education.',
        about: 'CogniSacra teaches digital skills to students globally.',
        website: 'https://cognisacra.edu',
        contact_email: 'contact@cognisacra.edu',
        contact_phone: '+1 (555) 0192-384',
        branding_logo_url: 'https://picsum.photos/seed/techu/100/40',
        branding_primary_color: '#A51C30',
        settings: { whiteLabel: false, multiLanguage: false, profileVisibility: 'public' },
        monetization_settings: {}
      }
    };
    localStorage.setItem('supabase_mock_institutions_data', JSON.stringify(institutions));

    localStorage.setItem('supabase_mock_initialized', 'true');
  }
};

// --- Listeners List ---
const mockListeners = new Set<(event: string, session: any) => void>();
const notifyListeners = (event: string, session: any) => {
  mockListeners.forEach(cb => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("Error invoking auth callback:", e);
    }
  });
};

const getMockSession = () => {
  if (typeof window === 'undefined') return { data: { session: null }, error: null };
  initMockDatabase();
  const sessionStr = localStorage.getItem('supabase_mock_session');
  if (sessionStr) {
    try {
      return { data: { session: JSON.parse(sessionStr) }, error: null };
    } catch (e) {
      // Ignored
    }
  }
  return { data: { session: null }, error: null };
};

const signUpMock = (params: any) => {
  initMockDatabase();
  const { email, password, options } = params;
  const fullName = options?.data?.full_name || email.split('@')[0];
  const avatarUrl = options?.data?.avatar_url || `https://i.pravatar.cc/150?u=${email}`;
  const role = options?.data?.role || 'learner';

  const users = JSON.parse(localStorage.getItem('supabase_mock_users') || '[]');
  if (users.some((u: any) => u.email === email)) {
    return { data: { user: null, session: null }, error: { message: "User already exists" } };
  }

  const newId = 'user-uuid-' + Math.random().toString(36).substring(2, 11);
  const newUser = { id: newId, email, fullName, role };
  users.push(newUser);
  localStorage.setItem('supabase_mock_users', JSON.stringify(users));

  const profiles = JSON.parse(localStorage.getItem('supabase_mock_profiles') || '{}');
  profiles[newId] = { id: newId, email, role, full_name: fullName, avatar_url: avatarUrl };
  localStorage.setItem('supabase_mock_profiles', JSON.stringify(profiles));

  const learners = JSON.parse(localStorage.getItem('supabase_mock_learners_data') || '{}');
  learners[newId] = {
    id: newId,
    username: email.split('@')[0],
    display_name: fullName,
    bio: '',
    title: 'Lifelong Learner',
    location_city: '',
    location_country: '',
    skills: [],
    learning_goals: [],
    mentorship_status: 'none'
  };
  localStorage.setItem('supabase_mock_learners_data', JSON.stringify(learners));

  const session = {
    access_token: "mock-token-" + newId,
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock-refresh-" + newId,
    user: {
      id: newId,
      email,
      user_metadata: {
        full_name: fullName,
        avatar_url: avatarUrl,
        role: role
      }
    }
  };
  localStorage.setItem('supabase_mock_session', JSON.stringify(session));
  notifyListeners('SIGNED_IN', session);

  return { data: { user: session.user, session }, error: null };
};

const signInMock = (params: any) => {
  initMockDatabase();
  const { email, password } = params;
  
  const users = JSON.parse(localStorage.getItem('supabase_mock_users') || '[]');
  const user = users.find((u: any) => u.email === email);
  
  if (!user) {
    // Conveniently auto-register any test login to provide seamless user onboarding!
    return signUpMock({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
          role: 'learner'
        }
      }
    });
  }

  const profiles = JSON.parse(localStorage.getItem('supabase_mock_profiles') || '{}');
  const userProfile = profiles[user.id] || { id: user.id, email, role: user.role, full_name: user.fullName };

  const session = {
    access_token: "mock-token-" + user.id,
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock-refresh-" + user.id,
    user: {
      id: user.id,
      email,
      user_metadata: {
        full_name: userProfile.full_name || user.fullName,
        avatar_url: userProfile.avatar_url || `https://i.pravatar.cc/150?u=${email}`,
        role: user.role
      }
    }
  };
  localStorage.setItem('supabase_mock_session', JSON.stringify(session));
  notifyListeners('SIGNED_IN', session);

  return { data: { user: session.user, session }, error: null };
};

const signInOAuthMock = (params: any) => {
  initMockDatabase();
  const provider = params?.provider || 'google';
  const email = `${provider}@example.com`;
  return signInMock({ email, password: 'password' });
};

const signOutMock = () => {
  localStorage.removeItem('supabase_mock_session');
  notifyListeners('SIGNED_OUT', null);
};

// --- Mock Query Builder ---
class MockQueryBuilder {
  private tableName: string;
  private selectFields: string = '*';
  private filters: { [key: string]: any } = {};
  private updateValues: any = null;
  private insertValues: any[] = [];
  private isSingle = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields: string = '*') {
    this.selectFields = fields;
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  update(values: any) {
    this.updateValues = values;
    return this;
  }

  insert(values: any[]) {
    this.insertValues = values;
    return this;
  }

  private async executeLocal() {
    initMockDatabase();
    
    const key = `supabase_mock_${this.tableName}`;
    let tableData: { [id: string]: any } = {};
    try {
      tableData = JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
      tableData = {};
    }

    if (this.updateValues !== null) {
      const updatedRows: any[] = [];
      for (const id in tableData) {
        let match = true;
        for (const col in this.filters) {
          if (tableData[id][col] !== this.filters[col] && id !== this.filters[col]) {
            match = false;
          }
        }
        if (match) {
          tableData[id] = { ...tableData[id], ...this.updateValues, updated_at: new Date().toISOString() };
          updatedRows.push(tableData[id]);
        }
      }
      localStorage.setItem(key, JSON.stringify(tableData));
      return { data: this.isSingle ? (updatedRows[0] || null) : updatedRows, error: null };
    }

    if (this.insertValues.length > 0) {
      const insertedRows: any[] = [];
      for (const val of this.insertValues) {
        const rowId = val.id || Math.random().toString(36).substring(2, 11);
        const existing = tableData[rowId] || {};
        tableData[rowId] = { ...existing, ...val, id: rowId, updated_at: new Date().toISOString() };
        insertedRows.push(tableData[rowId]);
      }
      localStorage.setItem(key, JSON.stringify(tableData));
      return { data: this.isSingle ? (insertedRows[0] || null) : insertedRows, error: null };
    }

    // Select row(s)
    const results: any[] = [];
    for (const id in tableData) {
      let match = true;
      for (const col in this.filters) {
        if (tableData[id][col] !== this.filters[col] && (col !== 'id' || id !== this.filters[col])) {
          match = false;
        }
      }
      if (match) {
        results.push(tableData[id]);
      }
    }

    // fallback when querying dynamic user profiles that aren't created yet
    if (results.length === 0 && this.tableName === 'profiles') {
      const userId = this.filters['id'];
      if (userId) {
        const session = getMockSession().data.session;
        if (session && session.user.id === userId) {
          const newProfile = { id: userId, email: session.user.email, role: 'learner', full_name: session.user.user_metadata.full_name, avatar_url: session.user.user_metadata.avatar_url };
          tableData[userId] = newProfile;
          localStorage.setItem(key, JSON.stringify(tableData));
          results.push(newProfile);
        }
      }
    }

    if (this.isSingle) {
      return { data: results[0] || null, error: results[0] ? null : { message: "Record not found" } };
    }

    return { data: results, error: null };
  }

  // Support thenable execution (await)
  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.executeLocal().then(onfulfilled, onrejected);
  }
}

// --- Hybrid/Proxy Query Builder ---
class HybridQueryBuilder {
  private tableName: string;
  private realBuilder: any;
  private mockBuilder: MockQueryBuilder;
  private selectFields: string = '*';
  private eqFilters: Array<[string, any]> = [];
  private isSingle = false;
  private isUpdate = false;
  private isInsert = false;
  private updateValues: any = null;
  private insertValues: any[] = [];

  constructor(tableName: string) {
    this.tableName = tableName;
    this.mockBuilder = new MockQueryBuilder(tableName);
    if (realSupabase) {
      try {
        this.realBuilder = realSupabase.from(tableName);
      } catch (e) {
        this.realBuilder = null;
      }
    }
  }

  select(fields: string = '*') {
    this.selectFields = fields;
    if (this.realBuilder) {
      try {
        this.realBuilder = this.realBuilder.select(fields);
      } catch (e) {}
    }
    this.mockBuilder.select(fields);
    return this;
  }

  eq(column: string, value: any) {
    this.eqFilters.push([column, value]);
    if (this.realBuilder) {
      try {
        this.realBuilder = this.realBuilder.eq(column, value);
      } catch (e) {}
    }
    this.mockBuilder.eq(column, value);
    return this;
  }

  single() {
    this.isSingle = true;
    if (this.realBuilder) {
      try {
        this.realBuilder = this.realBuilder.single();
      } catch (e) {}
    }
    this.mockBuilder.single();
    return this;
  }

  update(values: any) {
    this.isUpdate = true;
    this.updateValues = values;
    if (this.realBuilder) {
      try {
        this.realBuilder = this.realBuilder.update(values);
      } catch (e) {}
    }
    this.mockBuilder.update(values);
    return this;
  }

  insert(values: any[]) {
    this.isInsert = true;
    this.insertValues = values;
    if (this.realBuilder) {
      try {
        this.realBuilder = this.realBuilder.insert(values);
      } catch (e) {}
    }
    this.mockBuilder.insert(values);
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      if (isOffline) {
        throw new Error("Client is offline");
      }
      if (!this.realBuilder) {
        throw new Error("Real database client not available");
      }
      const res = await this.realBuilder;
      if (res.error && isFetchError(res.error)) {
        throw res.error;
      }
      if (onfulfilled) {
        return onfulfilled(res);
      }
      return res;
    } catch (err: any) {
      if (isFetchError(err)) {
        isOffline = true;
        console.warn("[Supabase] Network query failed, switching fallback database to Local Mode:", err);
      }
      const mockRes = await this.mockBuilder;
      if (onfulfilled) {
        return onfulfilled(mockRes);
      }
      return mockRes;
    }
  }
}

// --- Composite/Unified Client Export ---
export const supabase = {
  auth: {
    async getSession() {
      try {
        if (isOffline) throw new Error("Client is offline");
        if (!realSupabase) throw new Error("Real client offline");
        const res = await realSupabase.auth.getSession();
        if (res.error && isFetchError(res.error)) {
          throw res.error;
        }
        return res;
      } catch (err: any) {
        if (isFetchError(err)) {
          isOffline = true;
          console.warn("[Supabase] auth.getSession failed, continuing with Local Session Mode:", err);
        }
        return getMockSession();
      }
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      let realSubscription: any = null;
      if (realSupabase) {
        try {
          const res = realSupabase.auth.onAuthStateChange((event: string, session: any) => {
            if (!isOffline) {
              callback(event, session);
            }
          });
          realSubscription = res?.data?.subscription;
        } catch (e) {}
      }

      mockListeners.add(callback);

      // Trigger initial call with fallback if offline
      const currentSession = getMockSession().data.session;
      if (currentSession) {
        try {
          callback('SIGNED_IN', currentSession);
        } catch (e) {}
      }

      return {
        data: {
          subscription: {
            unsubscribe() {
              if (realSubscription) {
                try {
                  realSubscription.unsubscribe();
                } catch (e) {}
              }
              mockListeners.delete(callback);
            }
          }
        }
      };
    },

    async signUp(params: any) {
      try {
        if (isOffline) throw new Error("Client is offline");
        if (!realSupabase) throw new Error("Real client offline");
        const res = await realSupabase.auth.signUp(params);
        if (res.error && isFetchError(res.error)) {
          throw res.error;
        }
        return res;
      } catch (err: any) {
        if (isFetchError(err)) {
          isOffline = true;
          console.warn("[Supabase] auth.signUp failed, continuing with Local Signup:", err);
        }
        return signUpMock(params);
      }
    },

    async signInWithPassword(params: any) {
      try {
        if (isOffline) throw new Error("Client is offline");
        if (!realSupabase) throw new Error("Real client offline");
        const res = await realSupabase.auth.signInWithPassword(params);
        if (res.error && isFetchError(res.error)) {
          throw res.error;
        }
        return res;
      } catch (err: any) {
        if (isFetchError(err)) {
          isOffline = true;
          console.warn("[Supabase] auth.signInWithPassword failed, continuing with Local Authentication:", err);
        }
        return signInMock(params);
      }
    },

    async signInWithOAuth(params: any) {
      try {
        if (isOffline) throw new Error("Client is offline");
        if (!realSupabase) throw new Error("Real client offline");
        const res = await realSupabase.auth.signInWithOAuth(params);
        if (res.error && isFetchError(res.error)) {
          throw res.error;
        }
        return res;
      } catch (err: any) {
        if (isFetchError(err)) {
          isOffline = true;
          console.warn("[Supabase] auth.signInWithOAuth failed, continuing with Local OAuth Simulation:", err);
        }
        return signInOAuthMock(params);
      }
    },

    async signOut() {
      try {
        if (!isOffline && realSupabase) {
          await realSupabase.auth.signOut();
        }
      } catch (err: any) {
        if (isFetchError(err)) {
          isOffline = true;
        }
      }
      signOutMock();
      return { error: null };
    }
  },

  from(tableName: string) {
    return new HybridQueryBuilder(tableName);
  }
};
