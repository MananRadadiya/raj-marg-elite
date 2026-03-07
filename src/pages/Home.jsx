import HeroBooking from '../components/HeroBooking';
import WhyChooseUs from '../components/WhyChooseUs';
import CarCategories from '../components/CarCategories';
import RouteCoverage from '../components/RouteCoverage';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import MobileAppPromo from '../components/MobileAppPromo';

export default function Home() {
  return (
    <main>
      <HeroBooking />
      <WhyChooseUs />
      <CarCategories />
      <HowItWorks />
      <RouteCoverage />
      <Testimonials />
      <MobileAppPromo />
    </main>
  );
}
