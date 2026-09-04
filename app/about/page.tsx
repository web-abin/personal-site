import type { Metadata } from 'next';
import {
  GitFork,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  Code2,
  ArrowUpRight,
} from 'lucide-react';
import { Header, Footer, Label } from '@/components/site-shell';
export const metadata: Metadata = {
  title: '关于我',
  description: '了解王俊彬的个人信息、经历与联系方式。资料持续补充中。',
};
export default function About() {
  return (
    <>
      <Header />
      <main id="main" className="wrap">
        <section className="page-heading about-heading">
          <Label>多了解我一点</Label>
          <div className="heading-row">
            <h1>
              作品之外，
              <br />
              也是<span className="serif">生活。</span>
            </h1>
            <p>
              这里不只有一份履历。
              <br />
              也有我的来路、兴趣，以及想去的地方。
            </p>
          </div>
        </section>
        <section className="about-intro">
          <div className="identity-panel">
            <div className="visual-top">
              <span>作品背后的我</span>
              <span>01</span>
            </div>
            <div className="monogram" aria-hidden="true">
              王<span>·</span>俊斌
            </div>
            <div className="identity-bottom">
              <div>
                <h2>王俊彬</h2>
                <span>个人档案</span>
              </div>
              <span className="identity-note">
                个人档案
                <br />
                持续完善中
              </span>
            </div>
          </div>
          <div className="about-copy">
            <Label>很高兴认识你</Label>
            <h2>你好，我是王俊彬。</h2>
            <p>
              我希望这个网站能让你通过具体的作品，了解我做过什么、如何思考，以及我在意什么。
            </p>
            <p>
              这份个人介绍会随着真实经历逐步完善。工作背景、教育经历与技术方向，暂时留待补充。
            </p>
            <div className="facts">
              {[
                [MapPin, '所在城市', '待补充'],
                [Code2, '职业方向', '待补充'],
                [GraduationCap, '教育背景', '待补充'],
              ].map(([Icon, label, value]) => {
                const I = Icon as typeof MapPin;
                return (
                  <div key={String(label)}>
                    <I size={17} />
                    <span>{String(label)}</span>
                    <strong>{String(value)}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="section about-journey">
          <div>
            <Label>01 / 我的经历</Label>
            <h2>
              每一站，
              <br />
              <span>都算数。</span>
            </h2>
          </div>
          <div className="journey-list">
            <div>
              <span className="journey-dot" />
              <span className="mono">现在 / 2026</span>
              <h3>建立自己的数字空间</h3>
              <p>整理经历与作品，搭建个人网站，并持续迭代。</p>
            </div>
            <div>
              <span className="journey-dot hollow" />
              <span className="mono">时间待补充</span>
              <h3>工作与项目经历</h3>
              <p>待补充公司、职位、职责，以及代表性的工作成果。</p>
            </div>
            <div>
              <span className="journey-dot hollow" />
              <span className="mono">时间待补充</span>
              <h3>教育与学习经历</h3>
              <p>待补充院校、专业与在校经历。</p>
            </div>
          </div>
        </section>
        <section className="section interest-section">
          <Label>02 / 屏幕之外</Label>
          <div className="section-head">
            <h2>
              屏幕之外，<span>保持好奇。</span>
            </h2>
            <span className="muted">兴趣爱好待补充</span>
          </div>
          <div className="interest-copy">
            <span className="asterisk" aria-hidden="true">
              ✳
            </span>
            <p>
              这里留给工作以外的自己。
              <br />
              <span>喜欢的事物、长期的习惯，以及生活中的灵感。</span>
            </p>
          </div>
        </section>
        <section id="contact" className="section contact-section">
          <div className="section-head">
            <div>
              <Label>03 / 在这里找到我</Label>
              <h2>
                在别处，<span>找到我。</span>
              </h2>
            </div>
            <span className="muted">账号信息确认后开放访问</span>
          </div>
          <div className="contact-grid">
            {[
              [Mail, '电子邮箱', '直接与我联系'],
              [GitFork, 'GitHub', '代码与开源项目'],
              [BookOpen, '掘金', '技术文章与思考'],
              [Code2, 'CSDN', '学习记录与分享'],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof Mail;
              return (
                <div className="contact-card" key={String(title)}>
                  <div className="contact-card-top">
                    <I size={25} />
                    <span>待补充</span>
                  </div>
                  <h3>{String(title)}</h3>
                  <p>{String(desc)}</p>
                  <span className="contact-pending">
                    {title === '电子邮箱'
                      ? '邮箱地址待补充'
                      : '个人主页地址待补充'}
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
