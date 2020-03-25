import axios from "axios";
import qs from "querystring";
import { isDev } from "./util";
const http = function({
  url = "",
  method = "post",
  params = {},
  file = "",
  can,
  otherParams = {}
}: any) {
  if (!url) {
    return false;
  }

  const head = {
    withCredentials: true
  };
  let _promise = new Promise((resolve, reject) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("data", JSON.stringify(params));
    }
    // eslint-disable-next-line guard-for-in
    for (let key in otherParams) {
      const item = otherParams[key];
      let val = item;
      if (item instanceof Object) {
        val = JSON.stringify(val);
      }
      formData.append(key, val);
    }

    axios({
      ...head,
      url: url,
      method,
      data: formData,
      headers: {
        Authorization: ""
      },
      cancelToken: new axios.CancelToken((c: any) => {
        if (can === undefined) return;
        can.cancel = c;
      })
    })
      .then((res: any) => {
        const { data } = res;
        const { code, message, hash } = data;
        if (code === 200100000) {
          resolve(data);
        } else if (code === "-99998") {
          if (isDev()) {
            login().then(() => {
              window.location.reload();
            });
          }
        } else {
          if (hash && file) {
            resolve(data);
          } else {
            reject(data);
          }
        }
      })
      .catch((err: any) => {
        if (err.message !== "cancel") {
          console.error(err);
          reject(err);
        }
      });
  });
  return _promise;
};

function login() {
  console.error("自动登陆一下!");
  const { REACT_APP_ACCOUNT: acct, REACT_APP_PASSWORD: password } = process.env;
  let p = {
    ajax_act: "login",
    data: JSON.stringify({ acct, password, code: "", cache_acct: 0 })
  };
  return axios.post("/index.php?m=login", qs.stringify(p));
}

export default http;
