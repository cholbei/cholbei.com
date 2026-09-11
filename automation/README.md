# Weekly local publishing

The Windows task runs Friday at 10:00 in the computer's local time (expected Asia/Dhaka). It uses your ChatGPT-authenticated Codex CLI; no AI API key is used. The computer must be on, connected, and the Windows user logged in. Windows may wake from sleep if supported. No app window is required for this CLI-based task.

## What each run does

1. Check ChatGPT login, expected Git remote and branch, published GTM tag and Google access.
2. Save the last 28 days of GA4 page metrics and recent Search Console page performance in private local storage.
3. Require a clean checkout exactly matching origin/main. Never force-push, auto-merge or discard local work.
4. Pick the next unused topic from config.json (one page per week). Stop when the reviewed queue is exhausted.
5. Ask Codex for JSON content only under a read-only sandbox. Render trusted HTML templates; the AI does not run Git or edit the website.
6. Update the blog/solutions directories, footer navigation, metadata, structured data and sitemap. Run resource and content checks.
7. Commit only expected output files, then push main. Cloudflare's existing Git integration performs deployment.
8. Verify the live page, submit the sitemap and save URL Inspection status. Indexing is Google's decision and may take time.

GTM is checked for the published GA4 ID; it is not rewritten every week. Each generated page includes the existing production-only loader. Reporting APIs do not provide proof of browser event delivery.

## Private settings (outside the website)

Settings and logs are in `%LOCALAPPDATA%\CholbeiAutomation`. Never copy credentials, drafts or reports into the repository, which is also the Cloudflare output directory.

settings.json fields:
- codexPath: absolute path to the installed codex.exe (update after extension upgrades if needed).
- nodePath: absolute path to node.exe.
- ga4PropertyId: numeric GA4 Property ID, not the measurement or stream ID.
- serviceAccountFile: absolute path to a Google service-account JSON key outside the website.
- searchConsoleProperty: normally sc-domain:cholbei.com; use the exact URL-prefix property if that is what you verified.

## Google setup required once

1. In Google Cloud create/select a project and enable Google Search Console API and Google Analytics Data API.
2. Create a service account. In its Keys tab, create a JSON key and save it under the private directory above. Do not paste it into a chat or commit it.
3. In Search Console, Settings > Users and permissions, add the service account's client_email as a Full user for the verified property.
4. In Google Analytics, Admin > Property access management, add that same email as a Viewer. Record the numeric Property ID from Property details.
5. Fill serviceAccountFile and ga4PropertyId in private settings.json.
6. Run `node automation/run.mjs --preflight`. This reads reports and checks access but does not publish.

No GTM API key is required: this workflow verifies the public published container, keeping existing tracking configuration stable.

## Commands

- `node automation/test.mjs`: offline content and template checks (no AI usage).
- `node automation/run.mjs --preflight`: authenticated Google and Git prerequisites.
- `node automation/run.mjs --publish`: create and publish the next page immediately; consumes included Codex usage.
- `powershell -NoProfile -ExecutionPolicy Bypass -File automation/install-task.ps1`: install/update the weekly Windows task.
- Task Scheduler > Cholbei Weekly Publishing: disable, edit time, or inspect last-run status.

## Failure handling

See last-error.json and run logs in the private directory. Missing credentials, expired Codex login, usage limits, dirty Git, unexpected changes or failing checks stop publication. Files are restored on pre-commit failure. After a commit/push failure, inspect Git status and push the existing commit; do not delete it or generate a duplicate. After a deployment/API failure, the next run verifies the existing recent publication instead of generating another article. If Windows killed a run, check for a running process before manually removing run.lock.

Automated checks validate structure and known constraints; they cannot guarantee factual or editorial quality. Review published content periodically. Service-area topics must contain verifiedArea facts; no locations have been queued by default.

References:
- https://learn.chatgpt.com/docs/non-interactive-mode
- https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart
- https://developers.google.com/webmaster-tools/v1/sitemaps/submit

## Editorial blog pages

The first two articles live in `content/blog.mjs`. Run `npm.cmd run build:blog` to rebuild their pages and the blog listing. Their slugs are recorded in `automation/published.json` so weekly runs skip these completed topics. Blog pages use relative links for both XAMPP and domain hosting. `npm.cmd run check` includes blog metadata, structured-data and local-link checks.
