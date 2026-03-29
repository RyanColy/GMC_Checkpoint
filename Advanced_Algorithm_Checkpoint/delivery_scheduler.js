const readline = require("readline");

// ─── Jeu de données de référence (6 tâches) ─────────────────────────────────
const SAMPLE_TASKS = [
  { id: 1, start: 1, end: 3 },
  { id: 2, start: 2, end: 5 },
  { id: 3, start: 4, end: 6 },
  { id: 4, start: 6, end: 7 },
  { id: 5, start: 5, end: 9 },
  { id: 6, start: 8, end: 10 },
];

// ─── Générateur de tâches aléatoires ────────────────────────────────────────
function generateTasks(n) {
  return Array.from({ length: n }, (_, i) => {
    const start = Math.floor(Math.random() * 10_000);
    const duration = Math.floor(Math.random() * 50) + 1;
    return { id: i + 1, start, end: start + duration };
  });
}

// ─── Algorithme Greedy ─────────────────────────────────────────
function greedy(tasks) {
  const sorted = [...tasks].sort((a, b) => a.end - b.end);
  const selected = [];
  let lastEnd = -Infinity;

  for (const task of sorted) {
    if (task.start >= lastEnd) {
      selected.push(task);
      lastEnd = task.end;
    }
  }
  return selected;
}

// ─── Algorithme Brute-Force ───────────────────────────
function bruteForce(tasks, timeLimitMs = Infinity) {
  let best = [];
  const deadline = performance.now() + timeLimitMs;
  let timedOut = false;

  function explore(index, current) {
    if (timedOut) return;
    if (performance.now() > deadline) { timedOut = true; return; }

    if (index === tasks.length) {
      if (current.length > best.length) best = [...current];
      return;
    }
    const task = tasks[index];
    const last = current[current.length - 1];

    if (!last || task.start >= last.end) {
      explore(index + 1, [...current, task]);
    }
    explore(index + 1, current);
  }

  explore(0, []);
  return { result: best, timedOut };
}

// ─── Utilitaires d'affichage ─────────────────────────────────────────────────
const SEP_THIN = "─".repeat(52);
const SEP_BOLD = "═".repeat(52);

function printSampleTasks(tasks) {
  console.log("\n  Tâches de référence :");
  tasks.forEach((t) =>
    console.log(`    Tâche #${String(t.id).padEnd(2)}  [${t.start}h → ${t.end}h]`)
  );
}

function printResult(algoName, complexity, result, elapsedMs, showTasks = true) {
  console.log(`\n${SEP_THIN}`);
  console.log(`  Algorithme   : ${algoName}`);
  console.log(`  Complexité   : ${complexity}`);
  console.log(`  Sélectionnés : ${result.length} tâche(s)`);
  console.log(`  Temps        : ${elapsedMs} ms`);
  if (showTasks) {
    console.log("\n  Tâches retenues :");
    result.forEach((t) =>
      console.log(`    [${t.start}h → ${t.end}h]`)
    );
  }
  console.log(SEP_THIN);
}

function printBenchmarkResult(algoName, complexity, count, elapsedMs) {
  console.log(`\n${SEP_THIN}`);
  console.log(`  Algorithme   : ${algoName}`);
  console.log(`  Complexité   : ${complexity}`);
  console.log(`  Sélectionnés : ${count} tâche(s) / 10 000`);
  console.log(`  Temps        : ${elapsedMs} ms`);
  console.log(SEP_THIN);
}

// ─── Option 1 — Greedy sur données de référence ──────────────────────────────
function runGreedySample() {
  console.log("\n  >> Greedy sur le jeu de référence (6 tâches)\n");
  printSampleTasks(SAMPLE_TASKS);

  const t0 = performance.now();
  const result = greedy(SAMPLE_TASKS);
  const elapsed = (performance.now() - t0).toFixed(3);

  printResult("Greedy (earliest deadline first)", "O(n log n)", result, elapsed);
}

// ─── Option 2 — Brute-Force sur données de référence ────────────────────────
function runBruteForceSample() {
  console.log("\n  >> Brute-Force sur le jeu de référence (6 tâches)\n");
  printSampleTasks(SAMPLE_TASKS);

  const t0 = performance.now();
  const { result } = bruteForce(SAMPLE_TASKS);
  const elapsed = (performance.now() - t0).toFixed(3);

  printResult("Brute-Force (récursif exhaustif)", "O(2^n)", result, elapsed);
}

// ─── Option 3 — Validation : les deux doivent retourner le même résultat ────
function runValidation() {
  console.log("\n  >> Validation — Comparaison sur le jeu de référence (6 tâches)\n");
  printSampleTasks(SAMPLE_TASKS);

  const t0g = performance.now();
  const gResult = greedy(SAMPLE_TASKS);
  const gTime = (performance.now() - t0g).toFixed(3);

  const t0b = performance.now();
  const { result: bResult } = bruteForce(SAMPLE_TASKS);
  const bTime = (performance.now() - t0b).toFixed(3);

  printResult("Greedy (earliest deadline first)", "O(n log n)", gResult, gTime);
  printResult("Brute-Force (récursif exhaustif)", "O(2^n)", bResult, bTime);

  const sameCount  = gResult.length === bResult.length;
  const sameTasks  = gResult.every((t, i) => bResult[i] &&
    t.start === bResult[i].start && t.end === bResult[i].end);
  const identical  = sameCount && sameTasks;

  console.log(`\n  Même nombre de tâches  : ${sameCount ? "OUI ✔" : "NON ✘"}`);
  console.log(`  Mêmes intervalles      : ${sameTasks ? "OUI ✔" : "NON ✘"}`);
  console.log(`  Résultat global        : ${identical
    ? "IDENTIQUES ✔ — les deux algorithmes sont corrects"
    : "DIVERGENCE ✘ — vérifier l'implémentation"}\n`);
}

// ─── Option 4 — Benchmark sur 10 000 tâches aléatoires ──────────────────────
function runBenchmark() {
  const N         = 10_000;
  const TIMEOUT   = 5_000; // ms — on coupe le brute-force après 5 secondes

  console.log(`\n  >> Benchmark sur ${N.toLocaleString()} tâches aléatoires\n`);
  console.log(`  Génération de ${N.toLocaleString()} tâches...`);
  const largeTasks = generateTasks(N);
  console.log(`  Génération terminée.\n`);

  // ── Greedy sur la totalité des 10 000 tâches ──────────────────────────────
  const t0g  = performance.now();
  const gResult = greedy(largeTasks);
  const gTime   = (performance.now() - t0g).toFixed(3);
  printBenchmarkResult("Greedy — 10 000 tâches", "O(n log n)", gResult.length, gTime);

  // ── Brute-Force : on monte les paliers jusqu'au timeout ───────────────────
  console.log(`\n  Brute-Force — montée en charge (timeout ${TIMEOUT / 1000}s par palier)\n`);

  const paliers = [10, 20, 30, 50, 75, 100, 150, 200];
  let lastSuccessful = 0;

  for (const n of paliers) {
    const sample = largeTasks.slice(0, n);
    const t0b    = performance.now();
    const { result, timedOut } = bruteForce(sample, TIMEOUT);
    const elapsed = (performance.now() - t0b).toFixed(0);

    if (timedOut) {
      console.log(`    n = ${String(n).padStart(4)}  →  ⛔ TIMEOUT après ${elapsed} ms — abandon`);
      break;
    } else {
      console.log(`    n = ${String(n).padStart(4)}  →  ${String(result.length).padStart(3)} tâches retenues  |  ${elapsed} ms`);
      lastSuccessful = n;
    }
  }

  // ── Résumé comparatif ─────────────────────────────────────────────────────
  console.log(`\n${SEP_BOLD}`);
  console.log("  RÉSUMÉ COMPARATIF");
  console.log(SEP_BOLD);
  console.log(`  Greedy       : ${gTime.padStart(8)} ms   sur ${N.toLocaleString()} tâches`);
  console.log(`  Brute-Force  : viable jusqu'à ~${lastSuccessful} tâches, puis timeout`);
  console.log(`\n  Conclusion   : le Brute-Force ne peut PAS traiter 10 000 tâches.`);
  console.log(`  Le Greedy le fait en ${gTime} ms — production-ready.`);
  console.log(`${SEP_BOLD}\n`);
}

// ─── Menu principal ───────────────────────────────────────────────────────────
function showMenu() {
  console.log(`\n${SEP_BOLD}`);
  console.log("  DELIVERY SCHEDULER — Sélection de tâches");
  console.log(SEP_BOLD);
  console.log("\n  Choisissez une option :\n");
  console.log("    [1]  Greedy");
  console.log("    [2]  Brute-Force");
  console.log("    [3]  Comparer les 2 résultats");
  console.log("    [4]  Benchmark  — 10 000 tâches aléatoires");
  console.log("    [0]  Quitter\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function prompt() {
    showMenu();
    rl.question("  Votre choix : ", (answer) => {
      const choice = answer.trim();

      if      (choice === "1") runGreedySample();
      else if (choice === "2") runBruteForceSample();
      else if (choice === "3") runValidation();
      else if (choice === "4") runBenchmark();
      else if (choice === "0") {
        console.log("\n  Au revoir.\n");
        rl.close();
        return;
      } else {
        console.log("\n  Choix invalide. Entrez 1, 2, 3, 4 ou 0.\n");
      }

      rl.question("  Appuyez sur Entrée pour continuer...", () => prompt());
    });
  }

  prompt();
}

main();