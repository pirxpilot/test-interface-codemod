# test-interface-codemod


A collection of codemods for test interface transformation.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx test-interface-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add test-interface-codemod
test-interface-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [exports-to-bdd](transforms/exports-to-bdd/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`
