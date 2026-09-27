'use client';
export default function TestPage() {
  return (
    <div style={{ padding: '2rem', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>TEST PAGE</h1>
      <p>Si vous voyez ce texte, React fonctionne.</p>
      <button onClick={() => alert('CLICK OK')}>Cliquez ici</button>
    </div>
  );
}
