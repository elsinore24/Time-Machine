# Test script for embeddings and Pinecone queries
import os
import sys
import logging

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import required libraries
import pinecone
from sentence_transformers import SentenceTransformer
from config import config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_embeddings():
    """Test embedding generation"""
    logger.info("Testing embedding generation...")
    
    # Initialize embedding model
    model = SentenceTransformer(config.EMBEDDING_MODEL)
    
    # Test texts
    test_texts = [
        "What is the internet?",
        "Tell me about smartphones",
        "Explain social media",
        "What's cryptocurrency?",
        "How do electric cars work?"
    ]
    
    # Generate embeddings
    for text in test_texts:
        embedding = model.encode(text)
        logger.info(f"Text: '{text}'")
        logger.info(f"Embedding shape: {embedding.shape}")
        logger.info(f"First 5 values: {embedding[:5]}")
        logger.info("-" * 50)

def test_pinecone_query():
    """Test querying Pinecone"""
    logger.info("Testing Pinecone queries...")
    
    try:
        # Initialize Pinecone
        pinecone.init(
            api_key=config.PINECONE_API_KEY,
            environment=config.PINECONE_ENVIRONMENT
        )
        
        # Connect to index
        index = pinecone.Index(config.PINECONE_INDEX_NAME)
        
        # Get index stats
        stats = index.describe_index_stats()
        logger.info(f"Index stats: {stats}")
        
        # Initialize embedding model
        model = SentenceTransformer(config.EMBEDDING_MODEL)
        
        # Test queries
        test_queries = [
            "Tell me about 80s slang",
            "What happened in 1985?",
            "Popular music in the 1980s",
            "Reagan era politics",
            "Valley girl culture"
        ]
        
        for query in test_queries:
            logger.info(f"\nQuery: '{query}'")
            
            # Generate query embedding
            query_embedding = model.encode(query).tolist()
            
            # Query Pinecone
            results = index.query(
                vector=query_embedding,
                top_k=3,
                include_metadata=True
            )
            
            # Display results
            for match in results['matches']:
                logger.info(f"Score: {match['score']:.4f}")
                logger.info(f"ID: {match['id']}")
                if 'metadata' in match and 'text' in match['metadata']:
                    logger.info(f"Text: {match['metadata']['text'][:100]}...")
                logger.info("-" * 30)
                
    except Exception as e:
        logger.error(f"Error testing Pinecone: {str(e)}")

def main():
    """Run all tests"""
    logger.info("Starting embedding and Pinecone tests...")
    
    # Validate configuration
    try:
        config.validate()
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        return
    
    # Run tests
    test_embeddings()
    logger.info("\n" + "="*60 + "\n")
    test_pinecone_query()
    
    logger.info("\nAll tests completed!")

if __name__ == "__main__":
    main()