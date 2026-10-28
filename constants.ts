
import { Course, UserProfile, Job, FullInstitutionData, CommunityPost, Mentor, Club, UserSettings, Program, InstructorSettings, MentorshipMeeting, SubscriptionTier } from './types';
import BookOpenIcon from './components/icons/BookOpenIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import TrophyIcon from './components/icons/TrophyIcon';

export const courses: Course[] = [
  {
    id: 'react-mastery',
    title: 'Advanced React & State Management',
    instructor: 'Jane Doe',
    instructorImage: 'https://i.pravatar.cc/150?u=janedoe',
    imageUrl: 'https://picsum.photos/seed/react/600/400',
    progress: 75,
    offeredBy: 'instructor',
    instructorCredentials: 'M.Sc. in Computer Science, 10+ Years React Specialist',
    instructorCountry: 'South Africa',
    category: 'Web Development',
    description: 'Master advanced React concepts including hooks, context, performance optimization, and popular state management libraries like Redux and Zustand.',
    level: 'Advanced',
    price: 99.99,
    rating: 4.8,
    reviews: 2450,
    duration: '20 hours',
    university: 'Tech University',
    universityLogo: 'https://picsum.photos/seed/techu/100/40',
    certificateType: 'Micro-Credential',
    videoTrailerUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
    statusLabel: 'Self-Paced',
    language: 'English',
    coupons: [
        { code: 'REACT25', discount: 25, type: 'percentage' },
        { code: 'SAVE10', discount: 10, type: 'fixed' }
    ],
    learningOutcomes: [
        'Master advanced hooks like useReducer and useContext.',
        'Implement complex state management with Redux Toolkit.',
        'Optimize React application performance with memoization.',
        'Utilize code splitting and lazy loading for faster load times.'
    ],
    testimonials: [
        { id: 't1', name: 'Mike P.', avatarUrl: 'https://i.pravatar.cc/150?u=mikep', quote: 'This course took my React skills to a whole new level. Highly recommended for any serious developer!' },
    ],
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Deep Dive into Hooks',
        lessons: [
          { 
            id: 'l1a', 
            title: 'useState and useEffect In-Depth', 
            duration: '25 min', 
            isCompleted: true, 
            format: 'video',
            videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
            checklist: [
                { id: 'c1', text: 'Understand what useState returns', isCompleted: true },
                { id: 'c2', text: 'Practice updating state with setCount', isCompleted: true },
                { id: 'c3', text: 'Identify the purpose of the useEffect dependency array', isCompleted: false },
            ],
            resources: [
              { id: 'r1', name: 'Official React Hooks FAQ', url: '#', format: 'link' },
              { id: 'r2', name: 'Code Sandbox Example', url: '#', format: 'zip' },
            ],
            transcript: `Welcome to our deep dive on two of the most fundamental hooks in React: useState and useEffect.

First, let's talk about useState. Before hooks, managing state in functional components was not possible. We had to use class components. But useState changed everything. It allows you to add state to your functional components with a simple function call. When you call useState, you pass the initial state, and it returns an array with two elements: the current state value, and a function to update it. For example, 'const [count, setCount] = useState(0);' initializes a state variable 'count' to 0 and gives you 'setCount' to change it. Every time you call 'setCount', React re-renders your component with the new state value.

Now, let's move on to useEffect. This hook lets you perform side effects in your components. What are side effects? Things like fetching data from an API, setting up a subscription, or manually changing the DOM. By default, useEffect runs after every single render. However, you can control when it runs by passing a second argument: a dependency array. If you pass an empty array [], the effect will only run once, after the initial render. This is perfect for one-time setups. If you pass variables in the array, like [count], the effect will run only when those variables change. This is incredibly powerful for creating responsive and efficient components.`,
            discussion: [
                { 
                    id: 'd1', 
                    author: 'Chris G.', 
                    avatarUrl: 'https://i.pravatar.cc/150?u=chrisg', 
                    timestamp: '2 days ago', 
                    text: 'I\'m a bit confused about the dependency array in useEffect. When should I leave it empty?',
                    replies: [
                        {
                            id: 'r1',
                            author: 'Jane Doe',
                            avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
                            timestamp: '1 day ago',
                            text: 'Great question, Chris! You leave it empty when you want the effect to run only once, after the initial render, similar to componentDidMount in class components.',
                            replies: []
                        }
                    ]
                },
                 { 
                    id: 'd2', 
                    author: 'Emily R.', 
                    avatarUrl: 'https://i.pravatar.cc/150?u=emilyr', 
                    timestamp: '3 days ago', 
                    text: 'Can I call useState inside a conditional block?',
                    replies: [
                         {
                            id: 'r2',
                            author: 'Jane Doe',
                            avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
                            timestamp: '3 days ago',
                            text: 'Good question! No, you must always call hooks at the top level of your React function. The order of hook calls needs to be the same on every render.',
                            replies: []
                        }
                    ]
                }
            ]
          },
          { id: 'l1b', title: 'useReducer for Complex State', duration: '30 min', isCompleted: true, format: 'reading' },
          { id: 'l1c', title: 'Module 1 Quiz', duration: '20 min', isCompleted: false, format: 'quiz', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Performance Optimization',
        prerequisites: ['m1'],
        lessons: [
          { id: 'l2a', title: 'Memoization with useMemo & useCallback', duration: '22 min', isCompleted: true, format: 'video', videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', isLocked: false },
          { id: 'l2b', title: 'Code Splitting with React.lazy', duration: '18 min', isCompleted: true, format: 'video', videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', isLocked: false },
          { id: 'l2c', title: 'React Profiler', duration: '15 min', isCompleted: false, format: 'reading', isLocked: false },
          { id: 'l2d', title: 'Live Q&A Session', duration: '60 min', isCompleted: false, format: 'live-session', isLocked: false, sessionTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), liveSessionUrl: 'https://meet.google.com/abc-xyz-pqr' },
        ],
      },
       {
        id: 'm-extra',
        title: 'Module 3: Advanced Concepts',
        lessons: [
          { id: 'l-vr', title: 'Advanced Code Review', duration: '45 min', isCompleted: false, format: 'video', videoUrl: 'https://www.youtube.com/watch?v=cZp9S88AnM0', isLocked: true },
          { id: 'l-aq', title: 'Adaptive Hooks Assessment', duration: '30 min', isCompleted: false, format: 'adaptive-quiz', isLocked: true },
        ],
      },
      {
        id: 'm-final',
        title: 'Module 4: Final Project',
        prerequisites: ['m2'],
        lessons: [
            { id: 'l-proj', title: 'Project: Build a To-Do App with Redux', duration: '4 hours', isCompleted: false, format: 'project', deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'l-final-exam', title: 'Final Exam: Advanced React Concepts', duration: '1 hour', isCompleted: false, format: 'quiz', deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() },
        ],
      },
    ],
  },
  {
    id: 'ai-ux-design',
    title: 'AI-Powered UX/UI Design',
    instructor: 'John Smith',
    instructorImage: 'https://i.pravatar.cc/150?u=johnsmith',
    imageUrl: 'https://picsum.photos/seed/ai-ux/600/400',
    progress: 40,
    offeredBy: 'instructor',
    instructorCredentials: 'AI UX Lead Designer & Cognitive Ethicist',
    instructorCountry: 'Nigeria',
    category: 'Design',
    description: 'Learn how to leverage artificial intelligence in your design workflow to create smarter, more personalized user experiences. Explore AI tools for ideation, prototyping, and user testing.',
    level: 'Intermediate',
    price: 49.99,
    rating: 4.6,
    reviews: 1800,
    duration: '15 hours',
    university: 'Design Institute',
    universityLogo: 'https://picsum.photos/seed/designi/100/40',
    certificateType: 'Certificate',
    videoTrailerUrl: 'https://www.youtube.com/watch?v=cZp9S88AnM0',
    statusLabel: 'Self-Paced',
    language: 'English',
     learningOutcomes: [
        'Integrate AI tools into your design workflow.',
        'Generate design ideas and prototypes using AI.',
        'Analyze user data with AI for better insights.',
        'Understand the ethics of AI in design.'
    ],
    testimonials: [
        { id: 't2', name: 'Emily R.', avatarUrl: 'https://i.pravatar.cc/150?u=emilyr', quote: 'A game-changer for my design process. The future of UX is here, and this course shows you the way.' },
    ],
    modules: [
      {
        id: 'm3',
        title: 'Module 1: Foundations of AI in Design',
        lessons: [
          { id: 'l3a', title: 'Introduction to Generative AI', duration: '20 min', isCompleted: true, format: 'video', videoUrl: 'https://www.youtube.com/watch?v=cZp9S88AnM0', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'l3b', title: 'AI for User Research', duration: '25 min', isCompleted: false, format: 'reading' },
        ],
      },
    ],
  },
  {
    id: 'data-science-python',
    title: 'Data Science with Python',
    instructor: 'Emily White',
    instructorImage: 'https://i.pravatar.cc/150?u=emilywhite',
    imageUrl: 'https://picsum.photos/seed/python-ds/600/400',
    progress: 100,
    offeredBy: 'institution',
    institutionName: 'State University',
    facultyName: 'Faculty of Science & Computing',
    campusName: 'Main Campus',
    qualificationType: 'Professional Certificate',
    category: 'Data Science',
    description: 'A comprehensive guide to data analysis and machine learning using Python. Cover libraries like Pandas, NumPy, Scikit-learn, and TensorFlow.',
    level: 'Beginner',
    price: 0,
    rating: 4.9,
    reviews: 5200,
    duration: '30 hours',
    university: 'State University',
    universityLogo: 'https://picsum.photos/seed/stateu/100/40',
    certificateType: 'Certificate',
    videoTrailerUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    statusLabel: 'Self-Paced',
    language: 'Spanish',
     learningOutcomes: [
        'Analyze data effectively using Pandas and NumPy.',
        'Build predictive models with Scikit-learn.',
        'Visualize data with Matplotlib and Seaborn.',
        'Understand the fundamentals of machine learning.'
    ],
    testimonials: [
        { id: 't3', name: 'Chris G.', avatarUrl: 'https://i.pravatar.cc/150?u=chrisg', quote: 'The best free data science course I have ever taken. The content is top-notch and Emily is a wonderful teacher.' },
    ],
    modules: [
       {
        id: 'm4',
        title: 'Module 1: Python & NumPy',
        lessons: [
          { id: 'l4a', title: 'Python Fundamentals', duration: '45 min', isCompleted: true, format: 'video', videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
          { id: 'l4b', title: 'NumPy Arrays', duration: '35 min', isCompleted: true, format: 'reading' },
        ],
      },
      {
        id: 'm5',
        title: 'Module 2: Pandas DataFrames',
        lessons: [
          { id: 'l5a', title: 'Intro to Pandas', duration: '40 min', isCompleted: true, format: 'video', videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
          { id: 'l5b', title: 'Final Project', duration: '50 min', isCompleted: false, format: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'cloud-computing',
    title: 'Introduction to Cloud Computing',
    instructor: 'Michael Brown',
    instructorImage: 'https://i.pravatar.cc/150?u=michaelbrown',
    imageUrl: 'https://picsum.photos/seed/cloud/600/400',
    progress: 0,
    offeredBy: 'institution',
    institutionName: 'Cloud Academy',
    facultyName: 'Department of Engineering & DevOps',
    campusName: 'Digital Innovation Hub',
    qualificationType: 'Micro-Credential',
    category: 'Cloud & DevOps',
    description: 'Understand the fundamentals of cloud computing, including IaaS, PaaS, and SaaS. Get an overview of major providers like AWS, Azure, and GCP.',
    level: 'Beginner',
    price: 0,
    rating: 4.7,
    reviews: 3100,
    duration: '12 hours',
    university: 'Cloud Academy',
    universityLogo: 'https://picsum.photos/seed/clouda/100/40',
    certificateType: 'Certificate',
    videoTrailerUrl: 'https://www.youtube.com/watch?v=M988_fsOSWo',
    statusLabel: 'Self-Paced',
    language: 'English',
    learningOutcomes: [
        'Understand core cloud computing concepts (IaaS, PaaS, SaaS).',
        'Compare and contrast major cloud providers like AWS, Azure, and GCP.',
        'Grasp the fundamentals of cloud security and compliance.',
        'Explore common cloud services for compute, storage, and networking.'
    ],
    testimonials: [
        { id: 't4', name: 'Sarah L.', avatarUrl: 'https://i.pravatar.cc/150?u=sarahl', quote: 'This course was the perfect introduction to the cloud. The concepts were explained clearly and concisely. Highly recommended!' },
        { id: 't5', name: 'David C.', avatarUrl: 'https://i.pravatar.cc/150?u=davidc', quote: 'Michael is a fantastic instructor. He breaks down complex topics into easy-to-understand parts. I feel much more confident about cloud technology now.' }
    ],
    modules: [
       {
        id: 'm6',
        title: 'Module 1: Cloud Concepts',
        lessons: [
          { id: 'l6a', title: 'What is the Cloud?', duration: '20 min', isCompleted: false, format: 'video', videoUrl: 'https://www.youtube.com/watch?v=M988_fsOSWo' },
          { id: 'l6b', title: 'Service Models', duration: '25 min', isCompleted: false, format: 'reading' },
        ],
      },
    ],
  },
];

export const userProfile: UserProfile = {
  name: 'Alex Turner',
  displayName: 'Alex T.',
  username: 'alex_turner',
  academicInstitution: 'State University',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
  coverImageUrl: 'https://picsum.photos/seed/profile-banner/1200/300',
  bio: "Passionate lifelong learner exploring the intersection of technology and design. Currently diving deep into AI-powered UX and advanced state management in React. My goal is to build intuitive, user-centric applications that make a positive impact.",
  contact: {
    email: 'alex.turner@example.com',
  },
  location: {
    city: 'San Francisco',
    country: 'USA',
  },
  skills: ['React', 'TypeScript', 'UX/UI Design', 'State Management', 'Figma', 'Generative AI'],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/alex-turner',
    github: 'https://github.com/alex-turner',
    behance: 'https://www.behance.net/alexturner',
    portfolio: 'https://alex-turner-portfolio.com',
  },
  education: [
    { id: 'edu1', institution: 'Tech University', degree: 'B.S. in Computer Science', period: '2018 - 2022' },
  ],
  title: 'Lifelong Learner & Frontend Developer',
  coursesInProgress: 3,
  coursesCompleted: 1,
  achievements: [
    { id: 'ach1', name: 'First Steps', description: 'Completed your first lesson.', Icon: BookOpenIcon, color: 'bg-green-500' },
    { id: 'ach2', name: 'Curious Mind', description: 'Asked a question to the AI Tutor.', Icon: SparklesIcon, color: 'bg-purple-500' },
    { id: 'ach3', name: 'Pythonista', description: 'Completed the Data Science with Python course.', Icon: TrophyIcon, color: 'bg-blue-500' },
    { id: 'ach4', name: 'Course Conqueror', description: 'Finish your first course.', Icon: TrophyIcon, color: 'bg-yellow-500' },
    { id: 'ach5', name: 'Lesson Leader', description: 'Complete a lesson and take a step forward.', Icon: TrophyIcon, color: 'bg-teal-500' },
  ],
  certificates: [
    { id: 'cert1', courseId: 'data-science-python', courseTitle: 'Data Science with Python', issuedDate: '2024-05-20', transactionHash: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b', linkedinShareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.com' },
  ],
  learningGoals: [
    'Master React State Management',
    'Build a full-stack MERN application',
    'Contribute to an open-source project',
  ],
  mentorshipStatus: 'offering',
  targetCareer: 'Frontend Developer',
};

export const userSettings: UserSettings = {
    account: {
        email: 'alex.turner@example.com',
        phone: '+1 (555) 123-4567',
        twoFactorEnabled: true,
        connectedAccounts: ['google', 'linkedin'],
    },
    learning: {
        language: 'en-US',
        subtitles: true,
        videoSpeed: 1,
        videoQuality: 'auto',
        autoPlay: true,
    },
    notifications: {
        reminders: true,
        certificates: true,
        offers: false,
        forum: 'highlights',
    },
    privacy: {
        profileVisibility: 'public',
        showCompletedCourses: true,
        showAchievements: true,
    },
    payment: {
        plan: 'Premium Annual',
        paymentMethods: [
            { type: 'credit_card', last4: '4242', expiry: '12/26' },
        ],
        billingHistory: [
            { id: 'inv1', date: '2024-06-01', amount: 120.00, invoiceUrl: '#' },
            { id: 'inv2', date: '2023-06-01', amount: 120.00, invoiceUrl: '#' },
        ],
    },
    accessibility: {
        highContrast: false,
    },
    support: {
        lastDataExportRequest: null,
        lastAccountDeletionRequest: null,
    },
};

export const initialInstructorSettings: InstructorSettings = {
    publicProfile: {
        displayName: 'Alex Turner',
        bio: 'Passionate instructor dedicated to making modern JavaScript accessible to everyone. With over 10 years of experience in frontend development, I specialize in React, performance optimization, and building scalable applications.',
        socialLinks: {
            twitter: 'https://twitter.com/alexturner',
            website: 'https://alextuner.dev',
        },
        achievements: [
            { id: 'ach-instr-1', name: 'Top Instructor', description: 'Rated in the top 5% of instructors on the platform.', Icon: TrophyIcon, color: 'bg-amber-500' },
            { id: 'ach-instr-2', name: 'Course Creator', description: 'Published over 5 courses.', Icon: BookOpenIcon, color: 'bg-blue-500' },
        ],
        certifications: [
            { id: 'cert-instr-1', courseId: 'react-adv', courseTitle: 'Advanced React Certified Developer', issuedDate: '2023-01-15', transactionHash: '0xabc123def456', linkedinShareUrl: '#' },
        ],
        accreditations: [
            'Certified Web Development Professional (WDP)',
            'Official JavaScript Educator',
        ],
        licenses: [
            'State Teaching License #12345',
        ],
        resumeUrl: '/documents/alex-turner-cv.pdf',
    },
    payout: {
        method: 'paypal',
        paypalEmail: 'alex.t@paypal.com',
        stripeConnected: false,
    },
    notifications: {
        studentJoins: true,
        courseReviews: true,
        newEnrollments: true,
    },
};

export const recommendedJobs: Job[] = [
    { id: 'job1', title: 'Frontend Developer', company: 'Innovate Inc.', location: 'Remote', matchPercentage: 92, skills: ['React', 'TypeScript', 'State Management', 'HTML', 'CSS'] },
    { id: 'job2', title: 'UX/UI Designer', company: 'Creative Solutions', location: 'New York, NY', matchPercentage: 78, skills: ['UX/UI Design', 'Figma', 'Generative AI', 'User Research'] },
    { id: 'job3', title: 'Data Scientist', company: 'DataDriven Co.', location: 'San Francisco, CA', matchPercentage: 65, skills: ['Python', 'Data Science', 'Machine Learning'] },
     { id: 'job4', title: 'React Native Developer', company: 'MobileFirst', location: 'Remote', matchPercentage: 88, skills: ['React', 'State Management', 'Mobile Development'] },
];

export const instructorCourses: Course[] = [
  {
    id: 'course-builder-1',
    title: 'Modern JavaScript from Scratch',
    instructor: 'Alex Turner',
    imageUrl: 'https://picsum.photos/seed/js-course/600/400',
    progress: 0,
    category: 'Web Development',
    description: 'A comprehensive course on modern JavaScript for beginners.',
    isDraft: false,
    priceType: 'one-time',
    price: 49.99,
    analytics: {
        totalStudents: 1250,
        completionRate: 68,
        totalRevenue: 62487.50,
        engagement: [
            { month: 'Jan', students: 150 }, { month: 'Feb', students: 200 }, { month: 'Mar', students: 350 },
            { month: 'Apr', students: 300 }, { month: 'May', students: 250 },
        ],
        dropoutRates: [
            { lesson: 'Variables', dropoutPercentage: 5 },
            { lesson: 'Functions', dropoutPercentage: 8 },
            { lesson: 'Objects', dropoutPercentage: 15 },
            { lesson: 'Arrays', dropoutPercentage: 12 },
            { lesson: 'Promises', dropoutPercentage: 25 },
        ]
    },
    modules: [
      {
        id: 'm1-instr',
        title: 'Module 1: The Basics',
        lessons: [
          { 
            id: 'l1a-instr', 
            title: 'Variables and Data Types', 
            duration: '15 min', 
            isCompleted: false, 
            format: 'video',
            checklist: [
                { id: 'ic1', text: 'Define a variable using `let`', isCompleted: false },
                { id: 'ic2', text: 'Define a constant using `const`', isCompleted: false },
            ],
            resources: [
              { id: 'ir1', name: 'MDN Docs on Variables', url: '#', format: 'link'}
            ]
          },
          { 
            id: 'l1b-instr', 
            title: 'Weekly Office Hours', 
            duration: '60 min', 
            isCompleted: false, 
            format: 'live-session',
            sessionTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            liveSessionUrl: 'https://meet.google.com/def-uvw-stu',
          },
        ]
      }
    ]
  },
  {
    id: 'course-builder-2',
    title: 'Introduction to Python for AI',
    instructor: 'Alex Turner',
    imageUrl: 'https://picsum.photos/seed/py-ai/600/400',
    progress: 0,
    category: 'Data Science',
    description: 'Learn the fundamentals of Python and how it applies to Artificial Intelligence.',
    isDraft: true,
    priceType: 'free',
    price: 0,
     analytics: {
        totalStudents: 340,
        completionRate: 82,
        totalRevenue: 0,
        engagement: [
            { month: 'Jan', students: 50 }, { month: 'Feb', students: 80 }, { month: 'Mar', students: 120 },
            { month: 'Apr', students: 90 },
        ],
        dropoutRates: [
            { lesson: 'Intro', dropoutPercentage: 2 },
            { lesson: 'Syntax', dropoutPercentage: 5 },
            { lesson: 'Loops', dropoutPercentage: 10 },
            { lesson: 'AI Concepts', dropoutPercentage: 8 },
        ]
    },
    modules: [],
  }
];

export const seekingMentorshipLearners: UserProfile[] = [
  {
    name: 'Sarah Connor',
    username: 'sarah_connor',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarahconnor',
    title: 'Aspiring Full Stack Developer',
    coursesInProgress: 4,
    coursesCompleted: 2,
    mentorshipStatus: 'seeking',
    targetCareer: 'Full Stack Developer',
    bio: "Eager to learn backend technologies and combine them with my frontend skills. Looking for guidance on building scalable applications.",
    achievements: [],
    certificates: [],
  },
  {
    name: 'Kyle Reese',
    username: 'kyle_reese',
    avatarUrl: 'https://i.pravatar.cc/150?u=kylereese',
    title: 'UX/UI Design Student',
    coursesInProgress: 2,
    coursesCompleted: 1,
    mentorshipStatus: 'seeking',
    targetCareer: 'UX/UI Designer',
    bio: "Passionate about creating intuitive user interfaces. I'm seeking a mentor to help me build a strong portfolio and navigate the design industry.",
    achievements: [],
    certificates: [],
  },
  {
    name: 'John Anderton',
    username: 'john_anderton',
    avatarUrl: 'https://i.pravatar.cc/150?u=johnanderton',
    title: 'Cybersecurity Enthusiast',
    coursesInProgress: 5,
    coursesCompleted: 3,
    mentorshipStatus: 'seeking',
    targetCareer: 'Cybersecurity Analyst',
    bio: "Deeply interested in ethical hacking and network security. Looking for a mentor to guide my career path in the cybersecurity field.",
    achievements: [],
    certificates: [],
  },
];

export const interests = [
    { name: 'Web Development', icon: '💻' },
    { name: 'Data Science', icon: '📊' },
    { name: 'AI & Machine Learning', icon: '🤖' },
    { name: 'Design', icon: '🎨' },
    { name: 'Business', icon: '📈' },
    { name: 'Marketing', icon: '📢' },
    { name: 'Cloud & DevOps', icon: '☁️' },
    { name: 'Cybersecurity', icon: '🛡️' },
    { name: 'Mobile Development', icon: '📱' },
    { name: 'Game Development', icon: '🎮' },
    { name: 'Health & Wellness', icon: '❤️' },
    { name: 'Finance', icon: '💰' },
];

export const motivationalQuotes = [
    "The secret to getting ahead is getting started.",
    "The beautiful thing about learning is that nobody can take it away from you.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    "Don't watch the clock; do what it does. Keep going.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there."
];

const institutionalCourses: Course[] = [
    {
        id: 'inst-react-mastery',
        title: 'Advanced React & State Management',
        instructor: 'Dr. Evelyn Reed',
        imageUrl: 'https://picsum.photos/seed/react/600/400',
        progress: 0,
        offeredBy: 'institution',
        institutionName: 'CogniSacra Academy',
        facultyName: 'Faculty of Computer Science',
        campusName: 'Main Campus',
        qualificationType: 'Professional Certificate',
        category: 'Web Development',
        description: 'Master advanced React concepts including hooks, context, performance optimization, and popular state management libraries like Redux and Zustand.',
        level: 'Advanced',
        price: 199.99,
        status: 'active',
        statusLabel: 'Online',
        modules: [],
    },
    {
        id: 'inst-ai-ux-design',
        title: 'AI-Powered UX/UI Design',
        instructor: 'Dr. Evelyn Reed',
        imageUrl: 'https://picsum.photos/seed/ai-ux/600/400',
        progress: 0,
        offeredBy: 'institution',
        institutionName: 'CogniSacra Academy',
        facultyName: 'Department of UX Design',
        campusName: 'Digital Innovation Hub',
        qualificationType: 'Micro-Credential',
        category: 'Design',
        description: 'Learn how to leverage artificial intelligence in your design workflow to create smarter, more personalized user experiences.',
        level: 'Intermediate',
        price: 149.99,
        status: 'active',
        statusLabel: 'Online',
        modules: [],
    },
    {
        id: 'inst-upcoming-cloud',
        title: 'Advanced Cloud Architecture',
        instructor: 'Prof. Samuel Jones',
        imageUrl: 'https://picsum.photos/seed/adv-cloud/600/400',
        progress: 0,
        offeredBy: 'institution',
        institutionName: 'CogniSacra Academy',
        facultyName: 'Faculty of Computer Science',
        campusName: 'Regional Innovation Campus',
        qualificationType: 'Degree Pathway',
        category: 'Cloud & DevOps',
        description: 'Design and deploy scalable, resilient, and secure applications on major cloud platforms.',
        level: 'Advanced',
        price: 249.99,
        status: 'upcoming',
        statusLabel: 'Coming Soon',
        modules: [],
    },
    {
        id: 'inst-archived-data',
        title: 'Introduction to Data Mining (2022)',
        instructor: 'Prof. Samuel Jones',
        imageUrl: 'https://picsum.photos/seed/data-mine/600/400',
        progress: 0,
        offeredBy: 'institution',
        institutionName: 'CogniSacra Academy',
        facultyName: 'Department of Data Science',
        campusName: 'Main Campus',
        qualificationType: 'Micro-Credential',
        category: 'Data Science',
        description: 'An introductory course on data mining concepts from 2022.',
        level: 'Beginner',
        price: 29.99,
        status: 'archived',
        statusLabel: 'Archived',
        modules: [],
    }
];

const institutionalPrograms: Program[] = [
    {
        id: 'prog1',
        title: 'AI in Business Micro-Credential',
        type: 'Micro-Credential',
        description: 'A 3-course program designed to equip business leaders with AI strategy and implementation skills.'
    },
    {
        id: 'prog2',
        title: 'Full Stack Development Certificate',
        type: 'Professional Certificate',
        description: 'A 6-month intensive program covering everything from frontend React to backend Node.js and databases.'
    }
];

export const fullInstitutionData: FullInstitutionData = {
  name: 'State University',
  profile: {
    tagline: 'Excellence in Digital Education.',
    about: 'Founded in 1950, State University has been a pioneer in accessible and innovative education. Our digital campus offers world-class programs designed to equip learners with the skills needed for the future of work. We are accredited by the National Council for Higher Education.',
    bannerUrl: 'https://picsum.photos/seed/stateu-banner/1600/400',
    website: 'https://stateu.edu',
    social: {
      linkedin: 'https://linkedin.com/school/state-university',
      twitter: 'https://twitter.com/stateu',
    },
    contact: {
      email: 'admissions@stateu.edu',
      phone: '+1 (555) 123-4567',
    },
    supportLinks: {
        faq: 'https://stateu.edu/faq',
        helpDesk: 'https://stateu.edu/help',
        applicationPortal: 'https://stateu.edu/apply',
    },
    faculty: [
      { id: 'f1', name: 'Dr. Evelyn Reed', title: 'Head of Computer Science', avatarUrl: 'https://i.pravatar.cc/150?u=evelynreed', bio: 'Expert in AI and Machine Learning with over 20 years of research experience.' },
      { id: 'f2', name: 'Prof. Samuel Jones', title: 'Lead, Business Analytics', avatarUrl: 'https://i.pravatar.cc/150?u=samueljones', bio: 'Brings a decade of industry experience from Fortune 500 companies to the classroom.' },
    ],
    locations: [
      { id: 'loc1', name: 'Main Campus', address: '123 University Ave, Capital City, USA', imageUrl: 'https://picsum.photos/seed/campus1/400/250' },
      { id: 'loc2', name: 'Digital Innovation Hub', address: '456 Tech Park, Silicon Valley, USA', imageUrl: 'https://picsum.photos/seed/campus2/400/250' },
    ],
    partnerships: [
      { name: 'Innovate Inc.', logoUrl: 'https://picsum.photos/seed/innovate/200/100' },
      { name: 'DataDriven Co.', logoUrl: 'https://picsum.photos/seed/datadriven/200/100' },
    ],
    videoIntroductionUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery: [
      { id: 'gal1', imageUrl: 'https://picsum.photos/seed/gallery1/600/400', caption: 'State-of-the-art library facilities.' },
      { id: 'gal2', imageUrl: 'https://picsum.photos/seed/gallery2/600/400', caption: 'Collaborative student spaces.' },
      { id: 'gal3', imageUrl: 'https://picsum.photos/seed/gallery3/600/400', caption: 'Vibrant campus life.' },
      { id: 'gal4', imageUrl: 'https://picsum.photos/seed/gallery4/600/400', caption: 'Modern engineering labs.' },
    ],
    impactStories: [
      { 
        id: 'story1', 
        title: 'From Classroom to Career', 
        author: 'John Doe, Alumnus 2022', 
        content: 'The skills I learned at State University directly translated to my success at Innovate Inc. The hands-on projects were invaluable.', 
        imageUrl: 'https://picsum.photos/seed/story1/400/250' 
      },
      { 
        id: 'story2', 
        title: 'Groundbreaking Research in AI', 
        author: 'Dr. Evelyn Reed', 
        content: 'Our latest research, published in the Journal of AI, pushes the boundaries of machine learning and was developed right here in our labs.', 
        imageUrl: 'https://picsum.photos/seed/story2/400/250' 
      },
    ],
    testimonials: [
        { 
            id: 'it1', 
            name: 'Sarah L.', 
            avatarUrl: 'https://i.pravatar.cc/150?u=sarahl', 
            quote: 'The flexible online programs allowed me to get a world-class education while working full-time. The faculty is incredibly supportive!',
            rating: 5,
        },
        { 
            id: 'it2', 
            name: 'David C.', 
            avatarUrl: 'https://i.pravatar.cc/150?u=davidc', 
            quote: 'State University\'s career services are top-notch. I landed my dream job at DataDriven Co. thanks to the skills I learned here.',
            rating: 5,
        },
    ],
    mentorshipProgram: {
        description: 'Our award-winning mentorship program connects students with industry experts and esteemed faculty to provide guidance, support, and career advice. All students are encouraged to participate.',
        officeHours: [
            { id: 'oh1', day: 'Monday', time: '2:00 PM - 4:00 PM', facultyName: 'Dr. Evelyn Reed' },
            { id: 'oh2', day: 'Wednesday', time: '10:00 AM - 12:00 PM', facultyName: 'Prof. Samuel Jones' },
            { id: 'oh3', day: 'Friday', time: '1:00 PM - 2:00 PM', facultyName: 'General Advising' },
        ]
    },
  },
  branding: {
    logoUrl: 'https://picsum.photos/seed/stateu-logo/200/60',
    primaryColor: '#A855F7', // purple-500
  },
  settings: {
    customDomain: 'learn.stateu.edu',
    whiteLabel: true,
    multiLanguage: false,
    profileVisibility: 'public',
  },
  analytics: {
    totalLearners: 5280,
    activeCourses: 45,
    certificatesIssued: 1250,
    learnersPlacedInJobs: 452,
    totalRevenue: 752450,
    revenueByCourse: [
        { courseId: 'inst-react-mastery', revenue: 320500 },
        { courseId: 'inst-ai-ux-design', revenue: 250000 },
        { courseId: 'inst-upcoming-cloud', revenue: 150000 },
        { courseId: 'inst-archived-data', revenue: 31950 },
    ],
    progressDistribution: [
      { status: 'Completed', count: 1250 },
      { status: 'In Progress', count: 2530 },
      { status: 'Not Started', count: 1500 },
    ],
    demographicsByDepartment: [
      { department: 'Engineering', count: 2100 },
      { department: 'Business', count: 1500 },
      { department: 'Arts & Sciences', count: 1000 },
      { department: 'Other', count: 680 },
    ],
    demographicsByRegion: [
        { region: 'N. America', count: 2800 },
        { region: 'Europe', count: 1200 },
        { region: 'Asia', count: 800 },
        { region: 'S. America', count: 300 },
        { region: 'Other', count: 180 },
    ],
    demographicsByAge: [
        { ageGroup: '18-24', count: 1500 },
        { ageGroup: '25-34', count: 2500 },
        { ageGroup: '35-44', count: 900 },
        { ageGroup: '45+', count: 380 },
    ],
    employerConnections: [
        { employer: 'Innovate Inc.', learnersHired: 58 },
        { employer: 'DataDriven Co.', learnersHired: 42 },
        { employer: 'TechCorp', learnersHired: 35 },
        { employer: 'Creative Solutions', learnersHired: 28 },
        { employer: 'Global Net', learnersHired: 21 },
    ],
  },
  admins: [
    { id: 'admin1', name: 'Alice Johnson', email: 'alice.j@stateu.edu', role: 'Owner', lastLogin: '2 hours ago' },
    { id: 'admin2', name: 'Bob Williams', email: 'bob.w@stateu.edu', role: 'Admin', lastLogin: '1 day ago' },
  ],
  learners: [
        { id: 'learner1', name: 'John Doe', email: 'john.d@stateu.edu', progress: 85, lastActive: '2 hours ago', department: 'Engineering' },
        { id: 'learner2', name: 'Jane Smith', email: 'jane.s@stateu.edu', progress: 40, lastActive: '1 day ago', department: 'Business' },
        { id: 'learner3', name: 'Peter Jones', email: 'peter.j@stateu.edu', progress: 100, lastActive: '3 days ago', department: 'Engineering' },
        { id: 'learner4', name: 'Mary Johnson', email: 'mary.j@stateu.edu', progress: 15, lastActive: '5 days ago', department: 'Arts & Sciences' },
  ],
  monetization: {
    pricingTiers: [
        { id: 'tier1', name: 'Corporate Bulk License', price: 5000, description: 'Per 100 learners / year' },
        { id: 'tier2', name: 'Departmental Access', price: 1200, description: 'Per 20 learners / year' }
    ],
    scholarshipsEnabled: true,
    discounts: [
        { code: 'STATEU_FALL24', discount: 15, type: 'percentage' },
        { code: 'ALUMNI_50', discount: 50, type: 'fixed' },
    ],
    programBundles: [
        { id: 'bundle1', title: 'Full Stack Development Certificate', courseIds: ['inst-react-mastery', 'inst-upcoming-cloud'], price: 399.99 }
    ],
  },
  courses: institutionalCourses,
  programs: institutionalPrograms,
  communityPosts: [
    {
        id: 'ipost1',
        author: 'StateU Admissions',
        avatarUrl: 'https://picsum.photos/seed/stateu-logo/200/60',
        timestamp: '8 hours ago',
        content: 'Welcome, new and prospective students! Feel free to ask any questions about our programs or campus life here. #Welcome #StateU',
        likes: 55,
        comments: 12,
    },
    {
        id: 'ipost2',
        author: 'Alice Johnson (Admin)',
        avatarUrl: 'https://i.pravatar.cc/150?u=alicej',
        timestamp: '2 days ago',
        content: 'Don\'t forget, enrollment for the upcoming "Advanced Cloud Architecture" course is now open! Secure your spot today.',
        likes: 31,
        comments: 4,
    },
  ],
  rolePermissions: {
    Owner: { editProfile: true, manageCourses: true, viewAnalytics: true, manageTeam: true },
    Admin: { editProfile: true, manageCourses: true, viewAnalytics: true, manageTeam: false },
    'Billing Manager': { editProfile: false, manageCourses: false, viewAnalytics: true, manageTeam: false },
  },
  instructorVerifications: [
    { id: 'iv1', name: 'Dr. Alan Grant', email: 'alan.g@example.com', submittedDate: '2024-07-20' },
    { id: 'iv2', name: 'Dr. Ellie Sattler', email: 'ellie.s@example.com', submittedDate: '2024-07-18' },
  ],
};

export const communityPosts: CommunityPost[] = [
    {
        id: 'post1',
        author: 'Jane Doe',
        avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
        timestamp: '2 hours ago',
        content: 'Just published a new lesson on `useMemo` and `useCallback` in the Advanced React course! Let me know what you think. #react #webdev',
        likes: 42,
        comments: 8,
    },
    {
        id: 'post2',
        author: 'Chris G.',
        avatarUrl: 'https://i.pravatar.cc/150?u=chrisg',
        timestamp: '5 hours ago',
        content: '🎉 Just completed the "Data Science with Python" course and earned my certificate! It was an amazing learning experience. Big thanks to Emily White!',
        likes: 128,
        comments: 15,
    },
    {
        id: 'post3',
        author: 'Alex Turner',
        avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
        timestamp: '1 day ago',
        content: 'I\'m looking for a study buddy for the AI-Powered UX/UI Design course. Anyone interested in teaming up?',
        likes: 23,
        comments: 5,
    },
];

export const mentorshipMeetings: MentorshipMeeting[] = [
    {
      id: 'meet1',
      title: 'Mentorship Check-in',
      with: 'Jane Doe',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'meet2',
      title: 'Project Review',
      with: 'John Smith',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

export const mentors: Mentor[] = [
    { id: 'mentor1', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=janedoe', title: 'Senior Frontend Engineer @ TechCorp', expertise: ['React', 'TypeScript', 'Performance'] },
    { id: 'mentor2', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith', title: 'Principal UX Designer @ Creative AI', expertise: ['UX/UI', 'Generative AI', 'Figma'] },
    { id: 'mentor3', name: 'Emily White', avatarUrl: 'https://i.pravatar.cc/150?u=emilywhite', title: 'Lead Data Scientist @ DataDriven', expertise: ['Python', 'Machine Learning', 'Pandas'] },
];

export const clubs: Club[] = [
    { id: 'club1', name: 'Web Dev Wizards', description: 'A community for passionate frontend and backend developers.', memberCount: 1250, imageUrl: 'https://picsum.photos/seed/club-web/400/200' },
    { id: 'club2', name: 'AI Innovators', description: 'Exploring the frontiers of Artificial Intelligence and Machine Learning.', memberCount: 890, imageUrl: 'https://picsum.photos/seed/club-ai/400/200' },
    { id: 'club3', name: 'Design Thinkers', description: 'For UX/UI designers shaping the future of digital products.', memberCount: 640, imageUrl: 'https://picsum.photos/seed/club-design/400/200' },
];

export const teamMembers = [
  { name: 'Dr. Evelyn Reed', title: 'CEO & Founder', avatarUrl: 'https://i.pravatar.cc/150?u=evelynreed' },
  { name: 'John Smith', title: 'Head of Product', avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith' },
  { name: 'Jane Doe', title: 'Lead Instructor', avatarUrl: 'https://i.pravatar.cc/150?u=janedoe' },
  { name: 'Alex Turner', title: 'Lead Frontend Engineer', avatarUrl: 'https://i.pravatar.cc/150?u=alexturner' },
];

export const learnerSubscriptionTiers: SubscriptionTier[] = [
    {
        name: 'Basic',
        price: 0,
        idealFor: 'Casual learners wanting to explore.',
        features: [
            'Access to all free courses',
            'Basic AI Tutor access',
            'Community forum access',
            'Track progress on courses',
        ],
        objective: 'Start your learning journey.',
        cta: 'Start for Free'
    },
    {
        name: 'Plus',
        price: 15,
        idealFor: 'Dedicated learners aiming for certification.',
        features: [
            'Everything in Basic, plus:',
            'Access to all premium courses',
            'Unlimited AI Tutor sessions',
            'Earn verifiable certificates',
            'Access to Career Hub',
            'AI-powered skill suggestions'
        ],
        objective: 'Accelerate your learning and career.',
        cta: 'Choose Plus',
        featured: true
    },
    {
        name: 'Pro',
        price: 29,
        idealFor: 'Professionals seeking mentorship and advanced tools.',
        features: [
            'Everything in Plus, plus:',
            'Priority access to new courses',
            '1-on-1 mentorship matching',
            'AI Tools Suite access',
            'Download course materials for offline access'
        ],
        objective: 'Master your craft with premium features.',
        cta: 'Choose Pro'
    }
];


export const instructorSubscriptionTiers: SubscriptionTier[] = [
    {
        name: 'Starter Amplify Plan',
        price: 49,
        idealFor: 'Independent trainers beginning their journey and seeking visibility.',
        features: [
            'Personalized Profile Boost: AI-optimized trainer profile highlighting expertise and courses.',
            'Featured Listings (2 per month): Courses spotlighted in learner dashboards.',
            'Basic Email Campaigns: Platform-driven emails recommending the trainer’s courses to targeted learners.',
            'Analytics Snapshot: Monthly report on impressions, clicks, and enrollments.',
            'Community Shoutout: Trainer featured once per month in CogniSacra Academy’s learner community feed.',
        ],
        objective: 'Increased visibility and a steady flow of new learners discovering your content.',
        cta: 'Choose Starter Plan'
    },
    {
        name: 'Growth Accelerator Plan',
        price: 129,
        idealFor: 'Trainers with established courses looking to scale their reach and revenue.',
        features: [
            'Enhanced Course Spotlight (5 per month): Premium placement in search results and recommended feeds.',
            'AI-Targeted Ads: In-platform ads tailored to learner interests and past behavior.',
            'Custom Email Campaigns: 2 campaigns per month segmented by learner demographics.',
            'Social Boost: Inclusion in CogniSacra Academy’s official social media highlights (LinkedIn, Facebook, Instagram).',
            'Detailed Analytics Dashboard: Real-time engagement metrics and learner insights.',
            'Review & Rating Amplification: Positive reviews spotlighted to attract more enrollments.',
        ],
        objective: 'Stronger brand recognition, higher learner engagement, and accelerated sales growth.',
        cta: 'Choose Growth Plan',
        featured: true
    },
    {
        name: 'Elite Brand Dominator Plan',
        price: 299,
        idealFor: 'Professional trainers seeking maximum reach, premium positioning, and brand authority.',
        features: [
            'Unlimited Premium Spotlight: Courses consistently highlighted in all top learner feeds.',
            'Exclusive Banner Ads: Custom banners featured on course category pages.',
            'Personalized AI Marketing Funnel: Automated learner retargeting to boost course completion and upselling.',
            'Advanced Email Marketing Suite: 4 segmented campaigns with A/B testing and performance tracking.',
            'Social Media Takeover: Dedicated monthly feature across CogniSacra Academy’s social media platforms.',
            'Custom Video Promo: 1 AI-enhanced promotional video produced and circulated within the platform.',
            'Strategic Growth Consultation: Monthly 1-on-1 session with a CogniSacra Academy marketing strategist.',
            'Full Analytics Suite: In-depth learner behavior reports, ROI tracking, and recommendations.',
        ],
        objective: 'Maximum brand visibility, strong learner loyalty, and exponential revenue growth.',
        cta: 'Choose Elite Plan'
    }
];

export const institutionSubscriptionTiers: SubscriptionTier[] = [
    {
        name: 'Starter Visibility Plan',
        price: 499,
        idealFor: 'Small educational institutions and independent instructors who want affordable, entry-level visibility.',
        features: [
            'Sponsored Course Listings: Priority placement in learner searches (appears in top 5 results).',
            'Basic Banner Ads: Rotating ad placements on course recommendation pages.',
            'Institution Profile Highlight: Institution’s profile featured once per week on the platform’s homepage.',
            'Performance Report: Monthly insights report (impressions, clicks, and learner engagement).',
        ],
        objective: 'Establish presence and boost visibility to attract first wave of learners.',
        cta: 'Choose Starter Plan'
    },
    {
        name: 'Growth Amplifier Plan',
        price: 1499,
        idealFor: 'Mid-sized institutions looking to expand brand reach and consistently attract new learners.',
        features: [
            'Premium Course Promotion: Dedicated spotlight section for top courses.',
            'Targeted Ads: AI-driven ads targeted by demographics, subject interests, and learner behavior.',
            'Video Showcase Slot: Short promotional video featured on learner dashboards.',
            'Weekly Profile Highlights: Institution’s profile featured weekly across platform categories.',
            'Advanced Analytics Dashboard: Real-time tracking of ad performance, conversions, and ROI.',
            'Campaign Strategy Support: Monthly consultation with CogniSacra Academy’s marketing team.',
        ],
        objective: 'Accelerate course enrollments and establish strong brand recognition on the platform.',
        cta: 'Choose Growth Plan',
        featured: true
    },
    {
        name: 'Elite Partner Accelerator Plan',
        price: 4999,
        idealFor: 'Large institutions and universities aiming for maximum exposure and sustained sales growth.',
        features: [
            'Exclusive Homepage Takeover: Institution branding featured prominently on the homepage once per month.',
            'Featured Courses Section: Always-on placement of up to 5 flagship courses.',
            'AI-Powered Retargeting Ads: Personalized ads to re-engage learners who visited but didn’t enroll.',
            'Custom Content Campaigns: Branded articles, success stories, and case studies published within the platform’s knowledge hub.',
            'Live Webinar Promotion: Institution webinars promoted directly to relevant learner groups.',
            'Bi-Weekly Strategy Consultation: Direct support to refine campaigns and maximize results.',
            'Comprehensive Data Insights: Deep learner behavior analysis to optimize future campaigns.',
        ],
        objective: 'Dominate visibility, drive large-scale enrollments, and position the institution as a leading authority in education.',
        cta: 'Choose Elite Plan'
    }
];
