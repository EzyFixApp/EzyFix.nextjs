import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import About from '@/components/landing/About';
import AISection from '@/components/landing/AISection';
import BenefitsCustomer from '@/components/landing/BenefitsCustomer';
import BenefitsTechnician from '@/components/landing/BenefitsTechnician';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Navbar from '@/components/landing/Navbar';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'EzyFix - App trên tay, Thợ tới ngay',
    description: 'Kết nối nhanh chóng giữa khách hàng và thợ sửa chữa chuyên nghiệp với công nghệ AI thông minh',
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <AISection />
      <BenefitsCustomer />
      <BenefitsTechnician />
      <HowItWorks />
      <Contact />
      <Footer />
    </div>
  );
}
