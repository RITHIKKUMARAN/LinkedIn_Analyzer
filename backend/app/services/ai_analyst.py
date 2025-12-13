import google.generativeai as genai
import os
import logging

logger = logging.getLogger(__name__)

class AiAnalyst:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            logger.warning("GEMINI_API_KEY not found. AI Analyst will be disabled.")
            self.model = None

    async def generate_response(self, context_data: dict, user_query: str) -> str:
        if not self.model:
            return "I'm sorry, my AI brain (Gemini API Key) is missing. Please configure it in the backend."

        # Construct prompt properly
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
            # Gemini call (synchronous, but fast enough for mock demo, or better wrap in run_in_executor if needed for high load)
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            return "I encountered an error connecting to my thought processor. Please try again later."
