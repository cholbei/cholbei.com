# Cholbei — New Business & Technical Model

## 1. Core Direction

Cholbei আপাতত Laravel-based web application product বিক্রি করবে না।

নতুন model হবে:

**Cholbei builds and delivers complete client-owned websites and lightweight web systems using modern frontend, Cloudflare infrastructure, and Google Workspace integrations.**

প্রতিটি client তার প্রয়োজন অনুযায়ী একটি website/setup package অর্ডার করবে। Cholbei সেই client-এর জন্য পুরো system design, develop, configure, deploy এবং handover করবে।

এটি SaaS বা multi-tenant platform নয়।

প্রতিটি client-এর project হবে আলাদা, independently owned এবং independently deployable।

---

# 2. Main Principle

## Client Owns Everything

প্রতিটি client-এর website ideally থাকবে client-এর নিজের:

- GitHub account
- Cloudflare account
- Gmail / Google account
- Google Sheets
- Google Apps Script
- Domain
- Cloudflare Pages project
- Cloudflare Workers
- D1 Database
- R2 Storage
- Relevant API credentials

Cholbei setup, development এবং configuration করবে।

কিন্তু client যেন Cholbei-এর central server, hosting account, shared database বা proprietary backend-এর ওপর permanently dependent না থাকে।

---

# 3. What Cholbei Is Selling

Cholbei কোনো shared application subscription বিক্রি করবে না।

Cholbei বিক্রি করবে:

**Complete Website Setup Packs**

Client তার প্রয়োজন অনুযায়ী package নির্বাচন করবে।

উদাহরণ:

### Basic Website Pack

Suitable for:

- Corporate website
- Service business
- Portfolio
- Agency
- Consultant
- Small local business

Possible components:

- UI/UX design
- Responsive frontend
- Cloudflare Pages deployment
- Contact form
- Google Sheets lead collection
- Apps Script integration
- Basic SEO setup
- Analytics integration
- GitHub repository
- Domain setup
- Client handover

---

### Business Website Pack

Includes:

- Everything in Basic
- Cloudflare Workers API
- D1 database
- Dynamic forms
- Lead management
- Admin/dashboard interface where required
- Email integration
- Google Sheets synchronization
- Structured business data
- Form/activity records
- Authentication if required
- R2 storage where required

---

### Advanced Web System Pack

Suitable for:

- Booking systems
- Lead management
- Inventory-lite systems
- Directory systems
- Customer portals
- Internal business tools
- Dynamic service platforms
- Content-heavy websites
- Lightweight ecommerce

Possible stack:

- Frontend
- Cloudflare Pages
- Cloudflare Workers
- D1
- R2
- Authentication
- Google Apps Script
- Google Sheets
- Email integrations
- External APIs
- Custom dashboards

---

# 4. Technical Architecture

Preferred architecture:

```text
                 Client GitHub
                      │
                      ▼
               Cloudflare Pages
                      │
                      ▼
               Cloudflare Worker
                API / Security
                 /          \
                ▼            ▼
              D1             R2
           Database        Storage
                │
                │ optional sync
                ▼
          Google Apps Script
                │
                ▼
           Google Sheets
```

---

# 5. Responsibility of Each Technology

## GitHub

Purpose:

- Source code ownership
- Version control
- Deployment source
- Backup of application code
- Development history

Each client should ideally have their own repository.

---

## Cloudflare Pages

Purpose:

- Website frontend hosting
- Static assets
- Production deployment
- Preview deployment
- Custom domain integration

---

## Cloudflare Workers

Purpose:

- Backend/API layer
- Form processing
- Authentication logic
- Validation
- Business logic
- API routing
- Security
- Rate limiting
- Integration with D1/R2
- Apps Script communication
- Third-party API communication

---

## Cloudflare D1

D1 should be the main structured database where a database is needed.

Examples:

- users
- leads
- enquiries
- bookings
- website settings
- submissions
- services
- products
- orders
- activity logs
- content records

Google Sheets should not be treated as the primary production database for systems that require reliable database behaviour.

---

## Cloudflare R2

Purpose:

- Uploaded files
- Images
- PDFs
- Attachments
- Documents
- Media
- Generated exports
- Other object storage

---

## Google Apps Script

Apps Script should be used primarily as an integration and automation layer.

Examples:

- Send data to Google Sheets
- Process spreadsheet actions
- Generate reports
- Trigger Google Workspace workflows
- Email automation
- Sync business information
- Connect website data with client Google account

Apps Script should not normally be the core backend if Workers + D1 can handle the job better.

---

## Google Sheets

Purpose:

- Easy client-accessible reporting
- Lead sheets
- Sales sheets
- Business data views
- Manual operational workflows
- Reports
- Data exports
- Simple client-side management

D1 remains the source of truth where required.

Sheets acts as a convenient operational interface.

---

# 6. Integration Philosophy

The website may connect with the client's own:

### Gmail / Google Account

Potential uses:

- Form notifications
- Customer emails
- Internal alerts
- Google Sheets
- Apps Script
- Reports
- Google Workspace integrations

---

### GitHub Account

Potential uses:

- Repository ownership
- Source code
- Version control
- Cloudflare deployment
- Future developer access

---

### Cloudflare Account

Potential uses:

- Pages
- Workers
- D1
- R2
- DNS
- SSL
- CDN
- Security
- Deployment

---

# 7. What Cholbei Should NOT Build Right Now

Do not build Cholbei as a central multi-client SaaS.

Avoid:

```text
Cholbei Platform
      │
      ├── Client A
      ├── Client B
      ├── Client C
      ├── Client D
      └── Client E
```

Do not create one shared:

- database
- admin platform
- Worker backend
- server
- user system
- API
- storage bucket

that every customer website depends on.

---

# 8. Correct Client Architecture

Instead:

```text
Client A
├── GitHub A
├── Cloudflare A
├── D1 A
├── R2 A
├── Google Sheet A
└── Apps Script A

Client B
├── GitHub B
├── Cloudflare B
├── D1 B
├── R2 B
├── Google Sheet B
└── Apps Script B
```

Each project is independent.

Cholbei develops and configures each one.

---

# 9. Client Dependency Philosophy

One of Cholbei's main selling points should be:

## No Vendor Lock-In

After handover, the client should be able to:

- access the source code
- change developer
- change agency
- manage their Cloudflare account
- manage their GitHub account
- access their database
- access their Google Sheets
- access uploaded assets
- update credentials
- continue running the website without Cholbei

Cholbei may provide optional maintenance, but continued operation must not technically depend on purchasing maintenance.

---

# 10. How Cholbei Makes Money

Revenue comes from setup and professional services.

Examples:

### Initial Charges

- UI/UX design
- Frontend development
- Backend/API development
- Cloudflare setup
- Database setup
- Google integration
- Deployment
- SEO setup
- Analytics setup
- Migration
- Data import
- Custom features

### Optional Recurring Charges

- Maintenance
- Technical support
- SEO
- Content updates
- Security monitoring
- Feature development
- Backup management
- Analytics/reporting
- Performance optimization

Recurring service is optional.

The core website remains owned by the client.

---

# 11. Package-Based Ordering Model

cholbei.com should allow users to understand and choose a website solution.

Example structure:

```text
Choose Website Type
        ↓
Choose Setup Pack
        ↓
Choose Features
        ↓
Request Quote / Order
        ↓
Requirement Collection
        ↓
Client Account Setup
        ↓
UI/UX
        ↓
Development
        ↓
Integrations
        ↓
Testing
        ↓
Deployment
        ↓
Handover
```

---

# 12. Possible Website Categories

Cholbei may offer templates/packages for:

- Corporate Website
- Service Business Website
- Healthcare Website
- Clinic Website
- Restaurant Website
- Ecommerce Website
- Portfolio Website
- Agency Website
- Real Estate Website
- Education Website
- Lead Generation Website
- Booking Website
- Local Business Website
- Directory Website
- Business Dashboard
- Internal Business Tool
- Custom Web System

These are not necessarily fixed templates.

They represent starting solution types.

---

# 13. Feature Add-ons

Clients can optionally add features such as:

- Contact forms
- Quote forms
- Booking forms
- Lead management
- WhatsApp integration
- Email notifications
- Gmail integration
- Google Sheets integration
- Google Analytics
- Google Tag Manager
- Search Console
- Facebook Pixel
- CRM integration
- Admin dashboard
- User login
- Customer portal
- Blog
- CMS
- Product catalogue
- Basic ecommerce
- Payment gateway
- File uploads
- Image management
- R2 storage
- D1 database
- Search/filter
- API integrations
- Maps
- Reviews
- Multilingual support

---

# 14. Reusable Development System

Although each client owns an independent project, Cholbei should maintain reusable internal components.

Examples:

```text
cholbei-components/
├── navbar
├── footer
├── forms
├── cards
├── hero
├── FAQ
├── CTA
├── testimonials
├── SEO
├── analytics
├── Workers utilities
├── D1 helpers
├── R2 helpers
├── Apps Script connectors
└── validation
```

These reusable components speed up development.

But deployed projects should not depend on an external Cholbei runtime.

Once code is copied/generated into the client's project, the client owns the deployed version.

---

# 15. Template Philosophy

Cholbei can maintain internal starter templates such as:

```text
starter-corporate
starter-service
starter-healthcare
starter-ecommerce
starter-booking
starter-dashboard
starter-directory
```

Codex can generate a new client project from these starters.

Example:

```text
starter-service
      ↓
Generate client project
      ↓
Customize branding
      ↓
Customize pages
      ↓
Configure Worker
      ↓
Configure D1
      ↓
Configure Google integration
      ↓
Deploy to client's Cloudflare
```

---

# 16. Recommended Project Structure

A standard project could follow:

```text
client-project/
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── utilities/
│   └── styles/
│
├── worker/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── database/
│   └── integrations/
│
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seed/
│
├── apps-script/
│   ├── Code.gs
│   └── README.md
│
├── docs/
│   ├── setup.md
│   ├── deployment.md
│   ├── cloudflare.md
│   ├── google.md
│   └── handover.md
│
├── public/
│
├── wrangler.toml
├── package.json
├── README.md
└── .env.example
```

Exact framework can vary based on project requirements.

---

# 17. Credentials and Secrets

Credentials must never be hard-coded in source code.

Use:

- Cloudflare secrets
- environment variables
- GitHub secrets where appropriate
- Apps Script PropertiesService where appropriate

The repository should contain only examples such as:

```text
.env.example
```

Never real API keys or client secrets.

---

# 18. Client Onboarding Model

Before deployment, Cholbei should collect or help create:

1. Client GitHub account
2. Client Cloudflare account
3. Client Google/Gmail account
4. Domain access
5. Brand assets
6. Business information
7. Required integrations

Then create or configure the project's infrastructure inside those accounts.

---

# 19. Handover Standard

Every completed project should include:

### Code

- GitHub repository
- clean source code
- deployment configuration

### Infrastructure

- Cloudflare Pages
- Worker
- D1
- R2 where applicable
- DNS/domain setup

### Google

- Google Sheet
- Apps Script
- required permissions

### Documentation

- README
- installation/setup guide
- deployment guide
- environment variable guide
- credential guide
- database structure
- Google integration guide
- maintenance notes

---

# 20. cholbei.com Positioning

Recommended core positioning:

**Complete, Client-Owned Websites and Web Systems**

Supporting message:

Cholbei designs, develops and deploys modern websites and lightweight business systems using a client-owned technology stack. Your source code, infrastructure, database and business data remain under your control.

Potential selling points:

- Client-owned infrastructure
- No vendor lock-in
- Modern serverless architecture
- Fast Cloudflare hosting
- Scalable backend
- Professional UI/UX
- Git-based development
- Google Workspace integration
- Database and file storage
- SEO-ready
- Analytics-ready
- Easy handover
- Optional maintenance

---

# 21. What cholbei.com Itself Should Be

cholbei.com should follow the same architecture philosophy that Cholbei sells.

Recommended:

```text
GitHub
   ↓
Cloudflare Pages
   ↓
Cloudflare Worker
   ↓
D1
   ↓
Google integration where useful
```

Use R2 if the website needs:

- portfolio media
- uploads
- downloadable files
- client requirement attachments

---

# 22. cholbei.com Main Pages

Recommended initial structure:

```text
/
├── /website-development
├── /business-websites
├── /custom-web-systems
├── /ecommerce
├── /cloudflare-web-development
├── /google-workspace-integration
├── /packages
├── /features
├── /portfolio
├── /how-it-works
├── /about
├── /contact
└── /request-a-quote
```

Optional later:

```text
/templates
/industries
/resources
/blog
/support
```

---

# 23. Homepage Structure

## Hero

Message should immediately communicate:

**Own Your Website. Own Your Infrastructure.**

Supporting copy:

Cholbei builds modern websites and web systems on your GitHub, Cloudflare and Google accounts—giving you control of your code, infrastructure and business data.

CTA:

- Explore Packages
- Request a Quote

---

## Problem

Explain common dependency problems:

- Agency controls hosting
- Client does not own source code
- Website becomes difficult to move
- Proprietary CMS locks client in
- Data remains trapped
- Developer disappears
- Monthly fee is required just to keep the site alive

---

## Cholbei Solution

Explain:

```text
Your GitHub
+
Your Cloudflare
+
Your Database
+
Your Google Workspace
=
Your Website
```

---

## Website Packages

Show major package categories.

---

## Technology

Show:

- GitHub
- Cloudflare Pages
- Workers
- D1
- R2
- Google Apps Script
- Google Sheets

Avoid positioning technologies as the product themselves.

The product is the complete business solution.

---

## How It Works

1. Choose a package
2. Share requirements
3. Accounts and infrastructure setup
4. UI/UX
5. Development
6. Integrations
7. Testing
8. Deployment
9. Handover

---

## Ownership Section

Strongly emphasize:

**You keep the code, accounts and data.**

---

## Add-ons

Show optional features.

---

## Portfolio

Show completed client projects.

---

## CTA

Request project consultation / quotation.

---

# 24. Important UX Rule

Customers do not need to understand every technology.

Do not make cholbei.com feel like infrastructure documentation.

Customer-facing language should focus on outcomes:

Instead of:

"Cloudflare D1 + Worker + R2 architecture"

Prefer:

"Fast, secure and scalable website infrastructure."

Technical details can appear in secondary sections for technical buyers.

---

# 25. Codex Development Instruction

When Codex builds cholbei.com or a future client project, follow these principles:

1. Do not introduce Laravel unless specifically requested.
2. Prefer frontend + Cloudflare-native architecture.
3. Each client project must be independent.
4. Do not create a multi-tenant Cholbei backend.
5. Do not require a Cholbei server for client websites to operate.
6. Keep infrastructure portable and client-owned.
7. D1 is the preferred primary database where structured data is required.
8. R2 is the preferred object/file storage.
9. Workers handle server-side logic and API functionality.
10. Apps Script and Sheets are integrations, operational tools or reporting layers.
11. Keep Google Sheets out of the critical production path wherever possible.
12. Keep secrets out of repositories.
13. Include setup and handover documentation.
14. Build reusable internal components but deploy self-contained client projects.
15. Optimize for low operating cost from day one.
16. Ensure the project can start on Cloudflare free tiers whenever practical.
17. Avoid unnecessary external dependencies.
18. Keep frontend accessible, responsive, SEO-friendly and performant.
19. Maintain clear separation between frontend, Worker, database and integrations.
20. Everything required to operate the website should be transferable to the client.

---

# 26. Business Model Summary

Old direction:

```text
Build Laravel product
      ↓
Sell application
      ↓
Customer installs/uses product
```

New direction:

```text
Client chooses website/system
          ↓
Cholbei designs solution
          ↓
Cholbei develops it
          ↓
Setup in client's accounts
          ↓
Deploy
          ↓
Documentation + handover
          ↓
Optional maintenance
```

Cholbei is therefore primarily a:

**Productized Web Development & Deployment Service**

rather than a traditional SaaS or downloadable Laravel application business.

---

# 27. One-Sentence Definition

**Cholbei builds complete, modern, client-owned websites and lightweight web systems using UI/UX, frontend development, Cloudflare Pages, Workers, D1, R2, GitHub and Google Workspace integrations—then hands over the entire system to the client without infrastructure lock-in.**