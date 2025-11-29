# Command Palette Keywords

WordPress のコマンドパレットにキーワード検索機能を追加するプラグインです。

## 機能

- コマンドパレット（Cmd/Ctrl + K）でキーワード検索が可能になります
- 日本語と英語のキーワードをサポート
- WordPress の標準メニュー項目にキーワードを自動的に追加
- 既存のキーワードと新規キーワードをマージして検索精度を向上
- コマンド名とラベルの両方からインテリジェントにマッチング

## インストール

1. WordPress 管理画面にログイン
2. 「プラグイン」→「インストール済みプラグイン」に移動
3. 「Command Palette Keywords」を探して「有効化」をクリック

## 使い方

1. 管理画面で `Cmd + K` (Mac) または `Ctrl + K` (Windows/Linux) を押す
2. コマンドパレットが開きます
3. キーワードで検索できます

### キーワード検索の例

- **「blog」** → 投稿一覧が表示
- **「画像」** → メディアライブラリが表示
- **「design」** → テーマ設定が表示
- **「プラグイン」** → プラグイン管理が表示
- **「設定」** → 各種設定画面が表示

## サポートされているキーワード

### ダッシュボード
- home, dashboard, ホーム, ダッシュボード

### 投稿
- posts, blog, articles, 投稿, ブログ, 記事
- new post, write, create, 新規投稿, 作成
- categories, カテゴリー
- tags, タグ

### メディア
- media, images, files, メディア, 画像, ファイル
- upload, アップロード

### ページ
- pages, ページ
- new page, 新規ページ

### コメント
- comments, コメント

### 外観
- themes, appearance, design, テーマ, 外観, デザイン
- customizer, customize, カスタマイズ
- widgets, ウィジェット
- menus, navigation, メニュー, ナビゲーション

### プラグイン
- plugins, extensions, プラグイン, 拡張機能
- install plugins, add plugins, プラグインを追加

### ユーザー
- users, members, ユーザー, メンバー
- profile, account, プロフィール, アカウント

### ツール
- tools, ツール
- import, インポート
- export, エクスポート
- health, status, サイトヘルス, 状態

### 設定
- settings, general, config, 設定, 一般
- writing, 投稿設定
- reading, 表示設定
- discussion, ディスカッション
- permalinks, urls, パーマリンク
- privacy, プライバシー

## カスタマイズ

キーワードマッピングを追加・変更するには、`command-palette-keywords.php` の `$keyword_mappings` 配列を編集してください。

```php
$keyword_mappings = array(
    'your-page.php' => array( 'keyword1', 'keyword2', '日本語キーワード' ),
);
```

## 技術詳細

- WordPress 6.9+ が必要（コマンドパレット機能が含まれるバージョン）
- `wp.commands` パッケージを使用
- コアファイルを変更せずにフック経由で機能を拡張

### アーキテクチャ

1. **PHP側（command-palette-keywords.php）**
   - キーワードマッピングを定義
   - JavaScriptにデータを渡す

2. **JavaScript側（assets/command-keywords.js）**
   - WordPress コマンドストアを監視
   - 登録済みコマンドを自動検出
   - 以下の方法でキーワードをマッチング：
     - コマンド名からの直接マッチング（`.php` ファイル名）
     - `core/` プレフィックス付きコマンド名のパターンマッチング
     - コマンドラベルからのコンテンツマッチング
   - 既存キーワードと新規キーワードをマージして再登録
   - デバッグログをコンソールに出力

### デバッグ

ブラウザの開発者ツール（F12）のConsoleタブを開くと、以下の情報が表示されます：
- 処理されたコマンド数
- 各コマンドに追加されたキーワード
- マッチング方法（name-direct, name-pattern, label-match, url-match）

```
Command Palette Keywords: Processing 50 commands
Adding keywords to "サイトヘルス" (core/site-health): ["health", "status", "サイトヘルス", "状態"] [label-match]
```

## バージョン

### 1.0.1
- キーワードマッチングロジックを改善
- 既存キーワードとの統合機能を追加
- `core/` プレフィックス付きコマンドへの対応
- デバッグログ機能を追加

### 1.0.0
- 初回リリース

## トラブルシューティング

### キーワードで検索できない場合

1. ブラウザの開発者ツール（F12）を開く
2. Consoleタブを確認
3. "Command Palette Keywords: Processing" というログが表示されているか確認
4. 該当するコマンドにキーワードが追加されているか確認
5. ページをリロードして再試行

### 期待通りに動作しない場合

- WordPress 6.9以上を使用していることを確認
- プラグインが有効化されていることを確認
- ブラウザのキャッシュをクリア
- 他のプラグインとの競合がないか確認

## 作者

NExT-Season (created by Claude Code)
- Website: https://next-season.net/

## ライセンス

GPL2+
