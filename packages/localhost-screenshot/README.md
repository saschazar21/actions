[![localhost-screenshot](https://github.com/saschazar21/actions/actions/workflows/localhost-screenshot.yml/badge.svg)](https://github.com/saschazar21/actions/actions/workflows/localhost-screenshot.yml)

<div align="center">
  <h1>📸 Localhost Screenshot</h1>
  <br />
  <br />
</div>

> A [GitHub Action](https://docs.github.com/en/actions) for creating automated screenshots of a static website for various viewports

## Inputs

All listed inputs below are **optional** and therefore should merely support in customizing the workflow run. If omitted, an automatic fallback to the default values is provided.

| input     | description                                                                                                                                                                                                                | required | default                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------: | -------------------------- |
| `dark`    | Apply dark mode (run with @media (prefers-color-scheme: dark))                                                                                                                                                             |       no | `false`                    |
| `devices` | Comma-separated string of devices to emulate within Chrome (see: [Puppeteer DeviceDescriptors](https://bit.ly/3n0EmMe)) - to also include the default viewport, add an invalid device descriptor, e.g. `desktop`           |       no | standard 1440x900 viewport |
| `dist`    | Relative path pointing to the website distribution folder                                                                                                                                                                  |       no | `"./dist"`                 |
| `name`    | Screenshot file name prefix to use. Screenshot filenames are a combination of _prefix_, _viewport_ and _dark_ (e.g. `[name]_[width]x[height]_dark.png`, when `dark` input equals `true`, otherwise dark suffix is omitted) |       no | `"screenshot"`             |
| `url`     | URL path of the website to create a screenshot from                                                                                                                                                                        |       no | `"/"`                      |

## Example usage

```yml
uses: saschazar21/actions/packages/localhost-screenshot@main
with:
  dark: true
  devices: iPad, iPhone 11, Pixel 2
  dist: _build
  name: screen
  url: /about
```

The example configuration above will set `_build` as website root, create 3 screenshots from the website's `/about` page based on the viewport of the listed devices (requesting the website's dark mode, should it support automatic detection), and store the results in the [output directory](#output-files).

### Demo workflow

A demo workflow is available in the [Actions tab](https://github.com/saschazar21/actions/actions/workflows/localhost-screenshot.yml/) of this repository.

## Debug messages

Verbose logging output may be triggered by setting the `DEBUG` environment variable to `localhost-screenshot`:

```yml
uses: saschazar21/actions/packages/localhost-screenshot@main
env:
  DEBUG: localhost-screenshot
```

## Output files

Screenshot output files can be found in the `/home/runner/work/_temp/_github_home/` directory for further processing (e.g. uploading artifacts, etc...), like the following example shows:

```yml
- name: Upload screenshots
  uses: actions/upload-artifact@v2
  with:
    name: screenshots
    path: /home/runner/work/_temp/_github_home/**.png
```

## License

Licensed under the MIT license.

Copyright ©️ 2021 [Sascha Zarhuber](https://sascha.work)
