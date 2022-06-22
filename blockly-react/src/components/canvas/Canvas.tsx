import React, { useState, useRef, useEffect, useCallback } from 'react'

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
	//TODO: add a blockly component to control the moveForward function.
	let [coordinateX, setCoordinateX] = useState(50)
	let [coordinateY, setCoordinateY] = useState(50)
	// const PLAYER_RADIUS = 20


	// let c = document.getElementById("myCanvas");
	// let ctx = c.getContext("2d");

	// const moveForward = () => {
	//     setCoordinateX(coordinateX + 50)
	// 		setCoordinateY(coordinateY + 0)
	// }

    /**
     * Makes the character move forward in their direction
     */
	const moveForward = () => {
		setCoordinateX(coordinateX + 50)
		setCoordinateY(coordinateY)
	}

	const canvasRef = useRef<HTMLCanvasElement>(null)

	const draw = useCallback((ctx : CtxType) => {
        if(ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = "#000000"
            ctx.beginPath()
            ctx.arc(coordinateX, coordinateY, 25, 0, 2 * Math.PI)
            ctx.fill()
        }
	}, [coordinateX, coordinateY])

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx : CtxType = canvas?.getContext('2d')

		draw(ctx)

	}, [draw])


	return (
		<>
			<canvas className="main-canvas" ref={canvasRef} {...props}></canvas>
			<button onClick={moveForward}>Move Forward</button>
		</>
		)
	}