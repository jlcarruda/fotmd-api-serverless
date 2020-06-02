const bcrypt = require('bcryptjs')
const { model, models, Schema } = require('mongoose')

const schema = new Schema({
  username: { type: String },
  password: { type: String },
  // characters: { type: 'array' },
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
  next()
})

module.exports = models.User || model('User', schema)
