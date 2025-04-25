# Contributing

## Troubleshooting

### Wails Dependency Installation

The following command will tell you what dependencies you need. I ran into an error with `libwebkit` not being found

```zsh
wails doctor
```

If you are on Ubuntu 24.04, when running you can use `libwebkit2gtk-4.1-dev`, check out the `Platform Specific Dependencies` [page](https://wails.io/docs/gettingstarted/installation) for more details.
