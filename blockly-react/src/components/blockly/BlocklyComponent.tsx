import React, {useEffect, useRef, useState} from 'react';
import Blockly, {WorkspaceSvg} from 'blockly';
import BlocklyJS from 'blockly/javascript';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {move, reset} from '../redux/playgroundSlice';
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
  const goals = useAppSelector((state) => state.playground.goals);
  const actors = useAppSelector((state) => state.playground.actors);

  const [metGoals, setMetGoals] = useState(false);

  const dispatch = useAppDispatch();

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

  // TODO: disable generating code until timeout interval ends.
  /**
   * Code generation handler function
   */
  const handleGeneration = async () => {
    const code = BlocklyJS.workspaceToCode(simpleWorkspace.current);
    eval(code);
  };

  /* Checks whether the goals are met, resets the state
  after 5 seconds if not. */
  useEffect(() => {
    console.log(actors[0][0]);
    if (actors[0][0] != goals[0][0]) {
      setTimeout(() => dispatch(reset()), 5000);
    } else {
      setMetGoals(true);
    }
  }, [handleGeneration]);

  return (
    <React.Fragment>
      <div id="blockly-div" ref={blocklyRef} />
      <Button id="generate-button" variant="primary"
        onClick={handleGeneration}>Generate Code</Button>
      { metGoals && (<div>Congrats!</div>) }
    </React.Fragment>
  );
}
