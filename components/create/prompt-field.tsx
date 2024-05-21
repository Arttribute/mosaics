import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleX } from "lucide-react";

export default function PromptField({
  index,
  prompts,
  promptCount,
  setPromptCount,
  setPrompts,
}: {
  index: number;
  prompts: string[];
  promptCount: number;
  setPromptCount: (promptCount: number) => void;
  setPrompts: (prompt: string[]) => void;
}) {
  const [prompt, setPrompt] = useState<string>("");

  const deletePrompt = () => {
    setPromptCount(promptCount - 1);
    prompts.splice(index, 1);
    setPrompts([...prompts]);
  };

  return (
    <div key={index} className="flex w-full max-w-3xl">
      <div className="flex gap-3 w-full max-w-2xl">
        <FormField
          name="prompt"
          render={({ field }) => (
            <FormItem className="w-full mb-3">
              <FormControl>
                <Input
                  type="text"
                  placeholder={`Prompt ${index + 1}`}
                  {...field}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    prompts[index] = e.target.value;
                    setPrompts([...prompts]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="level"
          render={({ field }) => (
            <FormItem className="w-full max-w-32">
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="3"
                  placeholder="Select Level"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="time"
          render={({ field }) => (
            <FormItem className="w-full max-w-32">
              <FormControl>
                <Input
                  type="number"
                  min="15"
                  placeholder="Time in secs"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {index > 0 && (
        <Button variant="ghost" type="button" onClick={deletePrompt}>
          <CircleX className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
