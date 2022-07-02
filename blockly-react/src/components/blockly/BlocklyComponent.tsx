import React, {useEffect, useRef, useState} from 'react';
import Blockly, {WorkspaceSvg} from 'blockly';
import BlocklyJS from 'blockly/javascript';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {move, levelUp, reset} from '../redux/playgroundSlice';
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

  // Movement turn number inside the redux store.
  const boardTurn = useAppSelector((state) => state.playground.turn);
  // Number of movements in total, counted for animation purposes.
  const animationTurn = useRef(0);

  const [actorsMetGoals, setActorsMetGoals] = useState(false);
  const inProgressRef = useRef(false);
  const failedRef = useRef(false);
  const disabledRef = useRef(false);
  const level = useAppSelector((state) => state.playground.level);

  const dispatch = useAppDispatch();

  /**
   * Injects Blockly into the relavant div
   * if not already injected.
   */
  const injectBlockly = () => {
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
  };

  useEffect(() => {
    injectBlockly();
  }, [toolbox]);

  /**
   * The function that is going to be called via one of the Blockly
   * components.
   */
  // eslint-disable-next-line no-unused-vars
  const moveForward = () => {
    setTimeout(() => dispatch(move()), animationTurn.current * 250);
    // count each movement for animation purposes.
    animationTurn.current += 1;
  };

  /**
   * Checks whether the actor goals are met
   * after delay.
   * Checks the animation turn and board turn to
   * check completion only after all moves are made.
   * Animation turn and board turn would only be equal
   * after the last update was made inside redux store.
   */
  const checkActorGoals = () => {
    if (animationTurn.current == boardTurn && boardTurn != 0) {
      console.log('a');
      console.log(actors[0].coordinateX);
      console.log(goals[0].coordinateX);
      if (actors[0].coordinateX != goals[0].coordinateX) {
        setTimeout(() => {
          disabledRef.current = false;
          inProgressRef.current = false;
          failedRef.current = true;
          return dispatch(reset());
        }, 250);
        animationTurn.current = 0;
      } else {
        inProgressRef.current = false;
        animationTurn.current = 0;
        setActorsMetGoals(true);
        setTimeout(() => {
          disabledRef.current = false;
          console.log('Congrats, leveling up');
          return dispatch(levelUp());
        }, 500);
      }
    }
  };

  useEffect(() => {
    checkActorGoals();
  }, [actors[0].coordinateX]);

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
        <p className='w-25 float-left'>Level: {level + 1}</p>
        <GoalAlert
          success={actorsMetGoals}
          failed={failedRef.current}
          loading={inProgressRef.current}/>
      </Stack>
    </React.Fragment>
  );
}
