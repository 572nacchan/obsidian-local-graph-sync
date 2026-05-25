# Architecture

## Overview

Obsidianのグローバルグラフ設定（`graph.json`）を読み取り、開いているすべてのローカルグラフに適用する。
設定変更の検知は `vault.on('config-changed')` または `graph.json` のファイル監視で行う。
ローカルグラフの検出は `workspace.getLeavesOfType('localgraph')` を使用。

## データフロー

```
graph.json
  ↓ readConfigJson('graph')
GraphSettings（型定義）
  ↓
┌─────────────────────────────────┐
│ 公式API setViewState()          │ ← 物理・表示パラメータ
│ 非公式API LocalGraphView内部    │ ← search / colorGroups
└─────────────────────────────────┘
  ↓
localgraph leaf（全件）
```

## 反映タイミング

| イベント | 処理 |
|---|---|
| `layout-change` | 新規ローカルグラフ検出 → 即時適用 |
| `config-changed` / graph.json変更 | 設定再読み取り → 全ローカルグラフに再適用 |

## Key Decisions

- **setViewState() と非公式APIを分離**: バージョンアップで非公式部分が壊れても、物理・表示パラメータは生き残るようにする
- **LocalGraphView の型は `as unknown as LocalGraphView` でキャスト**: TypeScriptの型安全を意図的に破る箇所を明示
- **設定の部分適用**: 既存の `localJumps` など上書きしてはいけない値を守るため、`getViewState()` で現在値を取得してスプレッドでマージする

## 非公式APIの調査方法

Obsidianの `app.js` をリバースエンジニアリングして `LocalGraphView` の内部プロパティを特定する。

```typescript
// devtoolsで確認する方法
const leaf = app.workspace.getLeavesOfType('localgraph')[0];
console.log(leaf.view); // 内部構造を確認
```

## 実装ステップ

- [ ] obsidian-sample-plugin をcloneして環境セットアップ
- [ ] `graph.json` の読み取りと `GraphSettings` 型定義
- [ ] `localgraph` leaf の検出と内部API調査
- [ ] `setViewState()` による物理・表示パラメータの適用
- [ ] 非公式APIによる `search` / `colorGroups` の注入
- [ ] `layout-change` イベントフック
- [ ] `graph.json` 変更監視
- [ ] Vaultで動作確認
- [ ] （任意）設定画面：同期する項目を選択可能にする
