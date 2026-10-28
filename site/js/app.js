/**
 * Little Genius Prep - Client Application Logic
 * Implements App-Native Modals, Anti-Spam Protections, and Diagnostic Form Validation.
 */

document.addEventListener("DOMContentLoaded", function () {
  
  // App-Native Modal System (Zero window.alert)
  const modalOverlay = document.getElementById("app-modal-overlay");
  const modalBody = document.getElementById("modal-body-content");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  function openAppModal(htmlContent) {
    if (!modalOverlay || !modalBody) return;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeAppModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeAppModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        closeAppModal();
      }
    });
  }

  // Handle escape key for modals
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("open")) {
      closeAppModal();
    }
  });

  // Diagnostic Inquiry Form (Anti-Spam Strict Standards)
  const inquiryForm = document.getElementById("diagnostic-inquiry-form");
  const submitBtn = document.getElementById("submit-inquiry-btn");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const honeypot = document.getElementById("_gotcha") ? document.getElementById("_gotcha").value : "";
      const parentName = document.getElementById("parent_name").value.trim();
      const studentName = document.getElementById("student_name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const currentGrade = document.getElementById("current_grade").value;
      const targetProgram = document.getElementById("target_program").value;
      const preferredFormat = document.getElementById("preferred_format").value;
      const notes = document.getElementById("notes").value.trim();

      // Check required fields
      if (!parentName || !studentName || !phone || !email || !currentGrade || !targetProgram) {
        openAppModal(`
          <div class="modal-icon-badge warning">!</div>
          <h3 class="modal-title">Please Complete Required Fields</h3>
          <p class="modal-desc">Kindly ensure all contact details, current grade, and target program are filled out.</p>
          <button type="button" class="btn btn-full btn-accent" onclick="document.getElementById('modal-close-btn').click()">Review Form</button>
        `);
        return;
      }

      // 1. Honeypot check (Silent drop if filled by bot)
      if (honeypot) {
        console.warn("Honeypot triggered. Silent fake success returned.");
        showFakeSuccess(parentName, studentName, targetProgram);
        inquiryForm.reset();
        return;
      }

      // 2. Cyrillic & bot signature check
      const cyrillicRegex = /[А-Яа-яЁё]/;
      if (cyrillicRegex.test(parentName) || cyrillicRegex.test(studentName) || cyrillicRegex.test(notes)) {
        console.warn("Bot signature detected. Silent fake success returned.");
        showFakeSuccess(parentName, studentName, targetProgram);
        inquiryForm.reset();
        return;
      }

      // UI Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Securing Assessment Seat...</span>`;

      const payload = {
        parentName,
        studentName,
        phone,
        email,
        currentGrade,
        targetProgram,
        preferredFormat,
        notes,
        submittedAt: new Date().toISOString()
      };

      try {
        // Post to backend with custom secret header token
        const response = await fetch("/api/inquiry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-lgp-client": "secure-form-v1" // Required anti-spam secret token header
          },
          body: JSON.stringify(payload)
        });

        // Even if standalone static without running server, handle gracefully
        if (!response.ok && response.status !== 404) {
          throw new Error("Server response error: " + response.status);
        }
      } catch (err) {
        console.log("Local fallback: storing inquiry in browser storage for demo.", err);
      }

      // Also persist to localStorage for the demo ERP to consume instantly
      saveInquiryLocally(payload);

      // Reset form & restore button
      inquiryForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Submit Diagnostic Booking Request</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

      // Show App-Native Confirmation Modal
      showBookingSuccessModal(payload);
    });
  }

  function showFakeSuccess(parentName, studentName, targetProgram) {
    openAppModal(`
      <div class="modal-icon-badge success">✓</div>
      <h3 class="modal-title">Diagnostic Request Received</h3>
      <p class="modal-desc">Thank you. An academic advisor will review the diagnostic request.</p>
      <button type="button" class="btn btn-full btn-primary" onclick="document.getElementById('modal-close-btn').click()">Done</button>
    `);
  }

  function showBookingSuccessModal(data) {
    openAppModal(`
      <div class="modal-icon-badge success">✓</div>
      <h3 class="modal-title">Diagnostic Reservation Confirmed!</h3>
      <p class="modal-desc">
        Thank you <strong>${escapeHtml(data.parentName)}</strong>! We have reserved a complimentary diagnostic assessment session for <strong>${escapeHtml(data.studentName)}</strong>.
      </p>

      <div class="modal-details-box">
        <div class="modal-details-row">
          <span>Target Program:</span>
          <strong>${escapeHtml(data.targetProgram)}</strong>
        </div>
        <div class="modal-details-row">
          <span>Current Grade:</span>
          <strong>${escapeHtml(data.currentGrade)}</strong>
        </div>
        <div class="modal-details-row">
          <span>Campus Location:</span>
          <strong>3065 Brighton 7th St, Brooklyn</strong>
        </div>
        <div class="modal-details-row">
          <span>Advising Hotline:</span>
          <strong>(347) 229-5498</strong>
        </div>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-dim); text-align: center; margin-bottom: 20px;">
        An academic advisor will text or call to confirm your preferred weekend timeslot. This inquiry has also been synced to the Little Genius Prep Academy ERP.
      </p>

      const erpUrl = window.location.port === "3080" ? "http://localhost:3081" : "../erp/index.html";
      modalContainer.innerHTML += `
        <div style="display:flex; gap:12px;">
          <button type="button" class="btn btn-full btn-primary" onclick="document.getElementById('modal-close-btn').click()">Close Window</button>
          <a href="${erpUrl}" target="_blank" class="btn btn-full btn-glass">View in Academy ERP</a>
        </div>
      `;
  }

  function saveInquiryLocally(inquiry) {
    try {
      const existing = JSON.parse(localStorage.getItem("lgp_inquiries") || "[]");
      inquiry.id = "INQ-" + Math.floor(1000 + Math.random() * 9000);
      inquiry.status = "New Inquiry";
      existing.unshift(inquiry);
      localStorage.setItem("lgp_inquiries", JSON.stringify(existing));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Adjust ERP link dynamically for local dual-port vs static GitHub Pages hosting
  const erpFooterLink = document.getElementById("link-erp-system");
  if (erpFooterLink && window.location.port === "3080") {
    erpFooterLink.href = "http://localhost:3081";
  }
});
