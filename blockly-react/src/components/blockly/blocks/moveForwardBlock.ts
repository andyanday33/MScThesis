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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Blockly.JavaScript['move_forward_block'] = function(block: Blockly.Block)
  : String {
  // TODO: count number of times block is used.
  console.log('move_forward_block');
  const code =
  'if(initialTryNumber.current == tryNumber.current)' +
  '{numberOfMovesRef.current++;dispatch(move("FORWARD"))};\n';
  return code;
};
