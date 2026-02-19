import {useDraggable} from '@dnd-kit/core';
function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const isDropped= props.isDropped;
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'grab',
    backgroundColor: 'transparent', 
    border: 'none',                 
    borderRadius: '50%',            
    padding: 0,                     
    overflow: 'hidden',             
    width: '100px',                  
    height: '100px',
    zindex : '1000'
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

export default Draggable;