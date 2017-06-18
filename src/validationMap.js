// TODO: pull in tean and use me
export const mech = {
  "Version": "int",
  "Description": {
    "Id": "String(1000)",
    "Name": "String(1000)",
    "Details": "String(1000)",
    "Icon": "String(1000)",
    "Cost": "int",
    "Rarity": "int",
    "Purchasable": "bool",
  },
  "ChassisID": "String(1000)",
  "MechTags": {
    "items": ["String(1000)", "=[]"],
    "tagSetSourceFile": "String(1000)",
  },
  "inventory": [
    {
      "ComponentDefID": "String(1000)",
      "ComponentDefType": "String(1000)",
      "MountedLocation": "String(1000)",
      "HardpointSlot": "int",
      "DamageLevel": "String(1000)",
      "prefabName": "stringString(1000)!null",
      "hasPrefabName": "bool",
    },
    "=[]",
  ],
  "Locations": [
    {
      "DamageLevel": "String(1000)",
      "Location": "String(1000)",
      "CurrentArmor": "int",
      "CurrentRearArmor": "int",
      "CurrentInternalStructure": "int",
      "AssignedArmor": "int",
      "AssignedRearArmor": "int",
    },
    "=[]",
  ],
};
