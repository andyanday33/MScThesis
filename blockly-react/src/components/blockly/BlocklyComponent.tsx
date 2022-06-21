import React, { useEffect, useRef, useMemo } from 'react'
import Blockly from 'blockly'
import BlocklyJS from 'blockly/javascript';

// style
import './BlocklyComponent.css'
import useInject from '../../hooks/useInject';

export default function BlocklyComponent() {

  let blocklyRef = useRef<HTMLDivElement>(null);
  let workspace = useInject(blocklyRef, "blockly-div");

  let code = "";

  const handleGeneration = () => {
    code = BlocklyJS.workspaceToCode(workspace);
    console.log(code);
  }

  return (
    <React.Fragment>
        <div id="blockly-div" ref={blocklyRef} />
        <button onClick={handleGeneration}>Generate Code</button>
    </React.Fragment>


  )
}
