import React from 'react';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <h1>Hello</h1>;

toStorybook.story = {
  name: 'to Storybook',
};
