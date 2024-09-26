import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchCharms } from './actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

const CHARM_POSITIONS = 30;

interface Charm {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

interface PlacedCharm {
  charmId: number;
  position: number;
}

interface StringType {
  material: string;
  color: string;
  imageUrl: string;
  id: number;
  price: number;
  stock: number;
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
  charms: Charm[];
}


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
            className="cursor-move w-16 h-16 rounded-full overflow-hidden transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-pink-300 hover:shadow-lg"
          >
            <Image
              src={charm.imageUrl}
              alt={charm.name}
              width={64}
              height={64}
              className="object-cover rounded-full"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{charm.name}</p>
          <p className="text-sm text-gray-500">{charm.price.toLocaleString()} VND</p>
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

  const angle = (position / CHARM_POSITIONS) * 2 * Math.PI;
  const radius = 145;
  const left = 150 + radius * Math.cos(angle) - 15;
  const top = 150 + radius * Math.sin(angle) - 15;

  const charm = placedCharm ? charms.find(c => c.id === placedCharm.charmId) : undefined;

  return (
    <div
      ref={ref}
      className={`w-8 h-8 rounded-full ${isOver ? 'border-2 border-pink-300' : charm ? 'border-2 border-gray-300' : 'border-2 border-gray-300 border-dashed'
        } flex items-center justify-center absolute overflow-hidden group transition-all duration-200 ease-in-out ${isOver ? 'scale-110' : ''}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {charm && (
        <>
          <Image
            src={charm.imageUrl}
            alt={charm.name}
            width={30}
            height={30}
            className="object-cover h-10 w-10 rounded-full"
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

export function CharmPlacer({ selectedString, placedCharms, setPlacedCharms, charms }: CharmPlacerProps & { charms: Charm[] }) {
  const [zoom, setZoom] = useState(1);
  const MAX_ZOOM = 1.3; // Set your desired maximum zoom level here
  const MIN_ZOOM = 0.5; // Set your desired minimum zoom level here

  const totalPrice = selectedString!.price! + placedCharms.reduce((sum, placedCharm) => {
    const charm = charms.find(c => c.id === placedCharm.charmId);
    return sum + (charm ? charm.price : 0);
  }, 0);

  const charmCount = placedCharms.length;


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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, MAX_ZOOM));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, MIN_ZOOM));
  const handleResetZoom = () => setZoom(1);


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center max-w-6xl mx-auto bg-gradient-to-r from-pink-50 to-pink-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Tùy chỉnh vòng tay của bạn
        </h2>
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          <Card className="p-4">
            <CardHeader>
              {/* <CardTitle>Xem trước</CardTitle> */}
            </CardHeader>
            <CardContent>
              <div className="relative w-[300px] h-[300px] mb-16">
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease-in-out' }}>
                  <Image
                    src={selectedString?.imageUrl || ''}
                    alt={`${selectedString?.material} ${selectedString?.color}` || ''}
                    width={300}
                    height={300}
                    className="rounded-full shadow-md"
                  />
                  {Array.from({ length: CHARM_POSITIONS }).map((_, index) => (
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
              <div className="flex justify-center space-x-2 mb-4">
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
            </CardContent>
          </Card>
          <div className="flex flex-col space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Chọn charm</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] w-full rounded-md border p-3 bg-white">
                  <div className="grid grid-cols-4 gap-3">
                    {charms.map((charm) => (
                      <CharmItem key={charm.id} charm={charm} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết vòng tay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Chất liệu:</strong> {selectedString?.material}</p>
                  <p><strong>Màu sắc:</strong> {selectedString?.color}</p>
                  <div><strong>Số lượng charm:</strong> <Badge variant="secondary">{charmCount}</Badge></div>
                  <p><strong>Giá dây:</strong> {selectedString?.price?.toLocaleString()} VND</p>
                  <p className="text-lg font-semibold"><strong>Tổng giá:</strong> {totalPrice.toLocaleString()} VND</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}