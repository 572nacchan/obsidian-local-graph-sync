# Architecture

## Overview

Obsidianのグローバルグラフ設定（`graph.json`）を読み取り、開いているすべてのローカルグラフに適用する。
設定変更の検知は `vault.on('config-changed')` で行う。
ローカルグラフの検出は `workspace.getLeavesOfType('localgraph')` を使用。

## データフロー

```
graph.json
  ↓ readConfigJson('graph')  ← 非公式API（型なし）
GraphSettings（型定義）
  ↓ engine.setOptions(merged)  ← 非公式API（leaf.view.engine）
localgraph leaf（全件）
```

## 反映タイミング

| イベント | 処理 |
|---|---|
| `layout-change` | 新規ローカルグラフ検出 → 即時適用 |
| `config-changed` | 設定再読み取り → 全ローカルグラフに再適用 |

## Key Decisions

- **setViewState() は使わない**: app.js 調査の結果、LocalGraphView は `engine.setOptions()` で全設定を管理していることが判明。setViewState経由より直接・確実。
- **engine.getOptions() で現在値をマージ**: `localJumps` / `localFile` / `local*links` など上書きしてはいけない値を保護するため、現在値をスプレッドしてから SYNC_KEYS のみ上書きする。
- **SYNC_KEYS で同期対象を明示**: `types.ts` にまとめて定義し、追加・除外を一箇所で管理する。

## 非公式APIの内部構造（app.js 調査済み）

```
LocalGraphView (EJ)
  └─ engine: GraphEngine (xJ)
       ├─ getOptions() → { search, showTags, ..., colorGroups, ..., localJumps, ... }
       └─ setOptions(options) → 各サブコントローラに委譲してレンダリング
```

`getOptions` / `setOptions` の引数は `graph.json` のキー名と一致する（例: `linkStrength`, `nodeSizeMultiplier`）。

## graph.json のフィールド（実測値）

| フィールド | 同期 | 備考 |
|---|---|---|
| `search` | ✅ | フィルタ文字列 |
| `showTags` / `showAttachments` / `hideUnresolved` / `showOrphans` | ✅ | |
| `colorGroups` | ✅ | `[{ query, color: { a, rgb } }]` |
| `showArrow` | ✅ | |
| `textFadeMultiplier` / `nodeSizeMultiplier` / `lineSizeMultiplier` | ✅ | |
| `centerStrength` / `repelStrength` / `linkStrength` / `linkDistance` | ✅ | |
| `localJumps` / `localFile` / `local*links` | ❌ | ローカルグラフ固有 |
| `scale` / `close` | ❌ | ビュー状態 |

## 実装ステップ

- [x] obsidian-sample-plugin をcloneして環境セットアップ
- [x] `graph.json` の読み取りと `GraphSettings` 型定義
- [x] `localgraph` leaf の検出と内部API調査（app.js リバース済み）
- [x] `engine.setOptions()` による全パラメータの適用（setViewState不要と判明）
- [x] `layout-change` イベントフック
- [x] `config-changed` イベント監視
- [x] Vaultで動作確認
- [ ] （任意）設定画面：同期する項目を選択可能にする
