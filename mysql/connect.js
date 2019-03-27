/*
* @Author: liyunjiao2048@163.com
* @Date:   2019-03-27 15:18:46
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2019-03-27 15:19:06
*/

let CONF = {
    host:'10.117.140.34',  // ip也行域名也行
    user:'root',
    password:'19880923',
    connectionLimit:10,
    database:'jgs_sysdb', // database
    port:'8306'
}


if(process.env.NODE_ENV == 'production'){
    CONF = {
        host:'10.92.184.55',  // ip也行域名也行
        user:'regtech',
        password:'7e5z2t',
        connectionLimit:10,
        database:'jgs_sysdb', // database
        port:'8306'
    }
}

export default CONF;