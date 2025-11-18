from flask import Flask, request, jsonify
from flask_cors import CORS
from logic import check_phishing_risk

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "API do Detector de Phishing está funcionando!"})

@app.route('/check_url', methods=['POST'])
def check_url():
    data = request.get_json()
    print("API recebeu requisição:", data)
    if not data or 'url' not in data:
        return jsonify({'status': 'error', 'message': 'URL Não fornecida.'}), 400
    input_url = data['url']
    risk_result = check_phishing_risk(input_url)
    print("API retornou:", risk_result)
    return jsonify(risk_result)

if __name__ == '__main__':
    app.run(debug=True)