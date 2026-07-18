import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

// Directional animation: mine slides from bottom-right, theirs from bottom-left
const getVariants = (isMine, reduced) => {
  if (reduced) return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  return {
    initial: { opacity: 0, y: 12, x: isMine ? 16 : -16, scale: 0.95 },
    animate: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, transition: { duration: 0.1 } },
  };
};

const MessageList = ({ messages, currentUserId, participants, typers, isGroup }) => {
  const bottomRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typers]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <p className="message-list__empty">No messages yet. Say hello!</p>
      )}
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          // Resolve sender id regardless of populated/unpopulated state
          const senderId = (msg.sender?._id ?? msg.sender)?.toString?.() ?? "";
          const isMine = !!currentUserId && !!senderId && senderId === currentUserId.toString();

          return (
            <motion.div
              key={msg._id}
              {...getVariants(isMine, reduced)}
              style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}
            >
              <MessageBubble message={msg} isMine={isMine} isGroup={isGroup} />
            </motion.div>
          );
        })}
      </AnimatePresence>
      <TypingIndicator typers={typers} participants={participants} />
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
