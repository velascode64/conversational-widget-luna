"use client";

import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Textarea from "react-textarea-autosize";

import { useMergeRefs } from "@/lib/hooks/useMergeRefs";

import ChatWidgetSubmitButton from "./ChatWidgetSubmitButton";

interface ChatWidgetInputProps {
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

function ChatWidgetMessageInput(
  {
    loading,
    disabled,
    className,
    value,
    defaultValue,
    onChange,
    onSubmit,
  }: ChatWidgetInputProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [valueState, setValueState] = useState(
    () => value || defaultValue || ""
  );

  const isSubmitDisabled = valueState === "" || loading || disabled;

  useEffect(() => {
    if (value !== undefined) {
      setValueState(value);
    }
  }, [value]);

  const handleOnChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) {
      setValueState(ev.currentTarget.value);
    }

    onChange?.(ev.currentTarget.value);
  };

  const handleOnSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const nextValue = valueState.trim();
    if (!nextValue || isSubmitDisabled) return;

    if (value === undefined) {
      setValueState("");
    }

    onSubmit?.(nextValue);
  };

  const handleOnKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      formRef.current?.requestSubmit();
      ev.preventDefault();
    }
  };

  const mergedTextareRef = useMergeRefs(ref, textareaRef);

  useEffect(() => {
    // Hotix Safari mobile viewport issue
    // When input/textarea elements are focused on iOS Safari, the browser automatically
    // adjusts the viewport to accommodate the virtual keyboard, which can cause
    // unwanted blank space at the bottom of the screen.
    function handleBlur() {
      textareaRef.current?.blur();
    }

    window.addEventListener("touchmove", handleBlur);

    return () => {
      document.removeEventListener("touchmove", handleBlur);
    };
  }, []);

  return (
    <form ref={formRef} onSubmit={handleOnSubmit} className={className}>
      <div className="relative flex min-h-11 w-full grow flex-col overflow-hidden rounded-md bg-white pr-10">
        <Textarea
          ref={mergedTextareRef}
          tabIndex={0}
          placeholder="Message..."
          className="w-full resize-none bg-transparent p-3 text-base focus-within:outline-none"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          maxRows={3}
          value={valueState}
          disabled={disabled}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
        />

        <div className="absolute right-1.5 top-1.5">
          <ChatWidgetSubmitButton
            aria-label="Send message"
            type="submit"
            loading={loading}
            disabled={isSubmitDisabled}
          />
        </div>
      </div>
    </form>
  );
}

export default React.forwardRef<HTMLTextAreaElement, ChatWidgetInputProps>(
  ChatWidgetMessageInput
);
