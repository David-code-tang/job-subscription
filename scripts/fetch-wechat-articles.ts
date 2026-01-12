/**
 * 获取微信公众号历史发文列表
 * 使用极致了 API
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

const API_KEY = 'JZL7505fbcaf2e5fdc8';
// 尝试多个可能的 API 地址
const API_URLS = [
  'https://api.dajiala.com/api/v1/wechat/article/list',
  'https://dajiala.com/api/v1/wechat/article/list',
  'https://www.dajiala.com/api/v1/wechat/article/list',
  'https://api.jizhile.com/api/v1/wechat/article/list',
  'https://api.jzl.com/api/v1/wechat/article/list',
];

interface Article {
  position: number;
  url: string;
  post_time: number;
  post_time_str: string;
  cover_url: string;
  title: string;
  digest: string;
  appmsgid: number;
  msg_status: number;
  is_delete: number;
  types: number;
  pic_cdn_url_235_1: string;
  pic_cdn_url_1_1: string;
}

interface ApiResponse {
  code: number;
  msg: string;
  oa_name: string;
  data: Article[];
  offset: string;
  is_end: number;
  error_msg: string;
}

/**
 * 发送 HTTP/HTTPS 请求
 */
function fetchRequest(url: string, data: any): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const protocol = isHttps ? https : http;

    const postData = JSON.stringify(data);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      // 忽略 SSL 证书验证
      rejectUnauthorized: false,
    };

    const req = protocol.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`解析响应失败: ${responseData.substring(0, 200)}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 获取公众号历史文章列表
 * @param name 公众号名称
 * @param biz 公众号biz（可选）
 * @param offset 翻页偏移（可选）
 */
async function fetchArticles(name: string, biz?: string, offset?: string): Promise<ApiResponse> {
  // 尝试所有可能的 API URL
  for (const url of API_URLS) {
    try {
      console.log(`尝试 API 地址: ${url}`);
      const data = {
        key: API_KEY,
        name: name,
        biz: biz,
        offset: offset,
      };

      const response = await fetchRequest(url, data);
      console.log(`  ✓ 成功连接到: ${url}`);
      return response;
    } catch (error) {
      console.log(`  ✗ 连接失败: ${(error as Error).message}`);
      continue;
    }
  }
  throw new Error('所有 API 地址都无法连接');
}

/**
 * 获取所有历史文章（自动翻页）
 * @param name 公众号名称
 * @param biz 公众号biz（可选）
 */
async function fetchAllArticles(name: string, biz?: string): Promise<Article[]> {
  const allArticles: Article[] = [];
  let offset: string | undefined = undefined;
  let page = 1;

  console.log(`开始获取公众号 "${name}" 的历史文章...`);

  while (true) {
    console.log(`正在获取第 ${page} 页...`);
    const response = await fetchArticles(name, biz, offset);

    if (response.code === 0) {
      console.log(`✓ 第 ${page} 页获取成功，共 ${response.data.length} 篇文章`);
      allArticles.push(...response.data);

      if (response.is_end === 1) {
        console.log('✓ 已获取所有文章');
        break;
      }

      offset = response.offset;
      page++;

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.error(`✗ 获取失败: ${response.msg}`, response.error_msg);
      break;
    }
  }

  return allArticles;
}

/**
 * 主函数
 */
async function main() {
  const accountName = '逛逛GitHub';
  // 如果有 biz，可以在这里填写，biz 更准确且费用更低
  // const accountBiz = 'Mzxxxxxxxxxxxx==';

  try {
    const articles = await fetchAllArticles(accountName);

    console.log(`\n总共获取到 ${articles.length} 篇文章`);
    console.log('\n前 10 篇文章：');
    articles.slice(0, 10).forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   发布时间: ${article.post_time_str}`);
      console.log(`   链接: ${article.url}`);
      console.log('');
    });

    // 保存到 JSON 文件
    const fs = require('fs');
    const path = require('path');
    const outputDir = path.join(__dirname, '..', 'data');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, `${accountName}_articles.json`);
    fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2), 'utf-8');
    console.log(`✓ 文章数据已保存到: ${outputFile}`);

    // 保存为 CSV 文件
    const csvFile = path.join(outputDir, `${accountName}_articles.csv`);
    const csvHeader = '序号,标题,发布时间,链接,封面图\n';
    const csvContent = articles.map((article, index) => {
      return `${index + 1},"${article.title.replace(/"/g, '""')}","${article.post_time_str}","${article.url}","${article.cover_url}"`;
    }).join('\n');
    fs.writeFileSync(csvFile, csvHeader + csvContent, 'utf-8');
    console.log(`✓ 文章数据已保存到: ${csvFile}`);

  } catch (error) {
    console.error('执行失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main();
