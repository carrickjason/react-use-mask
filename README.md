# react-use-mask

React hook for easily masking inputs.

## Install

`npm install react-use-mask`
or
`yarn add react-use-mask`

## Example

```jsx
function DateInput({ value, onChange }) {
  const [ref, mask] = useMask({
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,],
    showMask: true,
    keepCharPositions: true,
    value,
    onChange
  })

  return <input ref={ref} value={mask.value} onChange={mask.onChange}>
}
```

## Inspiration

- [`react-text-mask`](https://github.com/text-mask/text-mask/tree/master/react#readme) is a great library that worked for most of my use cases. The only thing it was missing was a modern react solution (hooks). I loved the api so much that I stole it (along with a lot of great code).
- [`rifm`](https://github.com/realadvisor/rifm) is a fantastic, tiny, masking/formating tool for react. I liked that it provided a hook but found myself missing `react-text-mask`'s easy api.

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
