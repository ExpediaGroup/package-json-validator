![Release](https://github.com/ExpediaGroup/package-json-validator/workflows/Release/badge.svg)

# package-json-validator

A Github Action for validating package.json conventions.

## Usage

Use the `rules` input to specify one or more rules you would like to check for your `package.json`.

### Ranges
The "ranges" rule validates that all package.json dependencies are exact versions, or use only the allowed version ranges specified. [Click here](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies) for details about version ranges.

The following usage would allow `"my-package": "1.2.3"` but prevent `"my-package": "^1.2.3"`.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - uses: ExpediaGroup/package-json-validator@v1
    with:
      rules: ranges
```

You can also specify `allowed-ranges`. The following would allow `"my-package": "^1.2.3"` but prevent `"my-package": "~1.2.3"`.
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - uses: ExpediaGroup/package-json-validator@v1
    with:
      rules: ranges
      allowed-ranges: ^
```

### Tags
The "tags" rule validates that all package.json dependencies contain no tagged versions, or use only the allowed tags specified. [Click here](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies) for details about tags.

The following usage would allow `"my-package": "1.2.3"` but prevent `"my-package": "1.2.3-alpha.456.0"`.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - uses: ExpediaGroup/package-json-validator@v1
    with:
      rules: tags
```

The following usage would allow `"my-package": "1.2.3-canary.456.0"` but prevent `"my-package": "1.2.3-alpha.456.0"`.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - uses: ExpediaGroup/package-json-validator@v1
    with:
      rules: tags
      allowed-tags: canary
```

Specify `dependency-types` to denote which type of package.json dependencies you wish to validate. Valid options include `dependencies`, `devDependencies`, `peerDependencies`, and `optionalDependencies`. Defaults to `dependencies`.
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - uses: ExpediaGroup/package-json-validator@v1
    with:
      rules: ranges
      dependency-types: devDependencies
```

### Other Usages
You may also enforce multiple rules (and pass additional inputs) like this:
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - uses: ExpediaGroup/package-json-validator@v1
    with:
      rules: |
        ranges
        tags
      allowed-ranges: |
        ^
        *
      allowed-tags: |
        alpha
        canary
      dependency-types: |
        dependencies
        devDependencies
```

# Contact

This project is part of Expedia Group Open Source but also maintained by [Dan Adajian](https://github.com/danadajian)

* Expedia Group OSS
    * https://expediagroup.github.io

# License

The scripts and documentation in this project are released under the [Apache 2 License](./LICENSE).

# Contributions

- Follow semantic-release commit formatting. See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
