import pytest
from app.services.scraper import LinkedInScraper

# Mock scraper to avoid real network calls
async def mock_scrape_page_details(self, page_id: str):
    if page_id == "notfound":
        return None
    return {
        "linkedin_id": page_id,
        "name": f"Mock {page_id}",
        "description": "A mock description",
        "website": "https://example.com",
        "industry": "Tech",
        "follower_count": 500,
        "head_count": 10,
        "profile_image_url": "https://via.placeholder.com/150"
    }

@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "LinkedIn Insights API is running"}

@pytest.mark.asyncio
async def test_get_page_lifecycle(client, monkeypatch):
    # Mock the scraper method
    monkeypatch.setattr(LinkedInScraper, "scrape_page_details", mock_scrape_page_details)
    
    # 1. First fetch (should trigger scrape)
    response = await client.get("/api/v1/pages/test-company")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Mock test-company"
    assert data["id"] is not None
    
    # 2. Second fetch (should come from DB)
    # We can verify by Monkeypatching to error/different value? 
    # Or just trusting the ID remains same.
    first_id = data["id"]
    
    response_2 = await client.get("/api/v1/pages/test-company")
    assert response_2.status_code == 200
    data_2 = response_2.json()
    assert data_2["id"] == first_id

@pytest.mark.asyncio
async def test_get_page_not_found(client, monkeypatch):
    monkeypatch.setattr(LinkedInScraper, "scrape_page_details", mock_scrape_page_details)
    response = await client.get("/api/v1/pages/notfound")
    assert response.status_code == 404
