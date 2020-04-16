'use strict';
const fs = require('fs');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');
const schedule = require('node-schedule');
var request = require('request');

function scheduleCancel() {

    var counter = 1;

    // 参数： 秒 时 分 日 月 周几
    const j = schedule.scheduleJob('30 * * * * *', function () {

        console.log('定时器触发次数：' + counter);
        counter++;

        const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'));

        request({
            url: "https://www.easy-mock.com/mock/5afe2aadf2c87c0a2bc41ed1/example/getUserInfo",//请求路径
            method: "GET",//请求方式，默认为get
            headers: {//设置请求头
                "content-type": "application/json",
            },
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log("res",JSON.parse(body).data);

                let resData = JSON.parse(body).data;

                // 使用ejs填充后端相应数据，然后发送给客户端
                const html = template({
                    name: resData.name, // 最终标题: hello ejs (subject + title)
                    age: resData.age,
                });

                // 邮箱接收者
                let mailOptions = {
                    from: '"JavaScript之禅" <270029631@qq.com>', // sender address
                    to: 'cjg_free@163.com', // list of receivers
                    subject: '汇报-', // Subject line
                    html: html,// html body
                };


                // 邮箱发送者
                let transporter = nodemailer.createTransport({
                    // host: 'smtp.ethereal.email',
                    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
                    port: 465, // SMTP 端口
                    secureConnection: true, // 使用了 SSL

                    auth: {
                        user: '270029631@qq.com',
                        // 这里密码不是qq密码，是你设置的smtp授权码
                        pass: 'xxxxxxxxx',
                    }
                });

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
                });
            }
        });

    });

    // setTimeout(function() {
    //     console.log('定时器取消')
    //   // 定时器取消
    //     j.cancel();   
    // }, 5000);

}

scheduleCancel();