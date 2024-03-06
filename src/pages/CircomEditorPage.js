import React, { useState } from "react";

const CircomEditorPage = () => {
  const [proof, setProof] = useState("");
  const [result, setResult] = useState("");

  const calculateProof = async () => {
    const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
      { a: 3, b: 11 },
      "/path/to/your/circuit.wasm",
      "/path/to/your/circuit_final.zkey"
    );

    setProof(JSON.stringify(proof, null, 2));

    const vkey = await fetch("/path/to/your/verification_key.json").then(
      (res) => res.json()
    );

    const res = await window.snarkjs.groth16.verify(vkey, publicSignals, proof);
    setResult(`Verification result: ${res}`);
  };

  return (
    <div>
      <h1>Snarkjs client example</h1>
      <button onClick={calculateProof}>Create proof</button>
      <pre className="proof">
        Proof: <code>{proof}</code>
      </pre>
      <pre className="proof">
        Result: <code>{result}</code>
      </pre>
    </div>
  );
};

export default CircomEditorPage;
