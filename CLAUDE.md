# obsidian-local-graph-sync

グローバルグラフ（graph.json）の設定をローカルグラフに自動同期するObsidianコミュニティプラグイン。
obsidian-sample-plugin をベースに実装する。

## Tech Stack
- TypeScript
- Obsidian Plugin API
- esbuild（バンドル）

## Commands
```bash
npm install
npm run dev      # watch build
npm run build    # 本番ビルド
```

## Structure
```
src/
  main.ts        # プラグインエントリ・イベントフック
  sync.ts        # graph.json読み取り → LocalGraph適用ロジック
  types.ts       # GraphSettings型定義
manifest.json
```

## 同期設定の設計

### setViewState()（公式API）で適用
linksStrength, repelStrength, centerStrength, linkDistance,
nodeSize, linkThickness, textFadeThreshold, nodeSizeMode,
showTags, showAttachments, hideUnresolved, showOrphans

### 非公式API（LocalGraphView内部）で適用
search, colorGroups

### 同期しない
localJumps（ノート固有の深さ）

## Rules
- LocalGraphView の内部アクセスは必ず try-catch で囲む
- setViewState() と非公式APIは明確に分離して実装する
- Obsidian APIの型は obsidian パッケージから import、独自定義禁止
- graph.json の読み取りは readConfigJson('graph') のみ使用
- commit前に必ず確認する

@docs/ARCHITECTURE.md
