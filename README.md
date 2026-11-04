# DWQ Flood and Post-Fire Water Quality Toolkit

A static website for Utah Division of Water Quality's response to floods and post-fire runoff. All pages link to each other through a shared menu. Every file sits at the top level, with no folders.

| File | What it is |
|---|---|
| `index.html` | Home page with links to every tool |
| `response-guide.html` | Step-by-step flood and post-fire response, from activation to long-term monitoring |
| `minimum-response.html` | Minimum Response: scaled-down flood and post-fire sampling plans for limited time, staff and lab budget (sites, schedule, samples, cost, E. coli tracking, printable plan) |
| `who-samples-what.html` | Decision tree and roles table for which agency samples what |
| `sap-builder.html` | Builds a sampling and analysis plan with costs |
| `data-hub.html` | Shared Sampling Data Hub: partners share planned sampling and upload results |
| `risk-communication.html` | Risk Communication Plan: build a communication plan for an event (advisory levels, who speaks, fill-in messages, message maps, rumor log) |
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

## Adding protocol links later

The flood and post-fire protocols aren't linked while they're drafts. When they're final, ask for the Response Guide's "Read the full protocol" button to be turned back on, or add links to the home page's "Plans and companion tools" section in `index.html`.

## Editing the tools

Each tool is one self-contained `.html` file with its styles and code inline. Edit it on GitHub (pencil icon) and commit. People's in-progress work is saved in their own browser, so site updates don't erase it.
