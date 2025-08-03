export const schoolConfig = {
  // School Demographics
  demographics: {
    totalStudents: 2500,
    totalTeachers: 150,
    establishedYear: 1985,
    campusArea: "25 acres",
    classrooms: 80,
    laboratories: 12,
    library: "50,000+ books",
    sportsFields: 5,
  },

  // Admission Statistics
  admissionStats: {
    applicationsReceived: 3200,
    studentsAdmitted: 400,
    acceptanceRate: "12.5%",
    averageScore: 92.5,
    scholarshipsAwarded: 45,
  },

  // School Features
  features: [
    {
      title: "Academic Excellence",
      description: "Top 5% in national rankings",
      icon: "award",
      stats: "98% pass rate",
    },
    {
      title: "Modern Infrastructure",
      description: "State-of-the-art facilities",
      icon: "building",
      stats: "Smart classrooms",
    },
    {
      title: "Experienced Faculty",
      description: "Qualified and dedicated teachers",
      icon: "users",
      stats: "15+ years avg experience",
    },
    {
      title: "Holistic Development",
      description: "Sports, arts, and cultural activities",
      icon: "star",
      stats: "50+ extracurricular activities",
    },
  ],

  // QR Code Configuration
  qrConfig: {
    expectedFormat: "ID,Name,Phone,Email",
    validationRules: {
      id: {
        required: true,
        minLength: 10,
        pattern: /^\d+$/,
      },
      name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
      },
      phone: {
        required: true,
        pattern: /^\+?[\d\s-()]+$/,
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
  },

  // API Configuration
  api: {
    endpoints: {
      submitStudent: "/api/student-data",
      getStats: "/api/admission-stats",
      validateQR: "/api/validate-qr",
    },
    timeout: 10000,
    retryAttempts: 3,
  },

  // UI Theme
  theme: {
    primaryColor: "#4f46e5",
    secondaryColor: "#7c3aed",
    accentColor: "#06b6d4",
    gradients: {
      primary: "from-indigo-600 to-purple-600",
      background: "from-blue-50 via-indigo-50 to-purple-50",
      card: "from-white/80 to-white/60",
    },
  },
}

export type SchoolConfig = typeof schoolConfig
