# PDF Chat Application

An interactive web application that allows users to upload, view, and have conversations with their PDF documents using AI. This application extracts text from PDFs, stores it in a vector database, and enables natural language queries against the document content.

[![PDF Chat Application Screenshot 1](https://i.postimg.cc/L8cpyFdn/screen-1.png)](https://postimg.cc/hX16jwtB)
[![PDF Chat Application Screenshot 2](https://i.postimg.cc/g2XpqkTC/screen-2.png)](https://postimg.cc/sMrb3yym)

## Features

- 📄 PDF upload via drag-and-drop or file selection
- 👁️ Built-in PDF viewer with clean interface
- 💬 AI-powered chat interface for asking questions about PDF content
- 🔍 Semantic search using text embeddings
- 🔄 Real-time PDF text extraction and processing

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **PDF Processing**: React PDF to Text
- **Vector Database**: Pinecone
- **AI/NLP**: OpenAI's embeddings and GPT models
- **Server**: Express.js
- **API Integration**: OpenAI API, Pinecone API

## Project Structure

The application is split into client (React) and server (Express) components:

### Client-side (React Application)

The React application handles the user interface and client-side functionality:

- `app/src/components/left-section.tsx`: PDF upload area and viewer
- `app/src/components/right-section.tsx`: Chat interface for interacting with PDF content
- `app/src/components/SplitLayout.tsx`: Main layout component that combines left and right sections
- `app/src/services/pdf-text.ts`: Service for PDF text extraction and processing

### Server-side (Express Application)

The Express server handles the AI and database operations:

- `server/index.js`: Express server with endpoints for embeddings and question answering
- Integrates with Pinecone for vector storage and OpenAI for embeddings and question answering

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- NPM or Yarn
- OpenAI API key
- Pinecone API key

### Environment Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pdf-chat-app.git
   cd pdf-chat-app
   ```

2. Install client dependencies
   ```bash
   cd app
   npm install
   ```

3. Install server dependencies
   ```bash
   cd ../server
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PORT=3000
   ```

### Running the Application

1. Start the server
   ```bash
   cd server
   node index.js
   ```

2. In a new terminal, start the client
   ```bash
   cd app
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Usage

1. Upload a PDF using the left panel (drag and drop or click to upload)
2. Wait for the PDF to be processed (text extraction and embedding)
3. Start asking questions about the PDF in the chat interface on the right
4. View the PDF content in the built-in viewer
