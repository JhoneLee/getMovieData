/*
* @Author: liyunjiao2048@163.com
* @Date:   2019-03-27 15:06:03
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2019-03-27 15:06:25
*/

import mysql from 'promise-mysql';
import Promise from 'bluebird';
import conf from './connect';

export const pool = mysql.createPool(conf);

// 用using/dispsoer 模式构建连接
export function getSqlConnection(){
    return pool.getConnection().disposer((c)=>{
        pool.releaseConnection(c);
    });
}

// 使用bluebird 封装具有dispsoer功能的promise对象
export function query(sql){
    return Promise.using(getSqlConnection(),(con)=>{
        return sql?con.query(sql):con;
    })
}