import React, {useRef, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/reduxHooks';
import {finishThisTry} from '../redux/playgroundSlice';
import {ActorType} from '../redux/playgroundSlice';

// styles
import './Canvas.css';

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
  const houses = useAppSelector((state) => state.playground.houses);
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

  // Image sources
  const actorImageSrc = useAppSelector((state) =>
    state.playground.actorImageSrc);
  const wallImageSrc = useAppSelector((state) =>
    state.playground.wallImageSrc);
  const houseImageSrc = useAppSelector((state) =>
    state.playground.houseImageSrc);
  const goalImageSrc = useAppSelector((state) =>
    state.playground.goalImageSrc);
  // Images
  const actorImageRef = useRef<HTMLImageElement>(new Image());
  const wallImageRef = useRef<HTMLImageElement>(new Image());
  const houseImageRef = useRef<HTMLImageElement>(new Image());
  const goalImageRef = useRef<HTMLImageElement>(new Image());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    wallImageRef.current.src = wallImageSrc;
    houseImageRef.current.src = houseImageSrc;
    goalImageRef.current.src = goalImageSrc;
    actorImageRef.current.src = actorImageSrc;
    actorImageRef.current.onload = createCtxAndDraw;
  });

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

      // draw the actors
      ctx.beginPath();
      // we should find the minimum side so we that could
      // fit the image in a grid without strecthing it.
      const minSide = Math.min(rowSize, colSize);
      actors.map((actor) => {
        let actorX = actor.coordinateX * colSize -
        colSize / 2 - minSide / 3;
        const actorY = actor.coordinateY * rowSize -
        rowSize / 2 - minSide / 3;
        const actorWidth = minSide * 2 / 3;
        const actorHeight = minSide * 2 / 3;
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

      // draw the goals
      ctx.beginPath();
      goals.map((goal) => {
        ctx.drawImage(
            goalImageRef.current,
            (goal.coordinateX - 1) * colSize,
            (goal.coordinateY - 1) * rowSize,
            colSize,
            rowSize,
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

      // draw the houses, if exists
      if (houses) {
        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        houses.map((house) => {
          ctx.drawImage(
              houseImageRef.current,
              (house.coordinateX - 1) * colSize,
              (house.coordinateY - 1) * rowSize,
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
      if (!movementInProgress && !isLevelingUp) {
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
  return (
    <>
      <canvas className="main-canvas" ref={canvasRef}
        height={`${dimensions.width >= 1200 ?
          dimensions.height / 1.5 : dimensions.height - 50}`}
        width={`${dimensions.width >= 1200 ?
          dimensions.width / 2 - 50 : dimensions.width - 50}`} />
    </>
  );
}
