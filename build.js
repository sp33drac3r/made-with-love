const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");
const resizeImage = require("./src/helpers/image.js");

// Helper methods.
const readFilesInFolder = (folder) =>
  fs.readdirSync(path.join(__dirname, folder));

// Constants.
const BUILD_FOLDER = "./public";
const PAGES_FOLDER = "/src/pages";
const BLOG_FOLDER = "/blog";
const FAVICON = "./favicon.ico";
const BUILD_LIGHT_MODE_FOLDER = BUILD_FOLDER;
const BUILD_DARK_MODE_FOLDER = path.join(BUILD_FOLDER, "dark");
const TEMPLATE = "/src/template.mustache";

const templateText = fs.readFileSync(__dirname + TEMPLATE).toString();

const lightMode = {
  linkPath: "",
  navEmoji: "🌚",
  color: "#292929",
  backgroundColor: "white",
};

const darkMode = {
  linkPath: "/dark",
  navEmoji: "☀️",
  color: "white",
  backgroundColor: "#1d1d1d",
};

const makeFolders = () => {
  if (!fs.existsSync(BUILD_FOLDER)) {
    fs.mkdirSync(BUILD_FOLDER);
    fs.mkdirSync(path.join(BUILD_LIGHT_MODE_FOLDER, BLOG_FOLDER));
  }

  // Make /build/dark if it doesn't exist.
  if (!fs.existsSync(BUILD_DARK_MODE_FOLDER)) {
    fs.mkdirSync(BUILD_DARK_MODE_FOLDER);
    fs.mkdirSync(path.join(BUILD_DARK_MODE_FOLDER, BLOG_FOLDER));
  }

  if (!fs.existsSync(path.join(BUILD_FOLDER, "images"))) {
    fs.mkdirSync(path.join(BUILD_FOLDER, "images"));
  }
};

const buildPages = () => {
  const pages = readFilesInFolder(PAGES_FOLDER);
  pages.forEach((page) => {
    const data = fs.readFileSync(`${__dirname}${PAGES_FOLDER}/${page}`);

    let thinger;
    if (page === "blog.html") {
      thinger = Mustache.render(data.toString(), {
        linkPath: lightMode.linkPath,
      });
    } else {
      thinger = data.toString();
    }
    const lightModeRendered = Mustache.render(templateText, {
      CONTENT: thinger,
      LINK: page,
      linkPath: lightMode.linkPath,
      otherModeLinkPath: darkMode.linkPath,
      navEmoji: lightMode.navEmoji,
      color: lightMode.color,
      backgroundColor: lightMode.backgroundColor,
    });

    fs.writeFileSync(
      path.join(BUILD_LIGHT_MODE_FOLDER, page),
      lightModeRendered
    );

    if (page === "blog.html") {
      thinger = Mustache.render(data.toString(), {
        linkPath: darkMode.linkPath,
      });
    }

    const darkModeRendered = Mustache.render(templateText, {
      CONTENT: thinger,
      LINK: page,
      linkPath: darkMode.linkPath,
      otherModeLinkPath: lightMode.linkPath,
      navEmoji: darkMode.navEmoji,
      color: darkMode.color,
      backgroundColor: darkMode.backgroundColor,
    });

    fs.writeFileSync(path.join(BUILD_DARK_MODE_FOLDER, page), darkModeRendered);
  });
};

const buildPosts = () => {
  const blogPosts = readFilesInFolder(path.join("src", BLOG_FOLDER));
  blogPosts.forEach((blog) => {
    const data = fs.readFileSync(
      path.join(__dirname, "src", BLOG_FOLDER, blog)
    );

    const lightModeRendered = Mustache.render(templateText, {
      CONTENT: data.toString(),
      LINK: path.join("blog", blog),
      linkPath: lightMode.linkPath,
      otherModeLinkPath: darkMode.linkPath,
      navEmoji: lightMode.navEmoji,
      color: lightMode.color,
      backgroundColor: lightMode.backgroundColor,
    });

    fs.writeFileSync(
      path.join(BUILD_LIGHT_MODE_FOLDER, BLOG_FOLDER, blog),
      lightModeRendered
    );

    const darkModeRendered = Mustache.render(templateText, {
      CONTENT: data.toString(),
      LINK: path.join("blog", blog),
      linkPath: darkMode.linkPath,
      otherModeLinkPath: lightMode.linkPath,
      navEmoji: darkMode.navEmoji,
      color: darkMode.color,
      backgroundColor: darkMode.backgroundColor,
    });

    fs.writeFileSync(
      path.join(BUILD_DARK_MODE_FOLDER, BLOG_FOLDER, blog),
      darkModeRendered
    );
  });
};

const resizeCompressImages = () => {
  let sourceImages = readFilesInFolder(path.join("src", "images"));
  let alreadyProcessed = readFilesInFolder(path.join("public", "images"));

  let notYetProcessed = sourceImages.filter(
    (img) => !alreadyProcessed.includes(img)
  );

  resizeImage(
    notYetProcessed,
    720,
    80,
    path.join("src", "images"),
    path.join("public", "images")
  );
};

const copyFavicon = () => {
  fs.copyFileSync(
    path.join("src", FAVICON),
    path.join(BUILD_LIGHT_MODE_FOLDER, FAVICON)
  );
};

const build = () => {
  // Make /public folder if it doesn't exist.
  makeFolders();

  // Copy over favicon.
  copyFavicon();

  // Build top level pages.
  buildPages();

  // Build blog posts.
  buildPosts();

  // Resize, compress and copy over images.
  resizeCompressImages();

  return;
};

module.exports = build;
