import React, { useState } from 'react';

const AskImageQuestion = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setIframeSrc(URL.createObjectURL(file));
    }
  };

  const handleLoadDemo = async () => {
    const response = await fetch('20.png');
    const blob = await response.blob();
    const file = new File([blob], '20.png', { type: blob.type });

    setImageFile(file);
    setIframeSrc(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('https://etscan.org/predict_permeability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      setAnswer(data.response || 'No answer returned.');
    } catch (error) {
      setAnswer('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Ask About Vugs and Fractures
      </h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
        {/* LEFT COLUMN */}
        <div style={{ width: '700px' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
              onClick={handleLoadDemo}
              style={{
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
              }}
            >
              Load Demo Image
            </button>
          </div>

          <div
            style={{
              width: '700px',
              height: '350px',
              overflow: 'auto',
              border: '1px solid #ccc',
              borderRadius: '6px',
              background: '#fff',
            }}
          >
            {iframeSrc ? (
              <iframe
                src={iframeSrc}
                title="Seismic Preview"
                style={{ width: '1000px', height: '500px', border: 'none' }}
                scrolling="both"
              />
            ) : (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>No preview available</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: '400px', alignSelf: 'flex-start' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea
              placeholder="Type your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
                resize: 'vertical',
                width: '100%',
                minHeight: '100px',
                fontFamily: 'inherit',
                lineHeight: '1.5',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Ask
            </button>
          </form>

          <div style={{ marginTop: '1rem', minHeight: '60px' }}>
            {loading ? (
              <p style={{ fontStyle: 'italic', color: '#555' }}>LLM thinking...</p>
            ) : (
              answer && <p style={{ color: 'green', fontWeight: 'bold' }}>{answer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskImageQuestion;
