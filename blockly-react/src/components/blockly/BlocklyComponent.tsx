import React, { useEffect } from 'react'
import Blockly from 'blockly'

// style
import './BlocklyComponent.css'

export default function BlocklyComponent() {

  //We define the blockly workspace here to avoid multiple injections
  let workspace : (null | Blockly.WorkspaceSvg) = null;
  
  useEffect(() => {
    if(!workspace) {
      let toolbox = {
        "kind": "categoryToolbox",
        "contents": [
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
  
      //Typescript is probably going to give an error about this one
      //It's probably caused by type definitions inside blockly api
      //Yet it works perfectly fine
      workspace = Blockly.inject('blockly-div', {toolbox})
    }
    
  }, [workspace])

  return (
    <div id="blockly-div">

    </div>
  )
}
