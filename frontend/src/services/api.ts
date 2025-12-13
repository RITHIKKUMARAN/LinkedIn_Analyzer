const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
    getPage: async (pageId: string) => {
        const response = await fetch(`${API_URL}/api/v1/pages/${pageId}`);
        if (!response.ok) {
            throw new Error('Page not found or failed to fetch');
        }
        return response.json();
    },

    // Search pages with filters
    searchPages: async (filters: { name?: string, industry?: string, min_followers?: number, max_followers?: number }) => {
        // Clean undefined filters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') params.append(key, value.toString());
        });

        const response = await fetch(`${API_URL}/api/v1/pages/search?${params.toString()}`);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    },

    // Get paginated posts for a page
    getPagePosts: async (pageId: string, skip = 0, limit = 20) => {
        const response = await fetch(`${API_URL}/api/v1/pages/${pageId}/posts?skip=${skip}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    // Get comments for a post
    getPostComments: async (postId: string, skip = 0, limit = 20) => {
        const response = await fetch(`${API_URL}/api/v1/posts/${postId}/comments?skip=${skip}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    chatWithAnalyst: async (pageId: string, message: string) => {
        const response = await fetch(`${API_URL}/api/v1/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page_id: pageId, message })
        });
        if (!response.ok) throw new Error('Chat failed');
        return response.json();
    }
};
