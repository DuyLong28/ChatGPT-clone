const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let userName = '';

function appendMessage(message, className, author, avatarSrc) {
  const messageDiv = document.createElement('div');
  messageDiv.className = className + ' message';

  const avatarImg = document.createElement('img');
  avatarImg.src = avatarSrc;
  avatarImg.alt = author + ' Avatar';
  avatarImg.className = 'avatar';

  const messageContentDiv = document.createElement('div');
  messageContentDiv.className = 'message-content';

  const messageAuthorDiv = document.createElement('div');
  messageAuthorDiv.className = 'message-author';
  messageAuthorDiv.textContent = author;

  const messageTextDiv = document.createElement('div');
  messageTextDiv.className = 'message-text';
  messageTextDiv.textContent = message;

  messageContentDiv.appendChild(messageAuthorDiv);
  messageContentDiv.appendChild(messageTextDiv);
  messageDiv.appendChild(avatarImg);
  messageDiv.appendChild(messageContentDiv);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Display the initial prompt asking for user's name
const askUserName = () => {
  const modal = document.getElementById('myModal');
  const modalContent = document.querySelector('.modal-content');
  const nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('placeholder', 'Nhập Username');
  modalContent.appendChild(nameInput);

  const nameSubmit = document.createElement('button');
  nameSubmit.textContent = 'Gửi';
  modalContent.appendChild(nameSubmit);
  
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        nameSubmit.click();
    }
  });

  modal.style.display = "block";
  nameInput.focus();

  nameSubmit.addEventListener('click', () => {
    userName = nameInput.value.trim();
    if (userName) {
      modal.style.display = "none";
      const messageAuthor = chatMessages.querySelector('.user-message .message-author');
      messageAuthor.textContent = userName;
      userInput.focus();
    } else {
      nameInput.value = '';
      nameInput.placeholder = 'Bạn chưa nhập tên';
      nameInput.focus();
    }
  });
};

askUserName();

async function fetchChatGptResponse(messages) {
  const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
  });

  if (response.ok) {
      const chatGptResponse = await response.json();
      return chatGptResponse.content;
  } else {
      throw new Error('Error fetching Monkey AI response');
  }
}

// Function to create a new chat message
const createNewMessage = (message, isGptMessage) => {
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    if (isGptMessage) {
        newMessage.classList.add('gpt-message');
        newMessage.innerHTML = `
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/640px-ChatGPT_logo.svg.png" alt="ChatGPT Avatar" class="avatar">
            <div class="message-content">
                <div class="message-author">ChatGPT</div>
                <div class="message-text">${message}</div>
            </div>
        `;
    } else {
        newMessage.classList.add('user-message');
        newMessage.innerHTML = `
            <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="User Avatar" class="avatar">
            <div class="message-content">
                <div class="message-author">${userName}</div>
                <div class="message-text">${message}</div>
            </div>
        `;
    }

    chatMessages.appendChild(newMessage);
};

sendBtn.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (message) {
      appendMessage(message, 'message-text', userName, 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png');
      userInput.value = '';

      try {
          const chatGptResponse = await fetchChatGptResponse([{ role: 'user', content: message }]);
          appendMessage(chatGptResponse, 'gpt-message', 'ChatGPT', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/640px-ChatGPT_logo.svg.png');
      } catch (error) {
          console.error('Error in sendBtn event listener:', error);
          alert('An error occurred while fetching the ChatGPT response');
      }
  }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
      sendBtn.click();
  }
});