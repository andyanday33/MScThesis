import React, { useEffect, useRef } from 'react'
import Blockly from 'blockly'

// style
import './BlocklyComponent.css'
import useInject from '../../hooks/useInject';

export default function BlocklyComponent() {

  let blocklyRef = useRef<HTMLDivElement>(null);
  let workspace = useInject(blocklyRef, "blockly-div");

  return (
    <div id="blockly-div" ref={blocklyRef}>

    </div>
  )
}
