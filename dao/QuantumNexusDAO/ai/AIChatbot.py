from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    response = generate_response(user_input)
    return jsonify({'response': response})

def generate_response(message):
    # Simple response logic
    return f"You said: {message}"

if __name__ == "__main__":
    app.run(debug=True)
