# Little Genius Prep - Showcase Website & Academy ERP

A dual-application platform built for **[Little Genius Prep](https://www.littlegeniusprep.org)** (3065 Brighton 7th St, Brooklyn, NY 11235).

---

## Architecture & Ports

This project runs dual dedicated localhost ports without conflicts:

| Component | Port / Path | Description |
| :--- | :---: | :--- |
| **Public Showcase Website** | `3080` (`/`) | High-conversion admissions landing, course catalog, interactive diagnostic quiz, and secure booking form. |
| **Student Space (Responsive)** | `3080` (`/student/`) | Full desktop & mobile responsive scholar portal with automatic layout switching, left sidebar on desktop, floating burger & bottom bar on mobile, SHSAT scaled score gauge, messages, and private teacher notes. |
| **Academy ERP Operations Suite** | `3081` (`/`) | Real-time CRM pipeline, SHSAT mock exam scoring engine, cohort rosters, attendance, and tuition ledger with instant Light/Dark theme switching. |

Registered in [`local_port_registry.md`](../local_port_registry.md).

---

## Key Features

### 1. Public Showcase Website (`http://localhost:3080`)
- **NYS Department of Education Accreditation**: Displays credentials and authority badges.
- **SHSAT Diagnostic Sandbox**: Interactive 3-question mini-assessment testing ELA revising/editing and math geometry/rate logic with immediate scaled projections.
- **Faculty & Author Spotlight**: Showcases Arthur Letsker (author of *Master the SHSAT: ELA*) and PhD mathematics educators.
- **Brighton Beach Campus Guide**: Interactive visual campus map with transit details for the B & Q subways and B1/B68 buses.
- **Strict Anti-Spam Protected Booking Form**:
  - Hidden honeypot field (`_gotcha`)
  - Secret client token header (`x-lgp-client: secure-form-v1`)
  - Cyrillic / bot signature filtering
  - Fake 200 OK responses to neutralize spam bots
  - Strictly no open-relay automated emails
  - App-native animated confirmation modal (zero `window.alert`)

### 2. Academy ERP Operations Suite (`http://localhost:3081`)
- **Theme Switcher (Light / Dark Mode)**: Switch seamlessly between executive Dark Mode and clean academic Light Theme with instant local persistence.
- **Executive Overview**: Real-time KPI summaries, cohort seat capacities, and incoming diagnostic requests.
- **Admissions Pipeline (CRM)**: Track incoming leads from `New Inquiry` to `Diagnostic Scheduled`, `Trial Session`, and `Enrolled`.
- **Mock Exam Engine (Flagship)**:
  - Official DOE 114-question grading simulator (57 ELA / 57 Math).
  - Scaled composite calculations (300 to 720+).
  - Cutoff comparisons: Stuyvesant (560+), Bronx Science (525+), Brooklyn Tech (505+), HSMSE (495+).
  - One-click print/export Student Progress Report Card.
- **Cohorts & Attendance Journal**: Check in students (Present/Late/Absent) with daily teacher notes.
- **Tuition & Billing Ledger**: Payment statuses, balances due, and printable tuition receipts.

---

## How to Run Locally

Because the backend is built using standard Node.js libraries, there are **no external npm dependencies** to download or install.

```bash
# In d:\Antigravity projects\little-genius-prep
node server.js
```

Or:
```bash
npm start
```

Then visit:
- **Public Website:** [http://localhost:3080](http://localhost:3080)
- **Academy ERP Portal:** [http://localhost:3081](http://localhost:3081)
