import http from 'http';
import { spawn } from 'child_process';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--user-data-dir=/tmp/cdp_test_profile',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://localhost:9222/json');
    const tabs = await res.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;
    console.log('Connecting to', wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Console.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 4, method: 'Page.navigate', params: { url: 'http://localhost:4173/dashboard' } }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('PAGE EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
      if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
        console.error('CONSOLE ERROR:', msg.params.message.text);
      }
    };

    setTimeout(() => {
      ws.close();
      chrome.kill();
      process.exit(0);
    }, 4000);
  } catch (err) {
    console.error('Error in test:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
