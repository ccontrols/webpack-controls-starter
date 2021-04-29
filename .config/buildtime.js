const { defaultBuildConfig } = require("@component-controls/core");

module.exports = {
  stories: ["../src/docs/*.mdx", "../src/components/**/*.docs.tsx"],
  pages: {
    story: {
      tabs: {
        ...defaultBuildConfig.pages.story.tabs,
        test: "@component-controls/pages/TestingPage",
      },
    },
  },
  siteUrl: `https://webpack-controls-starter.netlify.app`,
};
