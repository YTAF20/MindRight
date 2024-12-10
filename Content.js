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
        width: 100%;
        line-height: 1.2em;
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
        transition: ease 1s;
      }
      .cloud:after,
      .cloud:before {
        content: "";
        position: absolute;
        background: #fff;
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
    </style>
  `;
};

//Generates the screen when trying to access a blocked website
const generateHTML = (pageName) => {
  return `
    <div id="clouds">
      <div class="cloud" style="top: 20px; left: 20px;"></div>
      <div class="cloud" style="top: 120px; right: 30px;"></div>
      <div class="cloud" style="bottom: 20px; right: 390px;"></div>
    </div>
    <div class='c'>
      <div class='_404'>404</div>
      <hr>
      <div class='_1'>GET BACK TO WORK</div>
      <div class='_2'>No more visiting ${pageName}</div>
    </div>`;
};

//function to compare current URL with the stored blocked URLs and checks if it is blocked
//also verifies if a blocked URL expires
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
