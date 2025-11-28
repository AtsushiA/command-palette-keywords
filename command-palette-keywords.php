<?php
/**
 * Plugin Name: Command Palette Keywords
 * Description: Adds keyword search support to WordPress Command Palette
 * Version: 1.0.0
 * Author: Custom
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue custom JavaScript to add keywords to command palette commands
 */
function cpk_enqueue_command_keywords() {
    // Only load on admin pages where command palette is active
    if ( ! is_admin() ) {
        return;
    }

    wp_enqueue_script(
        'command-palette-keywords',
        plugins_url( 'assets/command-keywords.js', __FILE__ ),
        array( 'wp-commands', 'wp-core-commands', 'wp-data', 'wp-hooks' ),
        '1.0.0',
        true
    );

    // Pass keyword mappings to JavaScript
    $keyword_mappings = array(
        // Dashboard
        'index.php' => array( 'home', 'dashboard', 'ホーム', 'ダッシュボード' ),

        // Posts
        'edit.php' => array( 'posts', 'blog', 'articles', '投稿', 'ブログ', '記事' ),
        'post-new.php' => array( 'new post', 'write', 'create', '新規投稿', '作成' ),
        'edit-tags.php?taxonomy=category' => array( 'categories', 'カテゴリー' ),
        'edit-tags.php?taxonomy=post_tag' => array( 'tags', 'タグ' ),

        // Media
        'upload.php' => array( 'media', 'images', 'files', 'メディア', '画像', 'ファイル' ),
        'media-new.php' => array( 'upload', 'アップロード' ),

        // Pages
        'edit.php?post_type=page' => array( 'pages', 'ページ' ),
        'post-new.php?post_type=page' => array( 'new page', '新規ページ' ),

        // Comments
        'edit-comments.php' => array( 'comments', 'コメント' ),

        // Appearance
        'themes.php' => array( 'themes', 'appearance', 'design', 'テーマ', '外観', 'デザイン' ),
        'customize.php' => array( 'customizer', 'customize', 'カスタマイズ' ),
        'widgets.php' => array( 'widgets', 'ウィジェット' ),
        'nav-menus.php' => array( 'menus', 'navigation', 'メニュー', 'ナビゲーション' ),
        'theme-editor.php' => array( 'editor', 'code', 'エディター', 'コード' ),

        // Plugins
        'plugins.php' => array( 'plugins', 'extensions', 'プラグイン', '拡張機能' ),
        'plugin-install.php' => array( 'install plugins', 'add plugins', 'プラグインを追加' ),
        'plugin-editor.php' => array( 'plugin editor', 'プラグインエディター' ),

        // Users
        'users.php' => array( 'users', 'members', 'ユーザー', 'メンバー' ),
        'user-new.php' => array( 'new user', 'add user', '新規ユーザー' ),
        'profile.php' => array( 'profile', 'account', 'プロフィール', 'アカウント' ),

        // Tools
        'tools.php' => array( 'tools', 'ツール' ),
        'import.php' => array( 'import', 'インポート' ),
        'export.php' => array( 'export', 'エクスポート' ),
        'site-health.php' => array( 'health', 'status', 'サイトヘルス', '状態' ),
        'export-personal-data.php' => array( 'privacy', 'gdpr', 'プライバシー' ),

        // Settings
        'options-general.php' => array( 'settings', 'general', 'config', '設定', '一般' ),
        'options-writing.php' => array( 'writing', '投稿設定' ),
        'options-reading.php' => array( 'reading', '表示設定' ),
        'options-discussion.php' => array( 'discussion', 'comments', 'ディスカッション' ),
        'options-media.php' => array( 'media settings', 'メディア設定' ),
        'options-permalink.php' => array( 'permalinks', 'urls', 'パーマリンク' ),
        'options-privacy.php' => array( 'privacy', 'プライバシー' ),
    );

    wp_localize_script(
        'command-palette-keywords',
        'commandPaletteKeywords',
        array(
            'mappings' => $keyword_mappings,
        )
    );
}
add_action( 'admin_enqueue_scripts', 'cpk_enqueue_command_keywords', 100 );
