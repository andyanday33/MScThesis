/* eslint-disable max-len */
export const toolboxWithLoops = {
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
      'name': 'Loops',
      'colour': '300',
      'contents': [
        {
          'kind': 'block',
          'type': 'controls_for',
          'inputs': {
            'FROM': {
              'block': {
                'type': 'math_number',
                'fields': {
                  'NUM': 1,
                },
              },
            },
            'TO': {
              'block': {
                'type': 'math_number',
                'fields': {
                  'NUM': 10,
                },
              },
            },
            'BY': {
              'block': {
                'type': 'math_number',
                'fields': {
                  'NUM': 1,
                },
              },
            },
          },
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
          'fields': {
            'NUM': 1,
          },
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
  ],
};

export const toolboxWithoutLoops = {
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
  ],
};
