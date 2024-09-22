import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';

interface Charm {
  id: number;
  name: string;
  image: string;
}

interface PlacedCharm {
  charmId: number;
  position: number;
}

interface StringType {
  id: number;
  name: string;
  image: string;
}

interface CharmItemProps {
  charm: Charm;
}

interface StringDropZoneProps {
  position: number;
  onDrop: (charmId: number, position: number) => void;
  placedCharm?: PlacedCharm;
  charms: Charm[];
}

interface CharmPlacerProps {
  selectedString: StringType | null;
  placedCharms: PlacedCharm[];
  setPlacedCharms: React.Dispatch<React.SetStateAction<PlacedCharm[]>>;
}

const charms: Charm[] = [
  { id: 1, name: 'Heart', image: '/charm-2.png' },
  { id: 2, name: 'Star', image: '/charm-3.png' },
  // { id: 3, name: 'Moon', image: '/charm-4.png' },
  // Add more charms as needed
];

const CharmItem: React.FC<CharmItemProps> = ({ charm }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'charm',
    item: { id: charm.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-move w-12 h-12 rounded-full overflow-hidden"
    >
      <Image 
        src={charm.image} 
        alt={charm.name} 
        width={48} 
        height={48} 
        className="object-cover rounded-full"
      />
    </div>
  );
};

const StringDropZone: React.FC<StringDropZoneProps> = ({ position, onDrop, placedCharm, charms }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'charm',
    drop: (item: { id: number }) => onDrop(item.id, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(ref);

  const angle = (position / 20) * 2 * Math.PI;
  const radius = 140; // Adjust this value to change the circle size
  const left = 150 + radius * Math.cos(angle) - 15;
  const top = 150 + radius * Math.sin(angle) - 15;

  const charm = placedCharm ? charms.find(c => c.id === placedCharm.charmId) : undefined;

  return (
    <div
      ref={ref}
      className={`w-8 h-8 rounded-full ${
        isOver ? 'border-2 border-blue-500' : 'border-none'
      } flex items-center justify-center absolute overflow-hidden`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {charm && (
        <Image 
          src={charm.image} 
          alt={charm.name} 
          width={30} 
          height={30} 
          className="object-cover rounded-full"
        />
      )}
    </div>
  );
};

export function CharmPlacer({ selectedString, placedCharms, setPlacedCharms }: CharmPlacerProps) {
  const handleDrop = (charmId: number, position: number) => {
    setPlacedCharms((prev) => {
      const newCharms = [...prev];
      const existingCharmIndex = newCharms.findIndex(c => c.position === position);
      if (existingCharmIndex !== -1) {
        newCharms[existingCharmIndex] = { charmId, position };
      } else {
        newCharms.push({ charmId, position });
      }
      return newCharms;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">
          Place Charms on {selectedString?.name}
        </h2>
        <div className="relative w-[300px] h-[300px] mb-8">
          <Image 
            src={selectedString?.image || ''}
            alt={selectedString?.name || ''}
            width={300}
            height={300}
            className="rounded-full"
          />
          {Array.from({ length: 20 }).map((_, index) => (
            <StringDropZone
              key={index}
              position={index}
              onDrop={handleDrop}
              placedCharm={placedCharms.find(c => c.position === index)}
              charms={charms}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {charms.map((charm) => (
            <CharmItem key={charm.id} charm={charm} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}