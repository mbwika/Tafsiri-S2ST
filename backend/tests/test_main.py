# tests/test_main.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_audio_file():
    # Create a mock audio file (for testing purposes)
    with open("test_audio.wav", "wb") as f:
        f.write(b"fake audio data")
    yield "test_audio.wav"
    os.remove("test_audio.wav")

def test_translate_audio_valid(mock_audio_file):
    # Test a valid translation request
    with open(mock_audio_file, "rb") as audio_file:
        response = client.post(
            "/translate/",
            files={"file": ("test_audio.wav", audio_file, "audio/wav")},
            data={"target_language": "eng", "voice": "en-US-John"}
        )

    assert response.status_code == 200
    assert "translated_text" in response.json()
    assert "download_link" in response.json()

def test_translate_audio_invalid_language(mock_audio_file):
    # Test with an invalid target language
    with open(mock_audio_file, "rb") as audio_file:
        response = client.post(
            "/translate/",
            files={"file": ("test_audio.wav", audio_file, "audio/wav")},
            data={"target_language": "xyz", "voice": "en-US-John"}
        )

    assert response.status_code == 200
    assert response.json()["error"] == "Invalid target language. Supported languages are: ..."

def test_translate_audio_empty_target_language(mock_audio_file):
    # Test with an empty target language
    with open(mock_audio_file, "rb") as audio_file:
        response = client.post(
            "/translate/",
            files={"file": ("test_audio.wav", audio_file, "audio/wav")},
            data={"target_language": "", "voice": "en-US-John"}
        )

    assert response.status_code == 200
    assert response.json()["error"] == "Target language cannot be empty"

def test_translate_audio_file_not_found():
    # Test when the file does not exist (file upload error)
    response = client.post(
        "/translate/",
        files={"file": ("non_existent_audio.wav", "fake_audio_data", "audio/wav")},
        data={"target_language": "eng", "voice": "en-US-John"}
    )

    assert response.status_code == 500
    assert "error" in response.json()

def test_translate_audio_invalid_file_format():
    # Test with an invalid file format (non-audio file)
    response = client.post(
        "/translate/",
        files={"file": ("test_image.jpg", open("test_image.jpg", "rb"), "image/jpeg")},
        data={"target_language": "eng", "voice": "en-US-John"}
    )

    assert response.status_code == 422  # Unprocessable Entity (validation error)

def test_translate_audio_security_check():
    # Test with a potentially malicious file
    malicious_content = b"malicious content"
    response = client.post(
        "/translate/",
        files={"file": ("malicious_file.txt", malicious_content, "text/plain")},
        data={"target_language": "eng", "voice": "en-US-John"}
    )

    assert response.status_code == 422  # Expect an error due to invalid file type
    assert "error" in response.json()
    assert "Invalid file" in response.json()["error"]

