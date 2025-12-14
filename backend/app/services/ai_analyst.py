import google.generativeai as genai
import os
import logging
import asyncio

logger = logging.getLogger(__name__)

class AiAnalyst:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        self.fallback_mode = False
        
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found. AI Analyst will use fallback mode.")
            self.fallback_mode = True
            return
            
        try:
            genai.configure(api_key=self.api_key)
            
            # List available models
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            logger.info(f"Available Gemini Models: {available_models}")
            
            if not available_models:
                logger.error("No Gemini models available for this API key. Using fallback mode.")
                self.fallback_mode = True
                return
            
            # Use the first available model
            self.model_name = available_models[0]
            self.model = genai.GenerativeModel(self.model_name)
            logger.info(f"AI Analyst initialized with model: {self.model_name}")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}. Using fallback mode.", exc_info=True)
            self.fallback_mode = True

    async def generate_response(self, context_data: dict, user_query: str) -> str:
        # Fallback mode - provide helpful canned responses
        if self.fallback_mode or not self.model:
            company_name = context_data.get('name', 'this company')
            query_lower = user_query.lower()
            
            # Intelligent fallback based on query keywords
            if any(word in query_lower for word in ['what', 'who', 'describe']):
                return f"Based on the available data, {company_name} operates in the {context_data.get('industry', 'technology')} sector with {context_data.get('follower_count', 0):,} followers on LinkedIn. {context_data.get('description', 'This company is actively building its presence on LinkedIn.')} For deeper AI-powered analysis, please configure a valid Gemini API key."
            
            elif any(word in query_lower for word in ['growth', 'strategy', 'future']):
                return f"{company_name}'s LinkedIn presence shows {context_data.get('follower_count', 0):,} followers, suggesting {'strong' if context_data.get('follower_count', 0) > 10000 else 'growing'} brand awareness. To unlock AI-powered growth predictions and strategic insights, please configure a valid Gemini API key."
            
            elif any(word in query_lower for word in ['post', 'content', 'engage']):
                post_count = len(context_data.get('posts', []))
                return f"I can see {post_count} recent posts from {company_name}. For AI-powered content analysis and engagement insights, please configure a valid Gemini API key. In the meantime, you can review the posts manually in the dashboard above."
            
            else:
                return f"I'd love to provide deeper insights about {company_name}, but I'm currently running in fallback mode. The data shows: {context_data.get('follower_count', 0):,} followers, {context_data.get('industry', 'N/A')} industry. For AI-powered analysis, please configure a valid Gemini API key in your backend .env file."

        # Original Gemini API logic
        company_name = context_data.get('name', 'this company')
        
        prompt = f"""
        You are an elite Business Analyst AI for LinkedIn data.
        
        Current Company Context:
        Name: {company_name}
        Description: {context_data.get('description')}
        Industry: {context_data.get('industry')}
        Followers: {context_data.get('follower_count')}
        Headcount: {context_data.get('head_count')}
        Website: {context_data.get('website')}
        
        Recent Posts: {str(context_data.get('posts', [])[:3])}
        
        User Query: {user_query}
        
        Provide a concise, professional, and insightful answer. If data is missing (like posts or employees), offer to hypothesize based on the industry and description, but clearly state it's an estimation. 
        Focus on business strategy, brand presence, and growth interpretation.
        Keep the response under 150 words unless asked for a detailed report.
        """
        
        try:
            # Run synchronous Gemini call in thread pool to avoid blocking event loop
            logger.info(f"Sending query to Gemini: {user_query[:50]}...")
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            logger.info("Gemini response received successfully")
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Error: {e}", exc_info=True)
            # Return fallback response instead of error message
            return f"I encountered a temporary issue accessing my AI processor. However, based on the data: {company_name} has {context_data.get('follower_count', 0):,} followers in the {context_data.get('industry', 'technology')} industry. {context_data.get('description', '')} Please try asking again or check the backend logs for details."
