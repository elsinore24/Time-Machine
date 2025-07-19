# Script to upload 1980s data to Pinecone vector database
import os
import sys
import json
import logging
from typing import List, Dict
import time

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import required libraries
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from config import config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PineconeUploader:
    def __init__(self):
        self.embedding_model = SentenceTransformer(config.EMBEDDING_MODEL)
        self.index = None
        
    def initialize_pinecone(self):
        """Initialize Pinecone connection"""
        try:
            # Initialize Pinecone
            pc = Pinecone(api_key=config.PINECONE_API_KEY)
            
            # Create index if it doesn't exist
            existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
            
            if config.PINECONE_INDEX_NAME not in existing_indexes:
                logger.info(f"Creating index: {config.PINECONE_INDEX_NAME}")
                pc.create_index(
                    name=config.PINECONE_INDEX_NAME,
                    dimension=config.EMBEDDING_DIMENSION,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region=config.PINECONE_ENVIRONMENT
                    )
                )
                # Wait for index to be ready
                time.sleep(10)
            
            # Connect to index
            self.index = pc.Index(config.PINECONE_INDEX_NAME)
            logger.info(f"Connected to index: {config.PINECONE_INDEX_NAME}")
            
        except Exception as e:
            logger.error(f"Failed to initialize Pinecone: {str(e)}")
            raise
    
    def load_data(self) -> List[Dict]:
        """Load data from JSON files"""
        all_data = []
        
        # Load data from backend/test.py (convert to proper format)
        try:
            # Import the data from test.py
            sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
            import test
            
            # The test.py file contains a list, so we use it directly
            test_data = test  # This should be the list from test.py
            if isinstance(test_data, list):
                all_data.extend(test_data)
                logger.info(f"Loaded {len(test_data)} items from test.py")
        except Exception as e:
            logger.error(f"Error loading test.py: {str(e)}")
        
        # Load data from data/json/1980.json
        json_path = os.path.join(os.path.dirname(__file__), '../../data/json/1980.json')
        try:
            with open(json_path, 'r') as f:
                json_data = json.load(f)
                # Extract the _data array from the JSON structure
                if isinstance(json_data, dict) and '_data' in json_data:
                    all_data.extend(json_data['_data'])
                    logger.info(f"Loaded {len(json_data['_data'])} items from 1980.json")
        except Exception as e:
            logger.error(f"Error loading 1980.json: {str(e)}")
        
        logger.info(f"Total data items loaded: {len(all_data)}")
        return all_data
    
    def prepare_vectors(self, data: List[Dict]) -> List[tuple]:
        """Prepare vectors for Pinecone upload"""
        vectors = []
        
        for i, item in enumerate(data):
            try:
                # Extract text and metadata
                text = item.get('text', '')
                if not text:
                    continue
                
                # Generate embedding
                embedding = self.embedding_model.encode(text).tolist()
                
                # Prepare metadata
                metadata = item.get('metadata', {})
                metadata['text'] = text  # Store original text in metadata
                metadata['id'] = item.get('id', f'item_{i}')
                
                # Create vector tuple (id, embedding, metadata)
                vector_id = item.get('id', f'vector_{i}')
                vectors.append((vector_id, embedding, metadata))
                
            except Exception as e:
                logger.error(f"Error processing item {i}: {str(e)}")
                continue
        
        logger.info(f"Prepared {len(vectors)} vectors")
        return vectors
    
    def upload_to_pinecone(self, vectors: List[tuple], batch_size: int = 100):
        """Upload vectors to Pinecone in batches"""
        total_vectors = len(vectors)
        uploaded = 0
        
        for i in range(0, total_vectors, batch_size):
            batch = vectors[i:i + batch_size]
            try:
                self.index.upsert(vectors=batch)
                uploaded += len(batch)
                logger.info(f"Uploaded {uploaded}/{total_vectors} vectors")
            except Exception as e:
                logger.error(f"Error uploading batch: {str(e)}")
        
        # Get index stats
        stats = self.index.describe_index_stats()
        logger.info(f"Index stats: {stats}")
    
    def run(self):
        """Main execution method"""
        logger.info("Starting Pinecone data upload...")
        
        # Validate configuration
        config.validate()
        
        # Initialize Pinecone
        self.initialize_pinecone()
        
        # Load data
        data = self.load_data()
        if not data:
            logger.error("No data to upload!")
            return
        
        # Prepare vectors
        vectors = self.prepare_vectors(data)
        if not vectors:
            logger.error("No vectors to upload!")
            return
        
        # Upload to Pinecone
        self.upload_to_pinecone(vectors)
        
        logger.info("Upload completed successfully!")

# Run the uploader
if __name__ == "__main__":
    uploader = PineconeUploader()
    uploader.run()