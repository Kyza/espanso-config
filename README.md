## Setup

You will need Git and Deno installed.

On Linux you will need `sensible-browser` as well.

Git clone the repository into anywhere you want.

Run the setup script and point `--location` to your Espanso config directory.

```bash
deno run --allow-read --allow-write ./scripts/setup.ts --location=/THE/PATH/TO/YOUR/ESPANSO/CONFIG/ROOT
```

## Some Commands

### `update;;`

Updates the config.

### `setvar;;`

Sets a variable in the config to the value you want.

### `getvar;;`

Gets a variable's value from the config.

### `reloadcache;;`

Redownloads the cached Deno files.

## Variables


## `git`

### `bases`

Array.

Adds more base URLs such as https://gitlab.com/ to the Git macro.

## `written-numbers`

### `commas`

Boolean.

Enables commas by default in Written Numbers.

### `and`

Boolean.

Enables hundred and by default in Written Numbers.
