import Draggable from '../../components/Draggable/Draggable';
import Droppable from '../../components/Droppable/Droppable';
import { DndContext, closestCenter, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import './Builder.css';

interface Joueur {
  id: string;
  name: string;
  imgUrl: string;
  zone: string;
}
interface Position {
  id: string;
  top: string;
  left: string;
  label: string;
}

const FORMATIONS: Record<string, Position[]> = {
  '442': [
    { id: 'GK', top: '90%', left: '50%', label: 'G' },
    { id: 'LB', top: '70%', left: '15%', label: 'DG' },
    { id: 'CB1', top: '75%', left: '38%', label: 'DC' },
    { id: 'CB2', top: '75%', left: '62%', label: 'DC' },
    { id: 'RB', top: '70%', left: '85%', label: 'DD' },
    { id: 'LM', top: '45%', left: '15%', label: 'MG' },
    { id: 'CM1', top: '50%', left: '38%', label: 'MC' },
    { id: 'CM2', top: '50%', left: '62%', label: 'MC' },
    { id: 'RM', top: '45%', left: '85%', label: 'MD' },
    { id: 'ST1', top: '20%', left: '35%', label: 'BU' },
    { id: 'ST2', top: '20%', left: '65%', label: 'BU' },
  ],
  '433': [
    { id: 'GK', top: '90%', left: '50%', label: 'G' },
    { id: 'LB', top: '70%', left: '15%', label: 'DG' },
    { id: 'CB1', top: '75%', left: '38%', label: 'DC' },
    { id: 'CB2', top: '75%', left: '62%', label: 'DC' },
    { id: 'RB', top: '70%', left: '85%', label: 'DD' },
    { id: 'CM1', top: '50%', left: '25%', label: 'MC' },
    { id: 'CDM', top: '60%', left: '50%', label: 'MDC' },
    { id: 'CM2', top: '50%', left: '75%', label: 'MC' },
    { id: 'LW', top: '25%', left: '20%', label: 'AG' },
    { id: 'ST', top: '20%', left: '50%', label: 'BU' },
    { id: 'RW', top: '25%', left: '80%', label: 'AD' },
  ]
};

export default function Builder() {
  const [currentFormation, setCurrentFormation] = useState<string>('442');
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=133602`);
      const data = await response.json();
      
      const formattedPlayers = data.player.map((p: any) => ({
        id: p.idPlayer,
        name: p.strPlayer,
        imgUrl: p.strCutout || p.strThumb || '/default-player.png',
        zone: 'reserve'
      }));
      
      setJoueurs(formattedPlayers);
    };
    
    fetchPlayers();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  useEffect(() => {
    const zonesValides = FORMATIONS[currentFormation].map(pos => pos.id);
    setJoueurs(prev => {
      return prev.map(joueur => {
        if (joueur.zone !== 'reserve' && !zonesValides.includes(joueur.zone)) {
          return { ...joueur, zone: 'reserve' };
        }
        return joueur;
      });
    });
  }, [currentFormation]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activePlayer = joueurs.find((j) => j.id === active.id);
    const overZoneId = over.id;
    setJoueurs((prev) => {
      const playerOccupyingTarget = prev.find((j) => j.zone === overZoneId && overZoneId !== 'reserve');
      return prev.map((j) => {
        if (j.id === active.id) {
          return { ...j, zone: overZoneId };
        }
        if (playerOccupyingTarget && j.id === playerOccupyingTarget.id) {
          return { ...j, zone: activePlayer?.zone || 'reserve' };
        }
        return j;
      });
    });
  };

  return (
    <div className="builder-container">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter} sensors={sensors}>
        <select value={currentFormation} onChange={(e) => setCurrentFormation(e.target.value)}>
          {Object.keys(FORMATIONS).map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        {FORMATIONS[currentFormation] && (
          <div className="main-layout">
            <div className="pitch">
              {FORMATIONS[currentFormation].map((pos) => (
                <div key={pos.id} className="slot-container" style={{ top: pos.top, left: pos.left }}>
                  <Droppable id={pos.id}>
                    {joueurs.filter(j => j.zone === pos.id).map(j => (
                      <Draggable key={j.id} id={j.id}>
                        <div className="player-wrapper">
                            <img src={j.imgUrl} className="player-img" alt="joueur" />
                            <p className="player-label">{pos.label}</p>
                        </div>
                      </Draggable>
                    ))}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="sidebar">
          <h3>Mes Joueurs</h3>
          <Droppable id="reserve">
            <div className="reserve-zone">
              {joueurs.filter(j => j.zone === 'reserve').map(j => (
                <Draggable key={j.id} id={j.id}>
                  <img src={j.imgUrl} className="player-thumb" alt="thumb" />
                </Draggable>
              ))}
            </div>
          </Droppable>
        </div>
      </DndContext>
    </div>
  );
}