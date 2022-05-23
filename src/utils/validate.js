/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validPassword(str) {
  var reg = /^(?![\d]+$)(?![a-z]+$)(?![!@$&*]+$)[\da-z!@$&*]{6,12}$/;//6-12位小寫字母；數字、字母、特殊字符(!#$%^&*)，起碼其中兩種组合
             
  if (!reg.test(str)) {
    throw new Error('6-12位小寫字母、數字、特殊字符!@$&*，至少含其中兩種组合');
  } else
    return;
}