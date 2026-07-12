"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import CreateCardModal from "@/components/CreateCardModal";

export default function CardsPage() {
  // Using explicit state instead of useDisclosure to solve export target tracing errors
  const [isOpen, setIsOpen] = useState(false);
  const [workspaceCards, setWorkspaceCards] = useState([]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleSaveCard = (payload) => {
    const { type, data } = payload;
    
    const newCard = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
      content: extractCardData(type, data),
    };

    setWorkspaceCards((prev) => [newCard, ...prev]);
    
    console.log(
      `✨ System Update: Successfully mounted a new [${type.toUpperCase()}] container to your active workspace deck.`, 
      newCard
    );
  };

  const extractCardData = (type, data) => {
    switch (type) {
      case "links":
        return { url: data.url, title: data.title, notes: data.notes };
      case "repos":
        return { repoUrl: data.repoUrl, customLabel: data.customLabel };
      case "snippets":
        return { language: data.language, code: data.code, purpose: data.purpose };
      case "notes":
        return { title: data.noteTitle, body: data.markdownContent };
      case "apis":
        return { method: data.apiMethod, url: data.apiUrl, auth: data.apiAuth };
      case "ideas":
        return { title: data.ideaTitle, status: data.ideaStatus };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-textPrimary p-8 flex flex-col gap-8">
      <div className="relative flex justify-between items-center border-b border-white/6 pb-6 w-full">
  

  {/* Perfectly Center-Aligned Button Bracket Container */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+0.75rem)] z-10">
    <Button
      onPress={onOpen}
      endContent={<Plus className="w-4 h-4" />}
      className="bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white font-medium rounded-full px-6 shadow-[0_4px_20px_rgba(233,79,209,0.3)] hover:shadow-[0_4px_25px_rgba(233,79,209,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
    >
      Create Card
    </Button>
  </div>

  {/* Right Spacing Layout Anchor (Keeps row balance intact if needed) */}
  <div className="hidden sm:block w-[120px]" aria-hidden="true" />
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {workspaceCards.length === 0 ? (
          <div className="col-span-full h-64 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 bg-surface/10 backdrop-blur-sm p-6 text-center">
            <p className="text-textSecondary text-sm max-w-sm">
              Your deck ecosystem feels lighter than usual. Let&apos;s map out your dependencies.
            </p>
            <Button
              variant="light"
              onPress={onOpen}
              className="text-[#3FE0C5] hover:bg-[#3FE0C5]/10 border border-[#3FE0C5]/20 font-medium rounded-full px-5 transition-all duration-300"
            >
              Initialize First Card
            </Button>
          </div>
        ) : (
          workspaceCards.map((card) => (
            <div 
              key={card.id} 
              className="bg-[#1A1D29]/60 backdrop-blur-md border border-white/8 rounded-xl p-5 hover:border-white/20 hover:shadow-[0_4px_20px_rgba(255,255,255,0.02)] transition-all duration-300 flex flex-col justify-between h-44"
            >
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-textSecondary bg-white/5 px-2 py-0.5 rounded border border-white/5 w-fit block mb-3">
                  {card.type}
                </span>
                <h3 className="text-sm font-medium text-textPrimary line-clamp-2">
                  {card.content.title || card.content.url || card.content.repoUrl || "Untitled System Entity"}
                </h3>
              </div>
              <p className="text-[11px] text-textSecondary font-mono mt-4 self-end">
                SEC_ID: {card.id.substring(0, 8)}
              </p>
            </div>
          ))
        )}
      </div>

      <CreateCardModal 
        isOpen={isOpen} 
        onClose={onClose} 
        onSave={handleSaveCard} 
      />
    </div>
  );
}