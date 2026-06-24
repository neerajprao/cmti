import http.server
import socketserver
import json
import os
import threading
import subprocess
import random

PORT = 8000

class QuantumServer(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/spin':
            self.handle_spin()
        elif self.path == '/api/backend_stats':
            self.handle_backend_stats()
        else:
            super().do_GET()

    def handle_backend_stats(self):
        cache_file = "quantum_cache.json"
        stats_file = "quantum_stats.json"
        
        # Read the cache
        cache = []
        if os.path.exists(cache_file):
            try:
                with open(cache_file, "r") as f:
                    cache = json.load(f)
            except Exception:
                cache = []

        # Read the stats
        stats = {
            "last_api_call": "Never",
            "last_backend_used": "None"
        }
        if os.path.exists(stats_file):
            try:
                with open(stats_file, "r") as f:
                    stats = json.load(f)
            except Exception:
                pass

        remaining = len(cache)
        rounds_until_refill = max(0, remaining - 10)

        response = {
            "remaining_in_cache": remaining,
            "rounds_until_refill": rounds_until_refill,
            "last_api_call": stats.get("last_api_call", "Never"),
            "last_backend_used": stats.get("last_backend_used", "None")
        }

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def handle_spin(self):
        cache_file = "quantum_cache.json"
        
        # Read the cache
        cache = []
        if os.path.exists(cache_file):
            try:
                with open(cache_file, "r") as f:
                    cache = json.load(f)
            except Exception:
                cache = []

        # If cache is empty, we attempt to generate it synchronously
        if not cache:
            print("Cache empty! Triggering synchronous quantum number generation...")
            try:
                # Run quantum_rng.py blockingly to get numbers
                subprocess.run(["python", "quantum_rng.py"])
                with open(cache_file, "r") as f:
                    cache = json.load(f)
            except Exception as e:
                print(f"Failed to run quantum generation script: {e}")
                cache = []

        # If we still don't have numbers (e.g. API key missing/offline), fallback to pseudorandom
        if not cache:
            outcome_idx = random.randint(0, len(self.get_payouts_count()) - 1)
            source = "pseudorandom (fallback)"
        else:
            # Pop the first round's number (and delete it from the cache)
            outcome_idx = cache.pop(0)
            source = "quantum"
            
            # Save the updated list back to the file (deleting this round's value)
            with open(cache_file, "w") as f:
                json.dump(cache, f)

            # If cache count falls below 10, trigger background refill of 100 more
            if len(cache) < 10:
                print(f"Cache count ({len(cache)}) is below 10. Refilling in background...")
                threading.Thread(target=self.trigger_background_refill).start()

        response = {
            "outcome_index": outcome_idx,
            "source": source,
            "remaining_in_cache": len(cache)
        }

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def get_payouts_count(self):
        # A simple helper to get maximum index (216 options)
        return range(216)

    def trigger_background_refill(self):
        try:
            subprocess.run(["python", "quantum_rng.py"])
        except Exception as e:
            print(f"Background refill failed: {e}")

# Run the web server
if __name__ == "__main__":
    # Ensure current directory matches script location
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Run initial cache check to pre-populate if needed
    try:
        subprocess.run(["python", "quantum_rng.py"])
    except Exception:
        pass

    Handler = QuantumServer
    # Allow socket reuse to prevent port-in-use errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Quantum Slot Machine Server running at: http://localhost:{PORT}")
        print("Open http://localhost:8000/double_diamond_slot.html in your browser.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
