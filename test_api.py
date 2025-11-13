import requests
import json
import time

API_URL = "http://127.0.0.1:5000/check_url"

TEST_PAYLOADS_ALERTA = {"url": "http://g0ogle.com"}
TEST_PAYLOADS_OK = {"url": "http://microsoft.com"}

def run_test(payload):
    url_tested = payload.get('url', 'N/A')
    print(f"\n--- Testando URL: {url_tested}")

    try:
        response = requests.post(API_URL, json=payload, timeout=5)
        response.raise_for_status()

        print(f"Status HTTP: {response.status_code}")
        print("JSON de Resposta Recebido:")
        print(json.dumps(response.json(), indent=4))

    except requests.exceptions.ConnectionError:
        print("\nERRO: Não foi possível conectar ao servidor.")
        print("Verifique se o seu servidor 'app.py' está rodando em outro terminal.")
    except requests.exceptions.HTTPError as http_err:
        # http_err pode não conter o código se response for None, por isso mostramos a mensagem
        print(f"\nERRO HTTP: O servidor retornou um erro: {http_err}")
    except Exception as e:
        print(f"\nERRO INESPERADO: Ocorreu um erro: {e}")

if __name__ == "__main__":
    print("Iniciando testes da API. Certifique-se de que o app.py está ativo.\n")
    for payload in [TEST_PAYLOADS_ALERTA, TEST_PAYLOADS_OK]:
        time.sleep(1)
        run_test(payload)