'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useBookmarks } from '@/context/BookmarkContext';
import CardItem from '../../components/CardItem';
import CardDetailsDrawer from '../../components/CardDetailsDrawer';
import CreateCardModal from '../../components/CreateCardModal';
import { LayoutCellsLarge, ArrowLeft, Plus } from '@gravity-ui/icons';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Maps the modal's internal tab id to the card "type" the server expects
// (must match the server's allowedTypes list exactly).
const TAB_TO_TYPE = {
  links: "Resource Link",
  repos: "GitHub Repository",
  snippets: "Snippet",
  notes: "Markdown Note",
  apis: "API Endpoint",
  ideas: "Project Idea",
  // Custom categories don't have their own card type on the server —
  // they ride on "Markdown Note" and are told apart by `category`.
  custom: "Markdown Note",
};

// Builds the { title, content } pair the server needs from whatever shape
// CreateCardModal's activeTab put the form data in.
function buildCardPayload(type, data) {
  switch (type) {
    case "links":
      return {
        title: data.title || data.url,
        content: { url: data.url, notes: data.notes },
      };
    case "repos":
      return {
        title: data.customLabel || data.repoUrl,
        content: { repoUrl: data.repoUrl, url: data.repoUrl },
      };
    case "snippets":
      return {
        title: data.purpose?.trim() ? data.purpose.slice(0, 80) : `${data.language} snippet`,
        content: { code: data.code, language: data.language, notes: data.purpose },
      };
    case "notes":
      return {
        title: data.noteTitle,
        content: { title: data.noteTitle, body: data.markdownContent, notes: data.markdownContent },
      };
    case "apis":
      return {
        title: `${data.apiMethod} ${data.apiUrl}`,
        content: { url: data.apiUrl, method: data.apiMethod, auth: data.apiAuth },
      };
    case "ideas":
      return {
        title: data.ideaTitle,
        content: { title: data.ideaTitle, status: data.ideaStatus, body: data.ideaTitle },
      };
    case "custom":
      return {
        title: data.customCategoryTitle,
        content: {
          title: data.customCategoryTitle,
          body: data.customCategoryContent,
          notes: data.customCategoryContent,
        },
      };
    default:
      return { title: data.title || "Untitled", content: {} };
  }
}

function CardsPageContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const tagFilter = searchParams.get('tag');
  const openModalParam = searchParams.get('openModal');

  const { toggleBookmark } = useBookmarks();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/cards`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load cards:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // "+" button in the navbar sends you here with ?openModal=true
  useEffect(() => {
    if (openModalParam === 'true') setIsCreateOpen(true);
  }, [openModalParam]);

  const visibleCards = cards.filter((card) => {
    if (categoryFilter && card.category !== categoryFilter) return false;
    if (tagFilter && !(Array.isArray(card.tags) && card.tags.includes(tagFilter))) return false;
    return true;
  });

  // CREATE — CreateCardModal calls onSave({ type, data }) on submit
  const handleSaveCard = async ({ type, data }) => {
    const resolvedType = TAB_TO_TYPE[type] || "Markdown Note";
    const category = type === "custom" ? (data.category || "General") : type;
    const { title, content } = buildCardPayload(type, data);

    const res = await fetch(`${backendUrl}/api/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        type: resolvedType,
        category,
        tags: [],
        content,
        clientRequestId: data.clientRequestId,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      alert(errBody.error || "Failed to create card.");
      throw new Error(errBody.error || "Failed to create card.");
    }

    const savedCard = await res.json();
    setCards((prev) => [savedCard, ...prev]);
  };

  // BOOKMARK TOGGLE (from the drawer's bookmark button)
  const handleBookmarkToggleFromDrawer = async (cardId) => {
    const target = cards.find((c) => (c._id || c.id) === cardId);
    const updated = await toggleBookmark(cardId, target?.type);
    if (updated) {
      setCards((prev) => prev.map((c) => ((c._id || c.id) === cardId ? updated : c)));
      setSelectedCard(updated);
    }
  };

  // DELETE
  const handleDeleteFromDrawer = async (cardId) => {
    if (!cardId) return;
    if (!confirm("Are you sure you want to delete this card?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/cards/${cardId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setCards((prev) => prev.filter((c) => (c._id || c.id) !== cardId));
        setSelectedCard(null);
      } else {
        const errText = await res.text().catch(() => "");
        console.error(`Failed to delete card (Status ${res.status}):`, errText);
      }
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  // UPDATE (Save Changes in the drawer's edit form)
  const handleUpdateFromDrawer = async (updatedCard) => {
    const cardId = updatedCard._id || updatedCard.id;
    try {
      const res = await fetch(`${backendUrl}/api/cards/${cardId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedCard),
      });

      if (res.ok) {
        const savedCard = await res.json();
        setCards((prev) => prev.map((c) => ((c._id || c.id) === cardId ? savedCard : c)));
        setSelectedCard(savedCard);
        return true;
      } else {
        const errorBody = await res.json().catch(() => ({}));
        console.error(`Failed to update card (Status ${res.status}):`, errorBody);
        alert(errorBody.error || "Failed to update card.");
        return false;
      }
    } catch (err) {
      console.error("Error updating card:", err);
      alert("Failed to update card.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#1A1D29] dark:text-[#F5F6FA] p-6 lg:p-10 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E94FD1]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#3FE0C5]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">

        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-md text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:border-black/10 dark:hover:border-white/10 hover:shadow-[0_0_15px_rgba(63,224,197,0.1)] transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#3FE0C5]" />
            Return to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-black/[0.06] dark:border-white/[0.06] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#E94FD1] mb-1">
              <LayoutCellsLarge className="w-5 h-5 text-[#E94FD1]" />
              <span className="text-xs uppercase tracking-widest font-bold font-mono">Workspace Deck</span>
            </div>
            <h1 className="text-3xl font-medium text-[#1A1D29] dark:text-[#F5F6FA] tracking-tight">
              {categoryFilter ? `Category: ${categoryFilter}` : tagFilter ? `Tag: ${tagFilter}` : "My Cards"}
            </h1>
            <p className="text-sm text-[#5B5F72] dark:text-[#9CA3B5] mt-1">
              Every link, repo, snippet, note, endpoint, and idea you've saved.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] px-4 py-2 rounded-xl backdrop-blur-md">
              <LayoutCellsLarge className="w-4 h-4 text-[#3FE0C5]" />
              <span className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] font-mono">
                Total Cards: <strong className="text-[#1A1D29] dark:text-[#F5F6FA]">{visibleCards.length}</strong>
              </span>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-[0_4px_20px_rgba(233,79,209,0.4)] hover:shadow-[0_4px_25px_rgba(233,79,209,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Plus className="w-3.5 h-3.5" />
              New Card
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] animate-pulse" />
            ))}
          </div>
        ) : visibleCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border border-dashed border-black/[0.08] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.01] backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-[#F5F6FA] dark:bg-[#1A1D29] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center mb-4 text-[#5B5F72] dark:text-[#9CA3B5]">
              <LayoutCellsLarge className="w-6 h-6 text-[#5B5F72]/40 dark:text-[#9CA3B5]/40" />
            </div>
            <h3 className="text-lg font-medium text-[#1A1D29] dark:text-[#F5F6FA] mb-1">No cards yet</h3>
            <p className="text-sm text-[#5B5F72] dark:text-[#9CA3B5] max-w-sm mb-6">
              Save a link, repo, snippet, note, API endpoint, or idea to get started.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-[0_4px_20px_rgba(233,79,209,0.4)] hover:shadow-[0_4px_25px_rgba(233,79,209,0.6)] transition-all duration-300"
            >
              <Plus className="w-3.5 h-3.5" />
              New Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCards.map((card) => (
              <CardItem
                key={card._id || card.id}
                card={card}
                onCardUpdate={(updated) =>
                  setCards((prev) => prev.map((c) => ((c._id || c.id) === (updated._id || updated.id) ? updated : c)))
                }
                onSelectCard={(c) => setSelectedCard(c)}
              />
            ))}
          </div>
        )}
      </div>

      <CardDetailsDrawer
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onToggleBookmark={handleBookmarkToggleFromDrawer}
        onDelete={handleDeleteFromDrawer}
        onUpdate={handleUpdateFromDrawer}
        existingItems={cards}
      />

      <CreateCardModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveCard}
      />
    </div>
  );
}

export default function CardsPage() {
  return (
    <Suspense fallback={null}>
      <CardsPageContent />
    </Suspense>
  );
}