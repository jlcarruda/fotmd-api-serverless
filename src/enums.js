const { User, Character, System } = require('./models')

module.exports = {
  MachineTypes: [ 'cyborg', 'android', 'replicant' ],
  AttributeNames: ['agility', 'reflexes', 'charisma', 'dexterity', 'inteligence', 'criativity', 'persuasion', 'skill'],
  ResourceTypes: {
    User: 'users',
    Character: 'characters',
    System: 'systems'
  },
  ModelsByResourceType: {
    users: 'User',
    characters: 'Character',
    systems: 'System'
  }
}