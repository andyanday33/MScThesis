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

Blockly.JavaScript['move_backwards_block'] = function(block: any) {
  // TODO: count number of times block is used.
  console.log('move_backwards_block');
  const code =
  'if(initialTryNumber.current == tryNumber.current)' +
  '{numberOfMovesRef.current++;dispatch(move("Backwards"))};\n';
  return code;
};
