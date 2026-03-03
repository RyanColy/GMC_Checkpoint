# ─────────────────────────────────────────────
#  Contact Management System
#  Data structures used:
#    • Doubly Linked List  – ordered storage / forward & backward traversal
#    • Hash Table (dict)   – O(1) exact-name lookup
#    • Naive Substring     – keyword search across all contact names
# ─────────────────────────────────────────────


# ── 1. Contact ────────────────────────────────

class Contact:
    def __init__(self, name: str, phone: str):
        self.name  = name
        self.phone = phone

    def __str__(self):
        return f"{self.name} - {self.phone}"


# ── 2. Doubly Linked List ─────────────────────

class Node:
    def __init__(self, contact: Contact):
        self.contact = contact
        self.prev    = None
        self.next    = None


class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def append(self, contact: Contact) -> Node:
        node = Node(contact)
        if self.head is None:
            self.head = self.tail = node
        else:
            node.prev      = self.tail
            self.tail.next = node
            self.tail      = node
        self.size += 1
        return node

    def traverse_forward(self):
        """Yield contacts from head → tail."""
        cur = self.head
        while cur:
            yield cur.contact
            cur = cur.next

    def traverse_backward(self):
        """Yield contacts from tail → head."""
        cur = self.tail
        while cur:
            yield cur.contact
            cur = cur.prev


# ── 3. Naive Substring Search ─────────────────

def naive_substring_search(dll: DoublyLinkedList, keyword: str):
    """
    Returns a list of contacts whose names contain `keyword`
    (case-insensitive) using naive O(n·m) character-by-character matching.
    """
    keyword_lower = keyword.lower()
    k_len         = len(keyword_lower)
    matches       = []

    for contact in dll.traverse_forward():
        text = contact.name.lower()
        t_len = len(text)

        # Slide the pattern across the text
        found = False
        for i in range(t_len - k_len + 1):
            match = True
            for j in range(k_len):
                if text[i + j] != keyword_lower[j]:
                    match = False
                    break
            if match:
                found = True
                break

        if found:
            matches.append(contact)

    return matches


# ── 4. Contact Manager ────────────────────────

class ContactManager:
    def __init__(self):
        self.dll        = DoublyLinkedList()   # doubly linked list
        self.hash_table = {}                   # name.lower() → Contact

    # ── operations ──────────────────────────

    def add_contact(self, name: str, phone: str):
        contact = Contact(name, phone)
        self.dll.append(contact)
        self.hash_table[name.lower()] = contact
        print(f"  Contact '{name}' ({phone}) added successfully.\n")

    def search_by_keyword(self, keyword: str):
        results = naive_substring_search(self.dll, keyword)
        if results:
            print(f"  {len(results)} match(es) found:")
            for c in results:
                print(f"     - {c}")
        else:
            print(f"  No contacts found matching '{keyword}'.")
        print()

    def search_by_name(self, name: str):
        contact = self.hash_table.get(name.lower())
        if contact:
            print(f"  Found: {contact}\n")
        else:
            print(f"  No contact found with name '{name}'.\n")

    def display_forward(self):
        if self.dll.size == 0:
            print("  (no contacts)\n")
            return
        print("  ── Forward ──")
        for i, c in enumerate(self.dll.traverse_forward(), 1):
            print(f"  {i:>3}. {c}")
        print()

    def display_backward(self):
        if self.dll.size == 0:
            print("  (no contacts)\n")
            return
        print("  ── Backward ──")
        for i, c in enumerate(self.dll.traverse_backward(), 1):
            print(f"  {i:>3}. {c}")
        print()


# ── 5. Text Menu ──────────────────────────────

MENU = """
╔══════════════════════════════════════╗
║       CONTACT MANAGEMENT SYSTEM      ║
╠══════════════════════════════════════╣
║  1. Add Contact                      ║
║  2. Search by Keyword (substring)    ║
║  3. Search by Exact Name (hash)      ║
║  4. View All – Forward               ║
║  5. View All – Backward              ║
║  6. Exit                             ║
╚══════════════════════════════════════╝"""


def main():
    manager = ContactManager()

    while True:
        print(MENU)
        choice = input("Enter option: ").strip()

        if choice == "1":
            name  = input("  Name:  ").strip()
            phone = input("  Phone: ").strip()
            if name and phone:
                manager.add_contact(name, phone)
            else:
                print("  Name and phone cannot be empty.\n")

        elif choice == "2":
            keyword = input("  Search keyword: ").strip()
            if keyword:
                manager.search_by_keyword(keyword)
            else:
                print("  Keyword cannot be empty.\n")

        elif choice == "3":
            name = input("  Enter exact name: ").strip()
            if name:
                manager.search_by_name(name)
            else:
                print("  Name cannot be empty.\n")

        elif choice == "4":
            manager.display_forward()

        elif choice == "5":
            manager.display_backward()

        elif choice == "6":
            print("\n  Goodbye!\n")
            break

        else:
            print("  Invalid option. Please enter 1–6.\n")


if __name__ == "__main__":
    main()
