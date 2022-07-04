import Blockly from 'blockly';

Blockly.Blocks['move_forward_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Move Forward');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Moves the elements forward by one square');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['move_forward_block'] = function(block: any) {
  // TODO: Assemble JavaScript into code variable.
  const code = 'moveForward();\n';
  return code;
};
