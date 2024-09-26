import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search } from "lucide-react";

const CHARM_POSITIONS = 30;

interface CustomBraceletImageProps {
    stringType: {
        material: string;
        color: string;
        imageUrl: string;
    };
    charms: {
        id: number;
        name: string;
        imageUrl: string;
        position: number;
    }[];
    size?: number;
    defaultUrl?: string;
}

export default function CustomBraceletImage({ 
    stringType, 
    charms, 
    size = 64, 
    defaultUrl = '/gem-custom.png' 
}: CustomBraceletImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative cursor-pointer group" onClick={() => setIsOpen(true)}>
                                <Image
                                    src={defaultUrl}
                                    alt="Custom bracelet"
                                    width={size}
                                    height={size}
                                    className="rounded-md object-cover transition-opacity duration-300 group-hover:opacity-75"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Search className="w-6 h-6 text-secondary-600" />
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click để xem chi tiết</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col items-center">
                    <div className="relative w-[300px] h-[300px]">
                        <Image 
                            src={stringType.imageUrl}
                            alt={`${stringType.material} ${stringType.color} bracelet`}
                            width={300}
                            height={300}
                            className="rounded-full shadow-md"
                        />
                        {charms.map((charm) => {
                            const angle = (charm.position / CHARM_POSITIONS) * 2 * Math.PI;
                            const radius = 145;
                            const left = 150 + radius * Math.cos(angle) - 15;
                            const top = 150 + radius * Math.sin(angle) - 15;

                            return (
                                <div
                                    key={charm.id}
                                    className="absolute w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                                    style={{
                                        left: `${left}px`,
                                        top: `${top}px`,
                                    }}
                                >
                                    <Image 
                                        src={charm.imageUrl} 
                                        alt={charm.name} 
                                        width={30} 
                                        height={30} 
                                        className="object-cover rounded-full h-8 w-8"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}