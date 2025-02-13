"use client";

import { markAnswerAsAccepted } from "@/lib/data";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface CorrectButtonProps {
  id: string;
  isCorrect: boolean;
  votes: number;
}

export default function CorrectButton({ id, isCorrect: initialCorrect }: CorrectButtonProps) {
  const [isCorrect, setIsCorrect] = useState(initialCorrect);

  const handleMarkCorrect = async () => {
    try {
      await markAnswerAsAccepted(id);
      setIsCorrect(true);
    } catch (error) {
      console.error("Error marking as correct:", error);
    }
  };

  return (
    <button
      onClick={handleMarkCorrect}
      className={`h-8 w-8 rounded-full transition-colors ${
        isCorrect
            ? "bg-emerald-500 text-white ring-2 ring-emerald-500"
            : "text-gray-500 hover:text-emerald-500 active:bg-emerald-500 active:text-white active:ring-2 active:ring-emerald-500"
        }`}
        title="Mark as Correct" >
        <CheckIcon className="h-5 w-5 mx-auto" />
    </button>
    );
}