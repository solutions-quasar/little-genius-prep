/**
 * Little Genius Prep - Academy ERP Mock Data & Schema
 * Realistic NYC student rosters, SHSAT scaled scoring curves, and lead pipelines.
 */

const DEFAULT_LGP_DATA = {
  leads: [
    {
      id: "INQ-4821",
      parentName: "Elena Rostova",
      studentName: "David Rostov",
      phone: "(347) 555-8912",
      email: "elena.rostov@example.com",
      currentGrade: "7th Grade",
      targetProgram: "SHSAT Specialized High Schools",
      preferredFormat: "In-Person (Brighton 7th St Campus)",
      status: "New Inquiry",
      notes: "Aiming for Stuyvesant High School. Strong in algebra but needs time management training on ELA reading comprehension.",
      submittedAt: "2026-10-27T10:15:00.000Z"
    },
    {
      id: "INQ-4822",
      parentName: "Marcus Chen",
      studentName: "Brandon Chen",
      phone: "(718) 441-2900",
      email: "mchen@example.com",
      currentGrade: "8th Grade",
      targetProgram: "SHSAT Specialized High Schools",
      preferredFormat: "In-Person (Brighton 7th St Campus)",
      status: "Diagnostic Scheduled",
      notes: "Scored 480 on school mock test. Wants to cross 540 for Brooklyn Tech cutoff.",
      submittedAt: "2026-10-26T14:30:00.000Z"
    },
    {
      id: "INQ-4823",
      parentName: "Svetlana Mikhailov",
      studentName: "Katya Mikhailov",
      phone: "(347) 921-6671",
      email: "svetlana.m@example.com",
      currentGrade: "5th Grade",
      targetProgram: "Mark Twain / Bay Academy",
      preferredFormat: "In-Person (Brighton 7th St Campus)",
      status: "Trial Session",
      notes: "Applying for Mark Twain Math & Science talent programs. Very motivated.",
      submittedAt: "2026-10-25T16:45:00.000Z"
    },
    {
      id: "INQ-4824",
      parentName: "Robert Miller",
      studentName: "Zachary Miller",
      phone: "(917) 302-8844",
      email: "rmiller.law@example.com",
      currentGrade: "High School 9-10",
      targetProgram: "NYS Regents Math & Science",
      preferredFormat: "Hybrid (Combined)",
      status: "Enrolled",
      notes: "Enrolled in Geometry Regents accelerator. Target score: 95+.",
      submittedAt: "2026-10-24T09:20:00.000Z"
    },
    {
      id: "INQ-4825",
      parentName: "Fatima Al-Mansoor",
      studentName: "Tariq Al-Mansoor",
      phone: "(347) 771-3420",
      email: "falmansoor@example.com",
      currentGrade: "Elementary (K-3)",
      targetProgram: "Gifted and Talented (G&T)",
      preferredFormat: "In-Person (Brighton 7th St Campus)",
      status: "New Inquiry",
      notes: "Seeking 99th percentile OLSAT prep for Brooklyn district G&T placement.",
      submittedAt: "2026-10-28T11:05:00.000Z"
    }
  ],

  cohorts: [
    {
      id: "COH-SHSAT-A",
      name: "SHSAT Fall Intensive Alpha",
      examType: "SHSAT",
      schedule: "Saturdays & Sundays 9:30 AM – 1:30 PM",
      instructor: "Arthur Letsker & Dr. Marina V.",
      room: "Room A (Main Lecture)",
      enrolledCount: 14,
      maxCapacity: 15,
      status: "Active"
    },
    {
      id: "COH-SHSAT-B",
      name: "SHSAT Priority Track Beta",
      examType: "SHSAT",
      schedule: "Saturdays 2:00 PM – 6:00 PM",
      instructor: "Arthur Letsker",
      room: "Room B (Testing Lab)",
      enrolledCount: 11,
      maxCapacity: 12,
      status: "Active"
    },
    {
      id: "COH-REGENTS-GEO",
      name: "Regents Geometry & Algebra Accelerator",
      examType: "Regents",
      schedule: "Tuesdays & Thursdays 4:30 PM – 6:30 PM",
      instructor: "Dr. Marina V.",
      room: "Room A (Main Lecture)",
      enrolledCount: 8,
      maxCapacity: 12,
      status: "Active"
    },
    {
      id: "COH-TWAIN-5",
      name: "Mark Twain & Bay Academy Talent Prep",
      examType: "Middle School Talent",
      schedule: "Sundays 10:00 AM – 1:00 PM",
      instructor: "Alexander R.",
      room: "Room B (Testing Lab)",
      enrolledCount: 10,
      maxCapacity: 12,
      status: "Active"
    }
  ],

  students: [
    {
      id: "STU-101",
      name: "Zachary Miller",
      cohortId: "COH-REGENTS-GEO",
      cohortName: "Regents Geometry & Algebra Accelerator",
      targetSchool: "Regents 95+ (Honors)",
      grade: "10th Grade",
      parentName: "Robert Miller",
      parentPhone: "(917) 302-8844",
      attendanceRate: "96%",
      tuitionStatus: "Paid",
      latestScore: {
        examName: "Regents Practice Benchmark 2",
        scaledTotal: 94,
        date: "2026-10-22"
      }
    },
    {
      id: "STU-102",
      name: "Sophia Lebedev",
      cohortId: "COH-SHSAT-A",
      cohortName: "SHSAT Fall Intensive Alpha",
      targetSchool: "Stuyvesant High School",
      grade: "8th Grade",
      parentName: "Anna Lebedev",
      parentPhone: "(347) 882-1920",
      attendanceRate: "100%",
      tuitionStatus: "Paid",
      latestScore: {
        examName: "Mock Test #3 (Full Timed)",
        rawELA: 49,
        rawMath: 54,
        scaledELA: 288,
        scaledMath: 312,
        scaledTotal: 600,
        targetCutoff: 560,
        probability: "High Probability (Target: Stuyvesant 560)",
        date: "2026-10-21"
      }
    },
    {
      id: "STU-103",
      name: "Brandon Chen",
      cohortId: "COH-SHSAT-A",
      cohortName: "SHSAT Fall Intensive Alpha",
      targetSchool: "Brooklyn Technical High School",
      grade: "8th Grade",
      parentName: "Marcus Chen",
      parentPhone: "(718) 441-2900",
      attendanceRate: "92%",
      tuitionStatus: "Partial",
      latestScore: {
        examName: "Mock Test #3 (Full Timed)",
        rawELA: 42,
        rawMath: 47,
        scaledELA: 245,
        scaledMath: 275,
        scaledTotal: 520,
        targetCutoff: 505,
        probability: "High Probability (Target: Brooklyn Tech 505)",
        date: "2026-10-21"
      }
    },
    {
      id: "STU-104",
      name: "Katya Mikhailov",
      cohortId: "COH-TWAIN-5",
      cohortName: "Mark Twain & Bay Academy Talent Prep",
      targetSchool: "Mark Twain JHS (Math & Science)",
      grade: "5th Grade",
      parentName: "Svetlana Mikhailov",
      parentPhone: "(347) 921-6671",
      attendanceRate: "100%",
      tuitionStatus: "Paid",
      latestScore: {
        examName: "Twain Talent Diagnostic 2",
        scaledTotal: 96,
        date: "2026-10-20"
      }
    },
    {
      id: "STU-105",
      name: "Ethan Goldberg",
      cohortId: "COH-SHSAT-A",
      cohortName: "SHSAT Fall Intensive Alpha",
      targetSchool: "Bronx High School of Science",
      grade: "8th Grade",
      parentName: "Miriam Goldberg",
      parentPhone: "(718) 633-1122",
      attendanceRate: "88%",
      tuitionStatus: "Paid",
      latestScore: {
        examName: "Mock Test #3 (Full Timed)",
        rawELA: 45,
        rawMath: 48,
        scaledELA: 262,
        scaledMath: 280,
        scaledTotal: 542,
        targetCutoff: 525,
        probability: "High Probability (Target: Bronx Science 525)",
        date: "2026-10-21"
      }
    },
    {
      id: "STU-106",
      name: "Maya Patel",
      cohortId: "COH-SHSAT-B",
      cohortName: "SHSAT Priority Track Beta",
      targetSchool: "Staten Island Tech / Brooklyn Tech",
      grade: "7th Grade",
      parentName: "Rajesh Patel",
      parentPhone: "(917) 412-5509",
      attendanceRate: "95%",
      tuitionStatus: "Paid",
      latestScore: {
        examName: "Mock Test #2 (Early Benchmark)",
        rawELA: 39,
        rawMath: 43,
        scaledELA: 230,
        scaledMath: 255,
        scaledTotal: 485,
        targetCutoff: 510,
        probability: "On Track (7th Grader Pace)",
        date: "2026-10-14"
      }
    }
  ],

  tuitionRecords: [
    {
      id: "INV-2026-081",
      studentName: "Sophia Lebedev",
      program: "SHSAT Fall Intensive Semester",
      amount: 1850,
      paidAmount: 1850,
      balance: 0,
      status: "Paid",
      dueDate: "2026-10-01",
      paymentMethod: "Zelle / Check"
    },
    {
      id: "INV-2026-082",
      studentName: "Brandon Chen",
      program: "SHSAT Fall Intensive Semester",
      amount: 1850,
      paidAmount: 925,
      balance: 925,
      status: "Partial",
      dueDate: "2026-11-01",
      paymentMethod: "Credit Card (Installment 1 of 2)"
    },
    {
      id: "INV-2026-083",
      studentName: "Zachary Miller",
      program: "Regents Geometry Mastery (Term)",
      amount: 1200,
      paidAmount: 1200,
      balance: 0,
      status: "Paid",
      dueDate: "2026-10-05",
      paymentMethod: "Check"
    },
    {
      id: "INV-2026-084",
      studentName: "Katya Mikhailov",
      program: "Mark Twain JHS Talent Module",
      amount: 1450,
      paidAmount: 1450,
      balance: 0,
      status: "Paid",
      dueDate: "2026-10-10",
      paymentMethod: "Zelle"
    }
  ],

  campusRooms: [
    {
      name: "Room A • Main Lecture Hall",
      capacity: 16,
      currentCohort: "SHSAT Fall Intensive Alpha",
      features: "Interactive Dual 4K Displays, Proctored Desks, Acoustic Baffles"
    },
    {
      name: "Room B • Diagnostic & Mock Lab",
      capacity: 12,
      currentCohort: "SHSAT Priority Track Beta",
      features: "Silent Testing Cubicles, Official Timers, High-Speed Scan Station"
    },
    {
      name: "Room C • 1-on-1 & G&T Studio",
      capacity: 8,
      currentCohort: "Gifted & Talented & Private Tutoring",
      features: "Roundtable Discussion Pod, Logic Puzzle Wall, Parent Observation Glass"
    }
  ]
};

// SHSAT Official Scaled Scoring Curve Simulator (57 ELA / 57 Math -> Composite Scaled Score)
function calculateSHSATScore(rawELA, rawMath) {
  // SHSAT curve formula approximation:
  // Base raw score scaled between 150 and 360 per section with high-end exponential curve
  function scaleSection(raw) {
    if (raw <= 0) return 150;
    if (raw >= 57) return 360;
    // Normalized value
    const p = raw / 57;
    // Non-linear scaling reflecting real DOE scaled curve
    const scaled = 150 + Math.pow(p, 1.45) * 210;
    return Math.round(scaled);
  }

  const scaledELA = scaleSection(rawELA);
  const scaledMath = scaleSection(rawMath);
  const composite = scaledELA + scaledMath;

  let tier = "Foundation";
  let targetMatch = "Staten Island Tech / Brooklyn Latin";

  if (composite >= 560) {
    tier = "Stuyvesant Benchmark";
    targetMatch = "Stuyvesant High School (560+)";
  } else if (composite >= 525) {
    tier = "Bronx Science Benchmark";
    targetMatch = "Bronx High School of Science (525+)";
  } else if (composite >= 505) {
    tier = "Brooklyn Tech Benchmark";
    targetMatch = "Brooklyn Technical HS (505+)";
  } else if (composite >= 480) {
    tier = "High School for Math & Science Benchmark";
    targetMatch = "HSMSE / Queens High School for Sciences";
  }

  return {
    rawELA,
    rawMath,
    scaledELA,
    scaledMath,
    composite,
    tier,
    targetMatch
  };
}
