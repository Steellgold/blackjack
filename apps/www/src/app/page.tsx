"use client";

import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { BlackjackInput } from "@/lib/components/ui/blackjack/blackjack-input";
import { useLang } from "@/lib/hooks/use-lang";
import { createAvatar } from '@dicebear/core';
import { dylan } from "@dicebear/collection";
import { usePlayerStore } from "@/lib/hooks/store/use-player.store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/lib/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { useRouter } from "next/navigation";
import { Slider } from "@/lib/components/ui/slider";

const Page = () => {
  const { lang } = useLang();
  const { playerName } = usePlayerStore();
  const { createTable, joinTable, canJoinTable } = useBlackjack();

  const [tableCode, setTableCode] = useState("");

  const [expectedPlayers, setExpectedPlayers] = useState<number>(2);
  const [balance, setBalance] = useState<string>("100");

  const router = useRouter();

  const avatar = createAvatar(dylan, { seed: playerName || "Joueur" }).toDataUri();

  const handleTable = async(type: "create" | "join") => {
    if (playerName === "") {
      toast.error(lang === "fr" ? "Vous devez entrer un nom pour continuer." : "You must enter a name to continue.");
      return;
    }

    if (type === "create") {
      const data = await createTable({
        expectedPlayers,
        baseBalance: parseInt(balance)
      });
      if (data.success && data.data?.tableId) {
        joinTable(playerName, data.data.tableId);
        router.push(`/${data.data.tableId}`);
      };
    } else {
      const data = await canJoinTable(tableCode);
      if (data.success && data.data) {
        joinTable(playerName, data.data.tableId);
        router.push(`/${data.data.tableId}`);
      } else {
        toast.error(data.error || "Une erreur s'est produite.");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5 max-w-xl mx-auto w-full p-3">
      <BlackjackCard className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-extrabold">Blackjack</h1>
          <p className="text-sm text-center">
            {lang === "fr"
              ? "Jouer contre l'ordinateur ou rejoindre une partie en ligne avec vos amis pour jouer ensemble sur la même table mais chaqu'un avec sa main."
              : "Play against the computer or join an online game with your friends to play together on the same table but each with their own hand."
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <BlackjackButton size="small">
            {lang === "fr" ? "Jouer contre l'ordinateur" : "Play against the computer"}
          </BlackjackButton>
        </div>
      </BlackjackCard>

      <BlackjackCard className="flex flex-col sm:flex-row justify-between items-left gap-3 sm:gap-1 p-3 w-full">
        <div className="flex flex-col sm:w-7/12 gap-0.5">
          <h1 className="text-lg">{lang === "fr" ? "Rejoindre une table" : "Join a table"}</h1>
          <span className="text-xs">
            {lang === "fr"
              ? "Demandez le code de la partie à un ami pour le rejoindre sur la même table."
              : "Ask your friend for the game code to join them on the same table."}
          </span>
        </div>

        <div className="flex items-center sm:justify-end gap-1">
          <BlackjackInput 
            className="w-full sm:w-32" 
            inputSize="small" 
            value={tableCode}
            onChange={(e) => setTableCode(e.target.value)}
            placeholder={lang === "fr" ? "Code de table" : "Table code"} 
          />
          <BlackjackButton size="small" onClick={() => handleTable("join")}>
            {lang === "fr" ? "Rejoindre" : "Join"}
          </BlackjackButton>
        </div>
      </BlackjackCard>

      <BlackjackCard className="flex flex-col sm:flex-row justify-between items-center p-3 w-full">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg">{lang === "fr" ? "Créer une table" : "Create a table"}</h1>
          <span className="text-xs sm:w-4/5">
            {lang === "fr"
              ? "Créez une table pour jouer avec vos amis en ligne en partageant le code de la partie."
              : "Create a table to play with your friends online by sharing the game code."
            }
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <BlackjackButton size="small">
              {lang === "fr" ? "Créer" : "Create"}
            </BlackjackButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {lang === "fr" ? "Quel est le nombre de joueurs ?" : "How many players ?"}
              </DialogTitle>

              <DialogDescription>
                {lang === "fr"
                  ? "Entrez le nombre de joueurs qui peuvent rejoindre la partie. Vous pouvez aussi choisir un mot de passe pour protéger la partie ainsi que la balance de départ pour chaque joueur."
                  : "Enter the number of players who can join the game. You can also choose a password to protect the game as well as the starting balance for each player."
                }
              </DialogDescription>
            </DialogHeader>

            <BlackjackCard className="flex flex-col sm:flex-row sm:gap-3 items-center p-3 mt-3">
              <div className="w-full flex flex-col mb-2 sm:mb-0">
                <label className="block text-white text-sm font-medium sm:mb-2 sm:-mt-4">
                  {expectedPlayers} {lang === "fr" ? "joueurs attendus" : "expected players"}
                </label>

                <Slider
                  value={[expectedPlayers]}
                  onValueChange={(value: number[]) => setExpectedPlayers(value[0] || 2)}
                  min={2}
                  max={7}
                  step={1}
                  className="w-full"
                />
              </div>

              <BlackjackInput
                inputSize="small"
                placeholder="100"
                label={lang === "fr" ? "Balance de départ" : "Starting balance"}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full"
              />

              {/* <BlackjackInput
                inputSize="small"
                placeholder={lang === "fr" ? "Mot de passe" : "Password"}
                label={lang === "fr" ? "Mot de passe" : "Password"}
                className="w-full"
              /> */}
            </BlackjackCard>

            <DialogFooter className="flex flex-col sm:flex-row justify-end w-full mt-3 gap-2">
              <BlackjackButton
                variant="success"
                onClick={() => handleTable("create")}
                disabled={
                  expectedPlayers <= 1 || expectedPlayers > 7 ||
                  balance === ""
                }
              >
                {lang === "fr" ? "Créer la table" : "Create table"}
              </BlackjackButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </BlackjackCard>
    </div>
  );
}

export default Page;