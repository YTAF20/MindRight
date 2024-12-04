const generateSTYLES = () => {
  return `
    <style>
      @import url(https://fonts.googleapis.com/css?family=opensans:500);
      body {
        background: #33cc99;
        color: #fff;
        font-family: "Open Sans", sans-serif;
        max-height: 700px;
        overflow: hidden;
      }
      .c {
        text-align: center;
        display: block;
        position: relative;
        width: 80%;
        margin: 100px auto;
      }
      ._404 {
        font-size: 220px;
        position: relative;
        display: inline-block;
        z-index: 2;
        height: 250px;
        letter-spacing: 15px;
      }
      ._1 {
        text-align: center;
        display: block;
        position: relative;
        letter-spacing: 12px;
        font-size: 4em;
        line-height: 80%;
        padding: 50px;
      }
      ._2 {
        text-align: center;
        display: block;
        position: relative;
        font-size: 20px;
        padding: 50px;
      }
      .text {
        font-size: 70px;
        text-align: center;
        position: relative;
        display: inline-block;
        margin: 19px 0px 0px 0px;
        z-index: 3;
        width: 100%;
        line-height: 1.2em;
      }
      .right {
        float: right;
        width: 60%;
      }
      hr {
        padding: 0;
        border: none;
        border-top: 5px solid #fff;
        color: #fff;
        text-align: center;
        margin: 0px auto;
        width: 420px;
        height: 10px;
        z-index: -10;
      }
      hr:after {
        display: inline-block;
        position: relative;
        top: -0.75em;
        font-size: 2em;
        padding: 0 0.2em;
        background: #33cc99;
      }
      .cloud {
        width: 350px;
        height: 120px;
        background: #fff;
        background: linear-gradient(top, #fff 100%);
        border-radius: 100px;
        position: absolute;
        margin: 120px auto 20px;
        z-index: -1;
        transition: ease 1s;
      }
      .cloud:after,
      .cloud:before {
        content: "";
        position: absolute;
        background: #fff;
        z-index: -1;
      }
      .cloud:after {
        width: 100px;
        height: 100px;
        top: -50px;
        left: 50px;
        border-radius: 100px;
      }
      .cloud:before {
        width: 180px;
        height: 180px;
        top: -90px;
        right: 50px;
        border-radius: 200px;
      }
      @-webkit-keyframes moveclouds {
        0% {
          margin-left: 1000px;
        }
        100% {
          margin-left: -1000px;
        }
      }
    </style>
  `;
};

const generateHTML = (pageName) => {
  return `
    <div id="clouds">
      <div class="cloud x1"></div>
      <div class="cloud x1_5"></div>
      <div class="cloud x2"></div>
      <div class="cloud x3"></div>
      <div class="cloud x4"></div>
      <div class="cloud x5"></div>
    </div>
    <div class='c'>
      <div class='_404'>404</div>
      <hr>
      <div class='_1'>GET BACK TO WORK</div>
      <div class='_2'>STUDYING > ${pageName}</div>
    </div>`;
};

const checkBlockedUrls = () => {
  chrome.storage.sync.get('blockedUrls', (data) => {
      const blockedUrls = data.blockedUrls || [];
      const currentDomain = new URL(window.location.href).hostname.replace(/^www\./, '');
      const now = Date.now();

      const isBlocked = blockedUrls.some(({ url, expiration }) =>
          (currentDomain === url || currentDomain.endsWith(`.${url}`)) && now < expiration
      );

      if (isBlocked) {
          const pageName = new URL(window.location.href).hostname;
          document.head.innerHTML = generateSTYLES();
          document.body.innerHTML = generateHTML(pageName);
      }
  });
};


checkBlockedUrls();
