/**
 * 验证身份证
 * @param {*} value
 */
const validateIdCard = (value)=> {
  value = value.toUpperCase(); //转换为大写
  //地址编码
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  };
  if (!city[value.substr(0, 2)]) {
    return false;
  }
  //检查身份证格式及长度
  if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
    return false;
  }
  //生日日期是否正确
  if (value.length == 15) {
    var reg = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
    var arrSplit = value.match(reg);
    var dtmBirth = new Date('19' + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
    var bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
    if (!bGoodDay) {
      return false;
    }
  }
  if (value.length == 18) {
    var reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    var arrSplit = value.match(reg);
    var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
    var bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
    if (!bGoodDay) {
      return false;
    }
  }
  //检查身份证号码末位校验码
  var valnum, nTemp = 0;
  // 加权因子
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验位
  var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  if (value.length == 15) {
    //把身份证号码转为18位
    value = value.substr(0, 6) + '19' + value.substr(6, value.length - 6);
  }
  for (var i = 0; i < 17; i++) {
    nTemp += value.substr(i, 1) * factor[i];
  }
  valnum = parity[nTemp % 11];
  if (valnum != value.substr(17, 1)) {
    return false;
  }
  return true;
};
/**
 * 座机
 * @param {*} value 
 */
const isLandLine =  (value)=> {
  const isLandLine = /^(((0\d{3}[\-])?\d{7,8}|(0\d{2}[\-])?\d{8}))(|[\-]\d{1,4})?$/;
  if (value.length > 0) {
    if (!isLandLine.test(value.trim())) {
      return false;
    }
  }
  return true;
};
/**
 * 传真号码
 * @param {*} value 
 */
const isfaxNumber=  (value)=> {
  var faxNumber = /^(((0\d{3}[\-])?\d{7}|(0\d{2}[\-])?\d{8}))?$/;
  if (value.length > 0) {
    if (!(faxNumber.test(value.trim()))) {
      return false;
    }
  }
  return true;
};
module.exports = {
  validateIdCard,
  isfaxNumber,
  isLandLine
}
