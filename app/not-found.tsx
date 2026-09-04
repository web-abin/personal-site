import Link from 'next/link';
import { Header, Footer, Label } from '@/components/site-shell';
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="wrap section">
        <Label>404 / 页面未找到</Label>
        <h1 style={{ margin: '35px 0' }}>
          这一页，
          <br />
          还未发生。
        </h1>
        <Link className="pill primary" href="/works">
          回到作品集 ↗
        </Link>
      </main>
      <Footer />
    </>
  );
}
