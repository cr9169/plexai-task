# Property Deal Analyzer

A 2-hour coding challenge. Build a fullstack application that analyzes commercial real estate deals.

**Stack:** Nest.js (backend) + React/Vite (frontend) + TypeScript

**AI tools:** Use freely. Claude Code, Copilot, ChatGPT — whatever you prefer.

**Candidate Guide:** [Candidate_Guide.pdf](Candidate_Guide.pdf) — read this before your interview for full context on the format, expectations, and how to prepare.

---

## Getting Started

```bash
# Backend
cd backend
npm install
npm run start:dev    # Runs on http://localhost:3000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev          # Runs on http://localhost:5173
```

Copy `.env.example` to `backend/.env` (API keys will be provided).

The property data is in `data/properties.json` — 50 commercial properties with financial details.

---

## Level 1 — Nest.js REST API (~10 min)

Build a REST API to serve property data.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/properties` | Paginated list with optional filters |
| `GET` | `/api/properties/:id` | Single property with all details |

### Filters (query params)
- `city` — filter by city name (case-insensitive)
- `type` — filter by property type (multifamily, office, retail, industrial)
- `minPrice` / `maxPrice` — filter by purchase price range
- `page` / `limit` — pagination (default: page=1, limit=10)

### Requirements
- Use Nest.js patterns: modules, controllers, services, DTOs
- Input validation with `class-validator`
- Proper error responses (404 for missing property, 400 for invalid params)
- TypeScript interfaces for all data models

---

## Level 2 — Financial Calculations + AI Analysis (~35 min)

Add underwriting calculations and an AI-powered deal analysis.

### Endpoint: `GET /api/properties/:id/underwriting`

Calculate and return the following metrics (research the standard commercial real estate formulas):

- **Net Operating Income (NOI)** — using the property's income streams, vacancy rate, and operating expenses
- **Cap Rate** — flag as "outlier" if below 4% or above 12%
- **Debt Service** — use standard amortization
- **DSCR (Debt Service Coverage Ratio)** — flag if below 1.25x
- **Cash on Cash Return**

### Endpoint: `POST /api/properties/:id/ai-analysis`

Call an AI model (use the API key in `.env`) to analyze the deal. Send the property's financial data + calculated metrics as context.

**Request body** (optional overrides):
```json
{
  "focusAreas": ["market_risk", "financing", "operations"]  // optional
}
```

**Expected response structure:**
```json
{
  "highlights": [
    { "title": "Strong Cash Flow", "description": "..." },
  ],
  "risks": [
    { "title": "High Vacancy Rate", "description": "..." },
  ],
  "overallRisk": "low" | "medium" | "high",
  "summary": "One paragraph overall assessment"
}
```

Requirements:
- Return 3–5 highlights and 3–5 risks
- Enforce the response structure (parse & validate the AI output)
- Handle API errors gracefully (timeout, rate limit, malformed response)
- Include all relevant financial context in your prompt

### Edge Cases to Handle
- Property with 0% occupancy → vacancy_rate = 1.0 (be careful with divisions)
- Property with no loan terms → DSCR is N/A, not an error
- Management fee is a **percentage of Effective Gross Income**, not Gross

---

## Level 3 — React Frontend (~30 min)

Build a React UI that consumes your Nest.js API.

### Pages

**Property List** (`/`)
- Table or card grid showing properties
- Search by name + filters (city, type, price range)
- Pagination
- Click to navigate to detail page

**Property Detail** (`/properties/:id`)
- Property info (address, type, size, year built)
- Underwriting metrics from Level 2 (NOI, Cap Rate, DSCR, etc.)
- Visual indicators: green for healthy metrics, red/yellow for flagged ones
- **AI Analysis panel:** A button that triggers the AI analysis endpoint. Display:
  - Highlights in green cards
  - Risks in red cards
  - Overall risk badge (low/medium/high)
  - Loading spinner while waiting for AI response
  - Error state if the API call fails

### Requirements
- React Router for navigation
- Proper loading & error states
- At least basic component separation (don't put everything in one file)
- TypeScript types matching the API response shapes

---

## Level 4 — Comparison & Sensitivity Analysis (~25 min)

Add the ability to compare multiple deals side-by-side.

### Endpoint: `POST /api/comparisons`

```json
{
  "propertyIds": ["id1", "id2", "id3"],
  "weights": {
    "capRate": 0.3,
    "dscr": 0.3,
    "cashOnCash": 0.2,
    "pricePerSqft": 0.2
  }
}
```

Returns:
- Side-by-side metrics for all selected properties
- A **weighted score** for each property based on the provided weights
- Properties ranked by score

### Endpoint: `GET /api/properties/:id/sensitivity`

Query params: `rateShift` (basis points, e.g. 50, 100, 150)

Returns how DSCR and Cash on Cash change if the interest rate increases by the given amount. Return results for +50bps, +100bps, and +150bps.

### Frontend
- Add a comparison page where users can select 2–5 properties
- Show a comparison table with all metrics side-by-side
- Display sensitivity analysis as a simple chart or table
- Highlight the "winner" based on the weighted score

---

## Tips

1. **Read all levels before you start.** Understanding where you're going helps you make better architecture decisions early.
2. **Level 1 should be fast.** If you're spending more than 15 minutes here, let Claude Code do more of the heavy lifting.
3. **Level 2 is where precision matters.** Double-check the financial calculations. Write a test or two.
4. **Don't over-engineer the frontend.** Functional beats beautiful. Let AI handle the styling.
5. **Finishing Level 3 well is better than rushing through Level 4 badly.**

---

## ⭐ Bonus — Real-Time AI Conversation via WebSocket

If you finish Levels 1–4 and want to push further, add a real-time AI conversation feature to the comparison page.

### The Idea

When a user is viewing a deal comparison, they can open a chat panel and have a live conversation with an AI about the deals. For example: "Which of these properties is safest if rates rise?" or "What's the biggest risk in the Phoenix property?"

### Requirements

1. **WebSocket gateway** in Nest.js using `@nestjs/websockets` and `socket.io`
2. **Connection with context** — When the client connects, it sends the property IDs being compared. The server loads all property data + calculated metrics as conversation context.
3. **Streaming AI responses** — When the user sends a message, the server calls the AI API with conversation history + property context. Stream the response back token-by-token through the WebSocket (don't wait for the full response).
4. **Chat UI in React** — A chat panel on the comparison page with:
   - Message input
   - Scrollable message history
   - AI response appearing word-by-word as it streams in
5. **Conversation history** — Maintain chat history in the WebSocket session so follow-up questions work naturally.

> ⚠️ This is a stretch goal. Don't attempt this at the cost of Level 2 or 3 quality.

Good luck!
