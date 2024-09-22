'use client'
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StringSelector } from './string-selector';
import { CharmPlacer } from './charm-placer';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StringType {
  id: number;
  name: string;
  image: string;
}

interface PlacedCharm {
  charmId: number;
  position: number;
}

export function CustomBraceletCreator() {
  const [selectedString, setSelectedString] = useState<StringType | null>(null);
  const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedString || placedCharms.length === 0) {
      toast({
        title: "Incomplete Bracelet",
        description: "Please select a string and add at least one charm.",
        variant: "destructive",
      });
      return;
    }

    const braceletData = {
      stringType: selectedString,
      charms: placedCharms,
    };
    console.log('Bracelet Data:', braceletData);
    
    toast({
      title: "Custom Bracelet Created",
      description: "Your custom bracelet has been added to the cart.",
      variant: "success",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Your Custom Bracelet</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="string" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="string">Choose String</TabsTrigger>
            <TabsTrigger value="charms" disabled={!selectedString}>Place Charms</TabsTrigger>
          </TabsList>
          <TabsContent value="string">
            <StringSelector onSelect={setSelectedString} />
          </TabsContent>
          <TabsContent value="charms">
            <CharmPlacer 
              selectedString={selectedString} 
              placedCharms={placedCharms}
              setPlacedCharms={setPlacedCharms}
            />
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