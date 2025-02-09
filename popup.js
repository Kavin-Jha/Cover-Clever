document.addEventListener("DOMContentLoaded", function () {
  const botTimestamp = document.querySelector(".chat-message.bot .message-time");
  if (botTimestamp) {
      botTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('chat-body');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const closeBtn = document.getElementById('close-btn');
  

  closeBtn.addEventListener('click', () => {
    window.close();
  });

  let conversationHistory = [];

  sendBtn.addEventListener('click', () => {
    const question = userInput.value.trim();
    if (question) {
      addMessage(question, 'user');
      userInput.value = '';
      getAnswer(question).then(answer => {
        addMessage(answer, 'bot');
      });
    }
  });

  function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('chat-message', sender);
    
    message.innerHTML = `<div class="message-text">${text}</div>`;

    const timestamp = document.createElement('div');
    const timestampClass = sender === 'user' ? 'timestamp-user' : 'timestamp-bot';
    
    timestamp.classList.add('timestamp', timestampClass);
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    chatBody.appendChild(message);
    chatBody.appendChild(timestamp); 
}


  function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.classList.add('chat-message', 'bot');
    typingIndicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async function getAnswer(question) {
    showTypingIndicator();
  
    // Fetch the context from dummy.json
    const response = await fetch(chrome.runtime.getURL('dummy.json'));
    const data = await response.json();
  
    // Format the JSON data into a text-based context
    const context = formatContext(data);
  
    // Add the user's question to the conversation history
    conversationHistory.push({ role: "user", content: question });
  
    // Trim the conversation history to the last 5 messages
    const trimmedHistory = conversationHistory.slice(-5);
  
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey = ""; // API key
  
    // Prepare the payload for OpenAI's ChatGPT API
    const payload = {
      model: "gpt-3.5-turbo", // Use "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: "You are an insurance policy assistant. Your task is to provide detailed and accurate answers to user questions based on the following context. Always include all relevant details, such as in-network and out-of-network costs, benefit limits, and any other important information. Do not summarize or omit any details.",
        },
        {
          role: "user",
          content: `Context: ${context}`,
        },
        ...trimmedHistory, // Include the last 5 messages from the conversation history
      ],
      max_tokens: 500, // Adjust based on your needs
      temperature: 0.7, // Adjust for creativity vs. accuracy
    };
  
    try {
      // Make the API call
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("API Response:", data); // Log the API response
  
      hideTypingIndicator();
  
      // Extract the answer from the API response
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const answer = data.choices[0].message.content;
  
        // Add the bot's response to the conversation history
        conversationHistory.push({ role: "assistant", content: answer });
  
        return answer;
      } else {
        return "Sorry, I couldn't find an answer to that question.";
      }
    } catch (error) {
      hideTypingIndicator();
      console.error("Error fetching answer:", error);
      return "Sorry, something went wrong. Please try again.";
    }
  }

  function formatContext(data) {
    let context = "";
    for (const category in data) {
      context += `**${category}**\n`;
      for (const subCategory in data[category].content) {
        context += `- ${subCategory}:\n`;
        const details = data[category].content[subCategory];
        for (const key in details) {
          context += `  - ${key}: ${details[key]}\n`;
        }
      }
    }
    return context;
  }
});
