/*===================================
 * Date 类重写和扩展
 * By PerfyLee 2015/09/11 
 *===================================/


/**   
 * 对Date toString方法的重写，将 Date 转化为指定格式的String   
 * 参数:
 * format(String)
 * 年(y)可以用 1-4 个占位符，月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符  ,毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
 * 参数为空时，默认设置为 yyyy/MM/dd HH:mm:ss
 * 参数为 D 时，表示格式化为短日期 yyyy/MM/dd
 * 返回值 String
 * eg:    
 * new Date().toString("yyyy-MM-dd HH:mm:ss") ==> 2009-03-10 20:09:04 
 * new Date().toString("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
 * new Date().toString("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04   
 * new Date().toString("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04   
 * new Date().toString("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04   
 * new Date().toString("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18   
 * new Date().toString() ==> 2009/03/10 20:09:04    
 * new Date().toString('D') ==> 2009/03/10
 */

Date.prototype.oldToString = Date.prototype.toString;

Date.prototype.toString = function (format) {
    if (!format)
        return this.oldToString();


    format == "DT" && (format = 'yyyy/MM/dd HH:mm:ss');
    format == 'D' && (format = 'yyyy/MM/dd');

    var o = {
        "M+": this.getMonth() + 1, //月份     
        "d+": this.getDate(), //日     
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时     
        "H+": this.getHours(), //小时     
        "m+": this.getMinutes(), //分     
        "s+": this.getSeconds(), //秒     
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度     
        "S": this.getMilliseconds() //毫秒     
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return format;
}

/**
* 获取对象的日期部分 
* 返回值 Date
* eg:
* new Date().toString()             ===> 2015/09/11 13:31:23
* new Date().dateValue().toString() ===> 2015/09/11 00:00:00
*/
Date.prototype.dateValue = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}

/**
 * 时间比较
 * 参数：
 * date 为比较时间 (Date)
 * type 为比较类型 (String) d 天（只比较日期部分）， H 小时， m 分钟， s 秒，S 毫秒 (默认值)
 * 返回值：Number
 * eg:
 * var date1 = new Date(2015,8,13 12:00:00)
 * var date2 = new Date(2015,8,12 12:00:00)
 * date1.dateDiff(date2)     === > 86400000
 * date1.dateDiff(date2,'S') === > 86400000
 * date1.dateDiff(date2,'s') === > 86400
 * date1.dateDiff(date2,'m') === > 1440
 * date1.dateDiff(date2,'H') === > 24
 * date1.dateDiff(date2,'d') === > 1
 */
Date.prototype.dateDiff = function (date, type) {
    var types = ['d', 'H', 'm', 's', 'S']
    type || (type = 'S');

    types.indexOf(type) == -1 && (type = 'S');

    if (type == 'S') {
        return this - date;
    } else if (type == 's') {
        return parseInt((this - date) / 1000);
    } else if (type == 'm') {
        return parseInt((this - date) / (1000 * 60));
    } else if (type == 'H') {
        return parseInt((this - date) / (1000 * 60 * 60));
    } else if (type == 'd') {
        //只比较日期部分
        return (this.dateValue() - date.dateValue()) / (1000 * 60 * 60 * 24);
    }
}

/**
 * 时间修改
 * 参数：
 * interval(Number) 增加间隔 可为负值 
 * type(String) 修改类型  y 年， M 月 ，d 天 (默认值)， H 小时， m 分钟， s 秒，S 毫秒
 * 返回值 Date
 * eg:
 * var date = new Date(2015,8,13,12,0,0,0)
 * date.toString()                    === > 2015/09/13 12:00:00.000
 * date.dateAdd(1).toString()         === > 2015/09/14 12:00:00.000
 * date.dateAdd(1,'y').toString()     === > 2016/09/13 12:00:00.000
 * date.dateAdd(1,'M').toString()     === > 2015/10/13 12:00:00.000
 * date.dateAdd(1,'d').toString()     === > 2015/09/14 12:00:00.000
 * date.dateAdd(1,'H').toString()     === > 2015/09/13 13:00:00.000
 * date.dateAdd(1,'m').toString()     === > 2015/09/13 12:01:00.000
 * date.dateAdd(1,'s').toString()     === > 2015/09/13 12:00:01.000
 * date.dateAdd(1,'S').toString()     === > 2015/09/13 12:00:01.001
 */
Date.prototype.dateAdd = function (interval, type) {

    isNaN(interval) && (interval = 0);

    var types = ['y', 'M', 'd', 'H', 'm', 's', 'S']
    type || (type = 'd');
    types.indexOf(type) == -1 && (type = 'd');

    var year = this.getFullYear() + (type == 'y' ? interval : 0);
    var month = this.getMonth() + (type == 'M' ? interval : 0);
    var date = this.getDate() + (type == 'd' ? interval : 0);
    var hours = this.getHours() + (type == 'H' ? interval : 0);
    var minutes = this.getMinutes() + (type == 'm' ? interval : 0);
    var seconds = this.getSeconds() + (type == 's' ? interval : 0);
    var milliseconds = this.getMilliseconds() + (type == 'S' ? interval : 0);

    return new Date(year, month, date, hours, minutes, seconds, milliseconds);

}

/**
 * 获取日期所在月份的第一天
 * 返回值 Date
 * eg:
 * new Date(2015,08,12).getFirstDayOfMonth().toString() ===> 2015/09/01 00:00:00
 * new Date(2015,08,15).getFirstDayOfMonth().toString() ===> 2015/09/01 00:00:00
 */
Date.prototype.getFirstDayOfMonth = function () {
    return new Date(this.getFullYear(), this.getMonth(), 1);
}

/**
 * 获取日期所在月份的最后一天
 * 返回值 Date
 * eg:
 * new Date(2015,08,12).getFirstDayOfMonth().toString() ===> 2015/09/30 00:00:00
 * new Date(2015,08,15).getFirstDayOfMonth().toString() ===> 2015/09/30 00:00:00
 */
Date.prototype.getLastDayOfMonth = function () {
    return this.dateAdd(1, 'M').getFirstDayOfMonth().dateAdd(-1).dateValue();
}

/**
 * 获取日期所在月份的天数
 * 返回值 Number
 * eg:
 * new Date(2015,8,13 12:00:00.000).getDaysOfMonth()  ===> 30
 */
Date.prototype.getDaysOfMonth = function () {
    return this.getLastDayOfMonth().dateDiff(this.getFirstDayOfMonth(), 'd') + 1;
}

/**
 * 获取日期所在星期的第一天
 * 参数 type   zh 表示一周从周一开始(默认)，en 表示一周从周日开始
 * 返回值 Date
 * eg:
 * new Date(2015,08,13).getFirstDayOfWeek().toString() ===> 2015/09/07 00:00:00
 * new Date(2015,08,13).getFirstDayOfWeek('en').toString() ===> 2015/09/13 00:00:00
 */
Date.prototype.getFirstDayOfWeek = function (type) {

    type || (type = 'zh');
    (type != 'zh' && type != 'en') && (type = 'zh');

    var day = this.getDay();

    if (type == 'zh') {
        day = day == 0 ? 7 : day;
        day = day - 1;
    }

    return this.dateAdd(day * -1).dateValue();
}

/**
 * 获取日期所在星期的第最一天
 * 参数 type   zh 表示一周从周一开始(默认)，en 表示一周从周日开始
 * 返回值 Date
 * eg:
 * new Date(2015,08,13).getLastDayOfWeek().toString() ===> 2015/09/13 00:00:00
 * new Date(2015,08,13).getLastDayOfWeek('en').toString() ===> 2015/09/19 00:00:00
 */
Date.prototype.getLastDayOfWeek = function (type) {
    return this.getFirstDayOfWeek(type).dateAdd(6);
}