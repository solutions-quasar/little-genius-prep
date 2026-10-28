/**
 * Little Genius Prep - Academy ERP Main Application Controller
 * Handles views, lead pipeline, mock exam score calculator, and app-native dialogs.
 */

(function () {
  // State Initialization with LocalStorage Persistence
  let appState = {
    leads: [],
    cohorts: [],
    students: [],
    tuitionRecords: [],
    campusRooms: []
  };

  function loadState() {
    try {
      const saved = localStorage.getItem("lgp_erp_data");
      if (saved) {
        appState = JSON.parse(saved);
      } else {
        appState = JSON.parse(JSON.stringify(DEFAULT_LGP_DATA));
        saveState();
      }

      // Check if any fresh inquiries were posted from the public website
      const websiteInquiries = JSON.parse(localStorage.getItem("lgp_inquiries") || "[]");
      if (websiteInquiries.length > 0) {
        websiteInquiries.forEach(webInq => {
          if (!appState.leads.some(l => l.id === webInq.id)) {
            appState.leads.unshift(webInq);
          }
        });
        saveState();
      }
    } catch (e) {
      console.error("Error loading ERP state:", e);
      appState = JSON.parse(JSON.stringify(DEFAULT_LGP_DATA));
    }
  }

  function saveState() {
    try {
      localStorage.setItem("lgp_erp_data", JSON.stringify(appState));
    } catch (e) {
      console.error("Error saving ERP state:", e);
    }
  }

  // ERP Theme Controller (Light / Dark Mode)
  let currentTheme = localStorage.getItem("lgp_erp_theme") || "light";

  window.toggleERPTheme = function () {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("lgp_erp_theme", currentTheme);
    applyERPTheme();
  };

  function applyERPTheme() {
    const body = document.body;
    const label = document.getElementById("theme-toggle-label");
    if (currentTheme === "light") {
      body.classList.add("light-theme");
      document.documentElement.setAttribute("data-theme", "light");
      if (label) label.textContent = "Mode Sombre";
    } else {
      body.classList.remove("light-theme");
      document.documentElement.setAttribute("data-theme", "dark");
      if (label) label.textContent = "Mode Clair";
    }
  }

  // App-Native Modal System (Strictly No window.alert)
  const modalOverlay = document.getElementById("erp-modal-overlay");
  const modalBody = document.getElementById("erp-modal-body-content");
  const modalCloseBtn = document.getElementById("erp-modal-close-btn");

  window.openERPModal = function (html) {
    if (!modalOverlay || !modalBody) return;
    modalBody.innerHTML = html;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
  };

  window.closeERPModal = function () {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", window.closeERPModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) window.closeERPModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("open")) {
      window.closeERPModal();
    }
  });

  // Navigation & View Routing
  let currentView = "dashboard";

  function initNav() {
    const navButtons = document.querySelectorAll(".sidebar-nav .nav-item");
    navButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const view = this.getAttribute("data-view");
        if (!view) return;
        navButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentView = view;
        renderCurrentView();
      });
    });

    updateInquiryBadge();
  }

  function updateInquiryBadge() {
    const badge = document.getElementById("inquiries-count-badge");
    if (!badge) return;
    const newCount = appState.leads.filter(l => l.status === "New Inquiry").length;
    badge.textContent = newCount;
    badge.style.display = newCount > 0 ? "inline-block" : "none";
  }

  function renderCurrentView() {
    const container = document.getElementById("erp-content-viewport");
    if (!container) return;

    updateInquiryBadge();

    switch (currentView) {
      case "dashboard":
        container.innerHTML = renderDashboardView();
        break;
      case "leads":
        container.innerHTML = renderLeadsView();
        break;
      case "cohorts":
        container.innerHTML = renderCohortsView();
        break;
      case "mock-exams":
        container.innerHTML = renderMockExamsView();
        break;
      case "attendance":
        container.innerHTML = renderAttendanceView();
        break;
      case "tuition":
        container.innerHTML = renderTuitionView();
        break;
      case "schedule":
        container.innerHTML = renderScheduleView();
        break;
      default:
        container.innerHTML = renderDashboardView();
    }

    bindViewEvents();
  }

  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  function renderDashboardView() {
    const totalStudents = appState.students.length;
    const activeCohorts = appState.cohorts.length;
    const pendingLeads = appState.leads.filter(l => l.status === "New Inquiry").length;
    const totalTuition = appState.tuitionRecords.reduce((acc, cur) => acc + (cur.paidAmount || 0), 0);

    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Executive Academy Dashboard</h1>
          <p>Welcome back, Arthur. Monitoring Fall 2026 SHSAT enrollment, diagnostic scores, and facility allocations.</p>
        </div>
        <div class="view-actions">
          <button type="button" class="btn btn-primary" onclick="openNewLeadModal()">+ New Inquiry</button>
          <button type="button" class="btn btn-accent" onclick="openScoreEntryModal()">+ Record Mock Test</button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Active Scholars</span>
            <div class="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            </div>
          </div>
          <div class="kpi-value">${totalStudents}</div>
          <div class="kpi-sub">Across 4 Brighton cohorts • <strong>94% attendance</strong></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Average SHSAT Scaled</span>
            <div class="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
          </div>
          <div class="kpi-value">537</div>
          <div class="kpi-sub">+48 pts growth since baseline diagnostic</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Pending Inquiries</span>
            <div class="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div class="kpi-value" style="color:var(--accent-gold);">${pendingLeads}</div>
          <div class="kpi-sub">From website diagnostic booking form</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Fall Term Revenue</span>
            <div class="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <div class="kpi-value">$${totalTuition.toLocaleString()}</div>
          <div class="kpi-sub">Tuition ledger in good standing</div>
        </div>
      </div>

      <!-- Live Pipeline & Cohort Capacity -->
      <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; margin-bottom: 32px;">
        
        <div class="table-card">
          <div class="table-card-header">
            <span class="table-card-title">Recent Inquiries & Diagnostics</span>
            <button type="button" class="btn btn-sm btn-ghost" onclick="document.querySelector('[data-view=leads]').click()">View All</button>
          </div>
          <div class="table-responsive">
            <table class="erp-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Target Program</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${appState.leads.slice(0, 4).map(lead => `
                  <tr>
                    <td>
                      <strong>${escapeHtml(lead.studentName)}</strong><br>
                      <span style="font-size:0.75rem; color:var(--text-tertiary);">Parent: ${escapeHtml(lead.parentName)}</span>
                    </td>
                    <td>${escapeHtml(lead.currentGrade)}</td>
                    <td><span class="target-school-tag">${escapeHtml(lead.targetProgram)}</span></td>
                    <td><span class="status-pill ${getStatusPillClass(lead.status)}">${escapeHtml(lead.status)}</span></td>
                    <td>
                      <button type="button" class="btn btn-sm btn-ghost" onclick="viewLeadDetails('${lead.id}')">Inspect</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cohort Capacity Card -->
        <div class="table-card">
          <div class="table-card-header">
            <span class="table-card-title">Brighton Cohort Capacity</span>
          </div>
          <div style="padding: 20px; display:flex; flex-direction:column; gap:16px;">
            ${appState.cohorts.map(c => {
              const pct = Math.round((c.enrolledCount / c.maxCapacity) * 100);
              return `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                    <strong>${escapeHtml(c.name)}</strong>
                    <span style="color:var(--text-secondary);">${c.enrolledCount} / ${c.maxCapacity} seats</span>
                  </div>
                  <div class="score-progress-bar" style="width:100%;">
                    <div class="score-progress-fill ${pct > 80 ? 'mid' : 'high'}" style="width:${pct}%;"></div>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-tertiary); margin-top:2px;">
                    ${c.room} • ${c.schedule}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }

  function renderLeadsView() {
    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Admissions Pipeline & CRM</h1>
          <p>Review parent inquiries, book proctored diagnostics, and advance candidates into enrolled cohorts.</p>
        </div>
        <div class="view-actions">
          <button type="button" class="btn btn-primary" onclick="openNewLeadModal()">+ Add New Inquiry</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="erp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student & Parent</th>
                <th>Contact</th>
                <th>Grade & Format</th>
                <th>Target Program</th>
                <th>Pipeline Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${appState.leads.map(lead => `
                <tr>
                  <td><code>${lead.id}</code></td>
                  <td>
                    <strong>${escapeHtml(lead.studentName)}</strong><br>
                    <span style="font-size:0.78rem; color:var(--text-secondary);">Parent: ${escapeHtml(lead.parentName)}</span>
                  </td>
                  <td>
                    <div>${escapeHtml(lead.phone)}</div>
                    <span style="font-size:0.75rem; color:var(--text-tertiary);">${escapeHtml(lead.email)}</span>
                  </td>
                  <td>
                    <strong>${escapeHtml(lead.currentGrade)}</strong><br>
                    <span style="font-size:0.75rem; color:var(--text-tertiary);">${escapeHtml(lead.preferredFormat || 'In-Person')}</span>
                  </td>
                  <td><span class="target-school-tag">${escapeHtml(lead.targetProgram)}</span></td>
                  <td>
                    <select class="form-group-erp" style="padding:4px 8px; font-size:0.78rem;" onchange="updateLeadStatus('${lead.id}', this.value)">
                      <option value="New Inquiry" ${lead.status === 'New Inquiry' ? 'selected' : ''}>New Inquiry</option>
                      <option value="Diagnostic Scheduled" ${lead.status === 'Diagnostic Scheduled' ? 'selected' : ''}>Diagnostic Scheduled</option>
                      <option value="Trial Session" ${lead.status === 'Trial Session' ? 'selected' : ''}>Trial Session</option>
                      <option value="Enrolled" ${lead.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
                    </select>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button type="button" class="btn btn-sm btn-ghost" onclick="viewLeadDetails('${lead.id}')">Details</button>
                      ${lead.status !== 'Enrolled' ? `
                        <button type="button" class="btn btn-sm btn-primary" onclick="convertLeadToStudent('${lead.id}')">Enroll</button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCohortsView() {
    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Student Rosters & Cohorts</h1>
          <p>Brighton Beach active student cohorts, attendance health, and instructor assignments.</p>
        </div>
        <div class="view-actions">
          <button type="button" class="btn btn-primary" onclick="openEnrollStudentModal()">+ Direct Enroll Student</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="erp-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Cohort</th>
                <th>Target School Goal</th>
                <th>Attendance</th>
                <th>Tuition Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${appState.students.map(stu => `
                <tr>
                  <td><code>${stu.id}</code></td>
                  <td>
                    <strong>${escapeHtml(stu.name)}</strong><br>
                    <span style="font-size:0.75rem; color:var(--text-tertiary);">${escapeHtml(stu.grade)} • Parent: ${escapeHtml(stu.parentName)}</span>
                  </td>
                  <td>
                    <strong>${escapeHtml(stu.cohortName)}</strong>
                  </td>
                  <td>
                    <span class="target-school-tag" style="color:var(--accent-gold);">${escapeHtml(stu.targetSchool)}</span>
                  </td>
                  <td>
                    <strong style="color:var(--accent-green);">${stu.attendanceRate}</strong>
                  </td>
                  <td>
                    <span class="status-pill ${stu.tuitionStatus === 'Paid' ? 'paid' : 'partial'}">${stu.tuitionStatus}</span>
                  </td>
                  <td>
                    <button type="button" class="btn btn-sm btn-ghost" onclick="viewStudentReportCard('${stu.id}')">Progress Report</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderMockExamsView() {
    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>SHSAT Mock Exam Engine & Scaled Scoring</h1>
          <p>Official DOE algorithm scaled curve simulator, raw question grading (57 ELA / 57 Math), and target cutoffs.</p>
        </div>
        <div class="view-actions">
          <button type="button" class="btn btn-accent" onclick="openScoreEntryModal()">+ Enter Student Mock Score</button>
        </div>
      </div>

      <!-- Cutoff Reference Strip -->
      <div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
        <div class="target-school-tag" style="background:rgba(245,158,11,0.1); border-color:var(--accent-gold); color:var(--accent-gold); padding:8px 14px;">
          <strong>Stuyvesant:</strong> 560+
        </div>
        <div class="target-school-tag" style="padding:8px 14px;">
          <strong>Bronx Science:</strong> 525+
        </div>
        <div class="target-school-tag" style="padding:8px 14px;">
          <strong>Brooklyn Tech:</strong> 505+
        </div>
        <div class="target-school-tag" style="padding:8px 14px;">
          <strong>Staten Island Tech:</strong> 515+
        </div>
        <div class="target-school-tag" style="padding:8px 14px;">
          <strong>HSMSE / City College:</strong> 495+
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="erp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Latest Exam</th>
                <th>Raw Breakdown</th>
                <th>Scaled Scores</th>
                <th>Composite Scaled</th>
                <th>Admission Probability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${appState.students.map(stu => {
                const s = stu.latestScore || {};
                const composite = s.scaledTotal || 0;
                let probClass = "needs-work";
                if (composite >= 540) probClass = "high";
                else if (composite >= 490) probClass = "medium";

                return `
                  <tr>
                    <td>
                      <strong>${escapeHtml(stu.name)}</strong><br>
                      <span style="font-size:0.75rem; color:var(--text-tertiary);">${escapeHtml(stu.targetSchool)}</span>
                    </td>
                    <td>
                      <strong>${escapeHtml(s.examName || 'Baseline Assessment')}</strong><br>
                      <span style="font-size:0.75rem; color:var(--text-tertiary);">${s.date || '2026-10-21'}</span>
                    </td>
                    <td>
                      ${s.rawELA ? `ELA: <strong>${s.rawELA}</strong>/57 • Math: <strong>${s.rawMath}</strong>/57` : 'Overall Score: ' + s.scaledTotal}
                    </td>
                    <td>
                      ${s.scaledELA ? `ELA: ${s.scaledELA} • Math: ${s.scaledMath}` : '-'}
                    </td>
                    <td>
                      <span class="score-pill-composite">${s.scaledTotal}</span>
                      <div class="score-progress-bar">
                        <div class="score-progress-fill ${probClass}" style="width:${Math.min(100, (composite / 650) * 100)}%;"></div>
                      </div>
                    </td>
                    <td>
                      <span class="probability-indicator ${probClass}">
                        ${escapeHtml(s.probability || 'On Track')}
                      </span>
                    </td>
                    <td>
                      <button type="button" class="btn btn-sm btn-ghost" onclick="viewStudentReportCard('${stu.id}')">Print Report Card</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAttendanceView() {
    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Classroom Attendance & Daily Journal</h1>
          <p>Brighton Beach campus check-ins, homework completion records, and teacher lesson notes.</p>
        </div>
      </div>

      <div class="table-card" style="margin-bottom:24px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; gap:16px; align-items:center;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-tertiary); display:block; margin-bottom:4px;">Date</label>
              <input type="date" value="2026-10-28" class="erp-input-sm">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-tertiary); display:block; margin-bottom:4px;">Selected Cohort</label>
              <select class="erp-input-sm">
                <option>SHSAT Fall Intensive Alpha (Arthur Letsker)</option>
                <option>Regents Geometry Mastery (Dr. Marina V.)</option>
                <option>Mark Twain Talent Prep (Alexander R.)</option>
              </select>
            </div>
          </div>
          <div>
            <button type="button" class="btn btn-primary" onclick="alertAttendanceSaved()">Save Daily Attendance</button>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="erp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Homework Check</th>
                <th>Teacher Diagnostic Observation</th>
              </tr>
            </thead>
            <tbody>
              ${appState.students.slice(0, 5).map((stu, i) => `
                <tr>
                  <td><strong>${escapeHtml(stu.name)}</strong></td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <label style="display:flex; align-items:center; gap:4px; font-size:0.8rem; cursor:pointer;">
                        <input type="radio" name="att_${stu.id}" value="Present" checked> Present
                      </label>
                      <label style="display:flex; align-items:center; gap:4px; font-size:0.8rem; cursor:pointer;">
                        <input type="radio" name="att_${stu.id}" value="Late"> Late
                      </label>
                      <label style="display:flex; align-items:center; gap:4px; font-size:0.8rem; cursor:pointer;">
                        <input type="radio" name="att_${stu.id}" value="Absent"> Absent
                      </label>
                    </div>
                  </td>
                  <td>
                    <span style="color:var(--accent-green); font-weight:700;">Complete (100%)</span>
                  </td>
                  <td>
                    <input type="text" value="${i === 1 ? 'Mastered circle theorem grid-ins. Quick time pace.' : 'Showed strong reading inference stamina.'}" style="width:100%; background:rgba(0,0,0,0.25); border:1px solid var(--border-subtle); color:#FFF; padding:6px 10px; border-radius:4px; font-size:0.85rem;">
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderTuitionView() {
    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Tuition & Payment Ledger</h1>
          <p>Tuition plans, semester balances, and app-native invoice generator.</p>
        </div>
        <div class="view-actions">
          <button type="button" class="btn btn-primary" onclick="openNewInvoiceModal()">+ Create Invoice</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="erp-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th>Program / Cohort</th>
                <th>Due Date</th>
                <th>Total Fee</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${appState.tuitionRecords.map(inv => `
                <tr>
                  <td><code>${inv.id}</code></td>
                  <td><strong>${escapeHtml(inv.studentName)}</strong></td>
                  <td>${escapeHtml(inv.program)}</td>
                  <td>${inv.dueDate}</td>
                  <td>$${inv.amount.toLocaleString()}</td>
                  <td style="color:var(--accent-green);">$${inv.paidAmount.toLocaleString()}</td>
                  <td style="color:${inv.balance > 0 ? 'var(--accent-gold)' : 'var(--text-tertiary)'};">
                    $${inv.balance.toLocaleString()}
                  </td>
                  <td><span class="status-pill ${inv.status.toLowerCase()}">${inv.status}</span></td>
                  <td>
                    <button type="button" class="btn btn-sm btn-ghost" onclick="printInvoice('${inv.id}')">Print Receipt</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderScheduleView() {
    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Brighton Beach Campus Room Schedule</h1>
          <p>3065 Brighton 7th St facility allocation, physical room capacity, and live Zoom hybrid feeds.</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:24px;">
        ${appState.campusRooms.map(rm => `
          <div class="table-card" style="padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <span class="table-card-title" style="font-size:1.1rem;">${escapeHtml(rm.name)}</span>
              <span class="status-pill new">Cap: ${rm.capacity}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
              ${escapeHtml(rm.features)}
            </p>
            <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-subtle); padding:12px; border-radius:6px; margin-bottom:16px;">
              <span style="font-size:0.75rem; color:var(--accent-gold); display:block; font-weight:700; text-transform:uppercase;">Current Assignment</span>
              <strong style="font-size:0.9rem;">${escapeHtml(rm.currentCohort)}</strong>
            </div>
            <button type="button" class="btn btn-sm btn-ghost" style="width:100%;" onclick="openRoomScheduleModal('${escapeHtml(rm.name)}')">View Weekly Timetable</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  function bindViewEvents() {
    // Dynamic binding if needed
  }

  // ==========================================
  // APP-NATIVE MODAL ACTIONS (NO window.alert)
  // ==========================================

  window.openScoreEntryModal = function () {
    const studentOptions = appState.students.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.cohortName)})</option>`).join('');

    openERPModal(`
      <h2 style="font-family:var(--font-heading); margin-bottom:8px;">Enter Mock Exam Scaled Score</h2>
      <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
        Input raw answers (out of 57 per section) to calculate official DOE scaled score and target admission probability.
      </p>

      <form id="score-entry-form" class="modal-form" onsubmit="handleScoreSubmit(event)">
        <div class="form-group-erp">
          <label>Select Student *</label>
          <select id="modal_stu_id" required>
            ${studentOptions}
          </select>
        </div>

        <div class="form-group-erp">
          <label>Exam Benchmark Name *</label>
          <input type="text" id="modal_exam_name" value="Mock Test #4 (Fall Intensive)" required>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div class="form-group-erp">
            <label>Raw ELA Score (0 – 57) *</label>
            <input type="number" id="modal_raw_ela" min="0" max="57" value="48" required oninput="previewScoreCalculation()">
          </div>
          <div class="form-group-erp">
            <label>Raw Math Score (0 – 57) *</label>
            <input type="number" id="modal_raw_math" min="0" max="57" value="52" required oninput="previewScoreCalculation()">
          </div>
        </div>

        <!-- Live Score Calculation Box -->
        <div id="live-score-preview" style="background:rgba(245,158,11,0.1); border:1px solid var(--border-gold); padding:16px; border-radius:8px; margin-top:8px;">
          <div style="font-size:0.8rem; color:var(--accent-gold); font-weight:700; text-transform:uppercase;">Live Scaled Projection</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span style="font-size:1.4rem; font-weight:800; color:#FFF;" id="preview-composite-val">580</span>
            <span class="status-pill enrolled" id="preview-target-val">Stuyvesant Benchmark (560+)</span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" onclick="closeERPModal()">Cancel</button>
          <button type="submit" class="btn btn-accent">Save & Update Student Profile</button>
        </div>
      </form>
    `);

    previewScoreCalculation();
  };

  window.previewScoreCalculation = function () {
    const rawEla = parseInt(document.getElementById("modal_raw_ela")?.value || 0, 10);
    const rawMath = parseInt(document.getElementById("modal_raw_math")?.value || 0, 10);
    const result = calculateSHSATScore(rawEla, rawMath);

    const compEl = document.getElementById("preview-composite-val");
    const targetEl = document.getElementById("preview-target-val");
    if (compEl) compEl.textContent = result.composite;
    if (targetEl) targetEl.textContent = result.targetMatch;
  };

  window.handleScoreSubmit = function (e) {
    e.preventDefault();
    const stuId = document.getElementById("modal_stu_id").value;
    const examName = document.getElementById("modal_exam_name").value;
    const rawEla = parseInt(document.getElementById("modal_raw_ela").value, 10);
    const rawMath = parseInt(document.getElementById("modal_raw_math").value, 10);

    const scoreData = calculateSHSATScore(rawEla, rawMath);
    const student = appState.students.find(s => s.id === stuId);

    if (student) {
      student.latestScore = {
        examName: examName,
        rawELA: rawEla,
        rawMath: rawMath,
        scaledELA: scoreData.scaledELA,
        scaledMath: scoreData.scaledMath,
        scaledTotal: scoreData.composite,
        targetCutoff: 560,
        probability: `${scoreData.tier} (${scoreData.targetMatch})`,
        date: new Date().toISOString().split("T")[0]
      };
      saveState();
    }

    closeERPModal();
    renderCurrentView();

    openERPModal(`
      <div style="text-align:center; padding:12px;">
        <div style="width:50px; height:50px; border-radius:50%; background:rgba(16,185,129,0.2); color:#10B981; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:1.5rem;">✓</div>
        <h3 style="font-family:var(--font-heading); margin-bottom:8px;">Score Recorded Successfully</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
          ${escapeHtml(student.name)}'s scaled composite of <strong>${scoreData.composite}</strong> has been updated.
        </p>
        <button type="button" class="btn btn-primary" onclick="closeERPModal()">Done</button>
      </div>
    `);
  };

  window.viewStudentReportCard = function (studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;

    const s = student.latestScore || {};
    openERPModal(`
      <div style="border-bottom:1px solid var(--border-subtle); padding-bottom:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.75rem; color:var(--accent-gold); text-transform:uppercase; font-weight:700;">Little Genius Prep Diagnostic Evaluation</span>
          <h2 style="font-family:var(--font-heading); margin-top:2px;">Official Student Score Report</h2>
        </div>
        <button type="button" class="btn btn-sm btn-ghost" onclick="window.print()">Print / Export</button>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px; background:rgba(0,0,0,0.25); padding:16px; border-radius:8px;">
        <div>
          <span style="font-size:0.75rem; color:var(--text-tertiary);">Student Name</span>
          <div style="font-size:1.1rem; font-weight:700;">${escapeHtml(student.name)}</div>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-tertiary);">Grade & Program</span>
          <div>${escapeHtml(student.grade)} • ${escapeHtml(student.cohortName)}</div>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-tertiary);">Target Specialized HS</span>
          <div style="color:var(--accent-gold); font-weight:700;">${escapeHtml(student.targetSchool)}</div>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-tertiary);">Assessment Date</span>
          <div>${s.date || '2026-10-21'}</div>
        </div>
      </div>

      <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:8px; padding:20px; text-align:center; margin-bottom:20px;">
        <span style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase;">Composite Scaled Score</span>
        <div style="font-family:var(--font-heading); font-size:3rem; font-weight:800; color:var(--text-primary); margin:4px 0;">
          ${s.scaledTotal}
        </div>
        <span class="status-pill enrolled" style="font-size:0.9rem;">${s.probability || 'Passing Stuyvesant Benchmark'}</span>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:24px;">
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); padding:14px; border-radius:6px; border-left:3px solid var(--accent-blue);">
          <strong style="display:block; margin-bottom:4px;">English Language Arts (ELA)</strong>
          <div style="font-size:0.85rem; color:var(--text-secondary);">Raw: ${s.rawELA || 48} / 57 • Scaled: ${s.scaledELA || 280}</div>
          <p style="font-size:0.8rem; color:var(--text-tertiary); margin-top:6px;">Strong command of revising/editing transitions. Recommended focus: poetic inference.</p>
        </div>
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); padding:14px; border-radius:6px; border-left:3px solid var(--accent-gold);">
          <strong style="display:block; margin-bottom:4px;">Mathematics</strong>
          <div style="font-size:0.85rem; color:var(--text-secondary);">Raw: ${s.rawMath || 53} / 57 • Scaled: ${s.scaledMath || 305}</div>
          <p style="font-size:0.8rem; color:var(--text-tertiary); margin-top:6px;">Exceptional speed in coordinate geometry. Minor arithmetic slip on rate problem.</p>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" onclick="closeERPModal()">Close</button>
        <button type="button" class="btn btn-primary" onclick="window.print()">Print Official Report</button>
      </div>
    `);
  };

  window.viewLeadDetails = function (leadId) {
    const lead = appState.leads.find(l => l.id === leadId);
    if (!lead) return;

    openERPModal(`
      <h2 style="font-family:var(--font-heading); margin-bottom:4px;">Inquiry Dossier: ${escapeHtml(lead.studentName)}</h2>
      <span style="font-size:0.8rem; color:var(--text-tertiary);">Received ${lead.submittedAt ? new Date(lead.submittedAt).toLocaleDateString() : 'Recently'}</span>

      <div style="display:flex; flex-direction:column; gap:14px; margin:20px 0;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div>
            <label style="font-size:0.75rem; color:var(--text-tertiary);">Parent Name</label>
            <div style="font-weight:600;">${escapeHtml(lead.parentName)}</div>
          </div>
          <div>
            <label style="font-size:0.75rem; color:var(--text-tertiary);">Phone</label>
            <div><a href="tel:${lead.phone}" style="color:var(--accent-blue);">${escapeHtml(lead.phone)}</a></div>
          </div>
          <div>
            <label style="font-size:0.75rem; color:var(--text-tertiary);">Email</label>
            <div>${escapeHtml(lead.email)}</div>
          </div>
          <div>
            <label style="font-size:0.75rem; color:var(--text-tertiary);">Current Grade</label>
            <div>${escapeHtml(lead.currentGrade)}</div>
          </div>
        </div>

        <div>
          <label style="font-size:0.75rem; color:var(--text-tertiary);">Target Program</label>
          <div style="font-weight:700; color:var(--accent-gold);">${escapeHtml(lead.targetProgram)}</div>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:14px; border-radius:6px; border:1px solid var(--border-subtle);">
          <label style="font-size:0.75rem; color:var(--text-tertiary); display:block; margin-bottom:4px;">Parent Notes & Context</label>
          <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5;">${escapeHtml(lead.notes || 'No extra notes provided.')}</div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" onclick="closeERPModal()">Close</button>
        ${lead.status !== 'Enrolled' ? `
          <button type="button" class="btn btn-primary" onclick="convertLeadToStudent('${lead.id}')">Convert to Enrolled Student</button>
        ` : ''}
      </div>
    `);
  };

  window.convertLeadToStudent = function (leadId) {
    const lead = appState.leads.find(l => l.id === leadId);
    if (!lead) return;

    lead.status = "Enrolled";

    const newStudent = {
      id: "STU-" + (appState.students.length + 101),
      name: lead.studentName,
      cohortId: "COH-SHSAT-A",
      cohortName: "SHSAT Fall Intensive Alpha",
      targetSchool: "Stuyvesant High School",
      grade: lead.currentGrade,
      parentName: lead.parentName,
      parentPhone: lead.phone,
      attendanceRate: "100%",
      tuitionStatus: "Partial",
      latestScore: {
        examName: "Initial Baseline Diagnostic",
        scaledTotal: 505,
        date: new Date().toISOString().split("T")[0]
      }
    };

    appState.students.push(newStudent);
    saveState();
    closeERPModal();
    renderCurrentView();

    openERPModal(`
      <div style="text-align:center; padding:12px;">
        <div style="width:50px; height:50px; border-radius:50%; background:rgba(16,185,129,0.2); color:#10B981; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:1.5rem;">✓</div>
        <h3 style="font-family:var(--font-heading); margin-bottom:8px;">Student Enrolled!</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
          ${escapeHtml(lead.studentName)} has been added to the Active Scholars Roster (ID: ${newStudent.id}).
        </p>
        <button type="button" class="btn btn-primary" onclick="closeERPModal()">Go to Cohort Roster</button>
      </div>
    `);
  };

  window.updateLeadStatus = function (leadId, newStatus) {
    const lead = appState.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      saveState();
      updateInquiryBadge();
    }
  };

  window.openNewLeadModal = function () {
    openERPModal(`
      <h2 style="font-family:var(--font-heading); margin-bottom:8px;">Add New Assessment Inquiry</h2>
      <form class="modal-form" onsubmit="handleNewLeadSubmit(event)">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-group-erp">
            <label>Parent Name *</label>
            <input type="text" id="nl_parent" required>
          </div>
          <div class="form-group-erp">
            <label>Student Name *</label>
            <input type="text" id="nl_student" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-group-erp">
            <label>Phone Number *</label>
            <input type="tel" id="nl_phone" required>
          </div>
          <div class="form-group-erp">
            <label>Email Address</label>
            <input type="email" id="nl_email">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-group-erp">
            <label>Current Grade *</label>
            <select id="nl_grade" required>
              <option>7th Grade</option>
              <option>8th Grade</option>
              <option>5th Grade (Mark Twain)</option>
              <option>Kindergarten – 3rd Grade (G&T)</option>
              <option>High School 9-12 (Regents)</option>
            </select>
          </div>
          <div class="form-group-erp">
            <label>Target Program *</label>
            <select id="nl_program" required>
              <option>SHSAT Specialized High Schools</option>
              <option>NYS Regents Math & Science</option>
              <option>Mark Twain / Bay Academy</option>
              <option>Gifted and Talented (G&T)</option>
            </select>
          </div>
        </div>

        <div class="form-group-erp">
          <label>Diagnostic Notes</label>
          <textarea id="nl_notes" rows="2"></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" onclick="closeERPModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Inquiry Record</button>
        </div>
      </form>
    `);
  };

  window.handleNewLeadSubmit = function (e) {
    e.preventDefault();
    const newLead = {
      id: "INQ-" + Math.floor(1000 + Math.random() * 9000),
      parentName: document.getElementById("nl_parent").value.trim(),
      studentName: document.getElementById("nl_student").value.trim(),
      phone: document.getElementById("nl_phone").value.trim(),
      email: document.getElementById("nl_email").value.trim() || "inquiry@example.com",
      currentGrade: document.getElementById("nl_grade").value,
      targetProgram: document.getElementById("nl_program").value,
      preferredFormat: "In-Person (Brighton 7th St)",
      status: "New Inquiry",
      notes: document.getElementById("nl_notes").value.trim(),
      submittedAt: new Date().toISOString()
    };

    appState.leads.unshift(newLead);
    saveState();
    closeERPModal();
    renderCurrentView();
  };

  window.printInvoice = function (invId) {
    const inv = appState.tuitionRecords.find(i => i.id === invId);
    if (!inv) return;

    openERPModal(`
      <div style="border-bottom:1px solid var(--border-subtle); padding-bottom:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.75rem; color:var(--accent-gold); font-weight:700;">LITTLE GENIUS PREP • BROOKLYN NY</span>
          <h2 style="font-family:var(--font-heading);">Tuition Statement & Receipt</h2>
        </div>
        <div>
          <button type="button" class="btn btn-sm btn-ghost" onclick="window.print()">Print</button>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:0.9rem;">
        <div>
          <strong>Billed To:</strong><br>
          Student: ${escapeHtml(inv.studentName)}<br>
          Facility: 3065 Brighton 7th St, Brooklyn NY
        </div>
        <div style="text-align:right;">
          <strong>Invoice:</strong> ${inv.id}<br>
          <strong>Date:</strong> ${inv.dueDate}<br>
          <strong>Status:</strong> <span class="status-pill ${inv.status.toLowerCase()}">${inv.status}</span>
        </div>
      </div>

      <table class="erp-table" style="margin-bottom:24px;">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${escapeHtml(inv.program)}</td>
            <td style="text-align:right;">$${inv.amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Amount Paid</strong></td>
            <td style="text-align:right; color:var(--accent-green);"><strong>-$${inv.paidAmount.toLocaleString()}</strong></td>
          </tr>
          <tr>
            <td><strong>Remaining Balance</strong></td>
            <td style="text-align:right; font-size:1.1rem; color:var(--accent-gold);"><strong>$${inv.balance.toLocaleString()}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" onclick="closeERPModal()">Close</button>
        <button type="button" class="btn btn-primary" onclick="window.print()">Print Receipt</button>
      </div>
    `);
  };

  window.alertAttendanceSaved = function () {
    openERPModal(`
      <div style="text-align:center; padding:12px;">
        <div style="width:50px; height:50px; border-radius:50%; background:rgba(16,185,129,0.2); color:#10B981; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:1.5rem;">✓</div>
        <h3 style="font-family:var(--font-heading); margin-bottom:8px;">Attendance & Notes Saved</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
          Today's Brighton 7th St cohort attendance journal has been committed to permanent records.
        </p>
        <button type="button" class="btn btn-primary" onclick="closeERPModal()">Done</button>
      </div>
    `);
  };

  window.openRoomScheduleModal = function (roomName) {
    openERPModal(`
      <h2 style="font-family:var(--font-heading); margin-bottom:4px;">Weekly Schedule • ${escapeHtml(roomName)}</h2>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:20px;">3065 Brighton 7th St Learning Facility</p>

      <div style="display:flex; flex-direction:column; gap:10px; font-size:0.9rem;">
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); padding:12px; border-radius:6px; display:flex; justify-content:space-between;">
          <span>Saturday: 9:30 AM – 1:30 PM</span>
          <strong style="color:var(--accent-gold);">SHSAT Fall Intensive Alpha</strong>
        </div>
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); padding:12px; border-radius:6px; display:flex; justify-content:space-between;">
          <span>Saturday: 2:00 PM – 6:00 PM</span>
          <strong style="color:var(--accent-gold);">SHSAT Priority Track Beta</strong>
        </div>
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); padding:12px; border-radius:6px; display:flex; justify-content:space-between;">
          <span>Sunday: 10:00 AM – 1:00 PM</span>
          <strong style="color:var(--accent-gold);">Mark Twain JHS Talent Prep</strong>
        </div>
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); padding:12px; border-radius:6px; display:flex; justify-content:space-between;">
          <span>Tue & Thu: 4:30 PM – 6:30 PM</span>
          <strong style="color:var(--accent-gold);">Regents Geometry Accelerator</strong>
        </div>
      </div>

      <div class="modal-actions" style="margin-top:24px;">
        <button type="button" class="btn btn-primary" onclick="closeERPModal()">Close</button>
      </div>
    `);
  };

  function getStatusPillClass(status) {
    if (status === "New Inquiry") return "new";
    if (status === "Diagnostic Scheduled") return "scheduled";
    if (status === "Trial Session") return "partial";
    if (status === "Enrolled") return "enrolled";
    return "new";
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // App Mount
  document.addEventListener("DOMContentLoaded", function () {
    applyERPTheme();
    loadState();
    initNav();
    renderCurrentView();
  });
})();
