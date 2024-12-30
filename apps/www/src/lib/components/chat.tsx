import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { BlackjackInput } from "@/lib/components/ui/blackjack/blackjack-input";
import { MessageSquare, Send } from "lucide-react";
import { useLang } from "@/lib/hooks/use-lang";
import { createAvatar } from "@dicebear/core";
import { dylan } from "@dicebear/collection";
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { BlackjackBadge } from "./ui/blackjack/blackjack-badge";

const ChatContent = () => {
  const [newMessage, setNewMessage] = useState("");
  const { lang } = useLang();
  const { chatMessages, sendChatMessage, id, tableId } = useBlackjack();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        await sendChatMessage(newMessage);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className={cn(
      "flex flex-col h-full",
      {
        "w-96": !isMobile,
        "w-full": isMobile,
      }
    )}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold">
          {lang === "fr" ? "Discussion" : "Chat"}
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-2">
          {(chatMessages ?? []).map((message) => {
            if (message.tableId !== tableId) return <></>;

            const isCurrentUser = message.playerId === id;
            return (
              <div
                key={message.timestamp.toString() + message.playerId}
                className={cn(
                  "flex gap-3",
                )}
              >
                <img
                  src={createAvatar(dylan, { seed: message.sender }).toDataUri()}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className={cn(
                  "flex flex-col flex-1",
                )}>
                  <div className={cn(
                    "flex items-baseline gap-2",
                  )}>
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-white/50">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={cn(
                    "px-3 py-2 rounded-lg border border-white/10 w-full",
                    {
                      "bg-white/10": isCurrentUser,
                      "bg-white/5": !isCurrentUser
                    }
                  )}>
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="flex gap-2">
          <div className="flex-1">
            <BlackjackInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              maxLength={200}
              onKeyDown={handleKeyPress}
              placeholder={lang === "fr" ? "Écrivez votre message..." : "Type your message..."}
              className="w-full"
            />
          </div>
          
          <BlackjackButton onClick={handleSend} disabled={!newMessage.trim() || newMessage.length > 200}>
            <Send className="w-4 h-4" />
          </BlackjackButton>
        </div>
      </div>
    </div>
  );
};

export const ChatComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { lang } = useLang();
  const { players, unreadMessages, markMessagesAsRead } = useBlackjack();

  if (players.length < 2) return <></>;

  const hasUnreadMessages = unreadMessages.length > 0;

  return (
    <div className={cn("fixed z-50", {
      "top-[100px] right-3": !isMobile,
      "top-[76px] right-3": isMobile && players.length > 1
    })}>
      <Sheet>
        <SheetTrigger asChild>
          <div className="relative">
            <BlackjackButton size="small" className="flex items-center gap-1" onClick={markMessagesAsRead}>
              <MessageSquare className="w-4 h-4" />
              {!isMobile && (lang === "fr" ? "Discussion" : "Chat")}
            </BlackjackButton>

            {hasUnreadMessages && (
              <BlackjackBadge blurred={false} variant="destructive" className="absolute -top-1 -right-2" size="number">
                {unreadMessages.length}
              </BlackjackBadge>
            )}
          </div>
        </SheetTrigger>
        <SheetContent 
          side={"right"} 
          className={cn(
            "p-0 z-[99999] backdrop-blur-3xl",
            {
              "w-auto h-auto": !isMobile,
              "w-full h-full": isMobile
            }
          )}
        >
          <ChatContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};