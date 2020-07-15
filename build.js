const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");
const resizeImage = require("./src/helpers/image.js");

// Helper.
const readFilesInFolder = (folder) => fs.readdirSync(folder);

// Constants.
const PUBLIC = "public";
const SRC = path.join(__dirname, "src");
const IMAGES = "images";
const PAGES = path.join(SRC, "pages");
const BLOG = "blog";
const FAVICON = "./favicon.ico";
const BUILD_LIGHT_MODE_FOLDER = PUBLIC;
const BUILD_DARK_MODE_FOLDER = path.join(PUBLIC, "dark");
const TEMPLATE = path.join(SRC, "template.mustache");

const templateText = fs.readFileSync(TEMPLATE).toString();

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
  if (!fs.existsSync(PUBLIC)) {
    fs.mkdirSync(PUBLIC);
    fs.mkdirSync(path.join(BUILD_LIGHT_MODE_FOLDER, BLOG));
  }

  // Make /build/dark if it doesn't exist.
  if (!fs.existsSync(BUILD_DARK_MODE_FOLDER)) {
    fs.mkdirSync(BUILD_DARK_MODE_FOLDER);
    fs.mkdirSync(path.join(BUILD_DARK_MODE_FOLDER, BLOG));
  }

  if (!fs.existsSync(path.join(PUBLIC, IMAGES))) {
    fs.mkdirSync(path.join(PUBLIC, IMAGES));
  }
};

const buildPages = () => {
  const pages = readFilesInFolder(PAGES);
  pages.forEach((page) => {
    const data = fs.readFileSync(path.join(PAGES, page));

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
  const blogPosts = readFilesInFolder(path.join(SRC, BLOG));
  blogPosts.forEach((blog) => {
    const data = fs.readFileSync(path.join(SRC, BLOG, blog));

    // Light mode.
    const lightModeRendered = Mustache.render(templateText, {
      CONTENT: data.toString(),
      LINK: path.join(BLOG, blog),
      linkPath: lightMode.linkPath,
      otherModeLinkPath: darkMode.linkPath,
      navEmoji: lightMode.navEmoji,
      color: lightMode.color,
      backgroundColor: lightMode.backgroundColor,
    });

    fs.writeFileSync(
      path.join(BUILD_LIGHT_MODE_FOLDER, BLOG, blog),
      lightModeRendered
    );

    // Dark mode.
    const darkModeRendered = Mustache.render(templateText, {
      CONTENT: data.toString(),
      LINK: path.join(BLOG, blog),
      linkPath: darkMode.linkPath,
      otherModeLinkPath: lightMode.linkPath,
      navEmoji: darkMode.navEmoji,
      color: darkMode.color,
      backgroundColor: darkMode.backgroundColor,
    });

    fs.writeFileSync(
      path.join(BUILD_DARK_MODE_FOLDER, BLOG, blog),
      darkModeRendered
    );
  });
};

const resizeCompressImages = () => {
  let sourceImages = readFilesInFolder(path.join(SRC, IMAGES));
  let alreadyProcessed = readFilesInFolder(path.join(PUBLIC, IMAGES));

  let notYetProcessed = sourceImages.filter(
    (img) => !alreadyProcessed.includes(img)
  );

  resizeImage(
    notYetProcessed,
    720,
    80,
    path.join(SRC, IMAGES),
    path.join(PUBLIC, IMAGES)
  );
};

const copyFavicon = () => {
  fs.copyFileSync(path.join("src", FAVICON), path.join(PUBLIC, FAVICON));
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
