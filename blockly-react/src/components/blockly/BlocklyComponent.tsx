import React, { useEffect, useRef, useMemo } from 'react'
import Blockly, { WorkspaceSvg } from 'blockly'
import BlocklyJS from 'blockly/javascript';

import toolbox from './toolbox';

// style
import './BlocklyComponent.css'

/**
 * A functional component that holds Blockly related functionality.
 * 
 * @param props options for Blockly injection
 * @returns A JSX consisting of a Blockly injected div and a button to generate code
 */
export default function BlocklyComponent(...props : Object[]) {

  let blocklyRef = useRef<HTMLDivElement>(null);
  let simpleWorkspace = useRef<WorkspaceSvg>();

  useEffect(() => {
    
		//Check if the div that the blockly is going to be injected
		//Already has a child element
		//This would prevent injecting Blockly multiple times
    if(blocklyRef.current?.childNodes.length == 0) {
  
      //Typescript is probably going to give an error about this one
      //It's probably caused by type definitions inside blockly api
      //Yet it works perfectly fine
      simpleWorkspace.current = Blockly.inject(blocklyRef.current, 
        {
          toolbox,
          ...props
        })
      
    }
    
  }, [toolbox])



  let code = "";

  /**
   * Code generation handler function
   */
  const handleGeneration = () => {
    code = BlocklyJS.workspaceToCode(simpleWorkspace.current);
    console.log(code);
  }

  return (
    <React.Fragment>
        <div id="blockly-div" ref={blocklyRef} />
        <button onClick={handleGeneration}>Generate Code</button>
    </React.Fragment>
  )
}
