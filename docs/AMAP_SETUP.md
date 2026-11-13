# 高德地图接入

在本机 .env.local 填写 AMAP_WEB_KEY（Web服务类型）、AMAP_JS_KEY（Web端JS API类型）、AMAP_JS_SECURITY_CODE（对应JS安全密钥）。密钥不得提交GitHub。重新构建并重启，重新生成方案。

JS API在线加载真实底图；服务端驾车接口提取 steps.polyline，前端绘制三种颜色的道路折线、方向箭头、选中路线加粗和绘制动画。缺少路径时不生成替代曲线。地址仍为地理编码参考点，未核验景区入口，不能宣称最优路径或可直接出发。

当前没有凭证，真实调用尚未验收。构建与既有契约测试通过，不等于地图认证成功。

本机开发采用安全码配置接口，只有localhost入口可用；公开部署必须改用高德安全代理，不能将此开发配置接口直接公开。

依据：https://lbs.amap.com/api/javascript-api-v2/guide/abc/load 与 https://lbs.amap.com/api/webservice/guide/api/direction

## 2026-11-13 底图灰色网格修复

浏览器直连 jsapi.amap.com 的初始化请求出现 ERR_CONNECTION_CLOSED，但 Node 服务端可正常访问。前端通过当前 SDK 的 _AMapServiceConfig.customSet.permissions.host 配置，将初始化与瓦片权限服务指向本机 /api/amap-init。该配置来自当前加载的高德 SDK；升级 SDK 时需重新回归，不能当作稳定公共接口保证。

仅实现两个固定上游端点：GET /web/init、POST /web_map/get_tile。保留高德响应和鉴权，使用服务端配置的 JS Key，不接受任意目标 URL。仅允许本机访问，拒绝跨站请求，瓦片请求体限制 64 KiB，15 秒超时，无响应缓存。样式和图标仍从高德官方域名加载。未更改系统代理或浏览器安全设置。

地图状态改为等待 complete 事件，20 秒未完成显示重试提示。浏览器实测南京至苏州道路、地名、水域、路线箭头及起终点标记均显示。next build、服务回归测试通过；跨站 403 和超长请求 413 已验证。本次修复只验证本机环境，生产部署仍需单独配置。密钥与验证截图位于 Git 忽略目录，未上传。
