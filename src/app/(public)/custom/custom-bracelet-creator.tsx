'use client'
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StringSelector } from './string-selector';
import { CharmPlacer } from './charm-placer';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomCheckout from './checkout';
import { useCartStore } from '@/hooks/use-cart-store';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { createUUID } from '@/util/uuid';
interface StringType {
  material: string;
  color: string;
  imageUrl: string;
  id: number;
  price: number;
  stock: number;
}

interface PlacedCharm {
  charmId: number;
  position: number;
}

interface Charm {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
}

export function CustomBraceletCreator({ initialCharms, initialStrings }: { initialCharms: Charm[], initialStrings: StringType[] }) {
  const [selectedString, setSelectedString] = useState<StringType | null>(null);
  const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
  const { toast } = useToast();
  const {addToCustomBracelet} = useCartStore();

  const handleSubmit = () => {
    if (!selectedString || placedCharms.length === 0) {
      toast({
        title: "Incomplete Bracelet",
        description: "Please select a string and add at least one charm.",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = selectedString.price + placedCharms.reduce((sum, charm) => {
      const charmDetails = initialCharms.find(c => c.id === charm.charmId);
      return sum + (charmDetails ? charmDetails.price : 0);
    }, 0);

    const date = new Date();
    const braceletId = moment(date).format("DDHHmmss");

    const braceletData = {
      id: braceletId,
      stringType: {
        ...selectedString,
        imageUrl: selectedString.imageUrl
      },      charms: placedCharms.map(pc => {
        const charmDetails = initialCharms.find(c => c.id === pc.charmId);
        return {
            id: pc.charmId,
            name: charmDetails?.name || '',
            imageUrl: charmDetails?.imageUrl || '',
            price: charmDetails?.price || 0,
            position: pc.position
        };
    }),
      price: totalPrice,
      quantity: 1
    };

    addToCustomBracelet(braceletData);


    toast({
      title: "Custom Bracelet Created",
      description: "Your custom bracelet has been added to the cart.",
      variant: "success",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Tạo vòng tay theo sở thích của bạn</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="string" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="string">Chọn loại vòng dây</TabsTrigger>
            <TabsTrigger value="charms" disabled={!selectedString}>Đặt charms</TabsTrigger>
          </TabsList>
          <TabsContent value="string">
            <StringSelector onSelect={setSelectedString} strings={initialStrings}  />
          </TabsContent>
          <TabsContent value="charms">
            {selectedString && (
              <CharmPlacer
                charms={initialCharms}
                selectedString={selectedString}
                placedCharms={placedCharms}
                setPlacedCharms={setPlacedCharms}
              />
            )}
          </TabsContent>
          
        </Tabs>
        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={!selectedString || placedCharms.length === 0}
            className="w-full"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}