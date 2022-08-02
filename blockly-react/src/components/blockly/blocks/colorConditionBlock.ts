import Blockly from 'blockly';

Blockly.Blocks['color_condition_block'] = {
  init: function() {
    this.appendStatementInput('conditional_code')
        .setCheck('String')
        .appendField('IF Color ==')
        .appendField(new Blockly.FieldDropdown([['red', 'RED'],
          ['blue', 'BLUE']]), 'color_dropdown');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Blockly.JavaScript['color_condition_block'] = function(block: Blockly.Block)
  : String {
  const dropdownColor = block.getFieldValue('color_dropdown');
  const conditionalCode = Blockly.JavaScript
      .statementToCode(block, 'conditional_code');
  // TODO: Assemble JavaScript into code variable.
  const code = `if(gridColor === '${dropdownColor}'){
    ${conditionalCode}};\n`;
  console.log(code);
  return code;
};
