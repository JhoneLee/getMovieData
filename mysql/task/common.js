/*
* @Author: liyunjiao2048@163.com
* @Date:   2019-03-27 15:25:44
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2019-03-27 15:33:49
*/
import {query} from '../pool';
import {judgeType} from '../../utils/tools';
export async function insertData(sql,tag){
    const conn = await query();
    try{
        await conn.beginTransaction(); // begin;
        let result = await conn.query(sql);
        await conn.commit();// commit
        console.log(`插入${tag||''}数据执行结果:`,result);
        return result;
    } catch(e){
        e.msg = `插入${tag||''}数据错误`;
        console.error(e);
        await conn.rollback();
        throw e;
        return false;
    }
}

export async function getData(sql,tag){
    try{
        let result = await query(sql);
        let type = judgeType(result);
        return type == 'array'?result:[];
    } catch(e){
        e.msg = `获取${tag||''}错误`;
        console.error(e);
        return [];
    }
}