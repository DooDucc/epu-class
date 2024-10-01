import { useState, useEffect, RefObject } from "react";

export const useScrollBehavior = (listRef: RefObject<HTMLUListElement>) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.scrollTop = listElement.scrollHeight;
    }
  };

  const checkIfAtBottom = () => {
    const listElement = listRef.current;
    if (listElement) {
      const isAtBottom =
        listElement.scrollHeight - listElement.scrollTop <=
        listElement.clientHeight + 1;
      setIsAtBottom(isAtBottom);
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", checkIfAtBottom);
      return () => {
        listElement.removeEventListener("scroll", checkIfAtBottom);
      };
    }
  }, [listRef]);

  return { showScrollButton, isAtBottom, scrollToBottom, checkIfAtBottom };
};
