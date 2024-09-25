import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { fetchStrings } from './actions';

interface StringType {
  material: string;
  color: string;
  imageUrl: string;
  id: number;
  price: number;
  stock: number;
}


interface StringSelectorProps {
  onSelect: (string: StringType) => void;
}
interface StringSelectorProps {
  onSelect: (string: StringType) => void;
  strings: StringType[];
}

export function StringSelector({ onSelect, strings }: StringSelectorProps) {
 
 
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedString, setSelectedString] = useState<StringType | null>(null);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSlideChange = React.useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSlideChange);
      onSlideChange();
    }
  }, [emblaApi, onSlideChange]);

  const handleStringSelect = (string: StringType) => {
    setSelectedString(string);
    onSelect(string);
  };

  return (
    <div className="relative px-4 py-8 bg-gradient-to-r from-pink-50 to-pink-50 rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Chọn loại vòng dây</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {strings.map((string, index) => (
            <motion.div 
              key={string.id} 
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 dark:bg-slate-200 ${
                  selectedString?.id === string.id ? 'ring-2 ring-pink-500 shadow-lg scale-105' : 'hover:shadow-md'
                }`}
                onClick={() => handleStringSelect(string)}
              >
                <CardHeader>
                  <CardTitle className="text-center text-sm dark:text-slate-800">{string.material} {string.color}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image 
                    src={string.imageUrl} 
                    alt={`${string.material} ${string.color}`} 
                    width={200} 
                    height={200} 
                    className="w-full h-36 object-fill rounded-md"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}