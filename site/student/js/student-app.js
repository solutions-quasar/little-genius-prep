/**
 * Little Genius Prep - Student Portal Application Logic (Mobile-First)
 * Handles authentication, drawer menu, bottom thumb navigation, and modular views.
 */

(function () {
  const STUDENT_DATABASE = {
    "STU-102": {
      id: "STU-102",
      name: "Sophia Lebedev",
      grade: "8th Grade",
      avatar: "SL",
      cohort: "SHSAT Fall Intensive Alpha",
      targetSchool: "Stuyvesant High School",
      targetCutoff: 560,
      scaledScore: 600,
      maxScore: 700,
      probability: "High Probability (96%)",
      nextClass: {
        title: "SHSAT Advanced Math & Logic",
        teacher: "Dr. Marina V.",
        time: "Saturday, 9:30 AM – 1:30 PM",
        room: "Room A • Brighton 7th St Campus"
      },
      homework: [
        { id: "hw1", title: "Practice Test 3 Section B (Math Grid-Ins)", due: "Due Saturday", completed: true },
        { id: "hw2", title: "ELA Revising & Editing Passage Drills (p. 42-48)", due: "Due Saturday", completed: false },
        { id: "hw3", title: "Poetic Tone & Inference Flashcards (20 terms)", due: "Due Sunday", completed: false }
      ],
      subjects: [
        {
          name: "SHSAT English Language Arts",
          teacher: "Arthur Letsker (Author)",
          progress: 88,
          syllabus: "Revising/Editing transitions, advanced inference, time-management pacing techniques.",
          nextSession: "Saturday 11:30 AM"
        },
        {
          name: "SHSAT Advanced Math & Logic",
          teacher: "Dr. Marina V. (Ph.D.)",
          progress: 94,
          syllabus: "Non-routine coordinate geometry, 3D solids, rate & distance algebra traps.",
          nextSession: "Saturday 9:30 AM"
        },
        {
          name: "Timed Benchmark Simulation Lab",
          teacher: "Proctored Testing Staff",
          progress: 92,
          syllabus: "Full 114-question mock test under strict DOE timed test conditions.",
          nextSession: "Sunday 10:00 AM"
        }
      ],
      exams: [
        { name: "Mock Test #3 (Official Timed)", date: "Oct 21, 2026", scaled: 600, rawEla: "49/57", rawMath: "54/57", status: "Stuyvesant Benchmark Exceeded" },
        { name: "Mock Test #2 (Mid-Term Benchmark)", date: "Oct 07, 2026", scaled: 552, rawEla: "44/57", rawMath: "49/57", status: "Above Bronx Science Cutoff" },
        { name: "Mock Test #1 (Diagnostic Baseline)", date: "Sep 15, 2026", scaled: 505, rawEla: "40/57", rawMath: "43/57", status: "Above Brooklyn Tech Cutoff" }
      ],
      messages: [
        {
          sender: "Arthur Letsker (Academic Director)",
          time: "Today at 2:15 PM",
          body: "Hello Sophia! Your revising/editing drill results from Sunday were superb. Make sure to review the poetic inference notes before Saturday's simulation."
        },
        {
          sender: "Brighton Beach Academy Office",
          time: "Yesterday at 10:30 AM",
          body: "Reminder: Mock Exam #4 will take place in Room A this Saturday. Please bring your student ID and non-programmable pencils. Good luck!"
        }
      ],
      notes: [
        {
          teacher: "Arthur Letsker",
          role: "ELA Department Lead",
          avatar: "AL",
          date: "Oct 22, 2026",
          note: "Sophia demonstrated remarkable reading stamina on Mock #3, completing the passage analysis with 11 minutes to spare. She has eliminated prior confusion on contrastive transitions ('; however,'). Focus for next session: subtle author intent questions.",
          strengths: ["Transition Logic", "Speed Reading Stamina"],
          focus: ["Double Negatives in Questions"]
        },
        {
          teacher: "Dr. Marina V.",
          role: "Mathematics Lead",
          avatar: "MV",
          date: "Oct 20, 2026",
          note: "Exceptional speed on non-routine geometry and cylinder volume changes. Raw score 54/57 puts her in the top 3% of our Brooklyn cohort. Continue keeping calculation scratch work organized to prevent minor arithmetic slips.",
          strengths: ["Geometry Logic", "High Speed Computation"],
          focus: ["Organized Scratch Layout"]
        }
      ]
    },

    "STU-103": {
      id: "STU-103",
      name: "Brandon Chen",
      grade: "8th Grade",
      avatar: "BC",
      cohort: "SHSAT Fall Intensive Alpha",
      targetSchool: "Brooklyn Technical High School",
      targetCutoff: 505,
      scaledScore: 520,
      maxScore: 700,
      probability: "High Probability (91%)",
      nextClass: {
        title: "SHSAT English Language Arts",
        teacher: "Arthur Letsker",
        time: "Saturday, 11:30 AM – 1:30 PM",
        room: "Room A • Brighton 7th St Campus"
      },
      homework: [
        { id: "hw10", title: "Algebra Linear Functions Worksheet (Set 4)", due: "Due Saturday", completed: true },
        { id: "hw11", title: "Reading Comprehension Timing Drills (2 passages)", due: "Due Sunday", completed: false }
      ],
      subjects: [
        {
          name: "SHSAT Mathematics & Word Logic",
          teacher: "Dr. Marina V.",
          progress: 86,
          syllabus: "Percentages, ratios, algebraic manipulations, and grid-in drills.",
          nextSession: "Saturday 9:30 AM"
        },
        {
          name: "SHSAT ELA Revising & Editing",
          teacher: "Arthur Letsker",
          progress: 80,
          syllabus: "Grammar conventions, paragraph cohesion, logical placement of sentences.",
          nextSession: "Saturday 11:30 AM"
        }
      ],
      exams: [
        { name: "Mock Test #3 (Official Timed)", date: "Oct 21, 2026", scaled: 520, rawEla: "42/57", rawMath: "47/57", status: "Brooklyn Tech Cutoff Exceeded" },
        { name: "Mock Test #2 (Mid-Term Benchmark)", date: "Oct 07, 2026", scaled: 495, rawEla: "39/57", rawMath: "44/57", status: "Competitive Score" },
        { name: "Mock Test #1 (Diagnostic Baseline)", date: "Sep 15, 2026", scaled: 460, rawEla: "36/57", rawMath: "41/57", status: "Baseline Score" }
      ],
      messages: [
        {
          sender: "Dr. Marina V.",
          time: "Oct 25 at 4:00 PM",
          body: "Great improvement on multi-step ratio problems Brandon! Keep up the daily 15-minute drills."
        }
      ],
      notes: [
        {
          teacher: "Dr. Marina V.",
          role: "Mathematics Lead",
          avatar: "MV",
          date: "Oct 22, 2026",
          note: "Brandon has successfully crossed the 505 Brooklyn Tech benchmark, scoring 520 on Mock #3. He has improved his rate of problem solving by 20%.",
          strengths: ["Algebra Manipulation", "Quick Recall"],
          focus: ["Complex Word Problems"]
        }
      ]
    }
  };

  let currentStudent = null;
  let activeTab = "home";

  // App-Native Bottom-Sheet Dialogs
  const modalOverlay = document.getElementById("student-modal-overlay");
  const modalBody = document.getElementById("student-modal-body");
  const modalCloseBtn = document.getElementById("student-modal-close-btn");

  function openStudentModal(html) {
    if (!modalOverlay || !modalBody) return;
    modalBody.innerHTML = html;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
  }

  function closeStudentModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeStudentModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeStudentModal();
    });
  }

  // Floating Burger & Drawer Controller
  const floatingBurger = document.getElementById("floating-burger");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const drawerCloseBtn = document.getElementById("drawer-close");

  function openDrawer() {
    if (drawerOverlay) drawerOverlay.classList.add("open");
  }

  function closeDrawer() {
    if (drawerOverlay) drawerOverlay.classList.remove("open");
  }

  if (floatingBurger) floatingBurger.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", function (e) {
      if (e.target === drawerOverlay) closeDrawer();
    });
  }

  // Authentication & Demo Profiles
  window.loginDemo = function (studentId) {
    const student = STUDENT_DATABASE[studentId];
    if (student) {
      currentStudent = student;
      sessionStorage.setItem("lgp_active_student", studentId);
      renderAppShell();
    }
  };

  window.handleManualLogin = function (e) {
    e.preventDefault();
    const idInput = document.getElementById("stu_id_input").value.trim().toUpperCase();
    const student = STUDENT_DATABASE[idInput] || STUDENT_DATABASE["STU-102"];
    currentStudent = student;
    sessionStorage.setItem("lgp_active_student", student.id);
    renderAppShell();
  };

  window.logoutStudent = function () {
    currentStudent = null;
    sessionStorage.removeItem("lgp_active_student");
    closeDrawer();
    document.getElementById("student-app-view").style.display = "none";
    document.getElementById("student-login-view").style.display = "flex";
  };

  // Display Mode Controller (Auto / Desktop / Mobile)
  let savedMode = localStorage.getItem("lgp_student_display_mode");
  // Default to 'auto' so layout switches dynamically and automatically with screen width
  let portalDisplayMode = (savedMode === "desktop" || savedMode === "mobile") ? savedMode : "auto";

  window.setPortalDisplayMode = function (mode) {
    portalDisplayMode = mode;
    localStorage.setItem("lgp_student_display_mode", mode);
    applyPortalDisplayMode();
  };

  window.cyclePortalMode = function () {
    if (portalDisplayMode === "auto") {
      setPortalDisplayMode("desktop");
    } else if (portalDisplayMode === "desktop") {
      setPortalDisplayMode("mobile");
    } else {
      setPortalDisplayMode("auto");
    }
  };

  function applyPortalDisplayMode() {
    const appWrapper = document.getElementById("student-app-view");
    const loginWrapper = document.getElementById("student-login-view");
    const body = document.body;

    const btnAuto = document.getElementById("btn-mode-auto");
    const btnDesk = document.getElementById("btn-mode-desktop");
    const btnMob = document.getElementById("btn-mode-mobile");

    // Clear legacy & force classes
    appWrapper?.classList.remove("force-desktop", "force-mobile", "mode-desktop", "mode-mobile");
    loginWrapper?.classList.remove("force-desktop", "force-mobile", "mode-desktop", "mode-mobile");
    body.classList.remove("desktop-viewport", "mobile-viewport");

    btnAuto?.classList.remove("active");
    btnDesk?.classList.remove("active");
    btnMob?.classList.remove("active");

    if (portalDisplayMode === "desktop") {
      appWrapper?.classList.add("force-desktop");
      loginWrapper?.classList.add("force-desktop");
      body.classList.add("desktop-viewport");
      btnDesk?.classList.add("active");
      updateMobileToggleLabel("💻 Desktop");
      if (appWrapper) appWrapper.style.display = "grid";
    } else if (portalDisplayMode === "mobile") {
      appWrapper?.classList.add("force-mobile");
      loginWrapper?.classList.add("force-mobile");
      body.classList.add("mobile-viewport");
      btnMob?.classList.add("active");
      updateMobileToggleLabel("📱 Mobile");
      if (appWrapper) appWrapper.style.display = "flex";
    } else {
      // Auto (Reactive) - handled by screen size
      btnAuto?.classList.add("active");
      updateMobileToggleLabel("⚡ Auto");
      if (window.innerWidth >= 992) {
        body.classList.add("desktop-viewport");
        if (appWrapper) appWrapper.style.display = "grid";
      } else {
        body.classList.remove("desktop-viewport");
        if (appWrapper) appWrapper.style.display = "flex";
      }
    }
  }

  function updateMobileToggleLabel(label) {
    const btnQuick = document.getElementById("btn-mobile-reactive-indicator");
    if (btnQuick) btnQuick.textContent = label;
  }

  // Reactive listener to ensure visual state stays synchronized on resize
  window.addEventListener("resize", function () {
    if (portalDisplayMode === "auto") {
      updateMobileToggleLabel("⚡ Auto");
      const appWrapper = document.getElementById("student-app-view");
      if (appWrapper && appWrapper.style.display !== "none") {
        appWrapper.style.display = window.innerWidth >= 992 ? "grid" : "flex";
      }
      if (window.innerWidth >= 992) {
        document.body.classList.add("desktop-viewport");
      } else {
        document.body.classList.remove("desktop-viewport");
      }
    }
  });

  function renderAppShell() {
    document.getElementById("student-login-view").style.display = "none";
    applyPortalDisplayMode();

    // Update Mobile Header
    const hAvatar = document.getElementById("header-avatar");
    const hName = document.getElementById("header-student-name");
    const hCohort = document.getElementById("header-cohort-name");
    if (hAvatar) hAvatar.textContent = currentStudent.avatar;
    if (hName) hName.textContent = currentStudent.name;
    if (hCohort) hCohort.textContent = currentStudent.cohort;

    // Update Mobile Drawer
    const dAvatar = document.getElementById("drawer-avatar");
    const dName = document.getElementById("drawer-name");
    const dGrade = document.getElementById("drawer-grade");
    const dTarget = document.getElementById("drawer-target");
    if (dAvatar) dAvatar.textContent = currentStudent.avatar;
    if (dName) dName.textContent = currentStudent.name;
    if (dGrade) dGrade.textContent = `${currentStudent.grade} • Brighton 7th St`;
    if (dTarget) dTarget.textContent = `🎯 ${currentStudent.targetSchool}`;

    // Update Desktop Sidebar
    const deskAvatar = document.getElementById("desktop-avatar");
    const deskName = document.getElementById("desktop-student-name");
    const deskCohort = document.getElementById("desktop-cohort-name");
    const deskTarget = document.getElementById("desktop-target");
    const deskScoreBadge = document.getElementById("desktop-badge-score");
    if (deskAvatar) deskAvatar.textContent = currentStudent.avatar;
    if (deskName) deskName.textContent = currentStudent.name;
    if (deskCohort) deskCohort.textContent = currentStudent.cohort;
    if (deskTarget) {
      deskTarget.textContent = `🎯 ${currentStudent.targetSchool} (${currentStudent.targetCutoff}+)`;
      deskTarget.title = `Target: ${currentStudent.targetSchool} (Cutoff: ${currentStudent.targetCutoff}+)`;
    }
    if (deskScoreBadge) deskScoreBadge.textContent = `${currentStudent.scaledScore} pts`;

    // Update Desktop Header
    const deskHeadCohort = document.getElementById("desktop-header-cohort");
    const deskHeadScore = document.getElementById("desktop-header-score");
    if (deskHeadCohort) deskHeadCohort.textContent = currentStudent.cohort;
    if (deskHeadScore) {
      deskHeadScore.innerHTML = `<span>Score:</span> <strong>${currentStudent.scaledScore} / ${currentStudent.maxScore}</strong>`;
    }

    // Update Demo Profile Switcher Pills
    const pill102 = document.getElementById("pill-STU-102");
    const pill103 = document.getElementById("pill-STU-103");
    if (pill102) {
      if (currentStudent.id === "STU-102") pill102.classList.add("active");
      else pill102.classList.remove("active");
    }
    if (pill103) {
      if (currentStudent.id === "STU-103") pill103.classList.add("active");
      else pill103.classList.remove("active");
    }

    applyPortalDisplayMode();
    switchTab("home");
  }

  const TAB_TITLES = {
    home: "Overview Dashboard",
    subjects: "My Subjects & Homework",
    exams: "Mock Tests & Scaled Scores",
    messages: "Academy Communications",
    notes: "Private Teacher Reviews"
  };

  // Tab Navigation Switcher
  window.switchTab = function (tabName) {
    activeTab = tabName;
    closeDrawer();

    // Update Desktop Title
    const deskTitle = document.getElementById("desktop-view-title");
    if (deskTitle) deskTitle.textContent = TAB_TITLES[tabName] || "Student Space";

    // Update Bottom Bar Active Class
    const thumbButtons = document.querySelectorAll(".thumb-nav-btn");
    thumbButtons.forEach(btn => {
      if (btn.getAttribute("data-tab") === tabName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update Desktop Sidebar Active Class
    const desktopLinks = document.querySelectorAll(".desktop-nav-link");
    desktopLinks.forEach(link => {
      if (link.getAttribute("data-tab") === tabName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update Drawer Active Class
    const drawerLinks = document.querySelectorAll(".drawer-link");
    drawerLinks.forEach(link => {
      const match = link.getAttribute("onclick")?.includes(tabName);
      if (match) link.classList.add("active");
      else link.classList.remove("active");
    });

    renderCurrentViewContent();
  };

  function renderCurrentViewContent() {
    const viewport = document.getElementById("student-view-viewport");
    if (!viewport || !currentStudent) return;

    switch (activeTab) {
      case "home":
        viewport.innerHTML = renderHomeView();
        break;
      case "subjects":
        viewport.innerHTML = renderSubjectsView();
        break;
      case "exams":
        viewport.innerHTML = renderExamsView();
        break;
      case "messages":
        viewport.innerHTML = renderMessagesView();
        break;
      case "notes":
        viewport.innerHTML = renderNotesView();
        break;
      default:
        viewport.innerHTML = renderHomeView();
    }
  }

  // ==========================================
  // VIEW RENDERERS (Desktop & Mobile Optimized)
  // ==========================================

  function renderHomeView() {
    const s = currentStudent;
    const pct = Math.min(100, Math.round((s.scaledScore / s.maxScore) * 100));

    return `
      <!-- Greeting Header Box -->
      <div class="overview-greeting-box">
        <div class="greeting-text-group">
          <span class="greeting-date">Fall 2026 Admissions Track • Brighton 7th St</span>
          <h2 class="greeting-name">Hello, ${escapeHtml(s.name.split(' ')[0])}! 👋</h2>
          <p class="greeting-quote">“Consistency turns effort into excellence. Keep up the high momentum.”</p>
        </div>
        <div class="greeting-target-card">
          <span class="target-sub">Target High School</span>
          <strong class="target-name">${escapeHtml(s.targetSchool)}</strong>
          <div class="target-cutoff-pill">Cutoff: ${s.targetCutoff}+ • ${s.probability}</div>
        </div>
      </div>

      <!-- Quick KPI Strip for Desktop & Mobile -->
      <div class="desktop-kpi-bar">
        <div class="kpi-mini-card">
          <span class="kpi-mini-label">Latest Scaled Score</span>
          <strong class="kpi-mini-val">${s.scaledScore} <span style="font-size:0.8rem; font-weight:500; color:var(--text-muted);">/ 700</span></strong>
          <span class="kpi-mini-sub positive">✓ Benchmark Exceeded</span>
        </div>
        <div class="kpi-mini-card">
          <span class="kpi-mini-label">Next Timed Simulation</span>
          <strong class="kpi-mini-val">In 3 Days</strong>
          <span class="kpi-mini-sub">Mock Exam #4 (Room A)</span>
        </div>
        <div class="kpi-mini-card">
          <span class="kpi-mini-label">Assignments Tracker</span>
          <strong class="kpi-mini-val">${s.homework.filter(h => !h.completed).length} Pending</strong>
          <span class="kpi-mini-sub">${s.homework.filter(h => h.completed).length} completed</span>
        </div>
        <div class="kpi-mini-card">
          <span class="kpi-mini-label">Active Cohort</span>
          <strong class="kpi-mini-val" style="font-size:0.95rem; line-height:1.3;">${escapeHtml(s.cohort)}</strong>
          <span class="kpi-mini-sub">12-Student Seminar</span>
        </div>
      </div>

      <!-- 2-Column Desktop Grid / Stacked Mobile -->
      <div class="overview-columns">
        <div class="overview-col-main">
          <!-- Scaled Score Progress Widget -->
          <div class="score-snapshot-card">
            <div class="snapshot-header">
              <span class="snapshot-title">Latest Composite Scaled Score</span>
              <span class="snapshot-target-badge">${escapeHtml(s.targetSchool)}</span>
            </div>
            <div class="score-main-display">
              <span class="score-number">${s.scaledScore}</span>
              <span class="score-max">/ ${s.maxScore}</span>
            </div>
            <div class="score-progress-bar-student">
              <div class="score-fill-student" style="width: ${pct}%;"></div>
            </div>
            <div class="score-meta-row">
              <span>Target Cutoff: <strong>${s.targetCutoff}+</strong></span>
              <strong>${s.probability}</strong>
            </div>
          </div>

          <!-- Next Scheduled Class Card -->
          <div class="next-class-card">
            <div class="next-class-badge">Upcoming Class Session</div>
            <div class="next-class-title">${escapeHtml(s.nextClass.title)}</div>
            <div class="next-class-time">📅 ${s.nextClass.time}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">📍 ${s.nextClass.room}</div>
            
            <div class="next-class-actions">
              <button type="button" class="btn btn-sm btn-primary" onclick="openClassDetailModal()">Class Details</button>
              <a href="../index.html#campus" target="_blank" class="btn btn-sm btn-light">Campus Directions</a>
            </div>
          </div>
        </div>

        <div class="overview-col-side">
          <!-- Homework Checklist -->
          <div class="homework-box">
            <span class="section-label">Active Assignments &amp; Practice Sets</span>
            <div class="homework-list">
              ${s.homework.map(hw => `
                <label class="homework-item">
                  <input type="checkbox" ${hw.completed ? 'checked' : ''} onchange="toggleHomework('${hw.id}')">
                  <div class="homework-text">
                    <strong style="${hw.completed ? 'text-decoration:line-through; opacity:0.6;' : ''}">${escapeHtml(hw.title)}</strong>
                    <span>${hw.due}</span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Quick Messages Widget -->
          <div class="quick-messages-box">
            <div class="quick-msg-header">
              <span class="section-label" style="margin-bottom:0;">Mentor Updates</span>
              <button type="button" class="btn-text-link" onclick="switchTab('messages')">View All →</button>
            </div>
            <div class="quick-msg-snippet">
              <strong>${escapeHtml(s.messages[0].sender)}:</strong>
              <p>${escapeHtml(s.messages[0].body)}</p>
              <span class="quick-msg-time">${s.messages[0].time}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSubjectsView() {
    const s = currentStudent;
    return `
      <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:flex-end;">
        <div>
          <h2 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--text-title);">My Enrolled Subjects</h2>
          <span style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(s.cohort)}</span>
        </div>
      </div>

      <div class="subjects-grid">
        ${s.subjects.map(subj => `
          <div class="subject-card">
            <div class="subject-header">
              <div>
                <h3 class="subject-name">${escapeHtml(subj.name)}</h3>
                <span class="subject-teacher">Mentor: ${escapeHtml(subj.teacher)}</span>
              </div>
              <span class="subject-progress-pct">${subj.progress}%</span>
            </div>

            <p class="subject-syllabus-snippet">${escapeHtml(subj.syllabus)}</p>

            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">
              Next live session: <strong>${subj.nextSession}</strong>
            </div>

            <div class="subject-footer-actions">
              <button type="button" class="btn btn-sm btn-light" onclick="openSyllabusModal('${escapeHtml(subj.name)}')">View Syllabus</button>
              <button type="button" class="btn btn-sm btn-primary" onclick="openAskQuestionModal('${escapeHtml(subj.teacher)}')">Ask Teacher</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderExamsView() {
    const s = currentStudent;
    return `
      <div class="exams-desktop-layout">
        <div class="exam-gauge-container">
          <div class="gauge-title">Official SHSAT Scaled Score Gauge</div>
          <div class="gauge-composite-val">${s.scaledScore}</div>
          <span class="gauge-match-pill">${s.probability}</span>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:8px;">Target: <strong>${escapeHtml(s.targetSchool)} (${s.targetCutoff}+)</strong></div>
        </div>

        <div style="background:#FFFFFF; border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:20px; box-shadow:var(--shadow-sm);">
          <div class="gauge-title" style="margin-bottom:12px; text-align:left;">Official Specialized HS Cutoffs</div>
          <table class="cutoff-table">
            <thead>
              <tr>
                <th>Specialized High School</th>
                <th>Cutoff Threshold</th>
                <th>Your Status</th>
              </tr>
            </thead>
            <tbody>
              <tr class="${s.scaledScore >= 560 ? 'highlighted' : ''}">
                <td>Stuyvesant High School</td>
                <td>560+</td>
                <td>${s.scaledScore >= 560 ? '✓ Exceeded' : 'On Track'}</td>
              </tr>
              <tr class="${s.scaledScore >= 525 ? 'highlighted' : ''}">
                <td>Bronx High School of Science</td>
                <td>525+</td>
                <td>✓ Exceeded</td>
              </tr>
              <tr class="${s.scaledScore >= 505 ? 'highlighted' : ''}">
                <td>Brooklyn Technical High School</td>
                <td>505+</td>
                <td>✓ Exceeded</td>
              </tr>
              <tr>
                <td>Staten Island Tech</td>
                <td>515+</td>
                <td>✓ Exceeded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <span class="section-label" style="margin-bottom:0;">Mock Test Chronology</span>
        <button type="button" class="btn btn-sm btn-light" onclick="openStudentReportModal()">Export Report</button>
      </div>

      <div class="exams-history-grid" style="display:flex; flex-direction:column; gap:12px;">
        ${s.exams.map(ex => `
          <div class="past-exam-card">
            <div class="past-exam-top">
              <span class="past-exam-name">${escapeHtml(ex.name)}</span>
              <span class="past-exam-score">${ex.scaled} pts</span>
            </div>
            <div class="past-exam-breakdown">
              <span>ELA: <strong>${ex.rawEla}</strong></span>
              <span>Math: <strong>${ex.rawMath}</strong></span>
              <span>Date: ${ex.date}</span>
            </div>
            <div style="font-size:0.75rem; color:var(--accent-green); font-weight:700; margin-top:6px;">
              ${ex.status}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderMessagesView() {
    const s = currentStudent;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div>
          <h2 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--text-title);">Academy Communications</h2>
          <span style="font-size:0.85rem; color:var(--text-muted);">Direct messaging channel with Little Genius Prep faculty</span>
        </div>
        <button type="button" class="btn btn-sm btn-primary" onclick="openAskQuestionModal('Arthur Letsker')">+ New Message</button>
      </div>

      <div class="messages-grid">
        ${s.messages.map(msg => `
          <div class="msg-bubble-card">
            <div class="msg-sender-row">
              <span class="msg-sender-name">${escapeHtml(msg.sender)}</span>
              <span class="msg-time">${msg.time}</span>
            </div>
            <p class="msg-body">${escapeHtml(msg.body)}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderNotesView() {
    const s = currentStudent;
    return `
      <div class="confidential-header-badge">
        <span>🔒</span>
        <span>Confidential Teacher Journal • Private to Scholar &amp; Parents</span>
      </div>

      <div style="margin-bottom:20px;">
        <h2 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--text-title);">Teacher Observations &amp; Coaching</h2>
        <p style="font-size:0.85rem; color:var(--text-muted);">Personalized diagnostic feedback from published authors &amp; PhD mentors.</p>
      </div>

      <div class="notes-grid">
        ${s.notes.map(note => `
          <div class="teacher-note-card">
            <div class="teacher-meta-row">
              <div class="teacher-avatar-circle">${note.avatar}</div>
              <div class="teacher-info">
                <strong>${escapeHtml(note.teacher)}</strong>
                <span>${escapeHtml(note.role)} • ${note.date}</span>
              </div>
            </div>

            <p class="teacher-note-text">“${escapeHtml(note.note)}”</p>

            <div style="margin-bottom:8px; font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Observed Strengths</div>
            <div class="tags-row" style="margin-bottom:12px;">
              ${note.strengths.map(st => `<span class="tag-strength">✓ ${escapeHtml(st)}</span>`).join('')}
            </div>

            <div style="margin-bottom:8px; font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Focus Areas for this Week</div>
            <div class="tags-row">
              ${note.focus.map(fc => `<span class="tag-focus">🎯 ${escapeHtml(fc)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // MODAL ACTIONS (App-Native Bottom-Sheets)
  // ==========================================

  window.toggleHomework = function (hwId) {
    const hw = currentStudent.homework.find(h => h.id === hwId);
    if (hw) {
      hw.completed = !hw.completed;
      renderCurrentViewContent();
    }
  };

  window.openClassDetailModal = function () {
    const s = currentStudent;
    openStudentModal(`
      <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--text-title); margin-bottom:8px;">Class Details</h3>
      <div style="background:var(--bg-app); padding:14px; border-radius:10px; margin-bottom:16px;">
        <strong style="display:block; font-size:1rem; color:var(--primary-navy);">${escapeHtml(s.nextClass.title)}</strong>
        <span style="font-size:0.85rem; color:var(--text-muted);">Instructor: ${escapeHtml(s.nextClass.teacher)}</span>
        <div style="font-size:0.85rem; color:var(--text-title); margin-top:8px;">📅 ${s.nextClass.time}</div>
        <div style="font-size:0.85rem; color:var(--text-title);">📍 ${s.nextClass.room}</div>
      </div>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">
        Materials needed: Graph paper notebook, scientific calculator, and the official Arthur Letsker SHSAT practice volume.
      </p>
      <button type="button" class="btn btn-full btn-primary" onclick="closeStudentModal()">Got it</button>
    `);
  };

  window.openSyllabusModal = function (subjectName) {
    openStudentModal(`
      <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--text-title); margin-bottom:8px;">${escapeHtml(subjectName)}</h3>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">Detailed weekly learning track and diagnostic goals.</p>
      <ul style="display:flex; flex-direction:column; gap:8px; font-size:0.85rem; margin-bottom:20px;">
        <li>• <strong>Week 1-3:</strong> Foundational logic & core trap recognition</li>
        <li>• <strong>Week 4-6:</strong> High-speed computation and passage pacing</li>
        <li>• <strong>Week 7-9:</strong> Non-routine geometry shortcuts & poetry inference</li>
        <li>• <strong>Week 10+:</strong> Full-length proctored simulations & score optimization</li>
      </ul>
      <button type="button" class="btn btn-full btn-primary" onclick="closeStudentModal()">Close</button>
    `);
  };

  window.openAskQuestionModal = function (recipient) {
    openStudentModal(`
      <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--text-title); margin-bottom:4px;">Message to ${escapeHtml(recipient)}</h3>
      <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">Your message will be sent directly to your academic mentor.</p>
      <form onsubmit="handleSendStudentMsg(event)">
        <div style="margin-bottom:16px;">
          <textarea id="student_msg_text" rows="3" style="width:100%; padding:12px; border:1px solid var(--border-subtle); border-radius:8px; font-family:var(--font-body); font-size:0.9rem;" placeholder="Ask about homework, a test question, or weekend attendance..." required></textarea>
        </div>
        <div style="display:flex; gap:10px;">
          <button type="button" class="btn btn-light" style="flex:1;" onclick="closeStudentModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex:1;">Send Message</button>
        </div>
      </form>
    `);
  };

  window.handleSendStudentMsg = function (e) {
    e.preventDefault();
    const text = document.getElementById("student_msg_text").value.trim();
    if (!text) return;

    currentStudent.messages.unshift({
      sender: "You",
      time: "Just now",
      body: text
    });

    closeStudentModal();
    if (activeTab === "messages") renderCurrentViewContent();

    openStudentModal(`
      <div style="text-align:center; padding:12px;">
        <div style="font-size:2rem; color:var(--accent-green); margin-bottom:8px;">✓</div>
        <h3 style="font-family:var(--font-heading); font-size:1.15rem; margin-bottom:6px;">Message Sent</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Your mentor has received your inquiry and will reply shortly.</p>
        <button type="button" class="btn btn-full btn-primary" onclick="closeStudentModal()">Done</button>
      </div>
    `);
  };

  window.openStudentReportModal = function () {
    const s = currentStudent;
    openStudentModal(`
      <div style="text-align:center; margin-bottom:16px;">
        <span style="font-size:0.72rem; color:var(--accent-gold-text); font-weight:700; text-transform:uppercase;">Official Student Dossier</span>
        <h3 style="font-family:var(--font-heading); font-size:1.3rem; color:var(--text-title);">${escapeHtml(s.name)}</h3>
        <span style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(s.cohort)} • ${s.grade}</span>
      </div>

      <div style="background:var(--bg-app); padding:16px; border-radius:10px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
          <span>Target Specialized School:</span>
          <strong style="color:var(--accent-gold-text);">${escapeHtml(s.targetSchool)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
          <span>Current Scaled Composite:</span>
          <strong style="color:var(--primary-navy); font-size:1.1rem;">${s.scaledScore} / ${s.maxScore}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
          <span>Admission Benchmark:</span>
          <strong style="color:var(--accent-green);">Exceeded (${s.probability})</strong>
        </div>
      </div>

      <button type="button" class="btn btn-full btn-primary" onclick="window.print()">Print Official Report Card</button>
    `);
  };

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Auto-login if previously saved in session & initialize display mode
  document.addEventListener("DOMContentLoaded", function () {
    applyPortalDisplayMode();
    const savedId = sessionStorage.getItem("lgp_active_student");
    if (savedId && STUDENT_DATABASE[savedId]) {
      currentStudent = STUDENT_DATABASE[savedId];
      renderAppShell();
    }
  });
})();
