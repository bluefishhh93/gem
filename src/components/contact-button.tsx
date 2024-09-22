"use client";

import { FacebookIcon, MessageCircleIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FloatingContactButtons() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-1/2 right-4 flex flex-col items-end z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col gap-2 mb-2 absolute bottom-full"
          >
                        <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      href="https://m.me/your-facebook-page"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-full transition-all duration-300 flex items-center justify-center"
                    >
                      <Image src="/facebook-icon.png" alt="Facebook" width={48} height={48} />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chat qua Messenger</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      href="https://zalo.me/0372343515"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-full transition-all duration-300 flex items-center justify-center"
                    >
                      <Image src="/zalo-icon.png" alt="Zalo" width={48} height={48} />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chat qua Zalo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

     
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        className="bg-secondary-400 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <motion.div
          animate={isOpen ? { scale: 1 } : { scale: [1, 1.4, 1] }}
          transition={isOpen ? {} : { repeat: Infinity, duration: 1.5 }}
        >
          {isOpen ? <XIcon size={16} /> : <MessageCircleIcon size={16} />}
        </motion.div>
      </motion.button>
    </div>
  );
}