import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { TrendingSlider } from '@/components/home/TrendingSlider';
import { NewArrivals } from '@/components/home/NewArrivals';
import { PromoBanner } from '@/components/home/PromoBanner';
import { ShopsGrid } from '@/components/home/ShopsGrid';

const Index = () => {
  return (
    <main>
      <HeroSection />
      <ShopsGrid />
      <CategoryGrid />
      <TrendingSlider />
      <NewArrivals />
      <PromoBanner />
    </main>
  );
};

export default Index;
