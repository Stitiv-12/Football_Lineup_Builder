import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import './Droppable.css';
function Droppable(props) {
  
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });

  const style = {
    backgroundColor: isOver ? 'lightgreen' : undefined,
  };
  
  return (
    <div className={props.style} ref={setNodeRef} style={style} >
      {props.children}
    </div>
  );
}

export default Droppable;