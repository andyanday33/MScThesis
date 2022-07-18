import Blockly from 'blockly';

Blockly.Blocks['turn_actors_block'] = {
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

Blockly.JavaScript['turn_actors_block'] = function(block: Blockly.Block)
  : String {
  const dropdownDirections = block.getFieldValue('directions');
  // TODO: Assemble JavaScript into code variable.
  const code = `console.log("Turn " + ${dropdownDirections})`;
  return code;
};
