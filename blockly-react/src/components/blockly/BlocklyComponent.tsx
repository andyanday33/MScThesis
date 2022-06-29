import React, {useEffect, useRef, useState} from 'react';
import Blockly, {WorkspaceSvg} from 'blockly';
import BlocklyJS from 'blockly/javascript';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {move, reset} from '../redux/playgroundSlice';
import {Button, Stack} from 'react-bootstrap';

import toolbox from './toolbox';

// style
import './BlocklyComponent.css';

// custom blocks
import './blocks/customBlocks';
import GoalAlert from '../alerts/GoalAlert';

/**
 * A functional component that holds Blockly related functionality.
 *
 * @param {Object[]} props options for Blockly injection
 * @return {JSX.Element} A JSX consisting of a Blockly injected div and
 * a button to generate code
 *
 * @author bab26@st-andrews.ac.uk
 */
export default function BlocklyComponent(...props :
  React.ComponentProps<any>[]):
    JSX.Element {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const simpleWorkspace = useRef<WorkspaceSvg>();
  const goals = useAppSelector((state) => state.playground.goals);
  const actors = useAppSelector((state) => state.playground.actors);
  // The real turn on the board state
  const boardTurn = useAppSelector((state) => state.playground.turn);
  // Turn created to make some animation delay between movements
  const animationTurn = useRef(0);
  const moveCountRef = useRef(0);

  const [actorsMetGoals, setActorsMetGoals] = useState(false);
  const inProgressRef = useRef(false);
  const failedRef = useRef(false);
  const disabledRef = useRef(false);


  const dispatch = useAppDispatch();

  useEffect(() => {
    /* Check if the div that the blockly is going to be injected
    Already has a child element
    This would prevent injecting Blockly multiple times */
    if (blocklyRef.current?.childNodes.length == 0) {
      /* Typescript is probably going to give an error about this one
      It's probably caused by type definitions inside blockly api
      Yet it works perfectly fine */
      console.log(...props);
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
    setTimeout(() => dispatch(move()), animationTurn.current * 250);
    animationTurn.current += 1;
  };

  /**
   * Checks whether the actor goals are met
   * after a "number of actor moves x 0.25 seconds"
   * delay. Checks the movecount and board turn
   * so it only executes after last move was made.
   */
  useEffect(() => {
    if (moveCountRef.current == boardTurn) {
      if (actors[0][0] != goals[0][0]) {
        setTimeout(() => {
          disabledRef.current = false;
          inProgressRef.current = false;
          failedRef.current = true;
          return dispatch(reset());
        }, moveCountRef.current * 250);
        animationTurn.current = 0;
      } else {
        inProgressRef.current = false;
        animationTurn.current = 0;
        setActorsMetGoals(true);
      }
    }
  }, [actors[0][0]]);

  /**
   * Code generation handler function
   */
  const handleGeneration = () => {
    const code = BlocklyJS.workspaceToCode(simpleWorkspace.current);
    eval(code);
    disabledRef.current = true;
    inProgressRef.current = true;
    failedRef.current = false;
    // Count the number of moveForward functions
    // for animation purposes.
    moveCountRef.current = (code.match(/moveForward/g) || []).length;
  };

  /* TODO: check every actor individually in the
  later stages. */

  return (
    <React.Fragment>
      <div id="blockly-div" ref={blocklyRef} />
      <Stack gap={3}>
        <Button className="w-25 float-right"
          id="generate-button" variant="primary"
          disabled={disabledRef.current}
          onClick={handleGeneration}>Generate Code</Button>
        <GoalAlert
          success={actorsMetGoals}
          failed={failedRef.current}
          loading={inProgressRef.current}/>
      </Stack>
    </React.Fragment>
  );
}
