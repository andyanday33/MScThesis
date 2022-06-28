import React, {useEffect, useRef} from 'react';
import Blockly, {WorkspaceSvg} from 'blockly';
import BlocklyJS from 'blockly/javascript';
import {useDispatch} from 'react-redux';
import {move} from '../redux/playgroundSlice';
import {Button} from 'react-bootstrap';

import toolbox from './toolbox';

// style
import './BlocklyComponent.css';

// custom blocks
import './blocks/customBlocks';

/**
 * A functional component that holds Blockly related functionality.
 *
 * @param {Object[]} props options for Blockly injection
 * @return {JSX.Element} A JSX consisting of a Blockly injected div and
 * a button to generate code
 *
 * @author bab26@st-andrews.ac.uk
 */
export default function BlocklyComponent(...props : Object[]): JSX.Element {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const simpleWorkspace = useRef<WorkspaceSvg>();

  const dispatch = useDispatch();

  useEffect(() => {
    /* Check if the div that the blockly is going to be injected
    Already has a child element
    This would prevent injecting Blockly multiple times */
    if (blocklyRef.current?.childNodes.length == 0) {
      /* Typescript is probably going to give an error about this one
      It's probably caused by type definitions inside blockly api
      Yet it works perfectly fine */
      simpleWorkspace.current = Blockly.inject(blocklyRef.current,
          {
            toolbox,
            ...props,
          });
    }
  }, [toolbox]);

  /**
   * The function that is going to be called via one of the Blockly
   * components.
   */
  // eslint-disable-next-line no-unused-vars
  const moveForward = () => {
    dispatch(move());
  };

  /**
   * Code generation handler function
   */
  const handleGeneration = async () => {
    const code = BlocklyJS.workspaceToCode(simpleWorkspace.current);
    eval(code);
  };

  return (
    <React.Fragment>
      <div id="blockly-div" ref={blocklyRef} />
      <Button id="generate-button" variant="primary"
        onClick={handleGeneration}>Generate Code</Button>
    </React.Fragment>
  );
}
