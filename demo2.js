/*
* @Author: liyunjiao
* @Date:   2019-05-20 16:29:29
* @Last Modified by:   liyunjiao
* @Last Modified time: 2019-05-24 15:17:10
*/

import Emitter from 'events';
import puppeteer from 'puppeteer';
import config from './config';
import cheerio from 'cheerio';
import path from 'path';

const forbidenArray = ['对外投资','融资动态','抽插检查','裁判文书','法院公告','送达公告','司法协助','工商信息'];

class Qcc extends Emitter {
    constructor(){
        super();
        this.page = null;
        this.browser = null;
        this.loginUrl = 'https://www.qichacha.com/user_login?back=%2F';
        this.radarUrl = 'https://www.qichacha.com/radar';
        this.loginPageBtns = {
            tabLogin:'#normalLogin', // 密码登录tab
            inputUser:'#nameNormal', // 用户名输入框
            inputPwd:'#pwdNormal', // 密码输入框
            btnSlider:'.btn_slide', // 人机验证滑动条按钮
            submitLogin:'button[type=submit]' // 登录提交按钮
        };
    }
    // 登录获取页面数据
    async openQccPage(){
        await this.page.goto(this.loginUrl);
        await _timeout(2);
        // 点击用户名密码登录按钮
        this.page.click(this.loginPageBtns.tabLogin);
        await _timeout();
        // 输入用户名
        this.page.type(this.loginPageBtns.inputUser,config.username);
        await _timeout();
        // 输入密码
        this.page.type(this.loginPageBtns.inputPwd,config.password);
        await _timeout();
        // 计算滑块位置及滑动距离
        let val= await _getSliderPosition(this.page);
        // 开始滑动
        this.page.mouse.click(val.x,val.y);
        this.page.mouse.down(this.loginPageBtns.btnSlider);
        // 模拟真人分两次滑动
        this.page.mouse.move(val.x+val.distance/4,val.y,{steps:5});
        await _timeout(Math.ceil(Math.random()*3));
        this.page.mouse.move(val.x+val.distance/2,val.y,{steps:5});
        await _timeout(Math.ceil(Math.random()*3));
        this.page.mouse.move(val.x+(val.distance*3)/4,val.y,{steps:5});
        await _timeout(Math.ceil(Math.random()*3));
        this.page.mouse.move(val.x+val.distance,val.y,{steps:5});
        await _timeout(3);
        // 判断是否存在验证码
        let imgSrc = await _isCaptchaImg(this.page);
        if(imgSrc){
            // 存在验证码无法登陆，等待一段时间再次尝试登录
            return false;
        } else {

            // await _timeout();
            // this.page.click(this.loginPageBtns.submitLogin);
            // await _timeout(3);
            // this.page.goto(this.radarUrl);
            // await _timeout(3);
            // let cookie = await this.getPageCookie();
            // if(cookie){
            //     let pageInfo = await _analysisHtml(this.page);
            //     await _timeout();
            //     return pageInfo;
            // } else {
            //     return false;
            // }
        }
    }
    // 获取页面cookie
    async getPageCookie(){
        return await this.page.evaluate(()=>{
            const userContent = document.querySelector('.user-drop')
            let userText = userContent?userContent.innerHTML:false;
            console.log('用户相关信息:',userText);
            let reg = /\u4f01\u9e45pmlt/;
            if(userText && reg.test(userText)){
                return document.cookie;
            } else {
                return false;
            }
        });
    }
    // 开始爬取
    async begin(){
        this.browser = await puppeteer.launch({
            devtools:true,
            headless:false
        });
        this.page = await this.browser.newPage();
        // await this.page.addScriptTag({path:path.resolve('./jquery.min.js')});
        return await this.openQccPage();
    }
}


async function _timeout(delay=1){
    let delayTime = 1000*delay;
    return new Promise((resolve, reject) => {   
       setTimeout(() => {   
              try {
                  resolve(1)
              } catch (e) {
                  reject(0)
               }
       }, delayTime);
    });
}
// 获取滑动条距离
async function _getSliderPosition(page){
    return await page.evaluate(()=>{
        // 找到滚动条
        const slider = document.querySelector('.btn_slide');
        const {clientWidth,clientHeight} = slider;
        let olt = getAbsolutePosition(slider);
        // 计算需要滑动的距离
        const bar = document.querySelector('.nc-lang-cnt');
        let distance = bar.clientWidth-clientWidth;
        return {
            x:clientWidth/2+olt.left,
            y:clientHeight/2+olt.top,
            distance
        };

        function getAbsolutePosition(dom,left=0,top=0){
            let parent = dom.offsetParent;
            if(!parent || parent.tagName=='HTML'){
                return {
                    left:left+dom.offsetLeft,
                    top:top+dom.offsetTop
                }
            } else {
                return getAbsolutePosition(parent,left+dom.offsetLeft,top+dom.offsetTop);
            }
        }
    });
}

// 判断是否存在验证码图片
async function _isCaptchaImg(page){
    return await page.evaluate(function(){
        const img = document.querySelector('#nc_1__imgCaptcha_img img');
        if(img && img.src){
            return img.src;
        } else {
            return false;
        }
    });
}

// 解析抓取的html
async function _analysisHtml(page){
    let html = await page.content();
    const $ = cheerio.load(html);
    let $trs = $('.ptable tbody tr');
    let arr = [];
    for(let i=0;i<5;i++){ // todo
        let $tds = $trs.eq(i).find('td');
        let varietyType = $tds.eq(2).text().trim();
        if(!forbidenArray.includes(varietyType)){
            let obj={
                companyName:$tds.eq(0).text().trim(),
                riskLevel:$tds.eq(1).text().trim(),
                varietyType,
                varietyDate:$tds.eq(4).text().trim(),
                varietyContent:$tds.eq(3).text().trim()
            }
            arr.push(obj);
        }
    }
    return arr;
}



export default Qcc;
