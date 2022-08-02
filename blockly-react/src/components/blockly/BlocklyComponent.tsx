import React, {useEffect, useRef} from 'react';
import Blockly, {WorkspaceSvg} from 'blockly';
import BlocklyJS from 'blockly/javascript';
import {useAppDispatch, useAppSelector} from '../../hooks/reduxHooks';
import {move, showOrHideEndLevelScreen, resetTry,
  startAnimation, turn, unlockLevel, setPoint} from '../redux/playgroundSlice';
import {Button, Stack, Accordion} from 'react-bootstrap';
import toolbox from './toolbox';

// style
import './BlocklyComponent.css';

// custom blocks
import './blocks/moveForwardBlock';
import './blocks/moveBackwardsBlock';
import './blocks/turnActorsBlock';
import './blocks/colorConditionBlock';
import GoalAlert from '../alerts/GoalAlert';

// Default level points that is going to be reduced
// with each line of code, movement, etc.
const DEFAULT_LEVEL_POINTS = 100;

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
  const level = useAppSelector((state) => state.playground.level);
  const dispatch = useAppDispatch();
  const tip = useAppSelector((state) => state.playground.tip);
  const storeStatus = useAppSelector((state) => state.playground.status);
  const actorCrashed = useAppSelector((state) => state.playground.crashed);
  // Keeping track of movement turn of a crash. for animation purposes.
  const crashedAtTurn = useAppSelector((state) =>
    state.playground.crashedAtTurn);
  // Movement turn number inside the redux store.
  const boardTurn = useAppSelector((state) => state.playground.turn);
  // Number of movements in total, counted for checking logically resetting
  // the level state after all the moves are made.
  const moves = useAppSelector((state) => state.playground.movesThisTry);
  // current tries
  const tryNumber = useRef(0);
  // initial value of trynumber when code generation first called.
  const initialTryNumber = useRef(0);
  // Game states
  const actorsMetGoalsRef = useRef(false);
  const inProgress = useAppSelector((state) =>
    state.playground.animationInProgress);
    // End level screen condition
  const isShowingLevelFinished = useAppSelector((state) =>
    state.playground.showingLevelFinishedScreen);
  // End game screen condition
  const isShowingGameFinished = useAppSelector((state) =>
    state.playground.showingEndGameScreen);
  const failedRef = useRef(false);
  // generation button disabler
  const disabledRef = useRef(false);

  const maxUnlockedLevel = useAppSelector((state) =>
    state.playground.maxUnlockedLevel);
  const currentLevel = useAppSelector((state) => state.playground.level);
  const levelPointsRef = useRef(DEFAULT_LEVEL_POINTS);
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
   * Function that is a placeholder for move and turn functions so it
   * could be imported with no errors
   * since we can not provide generated blockly code
   * ahead of the time. This function gets deleted
   * inside production build.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fakeMoves = () => {
    dispatch(move('Forward'));
    dispatch(turn('LEFT'));
  };
  /**
   * Resets the state if there is a crash.
   * If there is none;
   * Checks whether the actor goals are met
   * after all moves have been made with a delay.
   * Number of counted moves and board turn would only be equal
   * after the last update was made inside redux store and
   * if one of the actors has not crashed.
   */
  const checkActorGoals = () => {
    if (actorCrashed) {
      setTimeout(() => {
        disabledRef.current = false;
        failedRef.current = true;
        return dispatch(resetTry());
      }, 250 * crashedAtTurn);
      tryNumber.current++;
    } else if (moves.length == boardTurn && boardTurn != 0) {
      // Check whether the end level goals are met if the board turn
      // is equal to number of counted moves.
      let isAllMet = true;
      // Check all actors and corresponding goal indexes
      for (let i = 0; isAllMet && i < actors.length; i++) {
        if (actors[i].coordinateX != goals[i].coordinateX ||
            actors[i].coordinateY != goals[i].coordinateY) {
          isAllMet = false;
          setTimeout(() => {
            disabledRef.current = false;
            failedRef.current = true;
            return dispatch(resetTry());
          }, 250 * moves.length);
          tryNumber.current++;
        }
      }
      if (isAllMet) {
        setTimeout(() => {
          actorsMetGoalsRef.current = true;
          disabledRef.current = false;
        }, 250 * moves.length);
        setTimeout(() => {
          if (currentLevel === maxUnlockedLevel) {
            dispatch(unlockLevel());
          }
          return dispatch(showOrHideEndLevelScreen());
        }, 250 * moves.length);
        tryNumber.current = 0;
      }
    }
  };

  useEffect(() => {
    checkActorGoals();
  }, [boardTurn, moves.length]);

  const calculatePointsForBlockUsage = () => {
    Blockly.getMainWorkspace().getAllBlocks(false).map((block) => {
      if (block.type === 'move_forward_block' ||
      block.type === 'move_backwards_block' ||
      block.type === 'turn_actors_block') {
        levelPointsRef.current -= 2;
      }
    });
  };

  /**
   * Code generation handler function.
   * Starts the code generation process
   * alongside the animation.
   */
  const handleGeneration = async () => {
    initialTryNumber.current = tryNumber.current;
    const code = BlocklyJS.workspaceToCode(simpleWorkspace.current);
    disabledRef.current = true;
    failedRef.current = false;
    actorsMetGoalsRef.current = false;
    // console.log(code);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const gridColor = 'RED';
    await eval(code);
    calculatePointsForBlockUsage();
    dispatch(setPoint([currentLevel, levelPointsRef.current]));
    levelPointsRef.current = DEFAULT_LEVEL_POINTS;
    if (moves.length > 0) {
      dispatch(startAnimation());
    }
  };

  const TipAccordion = () => (
    <Accordion className="tip-accordion" defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header><strong>Level Tip</strong></Accordion.Header>
        <Accordion.Body style={{fontSize: '1.2em'}}>
          <strong>{tip}</strong>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
  return (
    <React.Fragment>
      {tip && <TipAccordion />}
      <div id="blockly-div" ref={blocklyRef} />
      <Stack gap={3}>
        <Stack gap={3} direction="horizontal">
          <Button className="w-50"
            id="generate-button" variant="primary"
            disabled={(disabledRef.current &&
              storeStatus === 'idle' || isShowingLevelFinished ||
              isShowingGameFinished
            )}
            onClick={handleGeneration}>Generate Code</Button>
          <p className='m-auto w-50 text-center
          bg-secondary text-light'>Level: {level + 1}</p>
        </Stack>
        <GoalAlert
          success={actorsMetGoalsRef.current}
          failed={failedRef.current}
          loading={inProgress}/>
      </Stack>
    </React.Fragment>
  );
}
