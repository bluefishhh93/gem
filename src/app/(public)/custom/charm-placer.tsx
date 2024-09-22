import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  onRemove: (position: number) => void;
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
  { id: 3, name: 'Moon', image: '/charm-4.png' },
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="cursor-move w-16 h-16 rounded-full overflow-hidden transition-transform hover:scale-110 border-2 border-gray-200 hover:border-pink-300"
          >
            <Image 
              src={charm.image} 
              alt={charm.name} 
              width={64} 
              height={64} 
              className="object-cover rounded-full"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{charm.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const StringDropZone: React.FC<StringDropZoneProps> = ({ position, onDrop, onRemove, placedCharm, charms }) => {
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
  const radius = 140;
  const left = 150 + radius * Math.cos(angle) - 15;
  const top = 150 + radius * Math.sin(angle) - 15;

  const charm = placedCharm ? charms.find(c => c.id === placedCharm.charmId) : undefined;

  return (
    <div
      ref={ref}
      className={`w-8 h-8 rounded-full ${
        isOver ? 'border-2 border-pink-300' : charm ? 'border-2 border-gray-300' : 'border-2 border-gray-300 border-dashed'
      } flex items-center justify-center absolute overflow-hidden group transition-all duration-200 ease-in-out ${isOver ? 'scale-110' : ''}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {charm && (
        <>
          <Image 
            src={charm.image} 
            alt={charm.name} 
            width={30} 
            height={30} 
            className="object-cover rounded-full"
          />
          <button
            onClick={() => onRemove(position)}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} color="white" />
          </button>
        </>
      )}
    </div>
  );
};

export function CharmPlacer({ selectedString, placedCharms, setPlacedCharms }: CharmPlacerProps) {
  const [zoom, setZoom] = useState(1);

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

  const handleRemove = (position: number) => {
    setPlacedCharms((prev) => prev.filter(charm => charm.position !== position));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center max-w-4xl mx-auto bg-gradient-to-r from-pink-50 to-pink-50 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          {/* Tùy chỉnh {selectedString?.name} */}
          Tùy chỉnh theo ý thích 
        </h2>
        <div className="flex space-x-28">
          <div className="relative w-[300px] h-[300px] mb-8">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease-in-out' }}>
              <Image 
                src={selectedString?.image || ''}
                alt={selectedString?.name || ''}
                width={300}
                height={300}
                className="rounded-full shadow-md"
              />
              {Array.from({ length: 20 }).map((_, index) => (
                <StringDropZone
                  key={index}
                  position={index}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  placedCharm={placedCharms.find(c => c.position === index)}
                  charms={charms}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <ScrollArea className="h-[300px] w-[240px] rounded-md border p-3 bg-pink-50">
              <div className="grid grid-cols-3 gap-3">
                {charms.map((charm) => (
                  <CharmItem key={charm.id} charm={charm} />
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-center space-x-2">
              <Button onClick={handleZoomOut} variant="outline" size="icon">
                <ZoomOut size={20} />
              </Button>
              <Button onClick={handleResetZoom} variant="outline" size="icon">
                <RotateCcw size={20} />
              </Button>
              <Button onClick={handleZoomIn} variant="outline" size="icon">
                <ZoomIn size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}