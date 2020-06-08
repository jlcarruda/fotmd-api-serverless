module.exports = {
  MachineTypes: [ 'cyborg', 'android', 'replicant' ],
  AttributeNames: ['agility', 'reflexes', 'charisma', 'dexterity', 'inteligence', 'criativity', 'persuasion', 'skill'],
  ResourceTypes: ['users','characters','systems','tokens'],
  ResourceTypesByModel: {
    User: 'users',
    Character: 'characters',
    System: 'systems',
    MachineModel: 'machine_models'
  },
  ModelsByResourceType: {
    users: 'User',
    characters: 'Character',
    systems: 'System',
    machine_models: 'MachineModel'
  }
}