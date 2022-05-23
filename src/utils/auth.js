import Cookies from 'js-cookie'
import { toCode, fromCode } from "@/utils/en-de-code";

/*
      const t = toCode(this.loginForm.username);
      const f = fromCode(t);
*/

export function getToken() {
  let token='';
  const tokenCode = Cookies.get('vue_video_token');
  if (typeof tokenCode === 'string')
     token = fromCode(tokenCode);
  return token
}

export function checkThridParty(to)
{
  let isThridPartyLogin=false;
  if(to.path=="/callback"){
    isThridPartyLogin=true;
  }
  else if(to.query)
  {
    if(to.query.token)
    isThridPartyLogin=true;
  }
  return isThridPartyLogin
}


export function getLoginTime() {
  const value = Cookies.get('vue_logintime');
  return value
}

export function setLoginTime(loginTime) {
  if(loginTime)
  {
    loginTime=loginTime.replace(' ','')
  }
  return Cookies.set('vue_logintime', loginTime)
}

export function setTokenOptions(token,options) {
  return Cookies.set('vue_video_token', toCode(token),options)
}

export function setToken(token) {
  return Cookies.set('vue_video_token', toCode(token))
}

export function removeToken() {
  return Cookies.remove('vue_video_token')
}
/************************************************/
export function getCookies(cookieKey) {
  return Cookies.get(cookieKey)
}

export function setCookies(cookieKey, cookieValue) {
  return Cookies.set(cookieKey, cookieValue)
}

export function removeCookies(cookieKey) {
  return Cookies.remove(cookieKey)
}