# AI-Native Investment Firm Assessment

Live at https://assessment.agi-automations.com (Cloudflare Pages, no build step: files are served from the repo root).

- `index.html` is generated. Do not edit it here. The source is the Claude Design export plus the edits in `Marketing Infrastructure/projects/ai-native-assessment/` (`edits.json`, `build.js`). Run `node build.js` and copy `dist/*` here.
- `state-of-ai-2026.pdf` is generated from the Claude Design report with `make-pdf.js` in the same folder. It is attached to the results email.
- Submissions POST to the n8n workflow "11 - AI-Native Assessment Inbound" (webhook `ai-native-assessment`), which upserts the Notion contact and company, notifies Ben and sends the results email via Resend.

The previous estate-agency Vite app is in the git history before this commit.
