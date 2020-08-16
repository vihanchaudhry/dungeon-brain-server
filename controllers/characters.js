const Character = require('../models/character');

exports.getAll = async (req, res) => {
  let characters;
  const params = {
    page: +req.query.page,
    pageSize: +req.query.pageSize,
    query: req.query.q,
  };

  // if there is a search query
  if (params.query) {
    characters = await Character.find({
      $text: { $search: params.query },
    })
      .skip((params.page - 1) * params.pageSize)
      .limit(params.pageSize)
      .lean()
      .catch(err =>
        res
          .status(500)
          .json({ success: false, message: 'Failed to fetch characters.' })
      );

    const count = await Character.countDocuments({
      $text: { $search: params.query },
    }).catch(err =>
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch characters.' })
    );

    return res.status(200).json({ success: true, characters, count });
  }

  // default case: no search query
  characters = await Character.find()
    .skip((params.page - 1) * params.pageSize)
    .limit(params.pageSize)
    .lean()
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch characters.' })
    );

  const count = await Character.estimatedDocumentCount().catch(err =>
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
  const character = new Character({
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    isPrivate: req.body.isPrivate,
    author: req.user._id,
    race: req.body.race,
    class: req.body.class,
    gender: req.body.gender,
    alignment: req.body.alignment,
    faith: req.body.faith,
    background: req.body.background,
  });

  const saved = await character.save(err => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to save your character.' });
    }
    return res
      .status(201)
      .json({ success: true, message: 'Character was successfully created.' });
  });
};

exports.update = async (req, res) => {
  const character = new Character({
    _id: req.body._id,
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
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
