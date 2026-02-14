"""
Smart Link Hub - Python URL Shortener Microservice
Uses pyshorteners to shorten URLs via TinyURL, is.gd, da.gd, etc.
Runs on port 5000 and exposes a POST /shorten endpoint.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pyshorteners

app = Flask(__name__)
CORS(app)

# Initialize the shortener
shortener = pyshorteners.Shortener()

# Supported providers mapping
PROVIDERS = {
    'tinyurl': lambda url: shortener.tinyurl.short(url),
    'isgd': lambda url: shortener.isgd.short(url),
    'dagd': lambda url: shortener.dagd.short(url),
    'clckru': lambda url: shortener.clckru.short(url),
}


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'service': 'url-shortener',
        'providers': list(PROVIDERS.keys())
    })


@app.route('/shorten', methods=['POST'])
def shorten_url():
    """
    Shorten a URL using the specified provider.
    
    Request body:
        {
            "url": "https://example.com/very/long/url",
            "provider": "tinyurl"  // optional, defaults to "tinyurl"
        }
    
    Response:
        {
            "short_url": "https://tinyurl.com/abc123",
            "original_url": "https://example.com/very/long/url",
            "provider": "tinyurl"
        }
    """
    data = request.get_json()

    if not data or 'url' not in data:
        return jsonify({'error': 'Missing required field: url'}), 400

    url = data['url'].strip()
    provider = data.get('provider', 'tinyurl').lower().strip()

    # Validate URL
    if not url.startswith(('http://', 'https://')):
        return jsonify({'error': 'Invalid URL. Must start with http:// or https://'}), 400

    # Validate provider
    if provider not in PROVIDERS:
        return jsonify({
            'error': f'Unsupported provider: {provider}',
            'supported_providers': list(PROVIDERS.keys())
        }), 400

    try:
        short_url = PROVIDERS[provider](url)
        return jsonify({
            'short_url': short_url,
            'original_url': url,
            'provider': provider
        })
    except Exception as e:
        # If the requested provider fails, try TinyURL as a fallback
        if provider != 'tinyurl':
            try:
                short_url = PROVIDERS['tinyurl'](url)
                return jsonify({
                    'short_url': short_url,
                    'original_url': url,
                    'provider': 'tinyurl',
                    'note': f'{provider} failed, fell back to tinyurl'
                })
            except Exception as fallback_error:
                return jsonify({
                    'error': f'All shortening services failed: {str(fallback_error)}'
                }), 502

        return jsonify({
            'error': f'Failed to shorten URL: {str(e)}'
        }), 502


@app.route('/expand', methods=['POST'])
def expand_url():
    """
    Expand a shortened URL to its original form.
    
    Request body:
        { "url": "https://tinyurl.com/abc123" }
    
    Response:
        { "original_url": "https://example.com/...", "short_url": "https://tinyurl.com/abc123" }
    """
    data = request.get_json()

    if not data or 'url' not in data:
        return jsonify({'error': 'Missing required field: url'}), 400

    url = data['url'].strip()

    try:
        # Try TinyURL expander (works for most short URLs)
        original_url = shortener.tinyurl.expand(url)
        return jsonify({
            'original_url': original_url,
            'short_url': url
        })
    except Exception as e:
        return jsonify({
            'error': f'Failed to expand URL: {str(e)}'
        }), 502


if __name__ == '__main__':
    print("\n🔗 Smart Link Hub - URL Shortener Service")
    print(f"   Supported providers: {', '.join(PROVIDERS.keys())}")
    print(f"   POST /shorten  - Shorten a URL")
    print(f"   POST /expand   - Expand a short URL")
    print(f"   GET  /health   - Health check\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
