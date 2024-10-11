import path from 'node:path'
import { DateTime } from 'luxon'
import striptags from 'striptags'

import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin
} from '@11ty/eleventy'
import { feedPlugin } from '@11ty/eleventy-plugin-rss'
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import pluginNavigation from '@11ty/eleventy-navigation'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'

import pluginFilters from './_config/filters.js'

function extractExcerpt(article) {
  if (!article) {
    console.warn('Failed to extract excerpt: Document has no content')
    return null
  }

  let excerpt = null
  const content = article

  excerpt = striptags(content)
    .substring(0, 200) // Cap at 200 characters
    .replace(/^\\s+|\\s+$|\\s+(?=\\s)/g, '')
    .trim()
    .concat('...')
  return excerpt
}

export default function (eleventyConfig) {
  // Copy the contents of the `public` folder to the output folder
  eleventyConfig.addPassthroughCopy('src/assets')
  eleventyConfig.addPassthroughCopy('CNAME') // for github pages

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget('content/**/*.{svg,webp,png,jpeg}')

  // Official plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 }
  })
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(HtmlBasePlugin)
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin)

  eleventyConfig.addPlugin(feedPlugin, {
    type: 'atom', // or "rss", "json"
    outputPath: '/feed/feed.xml',
    stylesheet: 'pretty-atom-feed.xsl',
    templateData: {
      eleventyNavigation: {
        key: 'Feed',
        order: 4
      }
    },
    collection: {
      name: 'posts',
      limit: 10
    },
    metadata: {
      language: 'en',
      title: 'Blog Title',
      subtitle: 'This is a longer description about your blog.',
      base: 'https://example.com/',
      author: {
        name: 'Your Name'
      }
    }
  })

  // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // File extensions to process in _site folder
    extensions: 'html',

    // Output formats for each image.
    formats: ['avif', 'webp', 'auto'],

    // widths: ["auto"],

    defaultAttributes: {
      // e.g. <img loading decoding> assigned on the HTML tag will override these values.
      loading: 'lazy',
      decoding: 'async'
    }
  })

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: '.11ty-vite', // Default name of the temp folder

    // Options passed to the Eleventy Dev Server
    // e.g. domdiff, enabled, etc.

    // Added in Vite plugin v2.0.0
    serverOptions: {},

    // Defaults are shown:
    viteOptions: {
      clearScreen: false,
      appType: 'mpa', // New in v2.0.0

      server: {
        mode: 'development',
        middlewareMode: true
      },

      build: {
        mode: 'production'
      },

      // New in v2.0.0
      resolve: {
        alias: {
          // Allow references to `node_modules` folder directly
          '/node_modules': path.resolve('.', 'node_modules')
        }
      }
    }
  })

  // Filters
  eleventyConfig.addPlugin(pluginFilters)

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // by default we use Eleventy’s built-in `slugify` filter:
    // slugify: eleventyConfig.getFilter("slugify"),
    // selector: "h1,h2,h3,h4,h5,h6", // default
  })

  // shortcodes
  //https://dev.to/jonoyeong/excerpts-with-eleventy-4od8
  eleventyConfig.addShortcode('excerpt', (article) => extractExcerpt(article))

  eleventyConfig.addShortcode('currentTime', () => {
    return DateTime.now().toString()
  })

  //https://dev.to/jonoyeong/excerpts-with-eleventy-4od8
  eleventyConfig.addShortcode('excerpt', (article) => extractExcerpt(article))
}

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: ['md', 'njk', 'html', 'liquid', '11ty.js'],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: 'njk',

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: 'njk',

  // These are all optional:
  dir: {
    input: 'src', // default: "."
    layouts: '_layouts',
    includes: '_includes', // default: "_includes" (`input` relative)
    data: '_data', // default: "_data" (`input` relative)
    output: '_site'
  }

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.

  // pathPrefix: "/",
}
