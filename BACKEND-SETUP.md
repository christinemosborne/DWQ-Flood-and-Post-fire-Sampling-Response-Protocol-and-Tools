# Data hub backend (Google Sheets)

The Shared Sampling Data Hub stores shared data in a Google Sheet through a small Google Apps Script web app (`Code.gs`). Until it's connected, the hub runs in **test mode**, and anything entered stays in that person's browser.

## Set it up (about 10 minutes, once)

1. Create a Google Sheet in the DWQ Google Drive, for example "DWQ Shared Sampling Data Hub".
2. In the sheet, open **Extensions → Apps Script**. Delete the starter code, paste in all of `Code.gs`, and save.
3. Open **Project Settings (gear icon) → Script Properties → Add script property**:
   - Property: `PASSCODE`
   - Value: a passcode you'll share with partner agencies by email or phone, never on the website.
4. Back in the editor, choose `setup` from the function menu and click **Run**. Approve the permissions. This creates the Events, Plans, Uploads and Results tabs.
5. Click **Deploy → New deployment**, pick type **Web app**, and set:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the web app URL (it ends in `/exec`).
7. In the GitHub repo, edit `config.js` and paste the URL into `hubBackendUrl`. Commit.

The first time partners open the Data Hub, it asks for the passcode and remembers it in their browser.

## Good to know

- **Access.** Anyone with the passcode can add, change or delete entries. To shut someone out, change `PASSCODE` in Script Properties and send the new one to current partners.
- **Your data stays in your sheet.** You can sort, filter, chart or export it in Google Sheets. Don't rename the tabs or column headers, because the hub reads them by name.
- **Updating the code.** After you change `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. That keeps the same URL. A "New deployment" gives a new URL that you'd have to put in `config.js` again.
- **Limits.** Each upload holds up to 1,000 result rows; split bigger files. Google Sheets handles hundreds of thousands of rows, but if the Results tab gets very large, copy past events to an archive sheet.
- **State IT.** Check with DTS whether a public Apps Script web app is allowed for this kind of data. If not, the same hub can point to another backend that follows the same requests (see `Code.gs` for the list of actions).
- **Not a system of record.** Results in the hub are provisional field and lab data shared during an event. Final, validated data still go to AWQMS/WQX through the normal process.
