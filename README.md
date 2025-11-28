# Command Palette Keywords

WordPress のコマンドパレットにキーワード検索機能を追加するプラグインです。

## 機能

- コマンドパレット（Cmd/Ctrl + K）でキーワード検索が可能になります
- 日本語と英語のキーワードをサポート
- WordPress の標準メニュー項目にキーワードを自動的に追加

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

## バージョン

1.0.0 - 初回リリース

## ライセンス

GPLv2 or later
