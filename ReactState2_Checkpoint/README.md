# To-Do List App

A React application for managing daily tasks with full CRUD functionality, form validation, and persistent storage.

## Features

- **Add tasks** — modal form with name and description, both fields required
- **Edit tasks** — click Edit to open a pre-filled modal and update a task
- **Delete tasks** — custom confirmation dialog before permanent deletion
- **Complete tasks** — toggle tasks between active and completed (visually distinguished)
- **Filter tasks** — view All, Active, or Done tasks via icon buttons
- **Persistent storage** — tasks are saved in `localStorage` and restored on reload

## Project Structure

```
src/
├── constants/
│   └── index.js                   # App-wide constants (storage key, filters, empty messages)
├── utils/
│   └── index.js                   # Pure helpers: createTask(), getTaskStats()
├── context/
│   └── TaskContext.js             # Global task state via React Context
├── hooks/
│   └── useTasks.js                # Custom hook — task CRUD + localStorage sync
├── services/
│   └── storageService.js          # localStorage read / write
├── pages/
│   ├── HomePage.js                # Main page — layout, modal state, filter
│   └── HomePage.css
└── components/
    ├── Modal/
    │   ├── Modal.js               # Reusable accessible dialog (add / edit)
    │   └── Modal.css
    ├── ConfirmDialog/
    │   ├── ConfirmDialog.js       # Destructive action confirmation dialog
    │   └── ConfirmDialog.css
    ├── TaskForm/
    │   ├── TaskForm.js            # Add / edit form with validation
    │   └── TaskForm.css
    ├── TaskItem/
    │   ├── TaskItem.js            # Individual task card with actions
    │   └── TaskItem.css
    └── TaskList/
        └── TaskList.js            # Filtered list renderer + empty states
```

## Getting Started

### Prerequisites

- Node.js >= 14
- npm >= 6

### Installation

```bash
npm install
```

### Run locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

The optimised output will be in the `build/` folder.
