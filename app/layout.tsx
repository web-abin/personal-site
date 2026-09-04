import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: {default:'王俊彬 · 个人作品集',template:'%s · 王俊彬'}, description:'关于我的经历、思考，以及从想法到实现的作品。个人网站 MVP，部分资料待补充。',openGraph:{title:'王俊彬 · 个人作品集',description:'经历、思考与作品。'},twitter:{card:'summary',title:'王俊彬 · 个人作品集',description:'经历、思考与作品。'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN" className="dark"><body>{children}</body></html>}
