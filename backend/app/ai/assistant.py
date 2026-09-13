import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

class CrimeDataAssistant:
    def __init__(self, persist_directory: str = None):
        print("[INFO] Initializing CrimeDataAssistant...")
        
        # Automatically resolve path whether run from root or backend folder
        if persist_directory is None:
            current_dir = os.path.dirname(os.path.abspath(__file__)) # points to backend/app/ai
            # Check if vector_db is relative to backend or root
            possible_path_1 = os.path.abspath(os.path.join(current_dir, "../../vector_db")) # if in backend/app/ai
            possible_path_2 = os.path.abspath("backend/vector_db") # if run from root
            possible_path_3 = os.path.abspath("vector_db") # if run from backend folder
            
            if os.path.exists(possible_path_1):
                persist_directory = possible_path_1
            elif os.path.exists(possible_path_2):
                persist_directory = possible_path_2
            else:
                persist_directory = possible_path_3

        # Use HuggingFace embeddings (runs locally, secure for sensitive crime data)
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        
        # Load local ChromaDB vector store
        if os.path.exists(persist_directory):
            self.vector_store = Chroma(
                persist_directory=persist_directory,
                embedding_function=self.embeddings
            )
            self.retriever = self.vector_store.as_retriever(
                search_kwargs={"k": 3}
            )
            print(f"[INFO] Vector Database loaded successfully from: {persist_directory}")
        else:
            self.vector_store = None
            self.retriever = None
            print(f"[WARNING] Vector database path not found at {persist_directory}! Please run ingestion script first.")

    def query(self, user_query: str) -> dict:
        """
        Retrieves relevant FIRs, CDRs, or crime records and builds an insight response.
        """
        if not self.retriever:
            return {
                "answer": "Vector database is not initialized. Please ingest data first.",
                "sources": []
            }

        # Fetch relevant documents based on semantic search
        relevant_docs = self.retriever.invoke(user_query)
        
        context_texts = [doc.page_content for doc in relevant_docs]
        sources = [doc.metadata.get("source", "Unknown FIR/Report") for doc in relevant_docs]

        # Formulate analytical output for investigators
        if not context_texts:
            answer = "No matching crime records or intelligence reports found in the database."
        else:
            answer = (
                f"Based on the local crime intelligence database, here are the relevant insights "
                f"matching your query ('{user_query}'):\n\n" + "\n---\n".join(context_texts)
            )

        return {
            "answer": answer,
            "sources": list(set(sources))
        }