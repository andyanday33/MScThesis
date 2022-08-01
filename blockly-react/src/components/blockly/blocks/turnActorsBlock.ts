import Blockly from 'blockly';

Blockly.Blocks['turn_actors_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Turn Actors')
        .appendField(new Blockly.FieldDropdown([['left', 'LEFT'],
          ['right', 'RIGHT']]), 'directions');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Turns Actors Left or Right');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['turn_actors_block'] = function(block: Blockly.Block)
  : String {
  const dropdownDirection = block.getFieldValue('directions');
  // TODO: Assemble JavaScript into code variable.
  const code =
  'if(initialTryNumber.current == tryNumber.current)' +
  `{dispatch(turn("${dropdownDirection}"))};\n` +
  `levelPointsRef.current -= 1;\n`;
  return code;
};
