import os
import json
import numpy as np
from dotenv import load_dotenv
from qiskit import QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService, Session, SamplerV2

# Load environment variables
load_dotenv()

CACHE_FILE = "quantum_cache.json"
MAX_CACHE_SIZE = 100
REFILL_THRESHOLD = 10
BATCH_SIZE = 100

def get_quantum_numbers(count):
    """
    Finds the least busy operational physical quantum computer, runs a circuit 
    consisting of 8 qubits in superposition (Hadamard gates) measured to output 
    an 8-bit number (0-255), and returns the results.
    """
    token = os.getenv("IBMQ_API_KEY")
    if not token or token == "YOUR_IBM_QUANTUM_API_TOKEN_HERE":
        raise ValueError("Error: IBMQ_API_KEY not set in .env file.")

    # Initialize connection to IBM Quantum Runtime Services
    service = QiskitRuntimeService(channel="ibm_quantum_platform", token=token)
    
    print("Querying available IBM Quantum systems...")
    # Find all operational real hardware systems
    backends = service.backends(simulator=False, operational=True)
    
    if not backends:
        raise RuntimeError("No operational physical quantum computers found.")
        
    # Select the system that is active and has the least queue depth (pending_jobs)
    least_busy = min(backends, key=lambda b: b.status().pending_jobs)
    print(f"Selected System: {least_busy.name}")
    print(f"Queue Size: {least_busy.status().pending_jobs} pending jobs")
    
    # 8 qubits are required to represent 0-255 options
    num_qubits = 8
    qc = QuantumCircuit(num_qubits, num_qubits)
    
    # Put all qubits into equal superposition (50/50 probability)
    for q in range(num_qubits):
        qc.h(q)
        
    # Measure all qubits
    qc.measure(range(num_qubits), range(num_qubits))
    
    # Transpile the circuit for the targeted quantum computer
    target_circuit = transpile(qc, backend=least_busy)
    
    print(f"Submitting job for {count} random rounds to {least_busy.name}...")
    
    # We do rejection sampling because we need numbers in range 0-215 (total 216 combinations).
    # To get `count` valid numbers, we request slightly more shots (e.g. count * 1.3)
    shots_needed = int(count * 1.3)
    
    results_list = []
    
    # Run Sampler on the selected backend
    sampler = SamplerV2(mode=least_busy)
    job = sampler.run([(target_circuit,)], shots=shots_needed)
    result = job.result()
    
    # Get classical output counts
    data = result[0].data
    bitstrings = data.c.get_bitstrings()
    
    # Parse binary bitstrings to integers and filter outcomes
    for bits in bitstrings:
        val = int(bits, 2)
        if val < 216: # Keep valid combinations (0 to 215)
            results_list.append(val)
            if len(results_list) >= count:
                break
                    
    import datetime
    stats = {
        "last_api_call": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "last_backend_used": least_busy.name
    }
    with open("quantum_stats.json", "w") as f:
        json.dump(stats, f)

    print(f"Successfully generated {len(results_list)} quantum outcomes.")
    return results_list

def manage_cache():
    """
    Checks if cache file exists and how many numbers remain. 
    Refills the cache if count falls below the threshold.
    """
    cache = []
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                cache = json.load(f)
        except Exception:
            cache = []

    print(f"Current Quantum Cache: {len(cache)} rounds remaining.")

    if len(cache) < REFILL_THRESHOLD:
        try:
            # We want to fill the cache up to 100, so we fetch BATCH_SIZE (100) new rounds
            new_numbers = get_quantum_numbers(BATCH_SIZE)
            cache.extend(new_numbers)
            
            # Clamp the cache size to maximum 100 rounds
            cache = cache[:MAX_CACHE_SIZE]
            
            with open(CACHE_FILE, "w") as f:
                json.dump(cache, f)
            print(f"Cache successfully refilled. Now has {len(cache)} rounds.")
        except Exception as e:
            print(f"Failed to generate quantum random numbers: {e}")

if __name__ == "__main__":
    manage_cache()
