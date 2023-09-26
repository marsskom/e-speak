# E-Speak

- [Firebase Docs](./docs/firebase.md)
- [OpenAI Docs](./docs/openai.md)
- [Instalation](./docs/installation.md)

## Disclaimer

> I'm newbie in Vue.js 3 and TypeScript, so I'm not sure that I'm doing everything right. If you have any suggestions, please, let me know.

> Moreover, work still in progress, so I'm not sure that everything is working as expected.

> The main purpose of this project is to learn Vue.js 3 and TypeScript with OpenAI, so I'm not sure that I will support it in the future. Now I'm working on it in my free time, but I'm not sure that I will have enough time for it in the future.

> Basically, I'm trying to create MVP.

## Node Version

The project works on no version 16.20.2.

Firstly, I used to use version 18 latest, but I had some problems with `fetch` to OpenAI API. I tried to fix it, but I didn't find any solution. So I decided to downgrade node version to 16.20.2 and it helped.

Except, you should install dependencies with `yarn install --ignore-engines` command, since latest version of `vuefire` doesn't support node version 16. Older `vuefire` vesions don't work.

## Docker

Unfortunately, docker is not working yet.

The problem some kind of strange, since nuxt doesn't use 3000 port and choses it randomly. I tried to use `EXPOSE` and `PORT` environment variable, but it didn't help.

## Contributors

- Andrii Prakapas - **owner**
- [Copilot](https://github.com/features/copilot) - **contributor**

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
