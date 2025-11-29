/**
 * Command Palette Keywords Extension
 * Adds keyword support to WordPress Command Palette commands
 */

(function() {
    'use strict';

    // Wait for WordPress to be ready
    if (typeof wp === 'undefined' || !wp.data || !wp.hooks) {
        console.error('Command Palette Keywords: WordPress dependencies not loaded');
        return;
    }

    const { subscribe, select, dispatch } = wp.data;

    // Get keyword mappings from PHP
    const keywordMappings = window.commandPaletteKeywords?.mappings || {};

    /**
     * Extract the file/slug from a URL for matching
     */
    function extractSlugFromUrl(url) {
        if (!url) return '';

        // Remove domain and protocol
        const urlObj = new URL(url, window.location.origin);
        const pathname = urlObj.pathname;
        const search = urlObj.search;

        // Get the file part (e.g., 'edit.php')
        const parts = pathname.split('/');
        const file = parts[parts.length - 1];

        // Combine with query string if present
        return search ? file + search : file;
    }

    /**
     * Match URL against keyword mapping keys
     */
    function findKeywordsForUrl(url) {
        const slug = extractSlugFromUrl(url);

        // Direct match
        if (keywordMappings[slug]) {
            return keywordMappings[slug];
        }

        // Try matching without query parameters
        const fileOnly = slug.split('?')[0];
        if (keywordMappings[fileOnly]) {
            return keywordMappings[fileOnly];
        }

        // Try partial matches
        for (const [key, keywords] of Object.entries(keywordMappings)) {
            if (slug.includes(key) || key.includes(slug)) {
                return keywords;
            }
        }

        return [];
    }

    /**
     * Enhance commands with keywords
     */
    function enhanceCommandsWithKeywords() {
        const commandsStore = select('core/commands');
        if (!commandsStore) {
            return;
        }

        // Get all registered commands
        const commands = commandsStore.getCommands();
        const contextualCommands = commandsStore.getCommands(true);
        const allCommands = [...commands, ...contextualCommands];

        console.log('Command Palette Keywords: Processing', allCommands.length, 'commands');

        // Enhance each command with keywords
        allCommands.forEach(command => {
            let matchedKeywords = [];
            let matchSource = '';

            // Try to extract URL from command name or callback
            let url = '';

            // Command name often contains the slug
            if (command.name) {
                // For commands like 'index.php', 'edit.php', etc.
                if (command.name.includes('.php')) {
                    url = command.name;
                    matchSource = 'name-direct';
                }
                // Also try to extract from core/edit-site pattern
                else if (command.name.startsWith('core/')) {
                    const slug = command.name.replace('core/', '');
                    // Try to find a match in mappings
                    for (const [key, keywords] of Object.entries(keywordMappings)) {
                        if (key.includes(slug) || slug.includes(key.replace('.php', ''))) {
                            matchedKeywords = keywords;
                            matchSource = 'name-pattern';
                            break;
                        }
                    }
                }
            }

            // Find keywords based on URL
            if (url && matchedKeywords.length === 0) {
                matchedKeywords = findKeywordsForUrl(url);
                if (matchedKeywords.length > 0) {
                    matchSource = 'url-match';
                }
            }

            // If we couldn't find URL from name, try to infer from label
            if (matchedKeywords.length === 0 && command.label) {
                // Check if label contains hints
                const label = command.label.toLowerCase();

                // Try to match based on label content
                for (const keywords of Object.values(keywordMappings)) {
                    if (keywords.some(kw => label.includes(kw.toLowerCase()))) {
                        matchedKeywords = keywords;
                        matchSource = 'label-match';
                        break;
                    }
                }
            }

            // Add keywords if found (merge with existing keywords)
            if (matchedKeywords.length > 0) {
                const existingKeywords = command.keywords || [];
                const mergedKeywords = [...new Set([...existingKeywords, ...matchedKeywords])];

                console.log(`Adding keywords to "${command.label}" (${command.name}):`, matchedKeywords, `[${matchSource}]`);

                // Re-register command with enhanced keywords
                dispatch('core/commands').registerCommand({
                    ...command,
                    keywords: mergedKeywords
                });
            }
        });
    }

    /**
     * Hook into command registration to add keywords automatically
     */
    let hasInitialized = false;
    let enhancementTimeout = null;

    function initKeywordEnhancement() {
        if (hasInitialized) return;

        // Wait for commands store to be ready
        const unsubscribe = subscribe(() => {
            const commandsStore = select('core/commands');

            if (!commandsStore) {
                return;
            }

            // Store is ready, we can enhance commands
            // Use timeout to debounce multiple rapid calls
            if (enhancementTimeout) {
                clearTimeout(enhancementTimeout);
            }

            enhancementTimeout = setTimeout(() => {
                enhanceCommandsWithKeywords();
            }, 100);
        });

        hasInitialized = true;

        // Also try to enhance immediately if store is already available
        if (select('core/commands')) {
            setTimeout(enhanceCommandsWithKeywords, 500);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKeywordEnhancement);
    } else {
        initKeywordEnhancement();
    }

    // Also try after a delay to catch late-loaded commands
    setTimeout(() => {
        enhanceCommandsWithKeywords();
    }, 2000);

})();
