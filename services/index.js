/* eslint-disable no-console */
const request = require('superagent');

module.exports = {

    getToken: async (cookie, sessionId) => {
        try {
            const p = new Promise(((resolve, reject) => {
                // request.get('http://39.104.84.131/api/user/authorize/'+ sessionId)
                request.get(`http://139.159.242.107/api/user/authorize/${sessionId}`)
                    .set('Cookie', cookie)
                // .timeout({
                //     response: 20000,
                //     deadline: 20000,
                // })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                            reject();
                        } else {
                            resolve(res);
                        }
                    });
            }));

            return p;
        } catch (e) {
            throw e;
        }
    },

    checkToken: async (token) => {
        try {
            const p = new Promise(((resolve, reject) => {
                request.post('http://account:8400/api/v1/account/check_token')
                // .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
                    .type('application/x-www-form-urlencoded')
                    .send({
                        token
                    })
                    .timeout({
                        response: 60000,
                        deadline: 60000,
                    })
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
            }));


            return p;
        } catch (e) {
            throw e;
        }
    },
};
