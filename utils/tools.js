/*
* @Author: liyunjiao2048@163.com
* @Date:   2019-03-27 15:32:37
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2019-03-27 15:32:54
*/

export function judgeType(param) {
    if(param === null){
        return 'null';
    }
    var str = Object.prototype.toString.call(param);
    var reg = /^\[\w+\s(\w+)\]$/;
    var type = str.match(reg)[1];
    return type.toLowerCase();
}