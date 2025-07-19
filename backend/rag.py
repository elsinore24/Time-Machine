# RAG (Retrieval Augmented Generation) implementation with LangChain
import logging
from typing import Dict, List, Optional
import uuid
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.memory import ConversationBufferMemory
from langchain_community.callbacks import get_openai_callback
from huggingface_hub import snapshot_download

# Import local modules
from config import config
from prompts import SYSTEM_PROMPT, RAG_PROMPT_TEMPLATE, get_few_shot_examples

# Set up logging
logger = logging.getLogger(__name__)

class RAGChain:
    """RAG chain for 1980s Time Machine chatbot"""
    
    def __init__(self):
        self.embedding_model = None
        self.pinecone_index = None
        self.llm = None
        self.memories = {}  # Store conversation memories by session_id
        
    async def initialize(self):
        """Initialize all components"""
        try:
            # Initialize embedding model
            logger.info("Initializing embedding model...")
            model_path = snapshot_download(repo_id='sentence-transformers/all-mpnet-base-v2')
            self.embedding_model = SentenceTransformer(model_path)
            
            # Initialize Pinecone
            logger.info("Initializing Pinecone...")
            pc = Pinecone(api_key=config.PINECONE_API_KEY)
            self.pinecone_index = pc.Index(config.PINECONE_INDEX_NAME)
            
            # Initialize LLM
            logger.info("Initializing OpenAI LLM...")
            self.llm = ChatOpenAI(
                model=config.OPENAI_MODEL,
                temperature=0.8,  # Higher temperature for more creative responses
                openai_api_key=config.OPENAI_API_KEY
            )
            
            logger.info("RAG chain initialized successfully!")
            
        except Exception as e:
            logger.error(f"Failed to initialize RAG chain: {str(e)}")
            raise
    
    def retrieve_context(self, query: str, top_k: int = 5) -> List[Dict]:
        """Retrieve relevant context from Pinecone"""
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.encode(query).tolist()
            
            # Query Pinecone
            results = self.pinecone_index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
            
            # Extract relevant context
            contexts = []
            for match in results['matches']:
                if match['score'] > 0.7:  # Only include relevant matches
                    metadata = match.get('metadata', {})
                    contexts.append({
                        'id': match['id'],
                        'text': metadata.get('text', ''),
                        'category': metadata.get('category', ''),
                        'score': match['score']
                    })
            
            return contexts
            
        except Exception as e:
            logger.error(f"Error retrieving context: {str(e)}")
            return []
    
    def format_context(self, contexts: List[Dict]) -> str:
        """Format retrieved contexts for the prompt"""
        if not contexts:
            return "No specific 1980s context available for this query."
        
        formatted_contexts = []
        for ctx in contexts:
            category = ctx.get('category', 'general')
            text = ctx.get('text', '')
            formatted_contexts.append(f"[{category.upper()}] {text}")
        
        return "\n\n".join(formatted_contexts)
    
    def get_or_create_memory(self, session_id: Optional[str]) -> ConversationBufferMemory:
        """Get or create conversation memory for a session"""
        if not session_id:
            session_id = str(uuid.uuid4())
        
        if session_id not in self.memories:
            self.memories[session_id] = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
        
        return self.memories[session_id], session_id
    
    async def get_response(self, query: str, session_id: Optional[str] = None) -> Dict:
        """Get AI response with RAG enhancement"""
        try:
            # Get or create memory
            memory, session_id = self.get_or_create_memory(session_id)
            
            # Retrieve relevant context
            contexts = self.retrieve_context(query)
            formatted_context = self.format_context(contexts)
            
            # Create system message with context
            system_message = SystemMessage(
                content=SYSTEM_PROMPT.format(context=formatted_context)
            )
            
            # Create human message
            human_message = HumanMessage(content=query)
            
            # Get few-shot examples for better responses
            few_shot_examples = get_few_shot_examples()
            
            # Construct full prompt
            full_prompt = RAG_PROMPT_TEMPLATE.format(
                context=formatted_context,
                query=query
            )
            
            # Get response from LLM with token tracking
            with get_openai_callback() as cb:
                messages = [system_message, HumanMessage(content=full_prompt)]
                response = await self.llm.agenerate([messages])
                
                # Log token usage for cost monitoring
                logger.info(f"Tokens used: {cb.total_tokens} (${cb.total_cost:.4f})")
            
            # Extract response text
            response_text = response.generations[0][0].text
            
            # Save to memory
            memory.save_context({"input": query}, {"output": response_text})
            
            # Prepare sources for response
            sources = [
                {
                    "id": ctx.get('id'),
                    "text": ctx.get('text')[:100] + "...",
                    "category": ctx.get('category')
                }
                for ctx in contexts[:3]  # Only include top 3 sources
            ]
            
            return {
                "response": response_text,
                "session_id": session_id,
                "sources": sources
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            # Fallback response
            return {
                "response": "Oh wow, like, totally sorry but my brain just went all fuzzy! It's like when the tracking on your VHS tape gets all wonky. Can you, like, ask me that again? Maybe in a different way?",
                "session_id": session_id or str(uuid.uuid4()),
                "sources": []
            }
    
    def clear_session_memory(self, session_id: str):
        """Clear memory for a specific session"""
        if session_id in self.memories:
            del self.memories[session_id]
            logger.info(f"Cleared memory for session: {session_id}")
