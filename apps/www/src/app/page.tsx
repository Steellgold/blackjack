"use client";

import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { BlackjackInput } from "@/lib/components/ui/blackjack/blackjack-input";
import { useLang } from "@/lib/hooks/use-lang";

import { createAvatar } from '@dicebear/core';
import { dylan } from "@dicebear/collection";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { usePlayerStore } from "@/lib/hooks/store/use-player.store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/lib/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { generateName } from "just-random-names";
import { SwitchLang } from "@/lib/components/blackjack-menu";

const Page = () => {
  const { lang } = useLang();
  const { playerName, setPlayerName } = usePlayerStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canCloseDialog, setCanCloseDialog] = useState(true);
  const [newName, setNewName] = useState(playerName);

  useEffect(() => {
    if (playerName === "") {
      setIsDialogOpen(true);
      setCanCloseDialog(false);
    }
  }, [playerName]);

  const avatar = createAvatar(dylan, { seed: playerName || "Joueur" }).toDataUri();

  return (
    <div className="flex flex-col items-center gap-3 max-w-xl mx-auto w-full p-3">
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
          <BlackjackInput className="w-full sm:w-32" inputSize="small" placeholder={lang === "fr" ? "Code de table" : "Table code"} />
          <BlackjackButton size="small">
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

        <BlackjackButton size="small">
          <>{lang === "fr" ? "Créer" : "Create"}</>
        </BlackjackButton>
      </BlackjackCard>

      <BlackjackCard className="flex flex-row gap-3 items-center p-3 w-full">
        <BlackjackCard className="bg-opacity-5 border-opacity-10 p-2 flex flex-row gap-2 items-center">
          <img src={avatar} alt="Avatar" className="rounded-md w-14 h-14" />
          
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">
              {playerName == "" ? "Joueur" : playerName}
            </h1>
            <span className="text-xs">$1000</span>
          </div>
        </BlackjackCard>

        <Dialog
          open={isDialogOpen}
          onOpenChange={
            (isOpen) => {
              if (!canCloseDialog && !isOpen) {
                toast.error("Vous devez entrer un nom pour continuer.");
              } else {
                setIsDialogOpen(isOpen);
              }
            }
          }
        >
          <DialogTrigger asChild>
            <BlackjackButton>
              {lang === "fr" ? "Modifier le nom" : "Edit name"}
            </BlackjackButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {canCloseDialog && (
                  <>
                    {lang === "fr" ? "Modifier le nom" : "Edit name"}
                  </>
                ) || (
                  <>
                    {lang === "fr" ? "Bienvenue" : "Welcome"} !
                  </>
                )}
              </DialogTitle>

              <DialogDescription>
                {canCloseDialog && (
                  <>
                    {lang === "fr" ? "Entrez votre nom et cliquer sur le bouton pour le sauvegarder." : "Enter your name and click the button to save it."}
                  </>
                ) || (
                  <>
                    {lang === "fr" ? "Avant de pouvoir continuer, veuillez entrer votre nom ou simplement un pseudonyme. Vous pouvez aussi en générer un aléatoirement." : "Before you can continue, please enter your name or simply a nickname. You can also generate one randomly."}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <BlackjackCard className="flex flex-row gap-3 items-center p-3 mt-3">
              <img
                src={createAvatar(dylan, { seed: newName }).toDataUri()}
                alt="Avatar"
                className="rounded-md h-11"
              />

              <BlackjackInput
                className="w-full"
                placeholder={lang === "fr" ? "Nom" : "Name"}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </BlackjackCard>

            <DialogFooter className="flex flex-col sm:flex-row justify-between w-full mt-3 gap-2">
              <div className="flex gap-2">
                <SwitchLang />

                <BlackjackButton
                  onClick={() => setNewName(generateName(lang == "fr" ? "fr" : "en", 2, ["lifestyle", "adjectives"]))}
                  className="flex flex-row gap-1.5 items-center"
                >
                  <RefreshCcw className="h-4 w-4" />
                  {lang === "fr" ? "Nom aléatoire" : "Random name"}
                </BlackjackButton>
              </div>

              <div className="flex gap-2">
                <BlackjackButton onClick={() => setNewName("")}>
                  {lang === "fr" ? "Annuler" : "Cancel"}
                </BlackjackButton>

                <BlackjackButton variant="success" onClick={() => {
                  setPlayerName(newName);
                  setNewName("");
                  toast.info("Nom sauvegardé avec succès.");
                  setIsDialogOpen(false);
                }}>
                  {lang === "fr" ? "Sauvegarder" : "Save"}
                </BlackjackButton>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* <BlackjackCard className="bg-opacity-5 border-opacity-10 p-2 flex flex-row gap-2 items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Dernière partie</h1>
            <span className="text-xs">+ $100</span>
          </div>
        </BlackjackCard> */}
      </BlackjackCard>
    </div>
  );
}

export default Page;