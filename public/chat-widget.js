/* eslint-disable no-inner-declarations */
// Chat Widget Script - Creates a floating chat widget
// This script uses iframes to create isolated UI components:
// 1. A control button frame (small circle button in the corner)
// 2. A chat panel frame (larger panel that appears when the button is clicked)
// The script handles communication between frames and manages animations

(() => {
  /**
   * Generates a UUID v4 (RFC 4122 compliant)
   * - Creates a pattern using 'x' and 'y' placeholders
   * - Replaces each placeholder with a random hexadecimal digit
   * - The '4' in the third group identifies it as version 4
   * - The 'y' character becomes either 8, 9, A, or B (ensuring RFC compliance)
   * - Returns a string in format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   * @returns {string} A randomly generated UUID v4
   */
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Retrieves metadata from the chat widget script element
   * Looks for the script tag either via document.currentScript or by querying for widget.js
   * Validates that required data attributes (apiKey and chatId) are present
   * @returns {Object|null} Object containing script source, API key and chat ID, or null if metadata is invalid
   */
  function getScriptMetadata() {
    const script = document.currentScript
      ? document.currentScript
      : document.querySelector('script[src*="widget.js"]');

    if (!(script instanceof HTMLScriptElement)) {
      return null;
    }

    if (!script.dataset.apiKey) {
      console.error("Chat widget is missing API key");
      return null;
    }

    if (!script.dataset.chatId) {
      console.error("Chat widget is missing chat id");
      return null;
    }

    return {
      src: script.src,
      apiKey: script.dataset.apiKey,
      chatId: script.dataset.chatId,
    };
  }

  // Constants
  const WIDGET_ID = uuid();
  const CONTROL_FRAME_ID = "doubleo-control-frame";
  const CHAT_FRAME_ID = "doubleo-chat-frame";
  const STYLES_ID = "doubleo-widget-styles";

  // Events - Define message types for cross-frame communication
  const EVENTS = {
    CONTROL_LOADED_SUCCESS: "widget_control_loaded_success",
    CONTROL_LOADED_FAILURE: "widget_control_loaded_failure",
    CONTROL_OPEN: "widget_control_open",
    CONTROL_CLOSE: "widget_control_close",
    CHAT_LOADED_SUCCESS: "widget_chat_loaded_success",
    CHAT_LOADED_FAILURE: "widget_chat_loaded_failure",
    CHAT_CLOSE: "widget_chat_close",
    CHAT_OPENED: "widget_chat_opened",
    CHAT_CLOSED: "widget_chat_closed",
  };

  try {
    const metadata = getScriptMetadata();

    // Exit early if we don't have script metadata
    if (!metadata) {
      return;
    }

    // Create URLs for control and chat frames based on script source
    const scriptUrl = new URL(metadata.src);

    const controlUrl = new URL(`${scriptUrl.origin}/widget/control`);
    controlUrl.searchParams.append("widget_id", WIDGET_ID);
    controlUrl.searchParams.append("api_key", metadata.apiKey);
    controlUrl.searchParams.append("chat_id", metadata.chatId);

    const chatUrl = new URL(`${scriptUrl.origin}/widget/chat`);
    chatUrl.searchParams.append("widget_id", WIDGET_ID);
    chatUrl.searchParams.append("api_key", metadata.apiKey);
    chatUrl.searchParams.append("chat_id", metadata.chatId);

    /**
     * Creates a style element with CSS for the widget frames
     * Handles positioning, animations, and visual effects
     * @returns {HTMLStyleElement} The created style element
     */
    function createStyles() {
      const styles = document.createElement("style");

      styles.setAttribute("id", STYLES_ID);

      styles.innerHTML = `
          #${CONTROL_FRAME_ID} {
            width: 52px;
            height: 52px;
            border: none;
            z-index: 2147483000;
            position: fixed;
            right: 20px;
            bottom: 20px;
            border-radius: 99999px;
            filter: drop-shadow(rgba(0, 0, 0, 0.11) 0px 1px 5px) drop-shadow(rgba(0, 0, 0, 0.28) 0px 2px 29px);
            transition: transform ease 80ms;
          }
  
          #${CONTROL_FRAME_ID}:hover {
            transform: scale(1.05);
          }
  
          #${CONTROL_FRAME_ID}:active {
            transform: scale(0.95);
          }
  
          #${CHAT_FRAME_ID} {
            width: 100vw;
            height: 100vh;
            border: none;
            z-index: 2147483001;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: hidden;
  
            @supports (width: 100dvw) {
              width: 100dvw;
            }
  
            @supports (height: 100dvh) {
              height: 100dvh;
            }
          }
  
          #${CHAT_FRAME_ID}.opened {
            opacity: 1;
            transform: scale(1) translate(0);
            transform-origin: bottom right;
            transition: opacity 300ms ease, transform 300ms ease;
          }
  
          #${CHAT_FRAME_ID}.closed {
            opacity: 0;
            transform: scale(0.8) translate(10px, 10px);
            transform-origin: bottom right;
          }
  
          #${CONTROL_FRAME_ID}.hidden,
          #${CHAT_FRAME_ID}.hidden {
            visibility: hidden;
            overflow: hidden;
            width: 0px;
            height: 0px;
            opacity: 0;
            pointer-events: none;
          }
  
          @media (min-width: 768px) {
            #${CHAT_FRAME_ID} {
              width: 384px;
              height: min(672px, 100% - 104px);
              top: auto;
              left: auto;
              right: 20px;
              bottom: 104px;
              border-radius: 12px;
              filter: drop-shadow(rgba(0, 0, 0, 0.11) 0px 1px 5px) drop-shadow(rgba(0, 0, 0, 0.28) 0px 2px 29px);
            }
  
            #${CONTROL_FRAME_ID} {
              width: 72px;
              height: 72px;
            }
          }
        `;

      return styles;
    }

    /**
     * Creates the control button iframe (the circular button in the corner)
     * Initially hidden until fully loaded to prevent visual glitches
     * @returns {HTMLIFrameElement} The control frame element
     */
    function createControlFrame() {
      const controlFrame = document.createElement("iframe");

      controlFrame.setAttribute("id", CONTROL_FRAME_ID);
      controlFrame.setAttribute("src", controlUrl.toString());

      // Hide the frame initially until it's fully loaded
      controlFrame.classList.add("hidden");

      return controlFrame;
    }

    /**
     * Creates the chat panel iframe (the larger conversation interface)
     * Initially closed and hidden until activated by the control frame
     * @returns {HTMLIFrameElement} The chat frame element
     */
    function createChatFrame() {
      const chatFrame = document.createElement("iframe");

      chatFrame.setAttribute("id", CHAT_FRAME_ID);
      chatFrame.setAttribute("src", chatUrl.toString());

      // Start with chat panel closed and hidden
      chatFrame.classList.add("closed", "hidden");

      return chatFrame;
    }

    /**
     * Sets up communication between the control and chat frames
     * Uses window.postMessage for secure cross-origin communication
     * Handles animations and state transitions between frames
     * @param {HTMLIFrameElement} controlFrame - The control button frame
     * @param {HTMLIFrameElement} chatFrame - The chat panel frame
     */
    function connectFrames(controlFrame, chatFrame) {
      window.addEventListener("message", (ev) => {
        // Only process messages with the matching widget ID
        if (ev.data?.widgetId !== WIDGET_ID) {
          return;
        }

        // Display control only after it has loaded successfully
        if (ev.data?.type === EVENTS.CONTROL_LOADED_SUCCESS) {
          controlFrame.classList.remove("hidden");
          return;
        }

        // Handle chat closing request
        if ([EVENTS.CHAT_CLOSE, EVENTS.CONTROL_CLOSE].includes(ev.data?.type)) {
          // Start fade-out animation
          chatFrame.classList.replace("opened", "closed");

          // Hide completely after animation completes (300ms)
          setTimeout(() => {
            chatFrame.classList.add("hidden");
          }, 300);

          // Notify that chat is now closed
          [controlFrame, chatFrame].forEach((frame) => {
            frame.contentWindow.postMessage(
              {
                widgetId: WIDGET_ID,
                type: EVENTS.CHAT_CLOSED,
              },
              "*"
            );
          });

          return;
        }

        // Handle chat opening request
        if (ev.data?.type === EVENTS.CONTROL_OPEN) {
          // Make chat visible but still transparent
          chatFrame.classList.remove("hidden");

          // Short delay before starting animation to ensure proper rendering
          setTimeout(() => {
            chatFrame.classList.replace("closed", "opened");
          }, 10);

          // Notify control frame that chat is now opened
          [controlFrame, chatFrame].forEach((frame) => {
            frame.contentWindow.postMessage(
              {
                widgetId: WIDGET_ID,
                type: EVENTS.CHAT_OPENED,
              },
              "*"
            );
          });

          return;
        }

        // Handle chat or control load failure event
        if (
          [EVENTS.CHAT_LOADED_FAILURE, EVENTS.CONTROL_LOADED_FAILURE].includes(
            ev.data?.type
          )
        ) {
          chatFrame.classList.add("hidden");
          controlFrame.classList.add("hidden");

          return;
        }
      });
    }

    /**
     * Initializes the widget by creating and connecting all components
     * Injects styles and frames into the document
     */
    function initialize() {
      const styles = createStyles();
      const controlFrame = createControlFrame();
      const chatFrame = createChatFrame();

      document.head.appendChild(styles);
      document.body.appendChild(controlFrame);
      document.body.appendChild(chatFrame);

      connectFrames(controlFrame, chatFrame);
    }

    // Initialize immediately if document is already loaded
    if (document.readyState === "complete") {
      initialize();
    } else {
      // Otherwise, wait for document to be fully loaded
      function handleDocumentReadyState() {
        if (document.readyState === "complete") {
          document.removeEventListener(
            "readystatechange",
            handleDocumentReadyState
          );

          initialize();
        }
      }

      document.addEventListener("readystatechange", handleDocumentReadyState);
    }
  } catch (error) {
    // Clean up any created elements if an error occurs
    document.getElementById(STYLES_ID)?.remove();
    document.getElementById(CONTROL_FRAME_ID)?.remove();
    document.getElementById(CHAT_FRAME_ID)?.remove();
  }
})();
