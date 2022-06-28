import React, {useRef, useEffect, useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {move, reset} from '../redux/playgroundSlice';
import {Button} from 'react-bootstrap';

// styles
import './Canvas.css';

// types
interface CanvasProps {
    height: string,
    width: string
}

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
export default function Canvas(props: CanvasProps): JSX.Element {
  const actors = useAppSelector((state) => state.playground.actors);
  const positionX = actors[0][0];
  const positionY = actors[0][1];
  const dispatch = useAppDispatch();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx : CtxType) => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      actors.map((actor) => ctx.arc(actor[0],
          actor[1], 25, 0, 2 * Math.PI));
      ctx.fill();
    }
  }, [positionX, positionY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx : CtxType = canvas?.getContext('2d');

    draw(ctx);
  }, [draw]);


  return (
    <>
      <canvas className="main-canvas" ref={canvasRef} {...props}></canvas>
      <Button className="m-2" variant="primary" onClick={() =>
        dispatch(move())}>Move Forward
      </Button>
      <Button className="m-2" variant="primary" onClick={() =>
        dispatch(reset())}>Reset State
      </Button>
    </>
  );
}
