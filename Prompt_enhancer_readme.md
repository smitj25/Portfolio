# PromptCraft — Intelligent NLP-Based Prompt Optimizer

PromptCraft is an NLP-powered web application that analyzes, understands, and enhances user prompts for improved AI interactions. It leverages Google's free Gemini API for semantic embeddings and prompt enhancement, and provides before–after comparisons with linguistic feedback.

## Features
- NLP pipeline: tokenization, lemmatization, stopword removal, readability analysis
- Intent detection and prompt classification (creative, academic, technical, conversational)
- Prompt enhancement via Gemini API tailored for selected target model (Gemini, ChatGPT, Perplexity)
- Metrics: readability, length, semantic similarity, and structured improvement summary
- Simple web UI with side-by-side comparison

## Quick Start

1. Set your Gemini API key in environment:
   - Windows PowerShell:
     ```powershell
     $env:GEMINI_API_KEY="YOUR_API_KEY"
     ```

2. Create a virtual environment and install dependencies:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install --upgrade pip
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

3. Run the server:
   ```powershell
   .\.venv\Scripts\python.exe -m uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload
   ```

4. Open the app in your browser at `http://127.0.0.1:8000/`.

## Notes
- If `GEMINI_API_KEY` is not set, the app will still run but prompt enhancement and embeddings will return a graceful error instructing you to set the key.
- The NLP pipeline uses `nltk` and will download required corpora (punkt, wordnet, stopwords, averaged_perceptron_tagger) on first run.