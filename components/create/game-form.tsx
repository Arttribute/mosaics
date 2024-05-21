"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import PromptField from "./prompt-field";
import AddPrompt from "./add-prompt";

const GameForm = () => {
  const form = useForm();

  const [promptCount, setPromptCount] = useState(1);
  const [prompts, setPrompts] = useState<string[]>([]);

  const handleSubmit = () => {
    console.log("done");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-20">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-3xl w-full flex flex-col gap-5"
        >
          {/* puzzle name */}
          <FormLabel className="text-center font-bold text-2xl">
            Create Game
          </FormLabel>

          <FormField
            name="game"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Puzzle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* game instructions */}
          <FormField
            name="instructions"
            render={({ field }) => (
              <FormItem className="mt-4  mb-4">
                <FormLabel>Create your prompt jigsaw puzzle</FormLabel>
                <FormDescription>Write at most a 6-word prompt</FormDescription>
              </FormItem>
            )}
          />

          {/* prompts */}
          <div>
            {promptCount > 0 && (
              <div>
                {[...Array(promptCount)].map((_, index) => (
                  <PromptField
                    key={index}
                    prompts={prompts}
                    setPrompts={setPrompts}
                    promptCount={promptCount}
                    setPromptCount={setPromptCount}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* <PromptField /> */}
            <AddPrompt
              promptCount={promptCount}
              setPromptCount={setPromptCount}
            />
          </div>
          <Button
            variant="outline"
            type="submit"
            className="self-center border-2 w-40"
          >
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GameForm;
