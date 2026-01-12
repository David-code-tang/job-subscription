'use client'

export default function SimpleTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ S2 组件测试页面</h1>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h2>如果你能看到这个页面，说明 Next.js 路由正常工作</h2>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>检查清单：</h3>
        <ul>
          <li>✅ Next.js 路由工作正常</li>
          <li>✅ 页面可以访问</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
        <h3>✨ 说明</h3>
        <p>这是一个非常简单的测试页面，用于确认 Next.js 路由是否正常工作。</p>
        <p>如果你能看到这个页面，说明代码部署成功了。</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/dashboard" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          返回 Dashboard
        </a>
      </div>
    </div>
  )
}
