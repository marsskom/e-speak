# E-Speak

## Instalation

## Snippets

Some useful snippets for the project you can find in `.vscode/snippets` folder.

## Settings

VSCode settings are stored in `.vscode/settings.json` file. However I cannot share it, so I just show you an example of:

```json
{
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  "editor.formatOnSaveMode": "file",
  "files.autoSave": "onFocusChange",
  "editor.defaultFormatter": "jkillian.custom-local-formatters",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "GitHooks.hooksDirectory": ".git/hooks",
  "customLocalFormatters.formatters": [
    {
      "command": "npx prettier --write --list-different ${file} && npx eslint --ext \".ts,.vue\" ${file}",
      "languages": ["js", "vue", "ts"]
    }
  ],
  "[vue]": {
    "editor.defaultFormatter": "jkillian.custom-local-formatters"
  }
}
```

I had troubles with `eslint` and `prettier` so I had to use `custom-local-formatters` [extension](https://marketplace.visualstudio.com/items?itemName=jkillian.custom-local-formatters). It is not perfect, but it works.
