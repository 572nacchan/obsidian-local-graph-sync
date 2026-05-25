# obsidian-local-graph-sync

グローバルグラフ（`graph.json`）の設定をローカルグラフに自動同期するObsidianコミュニティプラグイン。

## Tech Stack

- TypeScript
- Obsidian Plugin API（+ 非公式内部API）
- esbuild（バンドル）

## Commands

```bash
npm install
npm run dev      # watch build（Vault ジャンクション経由で即反映）
npm run build    # 本番ビルド
npm run lint     # ESLint（CI と同じチェック）
```

## Structure

```
src/
  main.ts        # プラグインエントリ・イベントフック・デバウンス
  sync.ts        # graph.json 読み取り → LocalGraph 適用ロジック
  settings.ts    # 設定定義・設定画面UI
  types.ts       # GraphSettings 型定義・SYNC_KEY_GROUPS
manifest.json
```

## 同期設定の設計

全設定を `engine.setOptions()` で一括適用（`setViewState()` は使わない）。

| グループ | 設定キー |
|---------|---------|
| filters | search, showTags, showAttachments, hideUnresolved, showOrphans |
| colorGroups | colorGroups |
| display | showArrow, textFadeMultiplier, nodeSizeMultiplier, lineSizeMultiplier |
| forces | centerStrength, repelStrength, linkStrength, linkDistance |

同期しない（ローカルグラフ固有）: `localJumps`, `localFile`, `local*links`

## 非公式API

```typescript
// graph.json 読み取り
(app.vault as unknown as Record<...>)['readConfigJson']('graph')

// LocalGraph への適用
(leaf.view as unknown as { engine: GraphEngine }).engine.setOptions(merged)
```

いずれも try-catch でラップして、APIが存在しない場合はサイレント失敗。

## Rules

- 非公式APIアクセスは必ず try-catch で囲む
- `engine.getOptions()` で取得した現在値にマージして localJumps 等を保護する
- 同期対象キーの追加・除外は `types.ts` の `SYNC_KEY_GROUPS` だけを変更する
- commit 前に `npm run lint` を通す（CIが同じチェックを実行する）
- commit 前に必ず確認する

@docs/ARCHITECTURE.md
