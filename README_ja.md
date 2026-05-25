# Local Graph Sync

グローバルグラフの設定をローカルグラフに自動同期する [Obsidian](https://obsidian.md) プラグインです。

## 解決する問題

Obsidian のローカルグラフとグローバルグラフは、カラーグループ・フィルター・表示設定・物理演算などの設定を共有していますが、グローバルグラフを変更しても**ローカルグラフには反映されません**。毎回手動で設定し直す手間を解消します。

## 動作

グローバルグラフの設定が変更されたとき（または新しいローカルグラフが開かれたとき）、プラグインが `graph.json` を読み取り、開いているすべてのローカルグラフに設定を自動で適用します。

**ローカルグラフ固有の設定は上書きされません：**
- `localJumps`（表示深度）
- `localFile` / `localBacklinks` / `localForelinks` / `localInterlinks`

## 設定

同期するグループをトグルで個別に選択できます：

| グループ | 対象設定 |
|---------|---------|
| **フィルター** | search, showTags, showAttachments, hideUnresolved, showOrphans |
| **カラーグループ** | colorGroups |
| **表示** | showArrow, textFadeMultiplier, nodeSizeMultiplier, lineSizeMultiplier |
| **物理演算** | centerStrength, repelStrength, linkStrength, linkDistance |

デフォルトはすべて有効です。

## インストール

### 手動インストール

1. [最新リリース](https://github.com/572nacchan/obsidian-local-graph-sync/releases/latest) から `main.js`・`manifest.json`・`styles.css` をダウンロード
2. `<Vault>/.obsidian/plugins/obsidian-local-graph-sync/` にコピー
3. Obsidian を再読み込みして **設定 → コミュニティプラグイン** で有効化

### BRAT（ベータ版自動更新ツール）

1. [BRAT](https://github.com/TfTHacker/obsidian42-brat) をインストール
2. **BRAT → Add Beta Plugin** で `572nacchan/obsidian-local-graph-sync` を追加

## 注意事項

> **⚠️ 非公式 API の使用について**
>
> このプラグインは `vault.readConfigJson('graph')` と `GraphEngine.setOptions()` という、公式プラグイン API には存在しない内部 API を使用しています。Obsidian のアップデートにより動作しなくなる可能性があります。API が利用できない場合はコンソールに警告を出力し、何もしない（サイレント失敗）設計になっています。

## 開発

```bash
git clone https://github.com/572nacchan/obsidian-local-graph-sync
cd obsidian-local-graph-sync
npm install
npm run dev
```

## ライセンス

[MIT](LICENSE)
