##### Common NPM custom registry
Custom NPM module to share common code across all the middlewares.
##### NOTE: 
Check the package.json file.
```
npm login
npm publish --access public
```

These will be written in TS but published in JS.

##### dependencies 
```
npm install typescript del-cli --save-dev
```

##### to convert TS to JS and build the project 
* add this to package.json 
```
"scripts": {
    "clean": "del-cli ./build/*",
    "build": "npm run clean && tsc"
  },
```
* uncomment below lines in tsconfig.json
```
    "declaration": true, /* Generates corresponding '.d.ts' file. */
    "outDir": "./build",
```
* run :
```
npm run build
```
*This will take the TS file we coded, convert it into JS and write it into the build directory*

If we want to publish it, we want to make sure we make changes so that the use/us while importing this module get access to the built file in the build folder instead of the index.js file in the root directory.
Therefore, package.json: 
```javascript
  "main": "./build/index.js", // main file
  "types": "./build/index.d.ts", // main type def file 
  "files": [
    "build/**/*" // files which will be included in the final published module
  ],
```

