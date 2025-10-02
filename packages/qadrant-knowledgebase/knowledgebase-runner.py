import os, re, sys, uuid
from typing import List, Dict, Tuple
from pypdf import PdfReader
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from openai import OpenAI


# Configuration - Use environment variables for security
QDRANT_URL = os.getenv("QDRANT_URL", "https://your-qdrant-url.com")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "your-qdrant-api-key")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key")
# ---------- Config ----------
COLLECTION = os.getenv("QDRANT_COLLECTION", "getluna")
EMB_MODEL  = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")  # 1536 dims
MODEL_DIMS = {
    "text-embedding-3-small": 1536,
    "text-embedding-3-large": 3072,
}

def get_embedding_size(model_name: str) -> int:
    """Return the dimension size of the embedding model."""
    return MODEL_DIMS.get(model_name, 1536)

# -----------------------------

# Inicializar OpenAI con API key

client_ai = OpenAI(api_key=OPENAI_API_KEY)

# Función para obtener embeddings usando la API de OpenAI
def get_embedding(text: str, model: str = EMB_MODEL) -> List[float]:
    """
    Genera un embedding para el texto dado.
    """
    try:
        response = client_ai.embeddings.create(
            input=text,
            model=model
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"⚠️  Error al generar embedding: {e}")
        return []

# Función para cargar y procesar el archivo de FAQ
def load_faq_from_txt(file_path: str) -> List[Dict[str, str]]:
    """
    Carga un archivo TXT de FAQ y lo convierte en una lista de documentos.
    Asume que las preguntas empiezan con 'Q:' y las respuestas con 'A:'
    """
    documents = []
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

            # Dividir por preguntas
            qa_pairs = re.split(r'\n(?=Q:)', content)

            for pair in qa_pairs:
                if 'Q:' in pair and 'A:' in pair:
                    lines = pair.strip().split('\n')
                    question = ""
                    answer = ""
                    current_section = None

                    for line in lines:
                        if line.startswith('Q:'):
                            question = line[2:].strip()
                            current_section = 'question'
                        elif line.startswith('A:'):
                            answer = line[2:].strip()
                            current_section = 'answer'
                        else:
                            if current_section == 'answer':
                                answer += ' ' + line.strip()

                    if question and answer:
                        documents.append({
                            'question': question,
                            'answer': answer.strip(),
                            'content': f"Question: {question}\n\nAnswer: {answer.strip()}",
                            'type': 'faq'
                        })

        print(f"✅ Se cargaron {len(documents)} pares de Q&A del archivo")
        return documents

    except Exception as e:
        print(f"⚠️  Error al cargar el archivo: {e}")
        return []

# Función para procesar archivos PDF
def load_documents_from_pdf(file_path: str) -> List[Dict[str, str]]:
    """
    Carga y procesa un archivo PDF dividiéndolo en chunks.
    """
    documents = []
    try:
        reader = PdfReader(file_path)

        for page_num, page in enumerate(reader.pages):
            text = page.extract_text()

            if text.strip():
                # Dividir el texto en chunks de aproximadamente 500 caracteres
                chunks = [text[i:i+500] for i in range(0, len(text), 400)]

                for chunk_num, chunk in enumerate(chunks):
                    if chunk.strip():
                        documents.append({
                            'content': chunk.strip(),
                            'page': page_num + 1,
                            'chunk': chunk_num + 1,
                            'type': 'pdf',
                            'source': os.path.basename(file_path)
                        })

        print(f"✅ Se procesaron {len(documents)} chunks del PDF")
        return documents

    except Exception as e:
        print(f"⚠️  Error al procesar el PDF: {e}")
        return []

def validate_embeddings(embeddings: List[float], expected_size: int) -> bool:
    """
    Valida que los embeddings tengan el tamaño correcto.
    """
    if not embeddings:
        return False
    if len(embeddings) != expected_size:
        print(f"⚠️  Tamaño de embedding incorrecto: {len(embeddings)} vs esperado {expected_size}")
        return False
    return True

# -----------------------------
# MAIN
# -----------------------------

def main():
    print("\n" + "="*50)
    print("🚀 Luna FAQ Knowledge Base Uploader")
    print("="*50 + "\n")

    # Verificar configuración
    if "your-" in QDRANT_URL or "your-" in QDRANT_API_KEY or "your-" in OPENAI_API_KEY:
        print("⚠️  ERROR: Por favor configura las variables de entorno:")
        print("   - QDRANT_URL")
        print("   - QDRANT_API_KEY")
        print("   - OPENAI_API_KEY")
        sys.exit(1)

    # Conectar a Qdrant
    print("📡 Conectando a Qdrant...")
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

    # Verificar/crear colección
    embedding_size = get_embedding_size(EMB_MODEL)
    print(f"📏 Usando modelo {EMB_MODEL} con dimensión {embedding_size}")

    try:
        # Verificar si la colección existe
        collections = client.get_collections().collections
        collection_names = [c.name for c in collections]

        if COLLECTION in collection_names:
            print(f"📦 Colección '{COLLECTION}' ya existe")

            # Preguntar si quiere recrearla
            response = input("¿Deseas recrear la colección? (esto borrará todos los datos existentes) [y/N]: ")
            if response.lower() == 'y':
                client.delete_collection(COLLECTION)
                print(f"🗑️  Colección eliminada")

                # Recrear
                client.create_collection(
                    collection_name=COLLECTION,
                    vectors_config=VectorParams(size=embedding_size, distance=Distance.COSINE)
                )
                print(f"✅ Colección '{COLLECTION}' recreada")
        else:
            # Crear nueva colección
            client.create_collection(
                collection_name=COLLECTION,
                vectors_config=VectorParams(size=embedding_size, distance=Distance.COSINE)
            )
            print(f"✅ Colección '{COLLECTION}' creada")

    except Exception as e:
        print(f"⚠️  Error al manejar la colección: {e}")
        sys.exit(1)

    # Cargar documentos
    all_documents = []

    # 1. Cargar FAQ desde archivo TXT
    faq_file = "faq.txt"  # Ajusta esta ruta según tu archivo
    if os.path.exists(faq_file):
        print(f"\n📄 Cargando FAQ desde {faq_file}...")
        faq_docs = load_faq_from_txt(faq_file)
        all_documents.extend(faq_docs)

    # 2. Opcional: Cargar PDFs
    pdf_files = []  # Agrega aquí las rutas de tus PDFs si tienes
    for pdf_file in pdf_files:
        if os.path.exists(pdf_file):
            print(f"\n📑 Procesando PDF: {pdf_file}...")
            pdf_docs = load_documents_from_pdf(pdf_file)
            all_documents.extend(pdf_docs)

    if not all_documents:
        print("⚠️  No se encontraron documentos para procesar")
        sys.exit(1)

    print(f"\n📊 Total de documentos a procesar: {len(all_documents)}")

    # Generar embeddings y preparar puntos
    print("\n🔄 Generando embeddings...")
    points = []
    failed_count = 0

    for idx, doc in enumerate(all_documents):
        try:
            # Generar embedding
            content = doc.get('content', '')
            if not content:
                continue

            embedding = get_embedding(content)

            # Validar embedding
            if not validate_embeddings(embedding, embedding_size):
                failed_count += 1
                continue

            # Crear punto para Qdrant
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload=doc
            )
            points.append(point)

            # Mostrar progreso
            if (idx + 1) % 10 == 0:
                print(f"   Procesados {idx + 1}/{len(all_documents)} documentos...")

        except Exception as e:
            print(f"⚠️  Error procesando documento {idx}: {e}")
            failed_count += 1

    print(f"✅ Embeddings generados: {len(points)} exitosos, {failed_count} fallidos")

    # Subir a Qdrant
    if points:
        print(f"\n📤 Subiendo {len(points)} puntos a Qdrant...")
        try:
            # Subir en batches para evitar timeouts
            batch_size = 100
            for i in range(0, len(points), batch_size):
                batch = points[i:i+batch_size]
                client.upsert(
                    collection_name=COLLECTION,
                    points=batch
                )
                print(f"   Batch {i//batch_size + 1}/{(len(points)-1)//batch_size + 1} completado")

            print(f"✅ ¡Todos los documentos han sido subidos exitosamente!")

            # Verificar
            collection_info = client.get_collection(COLLECTION)
            print(f"\n📊 Estado final de la colección:")
            print(f"   - Nombre: {COLLECTION}")
            print(f"   - Vectores: {collection_info.vectors_count}")
            print(f"   - Puntos: {collection_info.points_count}")

        except Exception as e:
            print(f"⚠️  Error al subir a Qdrant: {e}")

    print("\n" + "="*50)
    print("✨ Proceso completado")
    print("="*50 + "\n")

if __name__ == "__main__":
    main()