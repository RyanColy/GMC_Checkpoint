class InsertionSortVisualizer {
  constructor() {
    this.array = []
    this.issorting = false
    this.comparisons = 0
    this.swaps = 0
    this.delay = 1000 // 1 second delay between steps

    this.initializeElements()
    this.setupEventListeners()
    this.generateArray()
  }

  initializeElements() {
    this.arrayInput = document.getElementById("arrayInput")
    this.generateBtn = document.getElementById("generateBtn")
    this.sortBtn = document.getElementById("sortBtn")
    this.resetBtn = document.getElementById("resetBtn")
    this.arrayContainer = document.getElementById("arrayContainer")
    this.stepDescription = document.getElementById("stepDescription")
    this.comparisonsEl = document.getElementById("comparisons")
    this.swapsEl = document.getElementById("swaps")
    this.currentIEl = document.getElementById("currentI")
  }

  setupEventListeners() {
    this.generateBtn.addEventListener("click", () => this.generateRandomArray())
    this.sortBtn.addEventListener("click", () => this.startSort())
    this.resetBtn.addEventListener("click", () => this.reset())
    this.arrayInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.generateArray()
      }
    })
  }

  generateArray() {
    const input = this.arrayInput.value.trim()
    if (input) {
      this.array = input
        .split(",")
        .map((num) => Number.parseInt(num.trim()))
        .filter((num) => !isNaN(num))
    } else {
      this.generateRandomArray()
    }
    this.renderArray()
    this.resetStats()
  }

  generateRandomArray() {
    this.array = []
    const size = 8
    for (let i = 0; i < size; i++) {
      this.array.push(Math.floor(Math.random() * 90) + 10)
    }
    this.arrayInput.value = this.array.join(",")
    this.renderArray()
    this.resetStats()
  }

  renderArray() {
    this.arrayContainer.innerHTML = ""
    const maxValue = Math.max(...this.array)

    this.array.forEach((value, index) => {
      const element = document.createElement("div")
      element.className = "array-element"
      element.setAttribute("data-index", index)

      const bar = document.createElement("div")
      bar.className = "bar"
      bar.style.height = `${(value / maxValue) * 150 + 30}px`
      bar.textContent = value

      const valueLabel = document.createElement("div")
      valueLabel.className = "value"
      valueLabel.textContent = value

      element.appendChild(bar)
      element.appendChild(valueLabel)
      this.arrayContainer.appendChild(element)
    })
  }

  resetStats() {
    this.comparisons = 0
    this.swaps = 0
    this.updateStats()
    this.stepDescription.textContent = 'Click "Start Insertion Sort" to begin'
    this.currentIEl.textContent = "-"
  }

  updateStats() {
    this.comparisonsEl.textContent = this.comparisons
    this.swapsEl.textContent = this.swaps
  }

  async startSort() {
    if (this.isSort || this.array.length === 0) return

    this.isSort = true
    this.sortBtn.disabled = true
    this.generateBtn.disabled = true

    await this.insertionSort()

    this.isSort = false
    this.sortBtn.disabled = false
    this.generateBtn.disabled = false
    this.stepDescription.textContent = "Sorting completed! Array is now sorted."
  }

  async insertionSort() {
    const n = this.array.length

    // Mark first element as sorted
    this.highlightElement(0, "sorted")
    this.stepDescription.textContent = "Starting with first element as sorted portion"
    await this.sleep(this.delay)

    for (let i = 1; i < n; i++) {
      this.currentIEl.textContent = i
      const key = this.array[i]
      let j = i - 1

      // Highlight current element being inserted
      this.highlightElement(i, "current")
      this.stepDescription.textContent = `Step ${i}: Picking element ${key} at position ${i} to insert into sorted portion (0 to ${i - 1})`
      await this.sleep(this.delay)

      // Compare and shift elements
      while (j >= 0 && this.array[j] > key) {
        this.comparisons++
        this.updateStats()

        // Highlight comparison
        this.highlightElement(j, "comparing")
        this.stepDescription.textContent = `Comparing ${key} with ${this.array[j]} at position ${j}. Since ${this.array[j]} > ${key}, shift ${this.array[j]} to the right`
        await this.sleep(this.delay)

        // Shift element to the right
        this.array[j + 1] = this.array[j]
        this.swaps++
        this.updateStats()

        // Update visual representation
        this.updateElementValue(j + 1, this.array[j + 1])
        await this.sleep(this.delay / 2)

        j--
      }

      // Insert the key at correct position
      this.array[j + 1] = key
      this.updateElementValue(j + 1, key)

      // Clear highlights and mark sorted portion
      this.clearHighlights()
      for (let k = 0; k <= i; k++) {
        this.highlightElement(k, "sorted")
      }

      this.stepDescription.textContent = `Inserted ${key} at position ${j + 1}. Sorted portion now extends from 0 to ${i}`
      await this.sleep(this.delay)
    }

    // Final highlight - all elements are sorted
    this.clearHighlights()
    for (let i = 0; i < n; i++) {
      this.highlightElement(i, "sorted")
    }
  }

  highlightElement(index, className) {
    const element = document.querySelector(`[data-index="${index}"]`)
    if (element) {
      element.className = `array-element ${className}`
    }
  }

  clearHighlights() {
    const elements = document.querySelectorAll(".array-element")
    elements.forEach((element) => {
      element.className = "array-element"
    })
  }

  updateElementValue(index, value) {
    const element = document.querySelector(`[data-index="${index}"]`)
    if (element) {
      const bar = element.querySelector(".bar")
      const valueLabel = element.querySelector(".value")
      bar.textContent = value
      valueLabel.textContent = value

      // Update height based on new value
      const maxValue = Math.max(...this.array)
      bar.style.height = `${(value / maxValue) * 150 + 30}px`
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  reset() {
    this.isSort = false
    this.sortBtn.disabled = false
    this.generateBtn.disabled = false
    this.clearHighlights()
    this.generateArray()
  }
}

// Initialize the visualizer when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new InsertionSortVisualizer()
})
