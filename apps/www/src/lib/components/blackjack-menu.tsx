"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/lib/components/ui/dialog";
import { Moon, Pen, RefreshCcw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLang } from "@/lib/hooks/use-lang";
import { useState, type ReactElement } from "react";
import { BlackjackButton } from "./ui/blackjack/blackjack-button";
import { BlackjackCard } from "./ui/blackjack/blackjack-card";
import { usePlayerStore } from "../hooks/store/use-player.store";
import { createAvatar } from "@dicebear/core";
import { dylan } from "@dicebear/collection";
import { toast } from "sonner";
import { BlackjackInput } from "./ui/blackjack/blackjack-input";
import { generateName } from "just-random-names";

export const BlackjackButtons = (): ReactElement => {
  const { theme, setTheme } = useTheme();
  const { playerName } = usePlayerStore();

  const avatar = createAvatar(dylan, { seed: playerName || "Joueur" }).toDataUri();

  return (
    <div className="flex flex-col sm:flex-row gap-1 absolute top-3 right-3">
      <BlackjackCard className="bg-opacity-5 border-opacity-10 p-2 flex flex-row gap-2 items-center">
        <img src={avatar} alt="Avatar" className="rounded-md w-[60px] h-[60px]" />
          
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">
            {playerName == "" ? "Joueur" : playerName}
          </h1>

          <div className="flex flex-row gap-1">
            <BlackjackButton
              size="small"
              className="justify-center bg-white bg-opacity-10 text-white rounded-md px-3 py-2 flex items-center"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun size={16} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon size={16} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </BlackjackButton>

            <SwitchLang />

            <ChangeNameDialog />
          </div>
        </div>
      </BlackjackCard>
    </div>
  )
}

export const SwitchLang = (): ReactElement => {
  const { lang, setLang } = useLang();

  return (
    <BlackjackButton size="small" className="justify-center bg-white bg-opacity-10 text-white rounded-md px-3 py-2" onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
      {lang === "fr" ? "🇺🇸" : "🇫🇷"}
    </BlackjackButton>
  )
}

const ChangeNameDialog = (): ReactElement => {
  const { playerName, setPlayerName } = usePlayerStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canCloseDialog, setCanCloseDialog] = useState(true);
  const [newName, setNewName] = useState(playerName);
  const { lang } = useLang();

  return (
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
        <BlackjackButton size="small">
          <Pen className="h-4 w-4" />
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
  )
}