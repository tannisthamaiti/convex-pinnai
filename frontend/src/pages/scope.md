**Scope Document: Earthscan SaaS Front-End Prototype**

**Objective:**
Create a clickable, front-end-only prototype of the Earthscan platform using React + Tailwind (or preferred stack) in Cursor. This prototype should visualize the user's journey from onboarding through data analysis results, incorporating placeholder content and navigation.

---

**Pages & Flow:**

1. **Landing / Login Page**
   - Title: "Earthscan – Platform Demo"
   - Tagline: "Math that drills deeper"
   - Register button → navigates to Register Page

2. **Register Page**
   - Form fields:
     - First Name*  
     - Last Name*  
     - Title  
     - Company Email*  
     - Company Name*  
     - Maximum number of wells to analyze (5 – 100,000)*  
     - Department
   - On Submit: sends email confirmation
   - On confirmation: redirect to Tier Selection Page

3. **Select Tier Package Page**
   - Tier Options:
     - Starter (up to 100 wells)
     - Essential (up to 300 wells)
     - Professional (up to 1,000 wells)
     - Enterprise (contact us)
   - Placeholder text: (INSERT LATIN HERE)
   - Highlights around:
     - Data copy options: user-hosted or PINN-hosted secure silo
     - Immediate data deletion after processing (user-first privacy)
     - Intelligent metrics generated based on uploaded data
     - Recommended data purchases from 3rd party vendor (placeholder)

4. **Data Upload Page**
   - This page is purely **visual** and does **not require actual data upload**.
   - Visuals:
     - A mock File Explorer or Finder window
     - Mouse cursor selects data files
     - User clicks "Upload" button to move to the next page
   - Purpose: Simulate ease of use and intuitive file selection process
   - Button: "Next"

5. **Third Party Data Vendor Page (Placeholder)**
   - Map of region with shaded leases (illustrative only)
   - List of available data types to purchase (no prices yet)
   - Button: "Next"

6. **Project Dashboard**
   - Summary of:
     - Wells uploaded
     - Completeness of data (mock visual)
   - Button: "Submit" (to begin analysis)

7. **Analysis Running Page**
   - Spinner or animation
   - Text: "Analyzing data..."

8. **Results Page**
   - Tabs:
     - Well Map / Lease Map (placeholder)
     - Reservoir Gradient (chart placeholder)
     - Frac Recipe Recommendation (text or chart placeholder)
     - Export/download button

9. **Settings / Account Page (Optional)**
   - Placeholder for future settings control

---

**General Notes:**
- No backend integration required
- Unlimited users per company assumed
- Navigation between pages should simulate real app feel
- Placeholder components for map, analytics, and charts OK
- Mobile responsive layout optional in this prototype phase
- No credit card required for trial access
- Free trial allows up to 100 wells processed

---

This document will guide the rapid prototyping of Earthscan's SaaS demo inside Cursor.

