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
        "kind": "flyoutToolbox",
        "contents": [
          {
            "kind": "block",
            "type": "controls_if"
          },
          {
            "kind": "block",
            "type": "controls_repeat_ext"
          },
          {
            "kind": "block",
            "type": "logic_compare"
          },
          {
            "kind": "block",
            "type": "math_number"
          },
          {
            "kind": "block",
            "type": "math_arithmetic"
          },
          {
            "kind": "block",
            "type": "text"
          },
          {
            "kind": "block",
            "type": "text_print"
          },
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
