import * as fs from 'fs';
import * as path from 'path';
const isProd = process.env.NODE_ENV === 'production';



function parseEnv() {
  const localEnv = path.resolve('.env');
  const prodEnv = path.resolve('.env.prod');

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('缺少环境配置文件');
  }
  console.log('localEnv', localEnv)
  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;

  console.log('_____________________', process.env.NODE_ENV, isProd)
  return { path: filePath, isProd: !!isProd };
}
export default parseEnv();

