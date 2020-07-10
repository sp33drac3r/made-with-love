const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

// Helper methods.
const readFilesInFolder = (folder) => fs.readdirSync(__dirname + folder);

// Constants.
const BUILD_FOLDER = "./build";
const PAGES_FOLDER = "/pages";
const BLOG_FOLDER = "/blog";
const FAVICON = "./favicon.ico";
const BUILD_LIGHT_MODE_FOLDER = path.join(BUILD_FOLDER, "light");
const BUILD_DARK_MODE_FOLDER = path.join(BUILD_FOLDER, "dark");
const TEMPLATE = "/template.html";

const templateText = fs.readFileSync(__dirname + TEMPLATE).toString();

const build = () => {
  // Make /build folder if it doesn't exist.
  if (!fs.existsSync(BUILD_FOLDER)) {
    fs.mkdirSync(BUILD_FOLDER);
  }

  // Make /build/light and /build/dark if they don't exist.
  if (!fs.existsSync(BUILD_LIGHT_MODE_FOLDER)) {
    fs.mkdirSync(BUILD_LIGHT_MODE_FOLDER);
    fs.mkdirSync(path.join(BUILD_LIGHT_MODE_FOLDER, BLOG_FOLDER));
  }
  if (!fs.existsSync(BUILD_DARK_MODE_FOLDER)) {
    fs.mkdirSync(BUILD_DARK_MODE_FOLDER);
    fs.mkdirSync(path.join(BUILD_DARK_MODE_FOLDER, BLOG_FOLDER));
  }

  // Build top level pages.
  const pages = readFilesInFolder(PAGES_FOLDER);
  pages.forEach((page) => {
    const data = fs.readFileSync(`${__dirname}${PAGES_FOLDER}/${page}`);
    const rendered = Mustache.render(templateText, {
      CONTENT: data.toString(),
    });

    fs.writeFileSync(path.join(BUILD_LIGHT_MODE_FOLDER, page), rendered);
    fs.writeFileSync(path.join(BUILD_DARK_MODE_FOLDER, page), rendered);
    fs.copyFileSync(FAVICON, path.join(BUILD_LIGHT_MODE_FOLDER, FAVICON));
  });

  // Build blog posts.
  const blogPosts = readFilesInFolder(BLOG_FOLDER);
  blogPosts.forEach((blog) => {
    const data = fs.readFileSync(`${__dirname}${BLOG_FOLDER}/${blog}`);
    const rendered = Mustache.render(templateText, {
      CONTENT: data.toString(),
    });

    fs.writeFileSync(
      path.join(BUILD_LIGHT_MODE_FOLDER, BLOG_FOLDER, blog),
      rendered
    );
    fs.writeFileSync(
      path.join(BUILD_DARK_MODE_FOLDER, BLOG_FOLDER, blog),
      rendered
    );
  });

  return "success";
};

module.exports = build;
