import { suitToIcon } from "@/lib/components/blackjack-card";
import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { getHandValue } from "@blackjack/game/utils";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { cn } from "@/lib/utils";
import type { ReactElement } from "react";
import type { Player } from "@blackjack/game/types";
import { useMediaQuery } from "usehooks-ts";
import { Sheet, SheetContent, SheetTrigger } from "@/lib/components/ui/sheet";
import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { Users } from "lucide-react";

export const OtherPlayersCardsCard = (): ReactElement => {
  const { id, players } = useBlackjack();
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (!players) return <div className="bg-red-500">Players not found !</div>;
  if (players.length < 2) return <></>;

  const otherPlayers = players.filter(player => player.id !== id);

  const PlayerCard = ({ player }: { player: Player }): ReactElement => (
    <BlackjackCard 
      className={cn("flex flex-col items-center w-full")}
      variant={getHandValue(player.cards) > 21 ? "destructive" : "default"}
      key={player.id}
    >
      <div className="flex flex-row gap-1 justify-between w-full">
        <span>{player.name}</span>
        <span className="font-bold">{getHandValue(player.cards)}</span>
      </div>

      <div className="grid grid-cols-4 mt-1 gap-1 w-full">
        {player.cards.map((card, index) => (
          <div key={index} className={cn("flex flex-row items-center gap-1 bg-white p-1.5 rounded-md", {
            "text-[#e04f4f]": ["Hearts", "Diamonds"].includes(card.suit),
            "text-black": ["Clubs", "Spades"].includes(card.suit)
          })}>
            <span className="font-bold">{card.rank}</span>
            <span>{suitToIcon(card.suit)}</span>
          </div>
        ))}
      </div>
    </BlackjackCard>
  );

  if (isMobile) return (
    <div className="flex flex-col sm:flex-row gap-1 absolute top-11 right-3">
      <Sheet>
        <SheetTrigger asChild>
          <BlackjackButton size="small">
            <Users className="h-4 w-4" />
          </BlackjackButton>
        </SheetTrigger>
        <SheetContent side={"left"} showCloseButton={false} className="p-2">
          <div className="w-full">
            <div className="grid gap-2 auto-rows-auto">
              {otherPlayers.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <BlackjackCard className="absolute bottom-4 left-4 p-2">
      <div className={cn(
        "grid gap-2 auto-rows-auto", {
          "grid-cols-2": otherPlayers.length > 1,
        }
      )}>
        {otherPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </BlackjackCard>
  );
};

export default OtherPlayersCardsCard;