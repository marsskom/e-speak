# E-Speak

## Disclaimer

> I'm newbie in Vue.js 3 and TypeScript, so I'm not sure that I'm doing everything right. If you have any suggestions, please, let me know.
> Moreover, work still in progress, so I'm not sure that everything is working as expected.
> The main purpose of this project is to learn Vue.js 3 and TypeScript with OpenAI, so I'm not sure that I will support it in the future. Now I'm working on it in my free time, but I'm not sure that I will have enough time for it in the future.
> Basically, I'm trying to create MVP.

## Contributors

- Andrii Prakapas - **owner**
- [Copilot](https://github.com/features/copilot) - **contributor**

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
