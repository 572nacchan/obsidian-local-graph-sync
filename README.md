# Local Graph Sync

[日本語版 README はこちら](README_ja.md)

An [Obsidian](https://obsidian.md) plugin that automatically syncs your global graph settings to all open local graphs.

## The Problem

Obsidian's local graph and global graph share many visual settings (colors, filters, display options, physics), but changes to the global graph are **not** reflected in local graphs. You have to manually reconfigure each local graph every time you update your global graph settings.

## What This Plugin Does

Whenever your global graph settings change (or a local graph is opened), this plugin reads `graph.json` and applies the matching settings to all open local graphs — automatically.

**Local-graph-specific settings are preserved:**
- `localJumps` (depth)
- `localFile` / `localBacklinks` / `localForelinks` / `localInterlinks`

These are never overwritten because they are unique to each local graph.

## Settings

You can choose which setting groups to sync:

| Group | Settings |
|-------|----------|
| **Filters** | search, showTags, showAttachments, hideUnresolved, showOrphans |
| **Color Groups** | colorGroups |
| **Display** | showArrow, textFadeMultiplier, nodeSizeMultiplier, lineSizeMultiplier |
| **Forces** | centerStrength, repelStrength, linkStrength, linkDistance |

All groups are enabled by default.

## Installation

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/572nacchan/obsidian-local-graph-sync/releases/latest).
2. Copy them to `<vault>/.obsidian/plugins/obsidian-local-graph-sync/`.
3. Reload Obsidian and enable the plugin in **Settings → Community Plugins**.

### BRAT (Beta Reviewers Auto-update Tool)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat).
2. Add `572nacchan/obsidian-local-graph-sync` via **BRAT → Add Beta Plugin**.

## Notes

> **⚠️ Unofficial API usage**
>
> This plugin relies on `vault.readConfigJson('graph')` and `GraphEngine.setOptions()`, which are internal Obsidian APIs not exposed in the official plugin API. These may break in future Obsidian updates. The plugin will log a warning to the console and silently do nothing if the APIs are unavailable.

## Development

```bash
git clone https://github.com/572nacchan/obsidian-local-graph-sync
cd obsidian-local-graph-sync
npm install
npm run dev
```

## License

[MIT](LICENSE)
