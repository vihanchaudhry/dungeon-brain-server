const mongoose = require('mongoose');

const characterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 8192,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    race: {
      type: String,
      default: '',
      enum: ['', 'human', 'elf', 'dwarf', 'halfling'],
    },
    class: {
      type: String,
      default: '',
      enum: [
        '',
        'barbarian',
        'bard',
        'cleric',
        'druid',
        'fighter',
        'monk',
        'paladin',
        'ranger',
        'rogue',
        'sorcerer',
        'warlock',
        'wizard',
      ],
    },
    gender: {
      type: String,
      default: '',
      enum: ['', 'male', 'female', 'nonbinary'],
    },
    alignment: {
      type: String,
      default: '',
      enum: [
        '',
        'lawful-good',
        'lawful-neutral',
        'lawful-evil',
        'neutral-good',
        'neutral',
        'neutral-evil',
        'chaotic-good',
        'chaotic-neutral',
        'chaotic-evil',
      ],
    },
    faith: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '',
      enum: [
        '',
        'acolyte',
        'criminal-spy',
        'folk-hero',
        'noble',
        'sage',
        'soldier',
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Character', characterSchema);
