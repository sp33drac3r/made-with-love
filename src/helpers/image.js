const Jimp = require("jimp");
const path = require("path");

module.exports = async (images, width, quality, sourceFolder, destFolder) => {
  await Promise.all(
    images.map(async (img) => {
      const image = await Jimp.read(path.join(sourceFolder, img));
      await image.resize(width, Jimp.AUTO);
      await image.quality(quality);
      await image.writeAsync(path.join(destFolder, img));
    })
  );
};
