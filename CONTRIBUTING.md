# Contributing

## About

This application uses the official Wails React-TS template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.

> If you have the issue around libwebkit not being found related to Ubuntu 24.04, use the following command, see more about it in the `Troubleshooting` section below!

```zsh
wails dev -tags webkit2_41 
``` 

## Troubleshooting

### Wails Dependency Installation

The following command will tell you what dependencies you need. I ran into an error with `libwebkit` not being found

```zsh
wails doctor
```

If you are on Ubuntu 24.04, when running you can use `libwebkit2gtk-4.1-dev`, check out the `Platform Specific Dependencies` [page](https://wails.io/docs/gettingstarted/installation) for more details.
