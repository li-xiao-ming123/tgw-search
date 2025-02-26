document.addEventListener("DOMContentLoaded", function () {
  // 确保DOM完全加载后再执行

  // 获取元素
  var canvas = document.getElementById("live2d");
  var chatContainer = document.getElementById("live2d-chat-container");
  var chatInput = document.getElementById("live2d-chat-input");
  var chatSubmit = document.getElementById("live2d-chat-submit");
  var chatResponse = document.getElementById("live2d-chat-response");
  var chatClose = document.querySelector(".live2d-chat-close");

  // 电子书搜索助手的系统提示词
  const systemPrompt = `你是一个专业的电子书搜索助手，擅长根据用户提供的ISBN或书名等部分书籍信息查找完整书籍信息，便于用户进一步搜索资源，并提供电子书获取途径。请遵循以下指导：

1. 当用户提供ISBN或书名(仅提供部分信息)时，尽可能提供以下完整信息，使用HTML格式：
   - <div class="book-title"><strong>完整书名：</strong>[书名]（包括副标题）</div>
   - <div class="book-author"><strong>作者：</strong>[作者名]（包括译者，如有）</div>
   - <div class="book-publisher"><strong>出版社：</strong>[出版社名]</div>
   - <div class="book-year"><strong>出版年份：</strong>[年份]</div>
   - <div class="book-isbn"><strong>ISBN：</strong>[ISBN号]</div>
   - <div class="book-pages"><strong>页数：</strong>[页数]</div>
   - <div class="book-category"><strong>分类：</strong>[分类/标签]</div>
   - <div class="book-intro"><strong>简介：</strong>[简短介绍]</div>

2. 在提供书籍基本信息后，使用清晰的HTML结构列出电子书获取途径：
   <div class="ebook-sources">
     <h3>电子书获取途径</h3>
     <ol>
       <li><strong>免费资源：</strong>[资源名称及链接]</li>
       <li><strong>付费资源：</strong>[资源名称及链接]（价格区间）</li>
       <!-- 其他资源 -->
     </ol>
   </div>

3. 避免使用Markdown语法（如**、##等），直接使用HTML标签（<strong>、<h3>等）进行格式化。

4. 保持回答简洁明了，使用清晰的视觉层次结构。

5. 如果找不到电子版，使用HTML格式提供替代建议。

请以专业、简洁的方式提供这些信息，确保用户能够轻松找到并获取所需的电子书资源。`;

  // 初始化消息历史
  let messageHistory = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

  // 检查元素是否存在
  if (!canvas) {
    console.error("Live2D canvas not found!");
    return;
  }

  if (!chatContainer) {
    console.error("Chat container not found!");
    return;
  }

  // 显示/隐藏聊天框
  function toggleChatBox(show) {
    console.log("Toggling chat box:", show);
    chatContainer.style.display = show ? "block" : "none";
    if (show) {
      chatInput.focus();
    }
  }

  // 监听canvas点击事件
  canvas.addEventListener("click", function (e) {
    console.log("Canvas clicked");
    toggleChatBox(true);
  });

  // 监听关闭按钮点击事件
  chatClose.addEventListener("click", function () {
    console.log("Close button clicked");
    toggleChatBox(false);
  });

  // 调用Kimi API的函数
  async function callKimiAPI(userInput, retryCount = 0) {
    const API_KEY = "sk-UiYHGGXpXHGZCow1fc0S3BvSLfhFEitXqAe19I5EiVZdikrK"; // 替换为你的API密钥
    const API_ENDPOINT = "https://api.moonshot.cn/v1/chat/completions"; // Kimi API端点

    // 添加用户消息到历史
    messageHistory.push({
      role: "user",
      content: userInput,
    });

    // 如果历史太长，可以裁剪以节省token
    if (messageHistory.length > 10) {
      // 保留系统消息和最近的9条对话
      messageHistory = [
        messageHistory[0],
        ...messageHistory.slice(messageHistory.length - 9),
      ];
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k", // 或其他可用的Kimi模型
          messages: messageHistory,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("API请求失败: " + response.status);
      }

      const data = await response.json();

      // 根据Kimi API的实际响应格式进行处理
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const assistantMessage = data.choices[0].message;
        // 添加助手回复到历史
        messageHistory.push(assistantMessage);
        return assistantMessage.content;
      } else {
        throw new Error("无效的API响应格式");
      }
    } catch (error) {
      console.error("Kimi API error:", error);

      // 如果是限流错误并且重试次数小于最大重试次数
      if (error.message.includes("rate limit") && retryCount < 3) {
        // 等待一段时间后重试
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return callKimiAPI(userInput, retryCount + 1);
      }

      throw error;
    }
  }

  // 处理聊天提交
  function handleChatSubmit() {
    var userInput = chatInput.value.trim();
    if (!userInput) return;

    // 显示用户输入
    var userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.innerHTML = "<strong>您:</strong> " + userInput;
    chatResponse.appendChild(userMessage);

    // 显示加载中
    var loadingMessage = document.createElement("div");
    loadingMessage.textContent = "正在搜索电子书资源...";
    loadingMessage.id = "loading-message";
    chatResponse.appendChild(loadingMessage);

    // 滚动到底部
    chatResponse.scrollTop = chatResponse.scrollHeight;

    // 清空输入框
    chatInput.value = "";

    // 调用Kimi API
    callKimiAPI(userInput)
      .then(function (response) {
        // 移除加载消息
        var loadingEl = document.getElementById("loading-message");
        if (loadingEl) {
          chatResponse.removeChild(loadingEl);
        }

        // 创建响应容器
        var aiMessage = document.createElement("div");
        aiMessage.className = "ai-response";

        // 添加头部
        var header = document.createElement("div");
        header.className = "ai-response-header";
        header.innerHTML = "<strong>电子书助手:</strong>";
        aiMessage.appendChild(header);

        // 添加内容 - 直接使用HTML内容
        var content = document.createElement("div");
        content.className = "ai-response-content";
        content.innerHTML = response; // 直接渲染HTML
        aiMessage.appendChild(content);

        chatResponse.appendChild(aiMessage);

        // 滚动到底部
        chatResponse.scrollTop = chatResponse.scrollHeight;
      })
      .catch(function (error) {
        // 错误处理代码...
      });
  }

  // 监听提交按钮点击事件
  chatSubmit.addEventListener("click", handleChatSubmit);

  // 监听输入框回车事件
  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleChatSubmit();
    }
  });

  console.log("Live2D chat script loaded successfully");
});
