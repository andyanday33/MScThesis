import React, {useRef, useEffect, ReactElement} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import {useAppDispatch, useAppSelector} from '../../hooks/reduxHooks';
import {finishThisTry, changeTheme,
  showOrHideEndLevelScreen,
  levelUp, startNewGame, restartLevel,
  selectLevel} from '../redux/playgroundSlice';
import {ActorType} from '../redux/playgroundSlice';
import {themes} from '../redux/playgroundSlice';

// Theme images
// Car theme
import carWallSvg from '../../assets/carTheme/wall.svg';
import carGoalSvg from '../../assets/carTheme/goal.svg';
import carActorSvg from '../../assets/carTheme/actor.svg';

// Shopping Cart theme
import cartWallSvg from '../../assets/shoppingcartTheme/wall.svg';
import cartGoalSvg from '../../assets/shoppingcartTheme/goal.svg';
import cartActorSvg from '../../assets/shoppingcartTheme/actor.svg';

// Monkey theme
import monkeyWallSvg from '../../assets/monkeyTheme/wall.svg';
import monkeyGoalSvg from '../../assets/monkeyTheme/goal.svg';
import monkeyActorSvg from '../../assets/monkeyTheme/actor.svg';

// Bear theme
import bearWallSvg from '../../assets/bearTheme/wall.svg';
import bearGoalSvg from '../../assets/bearTheme/goal.svg';
import bearActorSvg from '../../assets/bearTheme/actor.svg';

// styles
import './Canvas.css';
import FinishedCard from './FinishedCard';

type CtxType = (CanvasRenderingContext2D | null | undefined)

/**
 * This functional component consists of a canvas and
 * a button to move elements in the canvas.
 * Width and Height of the canvas is dynamic and related to the screen size,
 * therefore there are no props being passed to this component.
 * @return {JSX.Element} some JSX involving a canvas.
 *
 * @author bab26@st-andrews.ac.uk
 */
export default function Canvas(): JSX.Element {
  const storeStatus = useAppSelector((state) => state.playground.status);
  const actors = useAppSelector((state) => state.playground.actors);
  const goals = useAppSelector((state) => state.playground.goals);
  // TODO: remove houses.
  const walls = useAppSelector((state) => state.playground.walls);
  const gridSize = useAppSelector((state) => state.playground.gridSize);
  // animation movement progress indicator
  const movementInProgress = useAppSelector((state) =>
    state.playground.animationInProgress);
  // level up sequence in progress indicator
  const isLevelingUp = useAppSelector((state) =>
    state.playground.isLevelingUp);
  const dispatch = useAppDispatch();
  // Take actor movements and process them in order for
  // animation purposes
  const actorMovements = useAppSelector((state) =>
    state.playground.movesThisTry);

  const maxUnlockedLevel = useAppSelector((state) =>
    state.playground.maxUnlockedLevel);
  const currentLevel = useAppSelector((state) =>
    state.playground.level);
  // End level screen condition
  const isShowingLevelFinished = useAppSelector((state) =>
    state.playground.showingLevelFinishedScreen);
  // End game screen condition
  const isShowingGameFinished = useAppSelector((state) =>
    state.playground.showingEndGameScreen);
  // Image sources
  const theme = useAppSelector((state) => state.playground.theme);
  // Images
  const actorImageRef = useRef<HTMLImageElement>(new Image());
  const wallImageRef = useRef<HTMLImageElement>(new Image());
  const goalImageRef = useRef<HTMLImageElement>(new Image());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  /**
   * Handles changing the theme on image load,
   * causes a re-draw on the canvas if there's no
   * animation going on.
   */
  const handleThemeLoad = () => {
    // If there is an animation going on, we don't need to
    // trigger a re-render or re-draw since the images are going to be
    // updated on the next step of the animation.
    if (actorMovements.length == 0) {
      createCtxAndDraw();
    }
  };

  useEffect(() => {
    actorImageRef.current.onload = handleThemeLoad;
    wallImageRef.current.onload = handleThemeLoad;
    goalImageRef.current.onload = handleThemeLoad;
    switch (theme) {
      case (themes.Car):
        wallImageRef.current.src = carWallSvg;
        goalImageRef.current.src = carGoalSvg;
        actorImageRef.current.src = carActorSvg;
        break;
      case (themes.Cart):
        wallImageRef.current.src = cartWallSvg;
        goalImageRef.current.src = cartGoalSvg;
        actorImageRef.current.src = cartActorSvg;
        break;
      case (themes.Monkey):
        wallImageRef.current.src = monkeyWallSvg;
        goalImageRef.current.src = monkeyGoalSvg;
        actorImageRef.current.src = monkeyActorSvg;
        break;
      case (themes.Bear):
        wallImageRef.current.src = bearWallSvg;
        goalImageRef.current.src = bearGoalSvg;
        actorImageRef.current.src = bearActorSvg;
        break;
    }
    // console.log(actorImageRef.current.src);
  }, [theme, storeStatus, isShowingGameFinished, isShowingLevelFinished,
    currentLevel]);

  useEffect(() => {
    /**
     * Handles resizing of the window.
     */
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => {
      // cleanup
      window.removeEventListener('resize', handleResize);
    };
  });

  const drawCanvas = (ctx : CtxType, actors: ActorType[]) => {
    if (ctx) {
      // clear the canvas before drawing next state.
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // sizes of each rect on canvas
      const colSize = ctx.canvas.width / gridSize;
      const rowSize = ctx.canvas.height / gridSize;

      // draw the grids
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      for (let i = 1; i < gridSize; i++) {
        // rows
        ctx.lineWidth = 1;
        ctx.moveTo(0, rowSize * i);
        ctx.lineTo(ctx.canvas.width, rowSize * i);
        // ctx.stroke();
        // cols
        ctx.moveTo(colSize * i, 0);
        ctx.lineTo(colSize * i, ctx.canvas.height);
        ctx.stroke();
      }

      // draw the actors
      ctx.beginPath();
      // we should find the minimum side so we that could
      // fit the image in a grid without strecthing it.
      let actorIndex = 1;
      const minSide = Math.min(rowSize, colSize);
      actors.map((actor) => {
        let actorX = actor.coordinateX * colSize -
        colSize / 2 - minSide / 3;
        const actorY = actor.coordinateY * rowSize -
        rowSize / 2 - minSide / 3;
        const actorWidth = minSide * 2 / 3;
        const actorHeight = minSide * 2 / 3;
        ctx.font = `${actorWidth * 3 / 8}px Arial`;
        ctx.fillText(`${actorIndex}`, actorX + actorWidth,
            actorY + actorHeight / 5);
        actorIndex++;
        ctx.save();
        if (actor.direction === 2) {
          ctx.scale(-1, 1);
          actorX = - actorX - actorHeight;
        } else {
          ctx.translate(actorX + actorWidth / 2, actorY + actorHeight / 2);
          ctx.rotate(actor.direction * Math.PI / 2);
          ctx.translate(-actorX - actorWidth / 2, -actorY - actorHeight / 2);
        }
        ctx.drawImage(
            // Center the images inside a grid by
            // extracting (grid's size / 2 + image's size / 2)
            // from the starting point of the image.
            actorImageRef.current,
            actorX,
            actorY,
            actorWidth,
            actorHeight,
        );
        ctx.restore();
      });
      ctx.fill();

      // draw the goals
      let goalIndex = 1;
      ctx.beginPath();
      goals.map((goal) => {
        const goalX = goal.coordinateX * colSize -
        colSize / 2 - minSide / 3;
        const goalY = goal.coordinateY * rowSize -
        rowSize / 2 - minSide / 3;
        const goalWidth = minSide * 2 / 3;
        const goalHeight = minSide * 2 / 3;
        ctx.font = `${goalWidth * 3 / 8}px Arial`;
        ctx.fillText(`${goalIndex}`, goalX - goalWidth / 5,
            goalY + goalHeight / 5);
        goalIndex++;
        ctx.drawImage(
            goalImageRef.current,
            goalX,
            goalY,
            goalWidth,
            goalHeight,
        );
        ctx.stroke();
      });

      // draw the walls, if exists
      if (walls) {
        ctx.beginPath();
        walls.map((wall) => {
          ctx.drawImage(
              wallImageRef.current,
              (wall.coordinateX - 1) * colSize,
              (wall.coordinateY - 1) * rowSize,
              colSize,
              rowSize,
          );
          ctx.stroke();
        });
      }
    }
  };

  /**
   * Creates a canvas context and
   * draws everything on the canvas.
   */
  const createCtxAndDraw = () => {
    if (storeStatus != 'loading') {
      const canvas = canvasRef.current;
      const ctx : CtxType = canvas?.getContext('2d');
      // Draw the initial actor position on the canvas.
      if (!movementInProgress && !isLevelingUp && actorMovements.length == 0) {
        drawCanvas(ctx, actors);
      }
      // Draw the animated movement on the canvas.
      for (let i = 0; i < actorMovements.length; i++) {
        const moveState = actorMovements[i];
        setTimeout(() => drawCanvas(ctx, moveState), i * 250);
      }
      // Finish the animation by setting the state to finished.
      if (actorMovements.length > 0) {
        setTimeout(() => dispatch(finishThisTry()),
            actorMovements.length * 250);
      }
    };
  };

  useEffect(() => createCtxAndDraw(), [dimensions.width,
    dimensions.height, actorMovements]);
  if (storeStatus == 'loading') {
    // TODO: add a spinner here
    return (<p>Loading...</p>);
  } else if (storeStatus == 'failed') {
    return (<p>There was an error while fetching data.</p>);
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(e);
    // console.log(e.currentTarget.value);
    dispatch(changeTheme(e.currentTarget.value));
  };

  const proceedToNextLevel = () => {
    dispatch(finishThisTry());
    dispatch(showOrHideEndLevelScreen());
    dispatch(levelUp());
  };

  const restartThisLevel = () => {
    dispatch(restartLevel());
    dispatch(showOrHideEndLevelScreen());
  };

  const EndGameCard: React.FC = () => {
    const pointsArray = useAppSelector((state) =>
      state.playground.points);
    const totalPoints = pointsArray.reduce((partialSum, point) =>
      partialSum + point, 0);

    return (
      <FinishedCard
        headerText="Game Finished"
      >
        <Card.Text>
          Total Score: {totalPoints}
        </Card.Text>
        <Button
          variant='primary'
          onClick={() => dispatch(startNewGame())}
        >
          Start New Game
        </Button>
      </FinishedCard>
    );
  };

  const EndLevelCard: React.FC = () => {
    const points = useAppSelector((state) =>
      state.playground.points[currentLevel]);
    return (
      <FinishedCard headerText="Level Finished">
        <Card.Text>
          Level Score: {points}
        </Card.Text>
        <Button
          variant='secondary'
          className='mx-2'
          onClick={restartThisLevel}
        >
          Retry Level
        </Button>
        <Button
          variant='primary'
          onClick={proceedToNextLevel}
          className='mx-2'
        >
          Next Level
        </Button>
      </FinishedCard>
    );
  };

  /**
   * Iterates for the number of previous levels up to the current level
   * and generates a select option for each level.
   *
   * @return {JSX.Element[]} An array of select options.
  */
  const prevLevels = (): JSX.Element[] => {
    const levels = [];
    for (let i = 0; i <= maxUnlockedLevel; i++) {
      levels.push((
        <option key={i} value={i}>{i + 1}</option>
      ));
    }
    return levels;
  };

  /**
   * Handles value change of the level selection dropdown.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e event target.
   */
  const handleLevelSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.currentTarget.value;
    if (level) {
      dispatch(selectLevel(+level));
    }
  };

  /**
   * Bootstrap Form Select component for level selection.
   *
   * @return {ReactElement} a select element consisting of
   *  previous levels (including current one).
   */
  const LevelSelection: React.FC = (): ReactElement => {
    return (
      <Form.Select
        onChange={handleLevelSelection}
        className="mx-auto mb-4"
        size="lg"
        aria-label="Theme Select"
      >
        <option>Select a level</option>
        {prevLevels()}
      </Form.Select>
    );
  };

  // Show the end game screen if the game is finished.
  if (isShowingGameFinished) {
    return (
      <>
        <EndGameCard />
        <LevelSelection />
      </>
    );
  }

  // Show end level scren if the level is finished.
  if (isShowingLevelFinished && !isShowingGameFinished) {
    return (
      <>
        <EndLevelCard />
        <LevelSelection />
      </>
    );
  }
  return (
    <>
      <canvas className="main-canvas" ref={canvasRef}
        height={`${dimensions.width >= 1200 ?
          dimensions.height / 1.5 : dimensions.height - 50}`}
        width={`${dimensions.width >= 1200 ?
          dimensions.width / 2 - 50 : dimensions.width - 50}`} />
      <p style={{fontSize: '1.5em'}}><strong>
        Select a theme for playground:
      </strong></p>
      <Form.Select defaultValue={themes.Car}
        onChange={(e) => handleThemeChange(e)}
        className="mx-auto" size="lg" aria-label="Theme Select">
        <option value={themes.Car}>Cars</option>
        <option value={themes.Cart}>Shopping Carts</option>
        <option value={themes.Monkey}>Monkeys</option>
        <option value={themes.Bear}>Bears</option>
      </Form.Select>
      <p style={{fontSize: '1.5em'}}><strong>
        Select a level:
      </strong></p>
      <LevelSelection />
    </>
  );
}
