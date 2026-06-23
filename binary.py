import os
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
from qiskit import QuantumCircuit

# 1. Initialize hardware connection
service = QiskitRuntimeService()
backend = service.backend("ibm_marrakesh")

# Initialize SamplerV2 globally without using a Session context
sampler = SamplerV2(mode=backend)

# 2. Build standard 1-qubit hardware coin-flip circuit
qc = QuantumCircuit(1, 1)
qc.h(0)            # 50/50 superposition
qc.measure(0, 0)   # Collapses to a true physical random 0 or 1

# 3. Setup loop parameters (4,096 shots * 245 iterations = 1,003,520 bits)
shots_per_job = 4096
total_iterations = 245
master_bitstream = []

print(f"Initiating hardware streaming on {backend.name}...")
print("Gathering 1,000,000 true quantum bits via the standard open queue...")

for i in range(total_iterations):
    # Submit standard individual job requests directly to the open queue
    job = sampler.run([qc], shots=shots_per_job)
    result = job.result()
    
    # Extract bit results from the classical register buffer
    pub_result = result[0]
    reg_name = list(pub_result.data.keys())[0]
    raw_bits = pub_result.data[reg_name].get_bitstrings()
    
    master_bitstream.extend(raw_bits)
    
    current_bits = len(master_bitstream) * len(raw_bits[0])
    print(f"Progress: {(current_bits / 1000000) * 100:.1f}% Complete ({current_bits} bits gathered)")

# 4. Concatenate and write stream to your desktop
final_string = "".join(master_bitstream)
output_path = "/Users/neerajprao/Desktop/cmti/quantum_million_bits.txt"

os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w") as f:
    f.write(final_string)

print("\n" + "=" * 60)
print(f"SUCCESS: 1,000,000+ Bit Quantum Stream Written!")
print(f"Total Exact Bits Extracted: {len(final_string)}")
print(f"File Saved To: {output_path}")
print("=" * 60)