module.exports = (req, res, next) => {
  // imageUrl = previous image or assign default as human male
  let imageUrl =
    req.body.imageUrl ||
    `${req.protocol}://${req.get(
      'host'
    )}/images/default-portraits/human-male.jpg`;

  // new file found
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/images/uploads/${
      req.file.filename
    }`;
  }

  // previous portrait did not exist or was a default
  else if (imageUrl.includes('/images/default-portraits/')) {
    // gender is nonbinary
    if (req.body.gender === 'nonbinary') {
      // race is human or dwarf
      if (req.body.race === 'human' || req.body.race === 'dwarf') {
        imageUrl = `${req.protocol}://${req.get(
          'host'
        )}/images/default-portraits/${req.body.race}-female.jpg`;
      }

      // race is elf or halfling
      else if (req.body.race === 'elf' || req.body.race === 'halfling') {
        imageUrl = `${req.protocol}://${req.get(
          'host'
        )}/images/default-portraits/${req.body.race}-male.jpg`;
      }

      // no race found
      else {
        imageUrl = `${req.protocol}://${req.get(
          'host'
        )}/images/default-portraits/human-female.jpg`;
      }
    }

    // race and gender found
    else if (req.body.gender && req.body.race) {
      imageUrl = `${req.protocol}://${req.get(
        'host'
      )}/images/default-portraits/${req.body.race}-${req.body.gender}.jpg`;
    }

    // only race found
    else if (req.body.race) {
      imageUrl = `${req.protocol}://${req.get(
        'host'
      )}/images/default-portraits/${req.body.race}-female.jpg`;
    }

    // only gender found
    else if (req.body.race) {
      imageUrl = `${req.protocol}://${req.get(
        'host'
      )}/images/default-portraits/${req.body.race}-female.jpg`;
    }
  }

  req.body.imageUrl = imageUrl;
  return next();
};
