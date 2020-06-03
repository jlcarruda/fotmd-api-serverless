const { model, models, Schema } = require('mongoose')
const { MachineTypes, AttributeNames } = require('../enums')

const AttributeBonusSchema = new Schema({
  name: {
    type: String,
    enum: AttributeNames
  },
  value: Number
}, { _id: false })

const schema = new Schema({
  name: { type: String },
  defense: { type: Number },
  vulnerability: { type: Number },
  network: { type: Number },
  requirements: {
    machine_types: [{ type: String, enum: MachineTypes }]
  },
  attributes_bonuses: [ AttributeBonusSchema ],
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
