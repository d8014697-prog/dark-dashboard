document.addEventListener('DOMContentLoaded', () => {
  const btnSendAI = document.getElementById('btnSendAI');
  const inputAI = document.getElementById('inputAI');
  const chatBoxAI = document.getElementById('chatBoxAI');

  const part1 = "AQ.Ab8RN6LI";
  const part2 = "OQhAcjQIU6um";
  const part3 = "R772oOFN3mEKK7NZ2usXFYP5UwSbbg";
  const GEMINI_API_KEY = part1 + part2 + part3;

  if (btnSendAI && inputAI && chatBoxAI) {
    btnSendAI.addEventListener('click', async () => {
      const text = inputAI.value.trim();
      if (!text) return;
      
      chatBoxAI.innerHTML += `<div class="chat-msg user-msg">${text}</div>`;
      inputAI.value = '';
      chatBoxAI.scrollTop = chatBoxAI.scrollHeight;

      const idLoading = "load-" + Date.now();
      chatBoxAI.innerHTML += `<div class="chat-msg ai-msg" id="${idLoading}">Dark AI sedang berpikir...</div>`;
      chatBoxAI.scrollTop = chatBoxAI.scrollHeight;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: text }]
            }]
          })
        });

        const data = await response.json();
        
        // Cek jika ada error dari Google API
        if (data.error) {
          throw new Error(data.error.message);
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Respons kosong dari AI.";

        document.getElementById(idLoading).innerText = reply;
        chatBoxAI.scrollTop = chatBoxAI.scrollHeight;

      } catch (err) {
        document.getElementById(idLoading).innerText = "Error: " + err.message;
        chatBoxAI.scrollTop = chatBoxAI.scrollHeight;
      }
    });

    inputAI.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btnSendAI.click();
    });
  }
});
