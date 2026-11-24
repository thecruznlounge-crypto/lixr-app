<?php
// Copy this file to config.php (same folder) and fill it in.
// config.php is blocked from the web by .htaccess. Never commit it to GitHub.
return [
    // Your Anthropic API key from console.anthropic.com
    'anthropic_api_key' => 'sk-ant-REPLACE_ME',

    // Model used for cloning. Sonnet is fast and reads menus and photos well.
    'model' => 'claude-sonnet-5-5',

    // Sites allowed to call the API (your live domain, with https, no trailing slash).
    'allowed_origins' => ['https://lixr.app', 'https://www.lixr.app'],

    // Clones per visitor per hour.
    'requests_per_hour' => 30,

    // Optional: email address that gets a note for every "Report this result".
    'report_email' => '',
];
