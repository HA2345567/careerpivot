<div align="center">
<img width="1200" height="475" alt="CareerPivot Banner" src="carrierpivot.png" />
</div>

# CareerPivot: The AI-Powered Career Transformation Platform

CareerPivot is an advanced, AI-driven platform designed to help professionals successfully navigate career transitions without the risk. By combining psychological validation, strategic roadmap generation, and micro-accountability, CareerPivot turns the daunting task of changing careers into a manageable, data-backed journey.

## 🚀 Key Features

*   **⚡ 1-2-3 Pivot Protocol**: A proprietary framework that moves users from Venting → Planning → Action in minutes.
*   **🤖 AI Accountability Agent**: A sophisticated bot that validates frustration and instantly converts it into tiny, 5-minute actionable micro-steps.
*   **🗺️ Safe Exit Roadmap**: Generates hyper-realistic, 6-12 month transition plans tailored to a user's specific constraints (mortgage, kids, time).
*   **💰 Salary Bridge Calculator**: A financial modeling tool that calculates the exact runway and "bridge job" income needed to safely leave a current role.
*   **🔍 Hidden Skills Audit**: Analyzes job descriptions to uncover transferable skills users didn't know they had.
*   **🤝 Network of Escapists**: A specialized mentor matching system for finding peers who have successfully pivoted.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS v4
*   **AI**: Google Gemini API (Gemini 2.5 Flash)
*   **Backend**: Supabase (Auth, Database, Edge Functions)
*   **Payments**: Stripe Integration

---

## 💻 Run Locally

**Prerequisites:** Node.js (v18+)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd careerpivot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_google_gemini_key
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **View the app:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase)

Copy the contents of `supabase_schema.sql` into the SQL Editor of your Supabase dashboard to set up the required tables and security policies.

---

## ☁️ Deployment

This project is optimized for deployment on Vercel or Netlify.
Ensure you add all environment variables in your deployment settings.
