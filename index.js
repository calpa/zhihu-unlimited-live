const axios = require('axios');
const handleLive = require('./handler');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
const inquirer = require('inquirer');

// Set default value
db.defaults({ live: {}, cookie: "" })
    .write();

let cookie;

const fetchZhihu = async (url, offset = 0, limit = 20, tag_id) => {
    try {
        const { data } = await axios.get(url, {
            params: {
                limit,
                offset,
                tag_id
            },
            headers: {
                // cookie,
                "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36"
            }});
        return data;
    } catch (err) {
        console.error(err);
    }
}

const saveToDB = (data) => {
    // Write to database
    db.get('live')
        .set(data.id, data)
        .write();
}

const main = async (url, offset = 0, tag) => {
    let result;
    try {
        const data = await fetchZhihu(url, offset);
        console.log('Successuflly fetcded url: ' + url + ', offset: ' + offset + ', tag: ' + tag);
        if (data.data) {
            const temp = data.data.map(live => {
                return handleLive(live.item);
            });
            result = temp;
        }
    } catch (err) {
        console.error(err);
    }
    return result;
};

const askCookie = async () => {
    const result = await inquirer.prompt([{
        type: 'input',
        name: 'cookie',
        message: 'Please enter the cookie used in https://www.zhihu.com/market/lives/unlimited/choiceness (open DevTools)'
    }]);

    await db.set('cookie', result.cookie).write();

    return result.cookie;
}

const getCachedCookie = async () => {
    return db.get('cookie').value();
}

const init = async () => {
    const baseurl = 'https://api.zhihu.com/unlimited/subscriptions/1/resources';
    const offset = 1020;
    let result = [];
    for (var i = 0; i < offset; i += 20) {
        const lives = await main(baseurl, i); // Receive recommend lives
        result = [...result, ...lives];
    }

    console.log(result.length);
    // saveToDB(result);
}

init();
