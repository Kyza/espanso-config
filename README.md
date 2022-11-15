## Setup

You will need Git and Deno installed.

On Linux you will need `sensible-browser` as well.

Git clone the repository into `match/kyza` in your Espanso config.

## Some Commands

### `update;`

Updates the config.

### `reloadcache;`

Redownloads the cached Deno files.

## Variables

Create a folder called `variables` in the root.

To make a variable name it the name of the target variable.

The contents of the file is the variable's value.

If the variable is a list each of the file's lines will be items.

### Valid Variables

- `gitbase`
  - Adds more base URLs such as https://gitlab.com/ to the Git macro.
