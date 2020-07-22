require("dotenv").config();
const queries = require("./src/utils/algolia");

const config = require("./config");

const plugins = [
  'gatsby-plugin-sitemap',
  'gatsby-plugin-sharp',
  'gatsby-plugin-emotion',
  'gatsby-plugin-react-helmet',
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "docs",
      path: `${__dirname}/content/`
    }
  },
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      gatsbyRemarkPlugins: [
        {
          resolve: "gatsby-remark-images",
          options: {
            maxWidth: 1035,
            sizeByPixelDensity: true
          }
        },
        {
          resolve: 'gatsby-remark-copy-linked-files'
        }
      ],
      extensions: [".mdx", ".md"]
    }
  },
  {
    resolve: `gatsby-plugin-gtag`,
    options: {
      // your google analytics tracking id
      trackingId: config.gatsby.gaTrackingId,
      // Puts tracking script in the head instead of the body
      head: true,
      // enable ip anonymization
      anonymize: false,
    },
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `docs`,
      remote: `https://github.com/273403986/docsify-project`,
      // Optionally supply a branch. If none supplied, you'll get the default branch.
      branch: `master`,
      // Tailor which files get imported eg. import the docs folder from a codebase.
      // patterns: `docs/**`
    }
  },
  // {
  //   resolve: `gatsby-source-github-api`,
  //   options: {
  //     // url: API URL to use. Defaults to  https://api.github.com/graphql
  //     url: 'https://github.com/273403986/docsify-project',
  //     // token: required by the GitHub API
  //     token: 'code-settings-sync',
  //   }
  // },
  // {
  //   resolve: "gatsby-plugin-tidy",
  //   options: {
  //       cleanPublic: true,
  //       cleanCache: true,
  //       removeHashes: true,
  //       removeArtifacts: true,
  //       noJsMap: true,
  //       removeInlineStyles: true,
  //       jsDir: "js",
  //       cssDir: "css"
  //   }
  // },
];

// check and add algolia
if (config.header.search && config.header.search.enabled && config.header.search.algoliaAppId && config.header.search.algoliaAdminKey) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: config.header.search.algoliaAppId, // algolia application id
      apiKey: config.header.search.algoliaAdminKey, // algolia admin key to index
      queries,
      chunkSize: 10000, // default: 1000
    }}
  )
}
// check and add pwa functionality
if (config.pwa && config.pwa.enabled && config.pwa.manifest) {
  plugins.push({
      resolve: `gatsby-plugin-manifest`,
      options: {...config.pwa.manifest},
  });
  plugins.push({
    resolve: 'gatsby-plugin-offline',
    options: {
      appendScript: require.resolve(`./src/custom-sw-code.js`),
    },
  });
} else {
  plugins.push('gatsby-plugin-remove-serviceworker');
}

// check and remove trailing slash
if (config.gatsby && !config.gatsby.trailingSlash) {
  plugins.push('gatsby-plugin-remove-trailing-slashes');
}

module.exports = {
  pathPrefix: config.gatsby.pathPrefix,
  siteMetadata: {
    title: config.siteMetadata.title,
    description: config.siteMetadata.description,
    docsLocation: config.siteMetadata.docsLocation,
    ogImage: config.siteMetadata.ogImage,
    favicon: config.siteMetadata.favicon,
    logo: { link: config.header.logoLink ? config.header.logoLink : '/', image: config.header.logo }, // backwards compatible
    headerTitle: config.header.title,
    githubUrl: config.header.githubUrl,
    helpUrl: config.header.helpUrl,
    tweetText: config.header.tweetText,
    headerLinks: config.header.links,
    siteUrl: config.gatsby.siteUrl,
  },
  plugins: plugins
};
