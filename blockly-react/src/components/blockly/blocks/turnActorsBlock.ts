import Blockly from 'blockly';

Blockly.Blocks['turn_actor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Turn Actors')
        .appendField(new Blockly.FieldDropdown([['left', 'LEFT'],
          ['right', 'RIGHT']]), 'directions');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['turn_actor'] = function(block: Blockly.Block)
  : String {
  const dropdownDirections = block.getFieldValue('directions');
  // TODO: Assemble JavaScript into code variable.
  const code = `console.log("Turn " + ${dropdownDirections})`;
  return code;
};
