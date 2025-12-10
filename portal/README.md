# QMS Portal - Phase 4 UI

**ISO 13485 Quality Management System Portal**

## Overview

The QMS Portal is a Next.js-based user interface for the ISO 13485 compliant Quality Management System. It provides intuitive workflow management for CAPA (Corrective and Preventive Actions) and DCR (Document Change Requests) processes.

## Architecture

### Technology Stack
- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **State Management:** React Query + Zustand
- **Authentication:** NextAuth.js with Google OAuth
- **API Integration:** Phase 3 Action Layer

### Integration Points
- **Phase 1:** RAG Layer (document search)
- **Phase 2:** Compliance Agent (QMS queries)
- **Phase 3:** Action Layer (workflow automation)

## Features

### Dashboard
- Real-time workflow statistics
- CAPA and DCR status overview
- Recent activity feed
- Quality metrics visualization

### CAPA Manager
- Create new CAPA cases
- Track corrective actions
- Manage approval workflows
- Monitor effectiveness verification

### DCR Manager
- Create document change requests
- Link supporting documents
- Route for approvals
- Track implementation status

### AI Assistant (Phase 4C)
- Document retrieval and search
- Response drafting assistance
- CAPA/DCR update proposals
- Citation and source display

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Access to Phase 3 Action Layer API

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables

```bash
# Required
QMS_API_URL=https://qms-agent-728802725258.us-central1.run.app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Optional (for authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Project Structure

```
portal/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── page.tsx         # Dashboard
│   │   ├── capa/page.tsx    # CAPA Manager
│   │   └── dcr/page.tsx     # DCR Manager
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout with navigation
│   │   └── ConfirmationModal.tsx
│   ├── lib/                 # Utilities and API clients
│   │   ├── api.ts           # Phase 3 Action Layer integration
│   │   ├── auth.ts          # Authentication utilities
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
└── package.json
```

## API Integration

### Phase 3 Action Layer
The portal integrates with the validated Phase 3 Action Layer through structured function calls:

```typescript
// CAPA Operations
await CAPAAPI.create(data, userId, confirmed);
await CAPAAPI.updateAnalysis(data, userId, confirmed);
await CAPAAPI.addAction(data, userId, confirmed);

// DCR Operations  
await DCRAPI.create(data, userId, confirmed);
await DCRAPI.addDocuments(data, userId, confirmed);
await DCRAPI.updateStatus(data, userId, confirmed);
```

### Safety Confirmation
All modifying operations require user confirmation per Phase 3 safety requirements:

1. Initial API call with `confirmed: false`
2. Display confirmation modal with message
3. Second API call with `confirmed: true` after user approval

## Authentication & Authorization

### Role-Based Access Control
- **Engineer:** DCR creation and management
- **QA:** CAPA management and approvals  
- **Production:** Status monitoring and reporting
- **Manager:** Full access and oversight

### OAuth Integration
Google Sign-In with email-to-role mapping for demo purposes.

## ISO 13485 Compliance

### Audit Trail
- All user actions logged through Phase 3 Action Layer
- Complete traceability of workflow operations
- User identification in all audit events

### Change Control
- Phase 4 UI development isolated from validated Phase 1-3 code
- No modifications to validated components
- Validation required in Phase 5 before production

### Risk Controls
- Confirmation dialogs prevent accidental operations
- Role-based access restrictions
- Input validation and sanitization

## Development Phases

### Phase 4A: Core UI ✅
- [x] Next.js project setup
- [x] Basic routing and navigation  
- [x] Dashboard, CAPA, DCR screens
- [x] Component library foundation

### Phase 4B: API Integration ✅
- [x] Action Layer API client
- [x] CAPA workflow integration
- [x] DCR workflow integration
- [x] Confirmation flow implementation

### Phase 4C: LLM Assistant (Next)
- [ ] Assistant panel UI
- [ ] OpenAI function calling integration
- [ ] Document retrieval interface
- [ ] Citation display

### Phase 4D: Authentication (Next)
- [ ] Google OAuth setup
- [ ] Role-based access control
- [ ] Session management
- [ ] Access logging

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

## Deployment

The portal will be deployed alongside the existing QMS Agent infrastructure:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Phase 5 Validation

Before production rollout, Phase 5 validation will include:
- User acceptance testing
- Performance validation
- Security validation  
- Regulatory compliance verification

## Contributing

1. Create feature branch from `feature/phase4-portal-ui`
2. Follow existing code patterns and conventions
3. Include tests for new functionality
4. Update documentation as needed
5. Submit pull request for review

## Support

- **Technical Issues:** Engineering team
- **UI/UX Feedback:** Product team
- **Compliance Questions:** QA team

---

**Phase 4 Status:** 🚧 **IN DEVELOPMENT**  
**Current Stage:** Phase 4B - API Integration Complete  
**Next Stage:** Phase 4C - LLM Assistant Integration