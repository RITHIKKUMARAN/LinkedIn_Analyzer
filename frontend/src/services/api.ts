const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
    getPage: async (pageId: string) => {
        const response = await fetch(`${API_URL}/api/v1/pages/${pageId}`);
        if (!response.ok) {
            throw new Error('Page not found or failed to fetch');
        }
        return response.json();
    },

    // Placeholder for search if needed
    searchPages: async () => {
        return [];
    }
};
