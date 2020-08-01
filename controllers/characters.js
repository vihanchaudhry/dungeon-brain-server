const Character = require('../models/character');

exports.getAll = async (req, res) => {
  let characters;
  const query = {
    page: +req.query.page,
    pageSize: +req.query.pageSize,
  };

  characters = await Character.find()
    .skip((query.page - 1) * query.pageSize)
    .limit(query.pageSize)
    .lean()
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch characters.' })
    );

  const count = await Character.count().catch(err =>
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch characters.' })
  );
  return res.status(200).json({ success: true, characters, count });
};

exports.get = async (req, res) => {
  const character = await Character.findById(req.params.id)
    .lean()
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch the character.' })
    );
  if (character) return res.status(200).json(character);
  return res
    .status(404)
    .json({ success: false, message: 'The character was not found.' });
};

exports.create = async (req, res) => {
  console.log(req.protocol);
  // const imageUrl = `${req.protocol}://${req.get('host')}/images/uploads/${
  //   req.file.filename
  // }`;
  const imageUrl = `${req.protocol}://${req.get(
    'host'
  )}/images/default-portraits/human-male.jpg`;

  const character = new Character({
    name: req.body.name,
    description: req.body.description,
    imageUrl: imageUrl,
    isPrivate: req.body.isPrivate,
    author: req.user._id,
    race: req.body.race,
    class: req.body.class,
    gender: req.body.gender,
    alignment: req.body.alignment,
    faith: req.body.faith,
    background: req.body.background,
  });
  const saved = await character
    .save()
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: 'Failed to save your character.' })
    );
  return res
    .status(201)
    .json({ success: true, message: 'Character was successfully created.' });
};

exports.update = async (req, res) => {
  let imageUrl = req.body.imageUrl;

  // generate new img url if new img detected
  if (req.file) {
    imageUrl = `https://${req.get('host')}/images/uploads/${req.file.filename}`;
  }

  const character = new Character({
    _id: req.body._id,
    name: req.body.name,
    description: req.body.description,
    imageUrl: imageUrl,
    isPrivate: req.body.isPrivate,
    author: req.user._id,
    race: req.body.race,
    class: req.body.class,
    gender: req.body.gender,
    alignment: req.body.alignment,
    faith: req.body.faith,
    background: req.body.background,
  });
  const result = await Character.updateOne(
    { _id: req.params.id, author: req.user._id },
    character
  )
    .lean()
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: 'Failed to save your character.' })
    );
  console.log(character);
  console.log(result);
  if (result.n > 0) {
    return res
      .status(200)
      .json({ success: true, message: 'Character updated successfully.' });
  } else {
    return res
      .status(403)
      .json({ success: false, message: 'Authorization failed.' });
  }
};

exports.delete = async (req, res) => {
  const result = await Character.deleteOne({
    _id: req.params.id,
    author: req.user._id,
  })
    .lean()
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete the character.' })
    );
  if (result.deletedCount > 0) {
    return res.status(200).json({ message: 'Character deleted successfully.' });
  } else {
    return res.status(403).json({ message: 'Authorization failed.' });
  }
};
