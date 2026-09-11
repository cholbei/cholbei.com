// Editorial sources for the first two articles. Keep dates tied to real content changes.
export default [
  {
    slug: 'website-project-brief', type: 'blog', date: '2026-09-12',
    title: 'How to write a website project brief for your business',
    description: 'Plan your business website with a practical project brief covering goals, pages, content, budget, ownership and launch requirements.',
    intro: 'A useful website project brief explains what your business needs the website to accomplish. It gives your developer enough context to recommend a sensible scope and helps you compare proposals on the same basis. You do not need to choose every technical detail before starting. Begin with your customers, the information they need, and the actions you want them to take.',
    sections: [
      { heading: 'Start with one clear business outcome', paragraphs: [
        'Describe the problem the website should solve before listing features. A service business might want visitors to understand its work and send a relevant enquiry. A supplier might need a clear product catalogue that helps customers request a quotation. These are different jobs, even if both websites use similar page layouts.',
        'Write down who the website is for, what those people need to know, and the main action they should take. Separate a business outcome from a design preference. A dark homepage is a preference; helping a visitor choose the right service is an outcome. Include both in the brief, but make the outcome the basis for decisions.'
      ], bullets: ['Primary audience: who will use the website?', 'Main task: what should visitors be able to do?', 'Success signal: what useful activity will you review after launch?'] },
      { heading: 'Map the pages and the visitor journey', paragraphs: [
        'List the pages you expect to need and give each one a purpose. A small service website might include a homepage, service information, an about page and a contact page. Add separate service pages when each service needs its own explanation. Avoid creating pages simply to make the website look bigger.',
        'Follow a realistic visitor journey. Someone arriving on a service page should be able to understand the offer, see relevant evidence and find the next step. Explain which pages should connect to each other. This is more useful than handing over a navigation list without saying why each destination matters.'
      ], bullets: [], links: [{ href: '/#solutions', label: 'Explore the website solutions Cholbei builds' }] },
      { heading: 'Separate launch requirements from later ideas', paragraphs: [
        'For each feature, describe the actual workflow. Instead of asking for a booking system, explain whether visitors request a preferred date or reserve an available slot immediately. Say who receives the request, whether payment is involved, and what confirmation the customer should receive. Those details change the scope.',
        'Use two lists: essential for launch and possible later. Features such as customer accounts, online payments and file uploads need more decisions than a simple contact path. Ask your developer to explain dependencies and recurring costs before you agree to them. A focused first release can still leave room for future development.'
      ], bullets: ['Describe what the visitor submits and what happens next.', 'Name any existing tools the website must connect to.', 'Record which features can wait until after launch.'] },
      { heading: 'Prepare content and name the decision maker', paragraphs: [
        'Identify who will supply service descriptions, brand assets, photographs and any case studies you are allowed to publish. Mark material as ready, needing revision or not yet available. If you need writing or image preparation included, put that in the brief so the quote reflects the work.',
        'Choose one person to collect feedback and confirm decisions. A developer can work through differing opinions, but conflicting approvals can stall a project. Agree how feedback will be delivered and when content will be ready. Share design references with a short explanation of what you like, rather than asking for an exact copy.'
      ], bullets: [] },
      { heading: 'Agree ownership and handover before development', paragraphs: [
        'Include ownership in the brief from the beginning. State who will own the domain, repository, hosting account and business data, and what documentation you expect. For Cholbei projects, the aim is an independent website deployed in client-owned accounts, with the agreed code and setup handed over.',
        'Discuss licences separately from ownership of custom work. A paid font or template may have conditions that still apply after delivery. Also clarify whether maintenance is included, optional or separately quoted. Knowing what you will receive at the end helps you evaluate proposals before work begins.'
      ], bullets: [], links: [{ href: '/blog/website-handover-checklist/', label: 'Use the website handover checklist to define your deliverables' }, { href: '/about-us/', label: 'Read about Cholbei’s client-owned approach' }] },
      { heading: 'Use this short brief to request a quote', paragraphs: [
        'A budget range and a preferred launch date help your developer suggest an achievable scope. Explain any fixed deadline and why it matters. Ask for the proposal to identify assumptions, exclusions, review stages and the process for changes. A package can provide a starting point, but your requirements determine the agreed work.',
        'Copy the checklist below into a document and answer it in plain language. Where you are unsure, write down the question rather than guessing a technical solution. The brief should open a useful conversation and become a reference for delivery, not prevent the project from evolving through agreed decisions.'
      ], bullets: ['Business, audience and main website outcome.', 'Required pages and the purpose of each page.', 'Essential workflows, integrations and later ideas.', 'Content readiness and the person approving decisions.', 'Budget range, preferred date and known dependencies.', 'Account ownership, launch checks and handover requirements.'], links: [{ href: '/#packages', label: 'Compare Cholbei’s website setup packs' }, { href: '/contact-us/', label: 'Send your website brief to Cholbei' }] }
    ]
  },
  {
    slug: 'website-handover-checklist', type: 'blog', date: '2026-09-12',
    title: 'Website handover checklist for business owners',
    description: 'Check your website handover covers domain access, source code, hosting, business data, licences, documentation and ongoing responsibilities.',
    intro: 'A website handover should leave you able to operate the site and ask another developer to maintain it. A working homepage alone does not show that you have the access, files and instructions you need. Use this checklist to review the agreed deliverables with your developer and record any unfinished items before closing the project.',
    sections: [
      { heading: 'Compare delivery with the agreed brief', paragraphs: [
        'Start with the written scope. Review the pages, features, integrations and documentation that were agreed, including any later changes. Test important visitor journeys such as navigating from a service page to the contact route. Record an issue with the page address, the action taken and the result you expected.',
        'Distinguish an incomplete agreed feature from a new request. Both can be discussed, but they may have different implications for the delivery schedule and cost. If there is an acceptance process or correction period in your agreement, use it to organise the review. Keep a written list of remaining actions and who will handle them.'
      ], bullets: [], links: [{ href: '/blog/website-project-brief/', label: 'Prepare a website project brief that makes handover easier' }, { href: '/delivery-and-refund/', label: 'Read Cholbei’s delivery and refund process' }] },
      { heading: 'Confirm domain and hosting access', paragraphs: [
        'Check that the domain is registered in an account your business controls and that the renewal contact reaches the right person. Know who pays renewal fees and where those settings are managed. Being able to edit website content is different from controlling the domain that sends visitors to it.',
        'For a Cholbei project, confirm access to the agreed Cloudflare setup and any connected accounts. Record the production project name, domain configuration and deployment source in the handover notes. Use account invitations and appropriate permissions for collaborators. Avoid treating a password sent in an email as the complete access handover.'
      ], bullets: ['Confirm you can sign in to the domain and hosting accounts.', 'Record renewal responsibilities and recovery contacts.', 'Identify collaborators whose access is still needed.'] },
      { heading: 'Receive the source code and deployment instructions', paragraphs: [
        'Open the GitHub repository and confirm that it contains the project source and the files required to build or deploy the website. Ask which branch is used for production and how a change reaches the live site. The repository should have instructions that another developer can understand without relying on a private conversation.',
        'Request a small demonstration of the update process. For example, a developer can show how a reviewed text change is deployed and how to return to a previous working version. Agree who will perform updates after handover. Keeping the code is most useful when the process for using it is also documented.'
      ], bullets: ['Repository ownership and production branch.', 'Setup instructions and required configuration names.', 'Deployment steps and a recovery procedure.'] },
      { heading: 'Review business data and connected tools', paragraphs: [
        'If the website stores enquiries, bookings or other records, confirm where those records live and how authorised people can access them. Ask how data can be exported and what a backup includes. A spreadsheet report is not necessarily the complete production database, so document the role of each system.',
        'Check the integrations that are actually in scope, such as email notifications, Google Sheets or analytics. Test them with clearly labelled sample information and agree how that test data will be removed. Record which account owns each integration and how credentials can be changed without breaking the website. Keep secrets out of public documentation and repositories.'
      ], bullets: [], links: [{ href: '/#ownership', label: 'See what client ownership means at Cholbei' }] },
      { heading: 'Check licences, content and launch basics', paragraphs: [
        'Ask for a list of third-party assets and services, including any paid templates, fonts, images or subscriptions. Record who purchased them and whether renewal or a particular licence is required. Ownership of the delivered project does not automatically transfer every third-party right, so keep the relevant purchase and licence information accessible.',
        'Review the final content on a phone and a larger screen. Check the main navigation, contact details, page titles and links. Confirm that intended public pages have appropriate canonical URLs and that the sitemap contains the pages you want discovered. If analytics is included, ask for evidence that your own property receives test activity rather than assuming the installation is working.'
      ], bullets: ['Check contact routes and any agreed form notifications.', 'Review images, text and navigation across screen sizes.', 'Confirm search and analytics account access where included.'] },
      { heading: 'Agree who looks after the website next', paragraphs: [
        'A handover should make ongoing responsibilities explicit. Write down who manages domain renewals, content changes, provider bills and any required backups. If maintenance is included for a period, record its scope and end date. If support is optional, clarify how to request work and agree a price before it starts.',
        'Cholbei’s model is to deliver an independently owned website, with optional maintenance and future development. You should know what you can manage yourself and when you will need technical help. Keep a final handover document with account locations, repository links, operating instructions and unresolved items so your business has a practical reference after launch.'
      ], bullets: ['Save the final scope, review notes and delivery documents.', 'Confirm ongoing tasks and the person responsible for each.', 'Keep account recovery details accessible to the business.', 'Arrange a final walkthrough of updates and recovery.'], links: [{ href: '/terms-and-conditions/', label: 'Review ownership and support terms' }, { href: '/contact-us/', label: 'Discuss a client-owned website with Cholbei' }] }
    ]
  }
];
