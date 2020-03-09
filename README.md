# react-use-mask

React hook for easily masking inputs.

## Inspiration

- This library is essentially a fork of [`react-text-mask`](https://github.com/text-mask/text-mask/tree/master/react#readme). I really liked their feature set and api. I just wanted a version built specifically for react and in the form of a hook. Thanks to them for laying the ground work for this lib.
- [`rifm`](https://github.com/realadvisor/rifm) is a fantastic, tiny, masking/formating tool for react. Props to them for inspiring the change handler/force update/useLayoutEffect (needs a pattern name!) cycle idea used in this hook.

## Install

`npm install react-use-mask`
or
`yarn add react-use-mask`

## Example

```jsx
function DateInput({ value, onChange }) {
  const mask = useMask({
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,],
    showMask: true,
    keepCharPositions: true,
    value,
    onChange
  })

  return <input value={mask.value} onChange={mask.onChange}>
}
```

## API

🚧Coming Soon. the API matches [`react-text-mask`](https://github.com/text-mask/text-mask/tree/master/react#readme) fairly closely.

## Development

This project was bootstrapped with [tsdx](https://github.com/jaredpalmer/tsdx)

### Commands

```
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run either example playground or storybook:

#### Storybook

Run inside another terminal:

```
yarn storybook
```

This loads the stories from `./stories`.

#### Example

Then run the example inside another:

```
cd example
yarn # or npm i to install dependencies
yarn start # or npm run start
```

#### Tests

Jest tests are set up to run with `yarn test`. This runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.
