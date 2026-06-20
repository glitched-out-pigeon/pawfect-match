import pytest
from httpx import AsyncClient, ASGITransport
from main import app

BASE_URL = "https://web-production-567e4.up.railway.app"


@pytest.mark.asyncio
async def test_get_animals():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/animals/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_employees():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/employees/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_adopters():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/adopters/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_applications():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/applications/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_vet_records():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/vet-records/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_medical_records_new_endpoint():
    # Confirms the new /medical-records/ endpoint works identically to /vet-records/
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/medical-records/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_old_and_new_endpoint_return_same_data():
    # Confirms zero-downtime migration: both old and new paths serve identical data
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        old_response = await client.get("/vet-records/")
        new_response = await client.get("/medical-records/")
    assert old_response.status_code == 200
    assert new_response.status_code == 200
    assert old_response.json() == new_response.json()

@pytest.mark.asyncio
async def test_get_intake_records():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/intake-records/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_rehoming():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/rehoming/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_animal_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/animals/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_wrong_endpoint_fails():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/pets/")
    assert response.status_code == 200  

@pytest.mark.asyncio
async def test_wrong_animal_response_structure():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/animals/")
    data = response.json()
    assert len(data) > 0
    assert "owner_name" in data[0] 

@pytest.mark.asyncio
async def test_wrong_status_code_on_adopt():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as client:
        response = await client.get("/animals/")
    assert response.status_code == 201  