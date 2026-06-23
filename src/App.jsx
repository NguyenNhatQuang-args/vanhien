import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './index.css'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

/* ============================================
   VHU LANDING PAGE — WORLD CUP 2026 EDITION
   Đại học Văn Hiến × Tinh thần Bóng đá
   ============================================ */

// ========== GSAP SNAP SCROLL MANAGER ==========
function useSnapScroll() {
  useLayoutEffect(() => {
    const sections = gsap.utils.toArray('.snap-section')
    if (sections.length === 0) return

    // Animate each section's children on scroll
    sections.forEach((section) => {
      const els = section.querySelectorAll('.gs-hidden, .gs-hidden-left, .gs-hidden-right, .gs-hidden-scale')
      if (els.length === 0) return

      gsap.to(els, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    // Snap scroll — each scroll goes to next section
    ScrollTrigger.create({
      snap: {
        snapTo: 1 / (sections.length - 1),
        duration: { min: 0.4, max: 0.8 },
        delay: 0.05,
        ease: 'power2.inOut',
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
}

// ========== NAVBAR ==========
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (selector) => {
    setMobileOpen(false)
    gsap.to(window, { scrollTo: { y: selector, offsetY: 0 }, duration: 0.8, ease: 'power2.inOut' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container">
        <a href="#" className="navbar-logo" onClick={() => scrollTo('#hero')}>
          <div className="logo-icon">⚽</div>
          <span>VHU 2026</span>
        </a>
        <div className={`navbar-nav ${mobileOpen ? 'active' : ''}`}>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('#about') }}>Giới thiệu</a>
          <a href="#wc-spirit" onClick={(e) => { e.preventDefault(); scrollTo('#wc-spirit') }}>World Cup</a>
          <a href="#programs" onClick={(e) => { e.preventDefault(); scrollTo('#programs') }}>Ngành học</a>
          <a href="#campus" onClick={(e) => { e.preventDefault(); scrollTo('#campus') }}>Campus</a>
          <a href="#admission" onClick={(e) => { e.preventDefault(); scrollTo('#admission') }}>Tuyển sinh</a>
          <a href="#cta" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('#cta') }}>Đăng ký ngay ⚽</a>
        </div>
        <div className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>
  )
}

// ========== SCROLL DOTS INDICATOR ==========
function ScrollDots() {
  const [active, setActive] = useState(0)
  const sectionIds = ['#hero', '#about', '#wc-spirit', '#programs', '#why-vhu', '#campus', '#admission', '#testimonials', '#cta']

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2
      const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean)
      sections.forEach((sec, i) => {
        if (sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY) {
          setActive(i)
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goTo = (id) => {
    gsap.to(window, { scrollTo: { y: id, offsetY: 0 }, duration: 0.8, ease: 'power2.inOut' })
  }

  return (
    <div className="scroll-indicator">
      {sectionIds.map((id, i) => (
        <div
          key={i}
          className={`scroll-dot ${i === active ? 'active' : ''}`}
          onClick={() => goTo(id)}
          title={id.replace('#', '')}
        />
      ))}
    </div>
  )
}

// ========== ANIMATED COUNTER ==========
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          let start = 0
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ========== HERO SECTION ==========
function HeroSection() {
  const heroRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8 })
        .from('.hero h1', { opacity: 0, y: 50, duration: 1 }, '-=0.4')
        .from('.hero-description', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
        .from('.hero-actions', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
        .from('.hero-stats', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
        .from('.hero-card-square', { opacity: 0, scale: 0.85, duration: 1.2 }, '-=1')
        .from('.hero-floating-badge', { opacity: 0, scale: 0, duration: 0.6, stagger: 0.15 }, '-=0.5')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero snap-section" id="hero" ref={heroRef}>
      {/* Background image: DH-Van-Hien.jpg */}
      <div className="hero-bg-image">
        <img src="/img/DH-Van-Hien.jpg" alt="Đại học Văn Hiến - HungHau Campus" />
      </div>
      <div className="hero-bg-overlay" />
      <div className="hero-bg-pattern" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">⚽</span>
              WORLD CUP 2026 × VHU
            </div>
            <h1>
              Tinh thần <span className="text-gold">World Cup</span>
              <br />
              Tại Đại học <span className="text-coral">Văn Hiến</span>
            </h1>
            <p className="hero-description">
              Mùa World Cup 2026 đang rực cháy — cùng VHU bùng nổ năng lượng! 
              Khám phá hành trình đại học đầy đam mê, nơi tinh thần thể thao 
              hòa quyện cùng tri thức, tạo nên thế hệ chiến binh tương lai.
            </p>
            <div className="hero-actions">
              <a href="https://tuyensinh.vhu.edu.vn" target="_blank" rel="noopener noreferrer" className="btn btn-white">
                🎓 Đăng ký Tuyển sinh 2026
              </a>
              <a href="#about" className="btn btn-outline" onClick={(e) => {
                e.preventDefault()
                gsap.to(window, { scrollTo: '#about', duration: 0.8, ease: 'power2.inOut' })
              }}>
                ▶ Tìm hiểu thêm
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="number"><AnimatedCounter end={27} suffix="+" /></div>
                <div className="label">Năm đào tạo</div>
              </div>
              <div className="hero-stat">
                <div className="number"><AnimatedCounter end={15000} suffix="+" /></div>
                <div className="label">Sinh viên</div>
              </div>
              <div className="hero-stat">
                <div className="number"><AnimatedCounter end={40} suffix="+" /></div>
                <div className="label">Ngành đào tạo</div>
              </div>
              <div className="hero-stat">
                <div className="number"><AnimatedCounter end={95} suffix="%" /></div>
                <div className="label">Việc làm sau tốt nghiệp</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-square">
              <img src="/img/bongda1.jpg" alt="Sinh viên VHU đá bóng tại sân cỏ nhân tạo" />
            </div>
            <div className="hero-floating-badge badge-top">
              <div className="hfb-icon coral">⚽</div>
              <div>
                <div className="hfb-text">World Cup 2026</div>
                <div className="hfb-sub">USA · Mexico · Canada</div>
              </div>
            </div>
            <div className="hero-floating-badge badge-bottom">
              <div className="hfb-icon teal">🎓</div>
              <div>
                <div className="hfb-text">Tuyển sinh 2026</div>
                <div className="hfb-sub">Đang mở đăng ký</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== ABOUT SECTION ==========
function AboutSection() {
  const features = [
    { icon: '⚽', text: 'CLB Bóng đá & Thể thao' },
    { icon: '🌍', text: 'Hợp tác quốc tế đa quốc gia' },
    { icon: '🏢', text: 'Cơ sở vật chất chuẩn 5 sao' },
    { icon: '💼', text: 'Kết nối doanh nghiệp' },
    { icon: '🏆', text: 'Giải thể thao sinh viên' },
    { icon: '🚌', text: 'Xe bus đưa đón miễn phí' }
  ]

  return (
    <section className="about snap-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-block gs-hidden-left">
            <div className="about-image-main">
              <img src="/img/DH-Van-Hien.jpg" alt="Khuôn viên Đại học Văn Hiến" />
            </div>
            <div className="about-badge">
              <span className="ab-number">1997</span>
              <span className="ab-text">Năm thành lập</span>
            </div>
          </div>
          <div className="about-content gs-hidden-right">
            <h2>
              Chào mừng đến với
              <br />
              Đại học <span className="teal">Văn Hiến</span>
            </h2>
            <p>
              Trường Đại học Văn Hiến (VHU) — thành lập năm 1997 tại TP.HCM,  
              mang biểu tượng Khuê Văn Các, tinh thần hiếu học Việt Nam. 
              Với 3 campus hiện đại: <strong>Harmony, HungHau và myU Campus</strong>, 
              VHU không chỉ đào tạo kiến thức mà còn phát triển thể chất, 
              tinh thần thể thao như một đội bóng vô địch — sẵn sàng chinh phục mọi sân chơi!
            </p>
            <div className="about-features">
              {features.map((f, i) => (
                <div className="about-feature" key={i}>
                  <span className="af-icon">{f.icon}</span>
                  <span className="af-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== WORLD CUP SPIRIT SECTION ==========
function WorldCupSection() {
  const events = [
    {
      img: '/wc-hero.jpg',
      tag: 'World Cup 2026',
      tagClass: 'coral-bg',
      title: 'VHU cùng World Cup 2026 — Bùng nổ Đam mê',
      desc: 'Hòa mình vào không khí World Cup 2026 tại VHU! Xem bóng đá cùng bạn bè, tham gia giải đấu mini và trải nghiệm tinh thần thể thao đỉnh cao.',
      date: 'Tháng 6 - 7/2026',
      location: 'VHU Campus'
    },
    {
      img: '/wc-spirit.jpg',
      tag: 'VHU Event',
      tagClass: 'teal-bg',
      title: 'Giải Bóng đá Sinh viên VHU Cup 2026',
      desc: 'Giải đấu bóng đá lớn nhất trong sinh viên VHU, nơi các đội từ các khoa tranh tài sôi động, thể hiện tinh thần fair-play và đoàn kết.',
      date: 'Tháng 6 - 8/2026',
      location: 'Sân VHU'
    },
    {
      img: '/wc-field.jpg',
      tag: 'Thể thao',
      tagClass: 'gold-bg',
      title: 'Cơ sở Thể thao Hiện đại tại VHU',
      desc: 'Hệ thống sân bóng đá, phòng gym, bể bơi và các cơ sở thể thao đạt chuẩn tại HungHau Campus — nơi rèn luyện thể chất và tinh thần.',
      date: 'Quanh năm',
      location: 'HungHau Campus'
    }
  ]

  return (
    <section className="wc-spirit snap-section" id="wc-spirit">
      <div className="container">
        <div className="section-header gs-hidden">
          <div className="section-tag coral">⚽ WORLD CUP 2026</div>
          <h2>
            Tinh thần <span className="coral">World Cup</span> tại VHU
          </h2>
          <p>
            World Cup 2026 lần đầu tổ chức tại 3 quốc gia (USA, Mexico, Canada) — 
            VHU cùng bạn sống trọn từng khoảnh khắc!
          </p>
        </div>
        <div className="wc-spirit-grid">
          {events.map((e, i) => (
            <div className="wc-card gs-hidden" key={i}>
              <div className="wc-card-image">
                <img src={e.img} alt={e.title} />
                <span className={`wc-tag ${e.tagClass}`}>{e.tag}</span>
              </div>
              <div className="wc-card-body">
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <div className="wc-card-meta">
                  <span>📅 {e.date}</span>
                  <span>📍 {e.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== PROGRAMS SECTION ==========
function ProgramsSection() {
  const programs = [
    { icon: '💻', title: 'Công nghệ Thông tin', desc: 'AI, Data Science, An ninh mạng', bg: 'teal-bg' },
    { icon: '📊', title: 'Quản trị Kinh doanh', desc: 'Marketing, Tài chính, Khởi nghiệp', bg: 'coral-bg' },
    { icon: '🎨', title: 'Thiết kế Đồ họa', desc: 'UX/UI, Truyền thông đa phương tiện', bg: 'gold-bg' },
    { icon: '🏨', title: 'Du lịch & Nhà hàng', desc: 'Quản trị khách sạn, Du lịch quốc tế', bg: 'green-bg' },
    { icon: '⚖️', title: 'Luật', desc: 'Luật kinh tế, Pháp luật quốc tế', bg: 'teal-bg' },
    { icon: '🗣️', title: 'Ngôn ngữ', desc: 'Anh, Nhật, Hàn, Trung', bg: 'coral-bg' },
    { icon: '📺', title: 'Truyền thông', desc: 'Báo chí, PR, Content Creator', bg: 'gold-bg' },
    { icon: '🏗️', title: 'Kiến trúc', desc: 'Thiết kế nội thất, Cảnh quan', bg: 'green-bg' }
  ]

  return (
    <section className="programs snap-section" id="programs">
      <div className="container">
        <div className="section-header gs-hidden">
          <div className="section-tag teal">🎓 NGÀNH ĐÀO TẠO</div>
          <h2>
            <span className="teal">40+ Ngành học</span> — Đội hình Hoàn hảo
          </h2>
          <p>
            Như một đội bóng cần đủ vị trí, VHU đào tạo 40+ ngành đáp ứng mọi đam mê 
            và nhu cầu nghề nghiệp của bạn.
          </p>
        </div>
        <div className="programs-grid">
          {programs.map((p, i) => (
            <div className="program-card gs-hidden-scale" key={i}>
              <div className={`program-icon ${p.bg}`}>{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== WHY VHU ==========
function WhyVHUSection() {
  const reasons = [
    { icon: '🏟️', cls: 'teal', title: 'Cơ sở vật chất 5 sao', desc: '3 campus hiện đại: Harmony (Âu Cơ), HungHau (Nguyễn Văn Linh), myU (Điện Biên Phủ). Sân bóng, gym, thư viện đẳng cấp.' },
    { icon: '🤝', cls: 'coral', title: 'Kết nối Doanh nghiệp', desc: 'Trung tâm Kết nối Doanh nghiệp hỗ trợ thực tập và việc làm. 95% sinh viên có việc sau 6 tháng tốt nghiệp.' },
    { icon: '🌏', cls: 'gold', title: 'Hội nhập Quốc tế', desc: 'Hợp tác đào tạo với đại học hàng đầu Nhật, Hàn, Úc, Mỹ. Chương trình trao đổi sinh viên toàn cầu.' },
    { icon: '💰', cls: 'green', title: 'Học bổng hấp dẫn', desc: 'Hàng ngàn suất học bổng lên đến 100% cho sinh viên xuất sắc, sinh viên thể thao và hoàn cảnh khó khăn.' },
    { icon: '⚽', cls: 'teal', title: 'Thể thao & Đời sống', desc: 'CLB bóng đá, Taekwondo, hội thao sinh viên, giải VHU Cup. Tinh thần thể thao là DNA của Văn Hiến.' },
    { icon: '💡', cls: 'coral', title: 'Đào tạo thực tiễn', desc: 'Học đi đôi với hành: InnoX, Startup Challenge, workshop AI, thương hiệu cá nhân, kỹ năng mềm.' }
  ]

  return (
    <section className="why-vhu snap-section" id="why-vhu">
      <div className="container">
        <div className="section-header gs-hidden">
          <div className="section-tag green">🏆 TẠI SAO CHỌN VHU</div>
          <h2>
            6 lý do chọn <span className="teal">Văn Hiến</span>
          </h2>
          <p>
            Như 6 cầu thủ xuất sắc trên sân — đây là 6 lý do VHU là "đội bóng" đại học bạn nên gia nhập!
          </p>
        </div>
        <div className="why-grid">
          {reasons.map((r, i) => (
            <div className="why-card gs-hidden" key={i}>
              <div className={`why-icon ${r.cls}`}>{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== CAMPUS SECTION ==========
function CampusSection() {
  return (
    <section className="campus snap-section" id="campus">
      <div className="container">
        <div className="section-header gs-hidden">
          <div className="section-tag teal">🏫 SÂN NHÀ CỦA BẠN</div>
          <h2>
            Khám phá <span className="teal">Campus VHU</span>
          </h2>
          <p>
            3 "sân nhà" hiện đại — nơi bạn ghi bàn thắng cho tương lai!
          </p>
        </div>
        <div className="campus-showcase gs-hidden-scale">
          <div className="campus-main">
            <img src="/img/DH-Van-Hien.jpg" alt="HungHau Campus VHU" />
            <div className="campus-overlay">
              <h3>🏟️ HungHau Campus</h3>
              <p>Đại lộ Nguyễn Văn Linh, Khu đô thị Nam TP.HCM — Campus rộng lớn, hiện đại nhất</p>
            </div>
          </div>
          <div className="campus-side">
            <div className="campus-side-item">
              <img src="/wc-spirit.jpg" alt="Harmony Campus" />
              <div className="csi-overlay">
                <h4>🌿 Harmony Campus — 624 Âu Cơ, Tân Bình</h4>
              </div>
            </div>
            <div className="campus-side-item">
              <img src="/graduation.jpg" alt="myU Campus" />
              <div className="csi-overlay">
                <h4>📚 myU Campus — 665 Điện Biên Phủ, Quận 3</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== ADMISSION SECTION ==========
function AdmissionSection() {
  const methods = [
    { icon: '📝', title: 'Xét tuyển Tốt nghiệp THPT', desc: 'Xét tuyển dựa trên kết quả kỳ thi Tốt nghiệp THPT quốc gia 2026.' },
    { icon: '📋', title: 'Xét tuyển Học bạ', desc: 'Xét tuyển theo kết quả học bạ THPT — đơn giản, nhanh chóng, không cần thi.' },
    { icon: '🧠', title: 'Đánh giá Năng lực', desc: 'Xét tuyển theo kỳ thi ĐGNL của ĐHQG TP.HCM và Hà Nội.' },
    { icon: '🏆', title: 'Xét tuyển thẳng', desc: 'Dành cho thí sinh đạt giải Olympic, HSG hoặc có chứng chỉ quốc tế.' }
  ]

  return (
    <section className="admission snap-section" id="admission">
      <div className="container">
        <div className="section-header gs-hidden">
          <div className="section-tag coral">📢 TUYỂN SINH 2026</div>
          <h2>
            Phương thức <span className="coral">Xét tuyển</span>
          </h2>
          <p>
            Nhiều cách "vào sân" — VHU luôn mở cửa đón bạn với 4 phương thức xét tuyển linh hoạt!
          </p>
        </div>
        <div className="admission-grid">
          {methods.map((m, i) => (
            <div className="admission-card gs-hidden" key={i}>
              <div className="ac-icon">{m.icon}</div>
              <div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== TESTIMONIALS ==========
function TestimonialsSection() {
  const testimonials = [
    {
      stars: 5,
      quote: '"VHU cho tôi cả kiến thức lẫn niềm đam mê thể thao. CLB bóng đá và giải VHU Cup đã giúp tôi rèn luyện tinh thần đồng đội — giá trị theo tôi suốt sự nghiệp."',
      name: 'Nguyễn Minh Anh',
      role: 'Cựu SV Quản trị Kinh doanh',
      avatar: '👩',
      cls: 'teal'
    },
    {
      stars: 5,
      quote: '"Con tôi phát triển toàn diện tại VHU — không chỉ học giỏi mà còn khỏe mạnh nhờ các hoạt động thể thao. Cơ sở vật chất hiện đại, tôi rất an tâm."',
      name: 'Anh Trần Văn Hùng',
      role: 'Phụ huynh sinh viên',
      avatar: '👨',
      cls: 'coral'
    },
    {
      stars: 5,
      quote: '"Chương trình trao đổi quốc tế mở cánh cửa đến Nhật Bản cho tôi. VHU là sân chơi lớn — nơi tôi ghi bàn thắng đẹp nhất cuộc đời!"',
      name: 'Lê Hoàng Phúc',
      role: 'Cựu SV Ngôn ngữ Nhật',
      avatar: '👨‍💼',
      cls: 'gold'
    }
  ]

  return (
    <section className="testimonials snap-section" id="testimonials">
      <div className="container">
        <div className="section-header gs-hidden">
          <div className="section-tag gold">💬 CẢM NHẬN</div>
          <h2>
            Đội hình <span className="teal">Cảm nhận</span>
          </h2>
          <p>Sinh viên & phụ huynh nói gì về "sân nhà" VHU?</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card gs-hidden" key={i}>
              <div className="tc-stars">
                {Array.from({ length: t.stars }, (_, j) => <span key={j}>⭐</span>)}
              </div>
              <p className="tc-quote">{t.quote}</p>
              <div className="tc-author">
                <div className={`tc-avatar ${t.cls}`}>{t.avatar}</div>
                <div className="tc-info">
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== CTA SECTION ==========
function CTASection() {
  return (
    <section className="cta-section snap-section" id="cta">
      <div className="container">
        <div className="cta-box gs-hidden-scale">
          <h2>⚽ Sẵn sàng "Ra sân" cùng VHU?</h2>
          <p>
            World Cup 2026 chỉ đến 4 năm 1 lần — nhưng cơ hội vào VHU là ngay bây giờ! 
            Đăng ký tuyển sinh ngay. Hotline miễn phí: 1800 1568
          </p>
          <a href="https://tuyensinh.vhu.edu.vn" target="_blank" rel="noopener noreferrer" className="btn-cta">
            Đăng ký Tuyển sinh 2026 🚀
          </a>
        </div>

        <div className="contact-info-row">
          <div className="contact-grid">
            <div className="contact-card gs-hidden">
              <div className="cc-icon">📞</div>
              <h4>Tổng đài tư vấn</h4>
              <p><a href="tel:18001568">1800 1568</a> (Miễn phí)</p>
            </div>
            <div className="contact-card gs-hidden">
              <div className="cc-icon">📧</div>
              <h4>Email tuyển sinh</h4>
              <p><a href="mailto:tuyensinh@vhu.edu.vn">tuyensinh@vhu.edu.vn</a></p>
            </div>
            <div className="contact-card gs-hidden">
              <div className="cc-icon">🌐</div>
              <h4>Website tuyển sinh</h4>
              <p><a href="https://tuyensinh.vhu.edu.vn" target="_blank" rel="noopener noreferrer">tuyensinh.vhu.edu.vn</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="fl-icon">⚽</div>
              <span>Đại học Văn Hiến</span>
            </div>
            <p>
              Trường Đại học Văn Hiến — Van Hien University (VHU). 
              Thành lập năm 1997. Biểu tượng Khuê Văn Các — truyền thống hiếu học Việt Nam. 
              Cùng World Cup 2026 — bùng nổ đam mê!
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com/vhu.edu.vn" target="_blank" rel="noopener noreferrer">📘</a>
              <a href="https://youtube.com/@vhu" target="_blank" rel="noopener noreferrer">📺</a>
              <a href="https://tiktok.com/@vhu" target="_blank" rel="noopener noreferrer">🎵</a>
              <a href="https://instagram.com/vhu.edu.vn" target="_blank" rel="noopener noreferrer">📸</a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Ngành đào tạo</h4>
            <ul>
              <li><a href="#programs">Công nghệ Thông tin</a></li>
              <li><a href="#programs">Quản trị Kinh doanh</a></li>
              <li><a href="#programs">Thiết kế Đồ họa</a></li>
              <li><a href="#programs">Du lịch & Nhà hàng</a></li>
              <li><a href="#programs">Ngôn ngữ Quốc tế</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Campus</h4>
            <ul>
              <li><a href="#campus">Harmony Campus</a></li>
              <li><a href="#campus">HungHau Campus</a></li>
              <li><a href="#campus">myU Campus</a></li>
              <li><a href="https://vhu.edu.vn" target="_blank" rel="noopener noreferrer">Virtual Tour 360°</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="tel:18001568">Tổng đài: 1800 1568</a></li>
              <li><a href="mailto:tuyensinh@vhu.edu.vn">Email tuyển sinh</a></li>
              <li><a href="https://tuyensinh.vhu.edu.vn" target="_blank" rel="noopener noreferrer">Đăng ký online</a></li>
              <li><a href="https://vhu.edu.vn" target="_blank" rel="noopener noreferrer">Website chính thức</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Trường Đại học Văn Hiến (VHU) × World Cup 2026 Edition. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="https://vhu.edu.vn" target="_blank" rel="noopener noreferrer">Chính sách bảo mật</a>
            <a href="https://vhu.edu.vn" target="_blank" rel="noopener noreferrer">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ========== MAIN APP ==========
function App() {
  useSnapScroll()

  return (
    <>
      <Navbar />
      <ScrollDots />
      <HeroSection />
      <AboutSection />
      <WorldCupSection />
      <ProgramsSection />
      <WhyVHUSection />
      <CampusSection />
      <AdmissionSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  )
}

export default App
