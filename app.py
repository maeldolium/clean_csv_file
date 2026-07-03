from flask import Flask, request, jsonify, send_from_directory
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/preview', methods=['POST'])
def preview():
    uploaded_file = request.files['csvFile']
    
    df = pd.read_csv(uploaded_file)

    preview = df.head(5).to_dict(orient='records')

    return jsonify({
        "preview": preview  
    })

if __name__ == '__main__':
    app.run(debug=True)