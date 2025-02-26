// 等待页面加载完成
document.addEventListener("DOMContentLoaded", () => {
  // 加载字体图标库
  const fontAwesomeLink = document.createElement("link");
  fontAwesomeLink.rel = "stylesheet";
  fontAwesomeLink.href =
    "https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css";
  document.head.appendChild(fontAwesomeLink);

  // 初始化live2d
  setTimeout(() => {
    // 加载waifu-tips.js
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.js";
    document.body.appendChild(script);

    // 等待waifu-tips.js加载完成后初始化
    script.onload = () => {
      // 初始化看板娘，加载丰川祥子模型
      initWidget({
        waifuPath:
          "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.json",
        apiPath: "", // 留空，不使用默认模型API
        cdnPath: "", // 留空，不使用默认CDN
        tools: [
          "hitokoto",
          "asteroids",
          "switch-model",
          "switch-texture",
          "photo",
          "info",
          "quit",
        ],
      });

      // 直接加载自定义模型
      loadModel("models/sakiko/341_school_summer-2023.model.json");

      console.log("丰川祥子模型初始化成功");
    };
  }, 1000);
});

// 自定义loadModel函数，直接加载指定模型
function loadModel(modelPath) {
  if (typeof loadlive2d !== "function") {
    console.error("loadlive2d函数未定义");
    return;
  }

  try {
    // 直接加载模型到canvas，添加缩放参数
    loadlive2d("live2d", modelPath, null, 0.5); // 调整缩放比例
    console.log("模型加载成功:", modelPath);
  } catch (e) {
    console.error("模型加载失败:", e);
  }
}
