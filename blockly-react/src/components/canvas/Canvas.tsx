import React, {useRef, useEffect, useCallback} from 'react';
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
 * @param {CanvasProps} props options for canvas element.
 * @return {JSX.Element} some JSX involving a canvas and a button.
 *
 * @author bab26@st-andrews.ac.uk
 */
export default function Canvas(): JSX.Element {
  const actors = useAppSelector((state) => state.playground.actors);
  const positionX = actors[0][0];
  const positionY = actors[0][1];
  const dispatch = useAppDispatch();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const MAP_GRID_COLS = 15;
  const MAP_GRID_ROWS = 15;

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  React.useEffect(() => {
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

  const draw = useCallback((ctx : CtxType) => {
    if (ctx) {
      const gridSize = ctx.canvas.width / MAP_GRID_COLS;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      console.log(gridSize / 2);
      actors.map((actor) => ctx.arc(actor[0] * ctx.canvas.width / MAP_GRID_COLS,
          actor[1] * ctx.canvas.height / MAP_GRID_ROWS,
          gridSize / 3, 0, 2 * Math.PI));
      ctx.fill();
    }
  }, [positionX, positionY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx : CtxType = canvas?.getContext('2d');

    draw(ctx);
  }, [draw, dimensions.width]);


  return (
    <>
      <canvas className="main-canvas" ref={canvasRef}
        height={`${dimensions.height >= 1200 ?
          dimensions.height / 2 : dimensions.height - 50}`}
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
