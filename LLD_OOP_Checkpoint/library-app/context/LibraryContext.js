"use client";

import { createContext, useContext, useState, useCallback } from "react";
import library from "../lib/patterns/LibrarySystem";
import { seedLibrary } from "../lib/seed";

seedLibrary();

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const addUser = (user) => {
    library.addUser(user);
    refresh();
  };

  const addBook = (book) => {
    library.addBook(book);
    refresh();
  };

  const borrowBook = (userId, bookId, dueDays) => {
    library.borrowBook(userId, bookId, dueDays);
    refresh();
  };

  const returnBook = (transactionId) => {
    library.returnBook(transactionId);
    refresh();
  };

  const checkOverdue = () => {
    library.checkOverdueTransactions();
    refresh();
  };

  const removeNotification = (index) => {
    library.removeNotification(index);
    refresh();
  };

  const clearNotifications = () => {
    library.clearNotifications();
    refresh();
  };

  return (
    <LibraryContext.Provider
      value={{
        users: library.getAllUsers(),
        books: library.getAllBooks(),
        transactions: library.getAllTransactions(),
        notifications: library.notifications,
        addUser,
        addBook,
        borrowBook,
        returnBook,
        checkOverdue,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
