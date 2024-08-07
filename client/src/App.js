import React, { useEffect, useState } from 'react';
import { Controlled as CodeMirror } from '@uiw/react-codemirror';
import '@uiw/react-codemirror/dist/index.css';
import './App.css';
import { initWebSocket } from './websocket';

function App() {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAIListening, setIsAIListening] = useState(false);
  
  useEffect(() => {
    const ws = initWebSocket((message) => {
      if (message.type === 'question') {
        setQuestion(message.content);
      } else if (message.type === 'result') {
        setResult(message.content);
      } else if (message.type === 'transcript') {
        setTranscript((prev) => prev + message.content + '\n');
      } else if (message.type === 'listening') {
        setIsAIListening(message.content);
      }
    });

    return () => ws.close();
  }, []);

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
  };

  const handleSend = () => {
    const ws = initWebSocket();
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'user_response', content: transcript }));
      setTranscript('');
    };
  };

  const handleRunCode = () => {
    const ws = initWebSocket();
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'code_submission', code }));
    };
  };

  const handleResetCode = () => {
    setCode('');
    setResult('');
  };

  return (
    <div className="container">
      <header>
        <h1>AI Interview Platform</h1>
        <button className="back-button">Back to Dashboard</button>
      </header>
      <main>
        <div className="screen">
          <div className="question-section">
            <h2>{question?.title || 'Loading...'}</h2>
            <p>{question?.description || 'Please wait while we fetch the question.'}</p>
          </div>
          <div className="transcript-section">
            <textarea 
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={isAIListening}
              placeholder="Type your explanation here..."
            />
            <button onClick={handleSend} disabled={isAIListening}>Send</button>
            <button onClick={() => setTranscript('')} disabled={isAIListening}>Reset</button>
          </div>
          <CodeMirror
            value={code}
            options={{
              mode: 'javascript',
              theme: 'dracula',
              lineNumbers: true
            }}
            onChange={handleCodeChange}
          />
          <div className="code-controls">
            <button onClick={handleRunCode}>Run</button>
            <button onClick={handleResetCode}>Reset</button>
          </div>
          <div className="result-section">
            <pre>{result}</pre>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
