const { model, models, Schema, Types } = require('mongoose')

const schema = new Schema({
  name: { type: String },
  defense: { type: Number },
  vulnerability: { type: Number },
  network: { type: Number },
  type_requirements: {
    system: {
      type: String,
      enum: [ 'cyborg', 'android', 'replicant' ]
    }
  },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
})

schema.pre('save', function(next) {
  if (this.isModified() {
    this.updated_at = new Date()
  }
  next()
})

module.exports = models.System || model('System', schema)
