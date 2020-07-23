# Made with 💙 Static Blog Builder

A stupid simple blog builder for fast, minimal blogs.

## Motivation

I decided to make this little blog builder after playing around with the [Bear blogging platform](https://bearblog.dev/). I love the layout of bear but I wanted a little bit more control over the development experience, hosting and features. I highly recommend using Bear if you like this layout and don't care about a custom hostname or dark mode!

[See my post on why platforms like Bear are the antidote to much of the garbage we find on the web today.](https://haphazard.engineering/blog/made-with-love.html)

## Quick Start

- Make sure you have Node installed
- `git clone git@github.com:sp33drac3r/made-with-love.git && cd made-with-love`
- `npm install`
- `npm start`
- open locahost:8085 in your browser

## Features

- 💨 Blazing fast, text-only page loads.
- 📱 Mobile responsive using the [motherfucking website framework](https://motherfuckingwebsite.com/).
- 🔥 Hot reloading.
- 🎯 SEO by default.
- ☀️ / 🌑 Light mode and dark mode.
- 📷 Automatic image resizing and compression.

## Development

### Adding a blog post

- To add a post, simply add an html file in `src/blog`.
- Note: the code inside your blog post will get inserted into `template.mustache` at build time so the file you put in blog needs to have a special format. No need to add a `<!DOCTYPE html>`, `<body>` or `<head>` just wrap the contents of your blog in a div like so:

```html
<div>
  <h1>Hello, Blog!</h1>
</div>
```

### Images

- Any pictures you want to include should be added to the `/images` folder. These images will automatically get resized and compressed.
- When including the image in your blog post, you'll need to make the filepath look like so:

```html
<img src="../../name-of-image.jpg" alt="my demo image" />
```

### Making changes to the styles

- Styles are all located in the template.mustache file. Any changes you make there will be replicated throughout your blog.

## Hosting

Check out this [step-by-step tutorial](https://haphazard.engineering/blog/made-with-love-aws-hosting.html) on how to host on AWS for pennies.
