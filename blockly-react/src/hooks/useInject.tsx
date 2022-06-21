import Blockly, { WorkspaceSvg } from "blockly";
import { RefObject, useEffect } from "react";
import toolbox from "./toolbox";

/**
 * This custom hook injects blockly to given html element.
 * 
 * @param blocklyRef Ref that points out to the element blockly is going to be injected into
 * @param HTMLTagId Id that belongs to the element blockly is going to be injected into
 * @returns A WorkspaceSvg element
 */
export default function useInject(blocklyRef: RefObject<HTMLDivElement>, HTMLTagId : string ) : (null | WorkspaceSvg) {

	let workspace : (null | WorkspaceSvg) = null;

  useEffect(() => {
		console.log(blocklyRef.current?.childNodes)

		//Check if the div that the blockly is going to be injected
		//Already has a child element
		//This would prevent injecting Blockly multiple times
    if(blocklyRef.current?.childNodes.length == 0) {
  
      //Typescript is probably going to give an error about this one
      //It's probably caused by type definitions inside blockly api
      //Yet it works perfectly fine
      workspace = Blockly.inject(HTMLTagId, {toolbox})
    }
    
  }, [toolbox])

    return workspace;
}