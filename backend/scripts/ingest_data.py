import os
import glob
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# Paths configuration
BASE_DIR = Path(__file__).resolve().parent.parent  # backend folder
DATA_DIR = BASE_DIR.parent / "data"                # root ka data folder
CHROMA_PERSIST_DIR = BASE_DIR / "vector_db"

def load_all_documents():
    documents = []
    if not DATA_DIR.exists():
        print(f"[-] Data directory not found at: {DATA_DIR}.")
        return documents

    print(f"[*] Scanning data directory: {DATA_DIR}")

    # 1. Load PDFs
    for pdf_path in glob.glob(str(DATA_DIR / "**/*.pdf"), recursive=True):
        try:
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())
            print(f"[+] Loaded PDF: {os.path.basename(pdf_path)}")
        except Exception as e:
            print(f"[-] Error loading PDF {pdf_path}: {e}")

    # 2. Load Text Files
    for txt_path in glob.glob(str(DATA_DIR / "**/*.txt"), recursive=True):
        try:
            loader = TextLoader(txt_path, encoding="utf-8")
            documents.extend(loader.load())
            print(f"[+] Loaded Text: {os.path.basename(txt_path)}")
        except Exception as e:
            print(f"[-] Error loading TXT {txt_path}: {e}")

    # 3. Load CSV Files
    for csv_path in glob.glob(str(DATA_DIR / "**/*.csv"), recursive=True):
        try:
            loader = CSVLoader(csv_path)
            documents.extend(loader.load())
            print(f"[+] Loaded CSV: {os.path.basename(csv_path)}")
        except Exception as e:
            print(f"[-] Error loading CSV {csv_path}: {e}")

    return documents

def ingest_data():
    docs = load_all_documents()
    if not docs:
        print("[-] No documents found to ingest. Add files to the data/ folder first.")
        return

    print(f"[*] Total raw documents loaded: {len(docs)}")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(docs)
    print(f"[*] Split into {len(chunks)} chunks.")

    print("[*] Initializing embedding model...")
    # Safe fallback configuration for embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )

    print(f"[*] Storing embeddings into ChromaDB at: {CHROMA_PERSIST_DIR}")
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_PERSIST_DIR)
    )

    print("[✔] Data Ingestion Completed Successfully! Vector database is ready.")

if __name__ == "__main__":
    ingest_data()