from flask import Flask, request, jsonify, send_from_directory
import pandas as pd

from cleaning import clean_dataframe

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/clean', methods=['POST'])
def clean():
    if 'csvFile' not in request.files:
        return jsonify({"error": "Aucun fichier reçu (champ 'csvFile' manquant)."}), 400

    uploaded_file = request.files['csvFile']

    try:
        df = pd.read_csv(uploaded_file, dtype=str)
    except (pd.errors.ParserError, UnicodeDecodeError) as exc:
        app.logger.warning("Failed to parse uploaded CSV: %s", exc)
        return jsonify({"error": f"Impossible de lire le fichier CSV : {exc}"}), 400

    before = df.head(5).fillna("").to_dict(orient='records')
    cleaned_df, stats = clean_dataframe(df)
    after = cleaned_df.head(5).fillna("").to_dict(orient='records')

    return jsonify({
        "before": before,
        "after": after,
        "stats": stats,
    })

if __name__ == '__main__':
    app.run(debug=True)