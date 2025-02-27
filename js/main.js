// 定义搜索网站数据
const defaultSites = [
  { name: "Z-Library", url: "https://z-library.sk/s/{q}" },
  { name: "LibGen", url: "http://libgen.li/index.php?req={q}" },
  { name: "Anna's Archive", url: "https://annas-archive.org/search?q={q}" },
  { name: "Google", url: "https://www.google.com/search?q={q}" },
  { name: "Wislib", url: "https://www.wislib.com/search?key={q}" },
  { name: "Hallowlib", url: "https://bk.hallowlib.org" },
  { name: "词典论坛", url: "https://forum.freemdict.com/search?q={q}" },
  { name: "PDF Drive", url: "https://www.pdfdrive.com/search?q={q}" },
  { name: "Panso", url: "https://panso.pro/search?q={q}" },
  { name: "阿里小站", url: "https://pan666.net/?q={q}" },
  { name: "读秀", url: "https://book.duxiu.com/search?sw={q}&ecode=utf-8" },
  { name: "鸠摩搜书", url: "https://www.jiumodiary.com" },
  { name: "B站", url: "https://search.bilibili.com/all?keyword={q}" },
  { name: "知乎", url: "https://www.zhihu.com/search?q={q}" },
];

const generalSites = [
  {
    name: "Gutenberg",
    url: "https://www.gutenberg.org/ebooks/search/?query={q}",
  },

  { name: "小白盘", url: "https://www.xiaobaipan.com/list-{q}AD.html" },
  {
    name: "虫部落",
    url: "https://www.google.com/search?sitesearch=chongbuluo.com&query={q}",
  },
  { name: "tstrs", url: "https://book.tstrs.me/search" },
  {
    name: "Proletarian",
    url: "https://library.proletarian.me/searchResult.php?query={q}",
  },
  {
    name: "LOC",
    url: "https://www.loc.gov/search/?in=partof%3Aworld+digital+library&q={q}",
  },
  { name: "百度", url: "https://www.baidu.com/s?wd={q}" },
  { name: "Bing", url: "https://cn.bing.com/search?q={q}" },
];

const researchSites = [
  { name: "Google Scholar", url: "https://scholar.google.com/scholar?q={q}" },
  { name: "arXiv", url: "https://arxiv.org/search/?query={q}" },
  { name: "百度学术", url: "https://xueshu.baidu.com/s?wd={q}" },
  { name: "CNKI", url: "https://www.cnki.net/search.aspx?q={q}" },
  { name: "Sci-Hub", url: "https://sci-hub.box" },
  { name: "公众学术", url: "https://pubscholar.cn" },
  {
    name: "台湾电子书",
    url: "https://taebc.ebook.hyread.com.tw/searchList.jsp?search_field=FullText&search_input={q}",
  },
  { name: "NAP", url: "https://nap.nationalacademies.org" },
  { name: "NCPSSD", url: "https://www.ncpssd.org" },
  { name: "UCDRS", url: "http://www.ucdrs.cn" },
  { name: "Marxists", url: "https://www.marxists.org/chinese/index.html" },
  { name: "NAP.edu", url: "https://www.nap.edu" },
  { name: "MIT OCW", url: "https://ocw.mit.edu/search/?q={q}" },
];

const englishSites = [

  { name: "Springer", url: "https://link.springer.com/search?query={q}" },
  {
    name: "iHeart",
    url: "https://iheartintelligence.com/free-books-100-legal-sites-download-literature",
  },
  { name: "BL Blogs", url: "https://www.bl.uk/research/blogs" },
  { name: "PALMM", url: "https://palmm.digital.flvc.org" },
  { name: "OAPEN", url: "https://library.oapen.org/discover?query={q}" },
  { name: "MagazineLib", url: "https://magazinelib.com/?s={q}" },
  {
    name: "ICPSR",
    url: "https://www.icpsr.umich.edu/web/ICPSR/search/studies?q={q}",
  },
  { name: "FreePDFMag", url: "https://www.freepdfmagazine.com" },
];

const traditionalSites = [
  { name: "古籍馆", url: "https://www.gujiguan.com/#/search?keyword={q}" },
  { name: "书格", url: "https://www.shuge.org/?s={q}" },
  { name: "国学导航", url: "http://guoxue.er07.com" },
  {
    name: "台大图书馆",
    url: "https://ntu.primo.exlibrisgroup.com/discovery/search?query=any,contains,{q}",
  },
  { name: "好读", url: "http://haodoo.net" },
  { name: "四库全书", url: "http://skqs.lib.ntnu.edu.tw/dragon" },
  {
    name: "家谱库",
    url: "https://jiapu.library.sh.cn/#/genealogyFullSearch?keywords={q}",
  },
];

let customSites = JSON.parse(localStorage.getItem("customSites") || "[]");

function showNotification(message, duration = 3000) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, duration);
}

function createLinks(sites, containerId, isCustom = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // 清空现有内容
  sites.forEach((site, index) => {
    const linkContainer = document.createElement("div");
    linkContainer.className = "custom-site-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "site-checkbox";
    checkbox.dataset.index = index;
    linkContainer.appendChild(checkbox);

    const link = document.createElement("a");
    link.className = "search-link";
    link.textContent = site.name;
    link.href = "#";
    link.onclick = (e) => {
      e.preventDefault();
      const query = document.getElementById("searchInput").value;
      if (query) {
        window.open(
          site.url.replace("{q}", encodeURIComponent(query), "_blank")
        );
      } else {
        showNotification("请输入搜索关键词");
      }
    };

    linkContainer.appendChild(link);

    if (isCustom) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "删除";
      deleteBtn.onclick = () => deleteCustomSite(index);
      linkContainer.appendChild(deleteBtn);
    }

    container.appendChild(linkContainer);
  });
}

function toggleAll(checkbox, containerId) {
  const container = document.getElementById(containerId);
  const checkboxes = container.querySelectorAll(".site-checkbox");
  checkboxes.forEach((box) => (box.checked = checkbox.checked));
}

function addCustomSite() {
  document.getElementById("customSiteModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("customSiteModal").style.display = "none";
}

function saveCustomSite() {
  const name = document.getElementById("siteName").value.trim();
  const url = document.getElementById("siteUrl").value.trim();

  if (!name || !url) {
    showNotification("请填写完整信息");
    return;
  }

  customSites.push({ name, url });
  localStorage.setItem("customSites", JSON.stringify(customSites));

  // 清空输入框
  document.getElementById("siteName").value = "";
  document.getElementById("siteUrl").value = "";

  // 刷新自定义链接列表
  createLinks(customSites, "customLinks", true);

  closeModal();
  showNotification("添加成功");
}

function deleteCustomSite(index) {
  customSites.splice(index, 1);
  localStorage.setItem("customSites", JSON.stringify(customSites));
  createLinks(customSites, "customLinks", true);
  showNotification("删除成功");
}

function batchOpenSelected(containerId) {
  const query = document.getElementById("searchInput").value;
  if (!query) {
    showNotification("请输入搜索关键词");
    return;
  }

  let sites;
  switch (containerId) {
    case "defaultLinks":
      sites = defaultSites;
      break;
    case "generalLinks":
      sites = generalSites;
      break;
    case "researchLinks":
      sites = researchSites;
      break;
    case "englishLinks":
      sites = englishSites;
      break;
    case "traditionalLinks":
      sites = traditionalSites;
      break;
    case "customLinks":
      sites = customSites;
      break;
    default:
      return;
  }

  const container = document.getElementById(containerId);
  const checkboxes = container.querySelectorAll(".site-checkbox");
  let selectedCount = 0;

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      selectedCount++;
      const site = sites[index];
      if (
        site.url.includes("jiumodiary.com") ||
        site.url.includes("sci-hub.box") ||
        site.url.includes("guoxue.er07.com") ||
        site.url.includes("haodoo.net") ||
        site.url.includes("pubscholar.cn") ||
        !site.url.includes("{q}")
      ) {
        window.open(site.url, "_blank");
      } else {
        const url = site.url.replace("{q}", encodeURIComponent(query));
        setTimeout(() => {
          window.open(url, "_blank");
        }, selectedCount * 300);
      }
    }
  });

  if (selectedCount === 0) {
    showNotification("请至少选择一个网站");
  } else {
    showNotification(`正在打开${selectedCount}个搜索结果，请允许弹出窗口`);
  }
}

/* 文叔叔悬浮传文件按钮功能 */
(function () {
  // 等待 DOM 加载完成
  function initFloatingButton() {
    const fileTransferBtn = document.getElementById("filetransfer-float-btn");

    if (fileTransferBtn) {
      // 检测设备类型
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

      // 点击事件处理 - PC端
      fileTransferBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.open("https://musetransfer.com/m", "_blank");
      });

      // 触摸事件处理 - 移动端和平板
      if (isTouchDevice) {
        // 防止触摸设备上的双重触发
        fileTransferBtn.addEventListener("touchend", function (e) {
          e.preventDefault();
          window.open("https://musetransfer.com/m", "_blank");
        });

        // 在触摸设备上显示/隐藏提示
        let touchTimer;
        fileTransferBtn.addEventListener("touchstart", function (e) {
          const tooltip = this.querySelector(".tooltip");
          if (tooltip) {
            clearTimeout(touchTimer);
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";

            touchTimer = setTimeout(() => {
              tooltip.style.visibility = "hidden";
              tooltip.style.opacity = "0";
            }, 1500);
          }
        });
      }

      // 根据设备类型调整样式
      if (isTouchDevice) {
        fileTransferBtn.classList.add("touch-device");
      } else {
        fileTransfer.classList.add("mouse-device");
      }

      // 检测是否在iframe中，调整z-index
      if (window !== window.top) {
        fileTransferBtn.style.zIndex = "2147483647"; // 最高z-index值
      }

      // 显示按钮的动画效果
      setTimeout(() => {
        fileTransferBtn.style.opacity = "1";
      }, 500);

      // 处理滚动位置调整
      let scrollTimer;
      window.addEventListener("scroll", function () {
        clearTimeout(scrollTimer);

        if (fileTransferBtn.classList.contains("float-btn-hidden")) {
          return;
        }

        fileTransferBtn.classList.add("float-btn-scrolling");

        scrollTimer = setTimeout(() => {
          fileTransfer.classList.remove("float-btn-scrolling");
        }, 200);
      });

      // 处理窗口大小变化
      window.addEventListener("resize", function () {
        // 可以在这里添加响应窗口大小变化的逻辑
        // 例如，根据窗口大小调整按钮位置
      });
    }
  }

  // 如果 DOM 已加载完成，直接初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFloatingButton);
  } else {
    initFloatingButton();
  }
})();

// 初始化所有链接
document.addEventListener("DOMContentLoaded", function () {
  createLinks(defaultSites, "defaultLinks");
  createLinks(generalSites, "generalLinks");
  createLinks(researchSites, "researchLinks");
  createLinks(englishSites, "englishLinks");
  createLinks(traditionalSites, "traditionalLinks");
  createLinks(customSites, "customLinks", true);

  // 添加回车搜索功能
  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        batchOpenSelected("defaultLinks");
      }
    });
});

// PWA 相关代码
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/tgw-search/js/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}
