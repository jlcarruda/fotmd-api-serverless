const { model, models, Schema, Types } = require('mongoose')
const { ObjectId } = Types

const schema = new Schema({
  name: { type: String },
  owner: { type: ObjectId, ref: 'User'},
  attributes: {
    agility: { type: Number },
    reflexes: { type: Number },
    charisma: { type: Number },
    dexterity: { type: Number },
    inteligence: { type: Number },
    criativity: { type: Number },
    persuasion: { type: Number },
    skill: { type: Number },
  },
  resources: {
    energy: { type: Number },
    life_cycles: { type: Number },
    sanity: { type: Number },
    adrenaline: { type: Number }
  },
  // system: { type: ObjectId, ref: 'System' },
  // model: { type: ObjectId, ref: 'MachineModel' },
  // motherboard: { type: ObjectId, ref: 'Motherboard' },
  // cpu: { type: ObjectId, ref: 'Cpu' },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
})

schema.pre('save', function(next) {
  if (this.isModified() {
    this.updated_at = new Date()
  }
  next()
})

module.exports = models.Character || model('Character', schema)
