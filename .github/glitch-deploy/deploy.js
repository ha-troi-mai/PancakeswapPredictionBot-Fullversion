const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/jade-metal-globe|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/ten-military-pyjama|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/decisive-shiny-currency|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/quintessential-bird-range|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/intelligent-azure-taker|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/pastoral-sassy-hotel|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/supreme-little-cerise|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/fine-morning-catboat|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/jet-calico-iridium|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/band-luminous-pillow|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/nimble-maize-toy|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/resonant-spectacular-trade|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/diamond-determined-tumbleweed|https://5a007799-5d8e-442a-8d7b-82d59b1ae7de@api.glitch.com/git/ruby-gem-space`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();