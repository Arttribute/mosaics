"use client";

import { Button } from "../ui/button";

export default function AddPrompt({
  promptCount,
  setPromptCount,
}: {
  promptCount: number;
  setPromptCount: (promptCount: number) => void;
}) {
  const addPromptCount = () => {
    setPromptCount(promptCount + 1);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="mt-6 border-2"
      onClick={addPromptCount}
    >
      Add another
    </Button>
  );
}
