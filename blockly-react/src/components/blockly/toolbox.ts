let toolbox = {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "name": "Movement",
        "colour": "80",
        "contents": [
          {
            "kind": "block",
            "type": "move_forward_block"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Variables",
        "custom": "VARIABLE",
        "colour": "160"
      },
      {
        "kind": "category",
        "name": "Functions",
        "custom": "PROCEDURE",
        "colour": "360"
      },
      {
        "kind": "category",
        "name": "Control",
        "colour": "210",
        "contents": [
          {
            "kind": "block",
            "type": "controls_if"
          },
        ]
      },
      {
        "kind": "category",
        "name": "Logic",
        "colour": "120",
        "contents": [
          {
            "kind": "block",
            "type": "logic_compare"
          },
          {
            "kind": "block",
            "type": "logic_operation"
          },
          {
            "kind": "block",
            "type": "logic_boolean"
          }
        ]
      }
    ]
  }

export default toolbox;