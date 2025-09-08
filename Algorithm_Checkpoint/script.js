function analyzeSentence() {
  const input = document.getElementById("sentenceInput").value
  const resultsDiv = document.getElementById("results")
  const processDiv = document.getElementById("processDetails")

  // Clear previous results
  processDiv.innerHTML = ""

  // Validate input
  if (!input) {
    showError("Please enter a sentence.")
    return
  }

  if (!input.endsWith(".")) {
    showError("The sentence must end with a period (.)")
    return
  }

  // Initialize three counter variables as requested
  let lengthCounter = 0 // Counter for sentence length
  let wordCounter = 0 // Counter for number of words
  let vowelCounter = 0 // Counter for number of vowels

  // Define vowels (both uppercase and lowercase)
  const vowels = "aeiouAEIOU"

  // Process tracking
  let processLog = "Character-by-character analysis:\n\n"
  let inWord = false // Track if we're currently inside a word

  // Read sentence character by character
  for (let i = 0; i < input.length; i++) {
    const currentChar = input[i]
    lengthCounter++ // Increment length for each character

    processLog += `Character ${i + 1}: '${currentChar}'\n`

    // Check if character is a vowel
    if (vowels.includes(currentChar)) {
      vowelCounter++
      processLog += `  → Vowel found! Vowel count: ${vowelCounter}\n`
    }

    // Check for word counting logic
    if (currentChar === " ") {
      if (inWord) {
        wordCounter++
        inWord = false
        processLog += `  → Space found, word completed. Word count: ${wordCounter}\n`
      }
    } else if (currentChar === ".") {
      if (inWord) {
        wordCounter++
        processLog += `  → Period found, last word completed. Word count: ${wordCounter}\n`
      }
      processLog += `  → End of sentence reached.\n`
    } else {
      if (!inWord) {
        inWord = true
        processLog += `  → Starting new word...\n`
      }
    }

    processLog += `  Length so far: ${lengthCounter}\n\n`
  }

  // Display results
  document.getElementById("lengthResult").textContent = lengthCounter
  document.getElementById("wordsResult").textContent = wordCounter
  document.getElementById("vowelsResult").textContent = vowelCounter

  // Show process details
  processDiv.textContent = processLog

  // Remove any error messages
  const existingError = document.querySelector(".error")
  if (existingError) {
    existingError.remove()
  }

  // Show results section
  resultsDiv.style.display = "block"
  document.getElementById("process").style.display = "block"
}

function showError(message) {
  // Remove existing error
  const existingError = document.querySelector(".error")
  if (existingError) {
    existingError.remove()
  }

  // Create new error message
  const errorDiv = document.createElement("div")
  errorDiv.className = "error"
  errorDiv.textContent = message

  // Insert before results
  const container = document.querySelector(".container")
  const results = document.getElementById("results")
  container.insertBefore(errorDiv, results)

  // Hide results
  document.getElementById("results").style.display = "none"
  document.getElementById("process").style.display = "none"
}

// Allow Enter key to trigger analysis
document.getElementById("sentenceInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    analyzeSentence()
  }
})
