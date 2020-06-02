const bcrypt = require('bcryptjs')
const { model, models, Schema, Types } = require('mongoose')
const { ObjectId } = Types
const schema = new Schema({
  username: { type: String },
  password: { type: String },
  characters: [{ type: ObjectId, ref: 'Character' }],
  // tables_owned: { type: 'array' },
  // tables_participating: { type: 'array' },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
})

schema.methods.comparePassword = async function(rawPassword) {
  return bcrypt.compare(rawPassword, this.password)
}

schema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password)
  }
  if (this.isModified()) {
    this.updated_at = new Date()
  }
  next()
})

module.exports = models.User || model('User', schema)
