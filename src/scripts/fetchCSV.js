// var HTMLParser = require('node-html-parser');
import { parse } from 'node-html-parser';
// const fetch = require('node-fetch');
import fetch from 'node-fetch';
// import { exit } from 'process';

const url = 'https://classroom.github.com/classrooms/19380377-learning-rust/assignments/learn_rust_rustlings?passing=true&updated_at=asc'
//const response = await fetch('https://api.github.com/users/github');

async function get_html_from_url(url) {

  // const response = await fetch(url);
  const response = await fetch("https://classroom.github.com/classrooms/19380377-learning-rust/assignments/learn_rust_rustlings?passing=true&updated_at=asc", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "_octo=GH1.1.1205739955.1648604764; logged_in=yes; dotcom_user=limingth; color_mode=%7B%22color_mode%22%3A%22auto%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D; preferred_color_mode=light; tz=Asia%2FShanghai; _github_classroom_session=srXqCxwk6ho1pnPOmw60MRG9aVIQhg5tJPYrOoBJgg%2FNP7MhXZ2WmIoajsZm99rJwJIkE5sCDgc3%2FEYukNxtaNpGgdUb45skP%2Fqn7XCBYjpRxtddZ%2FNPd12KvPTrAbd3KSUCufVrHUWVJn%2BncbNi7m8vEBLmIqzO45oamhxU2Ezh2xAkHguqufif%2Bp3jfk4uSedT%2Fdnx0zdsxtyikhL8jLTwB%2BUOYqyIoTR8Gclm%2BAo9z3X9cDprddlpo870S7hZfOdzs9aT0IBZJ7dkO3Qlh6IrCfRFguJMpK2I2Ui89KOjuZTdhrfLyaSx2q8TzeQ4NhdRMqexQXbYydo%2BjsxdXWt8LllanMYAL4LV6UjYqLSeDNHMMo9gX60FzkFpv88FLIG%2BkoiJp9sW20lFX2K7Ci08hTYvpgsBUm7Jrhhj8CP61Y6Fakd3zAbeBdusEQakSw%3D%3D--nhsntPmq9xikaQIe--95o%2F6quBwGvXcYSAbJcI6Q%3D%3D"
  },
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET"
});
// const response = await fetch("https://classroom.github.com/classrooms/19380377-2022-training-comp-on-open-source-os/assignments/lab0-0-setup-env-run-os1/download_grades", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
//     "if-none-match": "W/\"91c8c819008d409c96ac22f96ff4029d\"",
//     "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "none",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "cookie": "_octo=GH1.1.980811440.1655977492; logged_in=yes; dotcom_user=july-12; color_mode=%7B%22color_mode%22%3A%22auto%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark_dimmed%22%2C%22color_mode%22%3A%22dark%22%7D%7D; tz=Asia%2FShanghai; preferred_color_mode=light; _github_classroom_session=exejpR%2BWDTupP8l3%2BCUr1XwrdBUtM7NTGI8UhGQUBxNsin2Tu8tTjt2mfyPH302l80%2F7%2BfBY0KKWvIDA5s03BGtb%2F0OXXgZL2u7aUxDp19slpfPXYPiP%2FZWIoVwbAQwGbzhMsx0xk3mgyW%2BfbwuuPskydJW0UVBTrG3XV%2BE8Ou1hFNPC0IIxNyQNRUOSHi74lDTHR6w27r7MxfX70HzaeyhfhfDJxt76wm4AcOuzNycXN6U1KzM%2BOcca9m7n8IOWCxLFcP5gEaLreMfnK44OmRu9vsFYk%2BylbzmwW8ukQfUe9MVfFsjIWQ8numYkwvOU0Ksv6qupSg9VcI9Obyj48QHI8Ezu7mUu05%2B%2BmRpxhCngF9EwS57%2BECdpSbld3m29lJe%2BAqeT2hnsfTJDSariWWRzM409nMXt%2FlUHRCoRSD98jpK381mKm1z13TqCz31hDnwJp3PHUGGC%2BSpFSGzn3zW1JWO42EUaTozD8hWJSnW7--70oVkSTvM5NGI5Py--J%2Bg2Fv8Gk0NQusz5n3GcZA%3D%3D"
//   },
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET"
// });

console.log(response)
  const html = await response.text();

  console.log(html);

  return html;
}

async function main() {

  const data = await get_html_from_url(url);
  process.exit(0)
  // var root = parse(data).childNodes[1];
  var root = parse(data);
  // console.log('root', root)

  // var body = root.childNodes[1].childNodes[3];
  // console.log('body', root.childNodes[1].childNodes[3])

  let list = root.getElementById('assignment-repo-list')
  // console.log('list', list)

  // process.exit(0)
  list = list.childNodes

  for (let i = 0; i < list.length; i++) {
    let child = list[i]
  	// console.log('child', i, child)
    if(child.nodeType === 1) 
    {
      let username = child.childNodes[1].childNodes[1].childNodes[1].rawAttrs.split(' ')[6].split('/')[3]
      let commits = child.childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[3].childNodes[0]._rawText
      console.log('user ', (i+1)/2, ',', username, ',', commits, '\n')
    }
  }
  process.exit(0)

  // child = list[1]
  // console.log('child 1', child)
  // while(child != list.lastChild) {
  //   if(child.nodeType === 1) 
  //   {
  //   //console.log( child.firstElementChild.firstElementChild.firstElementChild.href.split('/')[3])
  //   console.log( child.firstElementChild)
  //     console.log('-----');
  // //    console.log(child)
  //   }
  //   child = child.nextSibling
  // }

}

main()