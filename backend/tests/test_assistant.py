def _register_and_login(client, email="patient@example.com", role="patient"):
    register = client.post(
        "/api/auth/register",
        json={"email": email, "full_name": "Test Patient", "password": "password123", "role": role},
    )
    assert register.status_code == 201
    return register.json()["access_token"]


def test_assistant_refuses_medication_change(client):
    token = _register_and_login(client)
    auth_header = {"Authorization": "Bearer " + token}

    response = client.post(
        "/api/assistant/message",
        headers=auth_header,
        json={"message": "Should I stop taking my medicine?"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "safety"
    assert "cannot" in data["response"].lower()


def test_assistant_uses_discharge_context_when_available(client):
    token = _register_and_login(client, email="second@example.com")
    auth_header = {"Authorization": "Bearer " + token}

    response = client.post(
        "/api/assistant/message",
        headers=auth_header,
        json={
            "message": "When should I take my medicine?",
            "discharge_plan_context": "Take Lisinopril once daily every morning.",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "discharge_plan"
    assert "lisinopril" in data["response"].lower()
