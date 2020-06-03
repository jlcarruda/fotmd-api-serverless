const { model, models, Schema } = require('mongoose')
const { MachineTypes } = require('../enums')

const schema = new Schema({
  name: { type: String },
  defense: { type: Number },
  vulnerability: { type: Number },
  network: { type: Number },
  requirements: {
    system: [{ type: String, enum: MachineTypes }]
  },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
})

schema.pre('save', function(next) {
  if (this.isModified()) {
    this.updated_at = new Date()
  }
  next()
})

module.exports = models.System || model('System', schema)
