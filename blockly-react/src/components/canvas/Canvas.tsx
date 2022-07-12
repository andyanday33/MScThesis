import React, {useRef, useEffect, useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {move, reset} from '../redux/playgroundSlice';
import {Button} from 'react-bootstrap';

// styles
import './Canvas.css';

// // types
// interface CanvasProps {
//     height: string,
//     width: string
// }

type CtxType = (CanvasRenderingContext2D | null | undefined)

// TODO: Try adding car SVG's instead of drawing circles.
/**
 * This functional component consists of a canvas and
 * a button to move elements in the canvas.
 * Width and Height of the canvas is dynamic and related to the screen size,
 * therefore there are no props being passed to this component.
 * @return {JSX.Element} some JSX involving a canvas and a button.
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
  const positionX = actors[0] ? actors[0].coordinateX : null;
  const positionY = actors[0] ? actors[0].coordinateY : null;
  const dispatch = useAppDispatch();
  const actorImageSrc = useAppSelector((state) => state.playground.actorImage);
  const [actorImage, setActorImage] = useState<HTMLImageElement>(new Image());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    actorImage.src = actorImageSrc;
    const newImage = actorImage;
    newImage.onload = drawEverything;
    setActorImage(newImage);
    console.log('aaaa');
    drawEverything();
  }, []);

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

  /**
   * Draws the actors, roads, and goals on the canvas
   */
  const draw = useCallback((ctx : CtxType) => {
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
      const minSide = Math.min(rowSize, colSize);
      actors.map((actor) => ctx.drawImage(
          // Center the images inside a grid by
          // extracting (grid's size / 2 + image's size / 2)
          // from the starting point of the image.
          actorImage, actor.coordinateX * colSize -
          colSize / 2 - minSide / 3,
          actor.coordinateY * rowSize -
          rowSize / 2 - minSide / 3,
          2 * minSide / 3,
          2 * minSide / 3,
      ));
      ctx.fill();

      // draw the goals
      ctx.beginPath();
      goals.map((goal) => {
        // make a cross on the goal
        ctx.moveTo(
            (goal.coordinateX - 1) * colSize,
            (goal.coordinateY - 1) * rowSize,
        );
        ctx.lineTo(
            goal.coordinateX * colSize,
            goal.coordinateY * rowSize,
        );
        ctx.moveTo(
            (goal.coordinateX) * colSize,
            (goal.coordinateY - 1) * rowSize,
        );
        ctx.lineTo(
            (goal.coordinateX - 1) * colSize,
            goal.coordinateY * rowSize,
        );
        ctx.stroke();
      });

      // draw the walls, if exists
      if (walls) {
        console.log(walls);
        ctx.beginPath();
        walls.map((wall) => {
          // ctx.moveTo(
          //     wall.coordinateX * colSize,
          //     wall.coordinateY * rowSize,
          // );
          ctx.fillRect(
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
        console.log(houses);
        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        houses.map((house) => {
          // ctx.moveTo(
          //     wall.coordinateX * colSize,
          //     wall.coordinateY * rowSize,
          // );
          ctx.fillRect(
              (house.coordinateX - 1) * colSize,
              (house.coordinateY - 1) * rowSize,
              colSize,
              rowSize,
          );
          ctx.stroke();
        });
      }
    }
  }, [positionX, positionY]);

  /**
   * Draws everything on the canvas.
   * Re-renders on width or height update.
   */
  const drawEverything = () => {
    if (storeStatus != 'loading') {
      const canvas = canvasRef.current;
      const ctx : CtxType = canvas?.getContext('2d');
      draw(ctx);
    };
  };
  useEffect(() => drawEverything(), [draw, dimensions.width,
    dimensions.height]);
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
      <Button className="m-2" variant="primary" onClick={() =>
        dispatch(move())}>Move Forward
      </Button>
      <Button className="m-2" variant="primary" onClick={() =>
        dispatch(reset())}>Reset State
      </Button>
    </>
  );
}
