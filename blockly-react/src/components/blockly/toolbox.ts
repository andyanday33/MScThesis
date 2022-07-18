/* eslint-disable max-len */
const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'Movement',
      'colour': '80',
      'contents': [
        {
          'kind': 'block',
          'type': 'move_forward_block',
        },
        {
          'kind': 'block',
          'type': 'move_backwards_block',
        },
        {
          'kind': 'block',
          'type': 'turn_actors_block',
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Variables',
      'custom': 'VARIABLE',
      'colour': '160',
    },
    {
      'kind': 'category',
      'name': 'Functions',
      'custom': 'PROCEDURE',
      'colour': '360',
    },
    {
      'kind': 'category',
      'name': 'Loops',
      'colour': '300',
      'contents': [
        {
          'kind': 'block',
          'type': 'controls_for',
          'fields': {
            'VAR': {
              'name': 'index',
              'type': 'Number',
            },
          },
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Control',
      'colour': '210',
      'contents': [
        {
          'kind': 'block',
          'type': 'controls_if',
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Math',
      'colour': '0',
      'contents': [
        {
          'kind': 'block',
          'type': 'math_number',
        },
        {
          'kind': 'block',
          'blockxml':
          '<block type="math_arithmetic"><field name="OP">ADD</field></block>',
        },
        {
          'kind': 'block',
          'blockxml':
          '<block type="math_arithmetic"><field name="OP">MINUS</field></block>',
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Logic',
      'colour': '120',
      'contents': [
        {
          'kind': 'block',
          'type': 'logic_compare',
        },
        {
          'kind': 'block',
          'type': 'logic_operation',
        },
        {
          'kind': 'block',
          'type': 'logic_boolean',
        },
      ],
    },
  ],
};

export default toolbox;
