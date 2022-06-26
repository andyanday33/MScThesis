import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { move } from '../redux/playgroundSlice';

//styles
import './Canvas.css'

/**
 * This functional component consists of a canvas and a button to move elements in the canvas.
 * @param {height, width} props options for canvas element.
 * @returns some JSX involving a canvas and a button.
 * 
 * @author bab26@st-andrews.ac.uk
 */

// types 
interface CanvasProps {
    height: string,
    width: string
}

type CtxType = (CanvasRenderingContext2D | null | undefined)

/**
 * A custom canvas component
 * 
 * @param props width and height of the canvas
 * @returns a react component with a canvas and a button
 */
export default function Canvas(props: CanvasProps) {

	//TODO: add more than one circles at once and try to move them around.
	// let [coordinateX, setCoordinateX] = useState(50)
	// let [coordinateY, setCoordinateY] = useState(50)
	const actors = useSelector((state: RootState) => state.playground.actors);
	const positionX = actors[0][0];
	const positionY = actors[0][1];
	const dispatch = useDispatch();
	// const PLAYER_RADIUS = 20


	// let c = document.getElementById("myCanvas");
	// let ctx = c.getContext("2d");

	// const moveForward = () => {
	//     setCoordinateX(coordinateX + 50)
	// 		setCoordinateY(coordinateY + 0)
	// }

	//TODO: Make the custom move_forward_block to be able to call this function.
	//This might require Redux
    /**
     * Makes the character move forward in their direction
     */
	// const moveForward = () => {
	// 	setCoordinateX(coordinateX + 50)
	// 	setCoordinateY(coordinateY)
	// }

	const canvasRef = useRef<HTMLCanvasElement>(null)

	const draw = useCallback((ctx : CtxType) => {
        if(ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = "#000000"
            ctx.beginPath()
            actors.map((actor) => ctx.arc(actor[0], 
				actor[1], 25, 0, 2 * Math.PI))
            ctx.fill()
        }
	}, [positionX, positionY])

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx : CtxType = canvas?.getContext('2d')

		draw(ctx)

	}, [draw])


	return (
		<>
			<canvas className="main-canvas" ref={canvasRef} {...props}></canvas>
			<button onClick={() => dispatch(move())}>Move Forward</button>
		</>
		)
	}