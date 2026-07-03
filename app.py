import io

from flask import Flask, request, jsonify, send_file, send_from_directory
import pandas as pd

from cleaning import clean_dataframe

app = Flask(__name__)


def load_uploaded_dataframe():
    """Read the uploaded CSV into a DataFrame.

    Returns (df, None) on success or (None, error_response) if the file is
    missing or unparseable, ready to be returned directly from a route.
    """
    if 'csvFile' not in request.files:
        return None, (jsonify({"error": "Aucun fichier reçu (champ 'csvFile' manquant)."}), 400)

    uploaded_file = request.files['csvFile']

    try:
        return pd.read_csv(uploaded_file, dtype=str), None
    except (pd.errors.ParserError, UnicodeDecodeError) as exc:
        app.logger.warning("Failed to parse uploaded CSV: %s", exc)
        return None, (jsonify({"error": f"Impossible de lire le fichier CSV : {exc}"}), 400)


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/clean', methods=['POST'])
def clean():
    df, error = load_uploaded_dataframe()
    if error:
        return error

    before = df.head(5).fillna("").to_dict(orient='records')
    cleaned_df, stats = clean_dataframe(df)
    after = cleaned_df.head(5).fillna("").to_dict(orient='records')

    return jsonify({
        "before": before,
        "after": after,
        "stats": stats,
    })


@app.route('/download', methods=['POST'])
def download():
    df, error = load_uploaded_dataframe()
    if error:
        return error

    cleaned_df, _ = clean_dataframe(df)

    # BOM so Excel on Windows (the client's likely tool) detects UTF-8
    # instead of showing garbled accents.
    buffer = io.BytesIO(cleaned_df.to_csv(index=False).encode('utf-8-sig'))

    return send_file(
        buffer,
        mimetype='text/csv',
        as_attachment=True,
        download_name='contacts_nettoyes.csv',
    )


if __name__ == '__main__':
    app.run(debug=True)
