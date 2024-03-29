import Blockly from 'blockly';

Blockly.Blocks['move_backwards_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Move Backwards');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Moves the elements backwards by one square');
    this.setHelpUrl('');
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Blockly.JavaScript['move_backwards_block'] = function(block: Blockly.Block)
  : String {
  const code =
  'if(initialTryNumber.current == tryNumber.current)' +
  '{dispatch(move("BACKWARDS"))};\n' +
  `levelPointsRef.current -= 1;\n`;
  return code;
};
