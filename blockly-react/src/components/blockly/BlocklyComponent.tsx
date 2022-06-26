import React, { useEffect, useRef, useMemo } from 'react'
import Blockly, { WorkspaceSvg } from 'blockly'
import BlocklyJS from 'blockly/javascript';
import { useSelector, useDispatch } from 'react-redux';
import { generate } from '../redux/codeSlice';
import { move } from '../redux/playgroundSlice';
import { RootState } from '../redux/store';

import toolbox from './toolbox';

// style
import './BlocklyComponent.css';

// custom blocks
import './blocks/customBlocks';

/**
 * A functional component that holds Blockly related functionality.
 * 
 * @param props options for Blockly injection
 * @returns A JSX consisting of a Blockly injected div and a button to generate code
 * 
 * @author bab26@st-andrews.ac.uk
 */
export default function BlocklyComponent(...props : Object[]) {

  let blocklyRef = useRef<HTMLDivElement>(null);
  let simpleWorkspace = useRef<WorkspaceSvg>();

  const code = useSelector((state: RootState) => state.code.value);
  const dispatch = useDispatch();

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

  const moveForward = () => {
    dispatch(move());
  }

  /**
   * Code generation handler function
   */
  const handleGeneration = async () => {
    let tempCode = BlocklyJS.workspaceToCode(simpleWorkspace.current);
    dispatch(generate(tempCode));
    eval(tempCode);
  }

  return (
    <React.Fragment>
        <div id="blockly-div" ref={blocklyRef} />
        <button onClick={handleGeneration}>Generate Code</button>
    </React.Fragment>
  )
}
