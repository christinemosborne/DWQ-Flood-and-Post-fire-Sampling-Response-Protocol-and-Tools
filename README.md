# DWQ Flood and Post-Fire Water Quality Toolkit

A static website for Utah Division of Water Quality's response to floods and post-fire runoff. All pages link to each other through a shared menu. Every file sits at the top level, with no folders.

| File | What it is |
|---|---|
| `index.html` | Home page with links to every tool |
| `response-guide.html` | Step-by-step flood and post-fire response, from activation to long-term monitoring |
| `who-samples-what.html` | Decision tree and roles table for which agency samples what |
| `sap-builder.html` | Builds a sampling and analysis plan with costs |
| `data-hub.html` | Shared Sampling Data Hub: partners share planned sampling and upload results |
| `risk-communication.html` | Risk Communication Plan (draft; not linked from the site yet) |
| `config.js` | Settings: data hub connection, BMP tool link |
| `nav.js` | The shared top menu |
| `Code.gs`, `BACKEND-SETUP.md` | Google Sheets backend for the data hub, and how to set it up |

The Post-Fire BMP Selection Tool is linked from the home page; it lives in its own repository.

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `dwq-flood-fire-toolkit`).
2. **Add file → Upload files**, select all the files, and commit.
3. **Settings → Pages**: "Deploy from a branch," branch `main`, folder `/ (root)`, Save.
4. After a minute or two, the site is at `https://<your-account>.github.io/<repo-name>/`.

## Connect the shared data hub

The hub works right away in **test mode** (data stays in each person's browser). To share data between agencies, follow `BACKEND-SETUP.md`, then paste the web app URL into `hubBackendUrl` in `config.js`.

**Never put the passcode in this repository.** It lives only in the Apps Script project's Script Properties.

## Linking the Risk Communication Plan later

The plan page is in the site but not linked. When it is ready: in `nav.js`, remove the `/*` and `*/` around the Risk Communication line; in `index.html`, follow the note above the Risk Communication Plan card and change step 5 (`<div class="step soon">`) back to a link.

## Editing the tools

Each tool is one self-contained `.html` file with its styles and code inline. Edit it on GitHub (pencil icon) and commit. People's in-progress work is saved in their own browser, so site updates don't erase it.
